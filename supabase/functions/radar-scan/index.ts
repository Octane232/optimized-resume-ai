import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const clampMatch = (value: unknown) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const fallbackPreferenceScore = (signal: any, preferences: any) => {
  const targetRole = String(preferences?.target_role || "").toLowerCase();
  const targetIndustry = String(preferences?.target_industry || "").toLowerCase();
  const experienceLevel = String(preferences?.experience_level || "").toLowerCase();
  const roles = Array.isArray(signal?.likely_roles) ? signal.likely_roles.map((r: string) => r.toLowerCase()) : [];
  const industry = String(signal?.industry || "").toLowerCase();
  let score = 48;
  const reasons: string[] = [];

  if (targetIndustry && industry && (industry.includes(targetIndustry) || targetIndustry.includes(industry))) {
    score += 24;
    reasons.push(`Industry aligns with ${preferences.target_industry}`);
  }
  if (targetRole && roles.some((role: string) => role.includes(targetRole) || targetRole.includes(role))) {
    score += 24;
    reasons.push(`Likely hiring includes ${preferences.target_role}`);
  }
  if (experienceLevel && roles.some((role: string) => role.includes(experienceLevel))) {
    score += 8;
    reasons.push(`Seniority signal fits ${preferences.experience_level}`);
  }

  return {
    match_score: clampMatch(score),
    match_reasons: reasons.length ? reasons : ["Broad hiring signal based on your saved preferences"],
    insight: `${signal.company_name} is showing a funding-driven hiring signal. Review the likely roles and apply early if the company matches your target direction.`,
  };
};

async function scoreSignalWithAI(signal: any, preferences: any, openAiKey: string) {
  const fallback = fallbackPreferenceScore(signal, preferences);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openAiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{
          role: "user",
          content: `You are matching a job seeker to a hidden hiring signal. Use meaning-level fit, not exact keywords only. Return JSON only: {"match_score":0-100,"match_reasons":["2-4 short reasons"],"insight":"2 direct sentences explaining why this company is or is not a good match and what to do next"}.

User preferences:
- Target role: ${preferences?.target_role || "not specified"}
- Target industry: ${preferences?.target_industry || "not specified"}
- Experience level: ${preferences?.experience_level || "not specified"}
- Target salary: ${preferences?.target_salary || "not specified"}
- Work style: ${preferences?.work_style || "not specified"}

Funding signal:
- Company: ${signal.company_name}
- Industry: ${signal.industry || "unknown"}
- Description: ${signal.description || ""}
- Funding: ${signal.amount || "unknown"} ${signal.funding_stage || ""}
- Likely roles: ${(signal.likely_roles || []).join(", ") || "unknown"}
- Hiring window: ${signal.hiring_window || "unknown"}`
        }],
      }),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return {
      match_score: clampMatch(parsed.match_score || fallback.match_score),
      match_reasons: Array.isArray(parsed.match_reasons) && parsed.match_reasons.length ? parsed.match_reasons.slice(0, 4) : fallback.match_reasons,
      insight: parsed.insight || fallback.insight,
    };
  } catch {
    return fallback;
  }
}

// ===== Auth & Quota Helpers =====

async function requireUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error("Unauthorized - No authorization header");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authClient = createClient(supabaseUrl, anonKey);

  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data, error } = await authClient.auth.getUser(token);
  
  if (error || !data?.user) {
    throw new Error("Unauthorized - Invalid token");
  }

  return data.user;
}

async function getUserTier(userId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("subscription_tier, subscription_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user tier:", error);
    throw new Error("Failed to fetch user tier");
  }

  const tier = profile?.subscription_tier || "free";
  const subscriptionEnd = profile?.subscription_end 
    ? new Date(profile.subscription_end) 
    : null;

  // Check if subscription has expired
  if (subscriptionEnd && subscriptionEnd < new Date()) {
    return { tier: "expired", isExpired: true };
  }

  return { tier, isExpired: false };
}

async function enforceQuota(userId: string, feature: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { tier, isExpired } = await getUserTier(userId);

  if (isExpired) {
    throw new Error("Subscription expired - Please upgrade to continue using this feature");
  }

  // Radar alert limits per tier
  const limits = {
    free: {
      radar_alert: 0, // Free users cannot trigger manual scans
    },
    pro: {
      radar_alert: 10, // 10 manual scans per month
    },
    elite: {
      radar_alert: 30, // 30 manual scans per month
    },
  };

  const tierLimit = limits[tier as keyof typeof limits]?.radar_alert || 0;
  
  // Count usage for this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { count: usageCount, error: countError } = await adminClient
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .gte("created_at", startOfMonth.toISOString());

  if (countError) {
    console.error("Error counting usage:", countError);
    throw new Error("Failed to check usage limits");
  }

  const currentUsage = usageCount || 0;
  const remaining = tierLimit - currentUsage;

  if (tierLimit === 0) {
    throw new Error("Your current plan does not include manual radar scans. Upgrade to Pro or Elite to use this feature.");
  }

  if (currentUsage >= tierLimit) {
    const tierNames = {
      free: "Free",
      pro: "Pro",
      elite: "Elite"
    };
    throw new Error(
      `Monthly ${feature} limit reached (${currentUsage}/${tierLimit}). ` +
      `Your ${tierNames[tier as keyof typeof tierNames] || tier} plan includes ${tierLimit} scans per month. ` +
      `${tier === 'free' ? 'Upgrade to Pro or Elite' : tier === 'pro' ? 'Upgrade to Elite' : 'Contact support'} for more.`
    );
  }

  return { tier, currentUsage, tierLimit, remaining };
}

async function recordUsage(userId: string, feature: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { error } = await adminClient
    .from("usage_events")
    .insert({
      user_id: userId,
      feature: feature,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error recording usage:", error);
    // Don't throw - we don't want to fail the request if usage recording fails
  }
}

// ===== Main Handler =====

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Allow cron calls with shared secret (no quota check)
    const SEED_SECRET = Deno.env.get("SEED_SECRET");
    const providedSecret = req.headers.get("x-cron-secret");
    const isCron = !!SEED_SECRET && providedSecret === SEED_SECRET;

    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    const hasUserJwt = !!authHeader && authHeader.toLowerCase().startsWith("bearer ");

    // If not cron and not user, reject
    if (!isCron && !hasUserJwt) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // If user request, enforce quota
    let requestingUserId: string | null = null;
    if (hasUserJwt) {
      const user = await requireUser(authHeader);
      requestingUserId = user.id;
      
      // ENFORCE QUOTA for user-initiated radar scans
      await enforceQuota(user.id, "radar_alert");
    }

    const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!NEWS_API_KEY) throw new Error("NEWS_API_KEY not configured");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const allArticles: any[] = [];
    const seenUrls = new Set<string>();

    // SOURCE 1: NewsAPI
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const from = yesterday.toISOString().split("T")[0];
      const queries = ['"Series A" "raised" "million"', '"Series B" "raised" "million"', '"seed round" "raised"', '"announces funding" "hiring"'];
      const newsResults = await Promise.allSettled(queries.map((q) => fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&from=${from}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`).then((r) => r.json())));
      for (const result of newsResults) {
        if (result.status === "fulfilled" && result.value.articles) {
          for (const a of result.value.articles) {
            if (a.url && !seenUrls.has(a.url)) {
              seenUrls.add(a.url);
              allArticles.push({ title: a.title || "", description: a.description || "", content: a.content || "", url: a.url, publishedAt: a.publishedAt || new Date().toISOString() });
            }
          }
        }
      }
      console.log(`NewsAPI: ${allArticles.length} articles`);
    } catch (e) { console.error("NewsAPI failed:", e); }

    // SOURCE 2: TechCrunch RSS
    try {
      const tcRes = await fetch("https://techcrunch.com/category/venture/feed/", { headers: { "User-Agent": "Vaylance/1.0" } });
      const tcXml = await tcRes.text();
      const tcItems = tcXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      let tcCount = 0;
      for (const item of tcItems) {
        const url = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() || "";
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || item.match(/<description>(.*?)<\/description>/)?.[1] || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
        const text = (title + description).toLowerCase();
        const isFunding = text.includes("raises") || text.includes("raised") || text.includes("funding") || text.includes("series") || text.includes("seed") || text.includes("million") || text.includes("billion");
        if (url && !seenUrls.has(url) && isFunding) {
          seenUrls.add(url);
          allArticles.push({ title, description: description.replace(/<[^>]*>/g, "").slice(0, 300), content: "", url, publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString() });
          tcCount++;
        }
      }
      console.log(`TechCrunch RSS: ${tcCount} articles`);
    } catch (e) { console.error("TechCrunch RSS failed:", e); }

    // SOURCE 3: VentureBeat RSS
    try {
      const vbRes = await fetch("https://venturebeat.com/feed/", { headers: { "User-Agent": "Vaylance/1.0" } });
      const vbXml = await vbRes.text();
      const vbItems = vbXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      let vbCount = 0;
      for (const item of vbItems) {
        const url = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() || "";
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || item.match(/<description>(.*?)<\/description>/)?.[1] || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
        const text = (title + description).toLowerCase();
        const isFunding = text.includes("raises") || text.includes("raised") || text.includes("funding") || text.includes("series") || text.includes("seed") || text.includes("million") || text.includes("billion");
        if (url && !seenUrls.has(url) && isFunding) {
          seenUrls.add(url);
          allArticles.push({ title, description: description.replace(/<[^>]*>/g, "").slice(0, 300), content: "", url, publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString() });
          vbCount++;
        }
      }
      console.log(`VentureBeat RSS: ${vbCount} articles`);
    } catch (e) { console.error("VentureBeat RSS failed:", e); }

    console.log(`Total unique articles: ${allArticles.length}`);

    // STEP 2: Extract signals using OpenAI
    const signals: any[] = [];
    for (let i = 0; i < allArticles.length; i += 8) {
      const batch = allArticles.slice(i, i + 8);
      const results = await Promise.allSettled(batch.map(async (article) => {
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, messages: [{ role: "user", content: `Analyse this article. Return JSON only: { "is_funding": true or false, "company_name": "string", "amount": "e.g. $50M", "funding_stage": "Seed/Series A/Series B/Series C", "industry": "one word e.g. Fintech/AI/SaaS/Healthcare", "description": "one sentence", "likely_roles": ["3-5 job titles"], "hiring_window": "e.g. 30-60 days" }. Set is_funding false if not a real funding announcement.\n\nTitle: ${article.title}\nDescription: ${article.description}` }] }),
          });
          const data = await res.json();
          const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
          if (!parsed.is_funding || !parsed.company_name) return null;
          return { ...parsed, source_url: article.url, published_at: article.publishedAt };
        } catch { return null; }
      }));
      for (const r of results) { if (r.status === "fulfilled" && r.value) signals.push(r.value); }
      if (i + 8 < allArticles.length) await new Promise((r) => setTimeout(r, 400));
    }
    console.log(`Extracted ${signals.length} valid signals`);

    // STEP 3: Store new signals and keep existing duplicates available for matching.
    const storedSignals: { id: string; signal: any }[] = [];
    for (const signal of signals) {
      const { data: existing } = await supabase.from("radar_signals").select("id").eq("source_url", signal.source_url).maybeSingle();
      if (existing) {
        storedSignals.push({ id: existing.id, signal });
        continue;
      }
      const { data: inserted, error } = await supabase.from("radar_signals").insert({ company_name: signal.company_name, amount: signal.amount, funding_stage: signal.funding_stage, industry: signal.industry, description: signal.description, source_url: signal.source_url, published_at: signal.published_at, likely_roles: signal.likely_roles, hiring_window: signal.hiring_window }).select("id").single();
      if (!error && inserted) storedSignals.push({ id: inserted.id, signal });
    }
    console.log(`Prepared ${storedSignals.length} signals for matching`);

    if (storedSignals.length === 0 && requestingUserId) {
      const { data: recentSignals } = await supabase
        .from("radar_signals")
        .select("id, company_name, amount, funding_stage, industry, description, source_url, published_at, likely_roles, hiring_window")
        .order("created_at", { ascending: false })
        .limit(25);
      for (const signal of recentSignals || []) storedSignals.push({ id: signal.id, signal });
    }

    // STEP 4: Match signals against user preferences with AI-generated percentages.
    let usersQuery = supabase.from("career_preferences").select("user_id, target_role, target_industry, experience_level, target_salary, work_style");
    if (requestingUserId) usersQuery = usersQuery.eq("user_id", requestingUserId);
    const { data: users } = await usersQuery;
    const usersToMatch = requestingUserId && (!users || users.length === 0)
      ? [{ user_id: requestingUserId, target_role: null, target_industry: null, experience_level: null, target_salary: null, work_style: null }]
      : users || [];
    let alertsCreated = 0;
    let alertsUpdated = 0;
    if (usersToMatch.length > 0) {
      for (const { id: signalId, signal } of storedSignals) {
        for (const user of usersToMatch) {
          const match = await scoreSignalWithAI(signal, user, OPENAI_API_KEY);
          const { data: existing } = await supabase.from("radar_alerts").select("id").eq("user_id", user.user_id).eq("signal_id", signalId).maybeSingle();
          if (existing) {
            const { error } = await supabase.from("radar_alerts").update({ match_score: match.match_score, match_reasons: match.match_reasons, insight: match.insight }).eq("id", existing.id);
            if (!error) alertsUpdated++;
          } else {
            const { error } = await supabase.from("radar_alerts").insert({ user_id: user.user_id, signal_id: signalId, match_score: match.match_score, match_reasons: match.match_reasons, insight: match.insight, is_read: false });
            if (!error) alertsCreated++;
          }
        }
      }
    }

    // RECORD USAGE for user-initiated scans (after successful completion)
    if (requestingUserId) {
      await recordUsage(requestingUserId, "radar_alert");
    }

    return jsonResponse({ 
      success: true, 
      articlesFound: allArticles.length, 
      signalsExtracted: signals.length, 
      signalsMatched: storedSignals.length, 
      signalsStored: storedSignals.length, 
      alertsCreated, 
      alertsUpdated 
    });

  } catch (error) {
    console.error("Radar scan error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("limit reached") || message.includes("expired") || message.includes("does not include") 
      ? 429 
      : message.includes("Unauthorized") 
        ? 401 
        : 500;
    return jsonResponse({ error: message }, status);
  }
});
