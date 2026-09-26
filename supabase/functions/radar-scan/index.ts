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

// ===== Cross-industry hiring signal queries =====
// These deliberately cover EVERY sector, not just tech/VC.
const NEWS_QUERIES = [
  '"raised" AND ("Series A" OR "Series B" OR "seed round")',
  '"announces expansion" AND hiring',
  '"plans to hire" OR "will hire" OR "hiring spree"',
  '"opening a new" AND (store OR factory OR plant OR warehouse OR office OR clinic OR hospital OR restaurant OR hotel)',
  '"wins contract" OR "awarded contract" AND jobs',
  '"new distribution center" OR "new manufacturing facility"',
  '"creating jobs" OR "new jobs" AND (county OR city OR state)',
  '"healthcare system" AND (expansion OR "hiring nurses" OR "new hospital")',
  '"school district" OR university AND ("hiring teachers" OR "new campus")',
  '"construction begins" OR "breaks ground" AND jobs',
  '"logistics" OR "retail chain" AND ("expands" OR "opens")',
  '"acquisition" OR "merger" AND "expand its team"',
  '"energy project" OR "renewable plant" AND workforce',
  '"government agency" AND ("recruitment drive" OR "hiring")',
];

const GOOGLE_NEWS_QUERIES = [
  '"plans to hire"',
  '"hiring spree"',
  '"opens new facility" jobs',
  '"new jobs" expansion announcement',
  '"awarded contract" hiring',
  '"opening new store" jobs',
  '"new hospital" hiring nurses',
  '"manufacturing plant" jobs created',
  '"warehouse opening" hiring',
  '"hotel opening" hiring staff',
  '"raises funding" hiring',
  '"school district" hiring teachers',
  '"construction project" jobs created',
  '"call center" opening jobs',
];

// ===== Preference-driven query builder =====
// Injects the user's Target Role / Industry / Work Style directly into the search.
function buildPreferenceQueries(preferences: any): { news: string[]; googleNews: string[]; remote: boolean } {
  const role = String(preferences?.target_role || "").trim();
  const industry = String(preferences?.target_industry || "").trim();
  const location = String(preferences?.target_location || "").trim();
  const workStyle = String(preferences?.work_style || "").trim();
  const remote = /remote|anywhere|distributed|work from home/i.test(workStyle);

  const news: string[] = [];
  const googleNews: string[] = [];

  if (role) {
    news.push(`"${role}" AND (hiring OR "now hiring" OR "expanding team" OR recruiting)`);
    googleNews.push(`"${role}" hiring`);
    googleNews.push(`"${role}" "joining our team" OR "expanding team"`);
    if (remote) {
      news.push(`"${role}" AND remote AND (hiring OR "distributed team" OR "work from anywhere")`);
      googleNews.push(`"${role}" remote hiring`);
      googleNews.push(`"remote-first" company hiring "${role}"`);
    }
  }

  if (industry) {
    news.push(`"${industry}" AND (expansion OR "plans to hire" OR "new office" OR funding)`);
    googleNews.push(`"${industry}" hiring expansion`);
  }

  if (role && industry) {
    googleNews.push(`"${industry}" "${role}" hiring`);
  }

  if (location && !remote) {
    googleNews.push(`hiring "${location}" ${role || "jobs"}`);
  }

  if (remote && !role) {
    googleNews.push(`"remote-first" company hiring`);
    googleNews.push(`"hiring remotely" "work from anywhere"`);
  }

  return { news: news.slice(0, 6), googleNews: googleNews.slice(0, 8), remote };
}

const HIRING_HINTS = [
  "hire", "hiring", "jobs", "recruit", "workforce", "staff", "employees",
  "expansion", "expands", "opens", "opening", "raised", "raises", "funding",
  "contract", "invests", "investment", "million", "billion", "facility", "plant",
];

const stripTags = (s: string) => s.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();

const BLOCKED_COMPANY_DOMAINS = new Set([
  "linkedin.com", "facebook.com", "instagram.com", "x.com", "twitter.com", "youtube.com",
  "news.google.com", "google.com", "reuters.com", "bloomberg.com", "forbes.com", "businesswire.com",
  "prnewswire.com", "yahoo.com", "msn.com", "bbc.com", "cnn.com", "apnews.com",
]);

function normalizeCompanyDomain(value: unknown, sourceUrl: string): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const parsed = new URL(value.includes("://") ? value : `https://${value}`);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const sourceHostname = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, "");
    const validHostname = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(hostname);
    const blocked = BLOCKED_COMPANY_DOMAINS.has(hostname) || [...BLOCKED_COMPANY_DOMAINS].some((domain) => hostname.endsWith(`.${domain}`));
    if (!validHostname || blocked || hostname === sourceHostname) return null;
    return hostname;
  } catch {
    return null;
  }
}

function parseRssItems(xml: string, sourceName: string, requireHiringHint: boolean) {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const out: any[] = [];
  for (const item of items) {
    const url = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() || "";
    const title =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    const description =
      item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    if (!url || !title) continue;
    const text = `${title} ${description}`.toLowerCase();
    if (requireHiringHint && !HIRING_HINTS.some((h) => text.includes(h))) continue;
    out.push({
      title: stripTags(title),
      description: stripTags(description).slice(0, 400),
      url,
      sourceName,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }
  return out;
}

const fallbackPreferenceScore = (signal: any, preferences: any) => {
  const targetRole = String(preferences?.target_role || "").toLowerCase();
  const targetIndustry = String(preferences?.target_industry || "").toLowerCase();
  const experienceLevel = String(preferences?.experience_level || "").toLowerCase();
  const roles = Array.isArray(signal?.likely_roles) ? signal.likely_roles.map((r: string) => String(r).toLowerCase()) : [];
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
    insight: `${signal.company_name} is showing a hiring signal. Review the likely roles and reach out early if it fits your direction.`,
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
          content: `You are matching a job seeker to a hidden hiring signal from ANY industry (tech, healthcare, retail, construction, logistics, hospitality, education, finance, energy, manufacturing, public sector, non-profit). Judge meaning-level fit, not keywords. Return JSON only:
{"match_score":0-100,"match_reasons":["2-4 short reasons"],"insight":"2 direct sentences: why this is or is not a fit and the single next action to take"}

User preferences:
- Target role: ${preferences?.target_role || "not specified"}
- Target industry: ${preferences?.target_industry || "not specified"}
- Experience level: ${preferences?.experience_level || "not specified"}
- Target salary: ${preferences?.target_salary || "not specified"}
- Work style: ${preferences?.work_style || "not specified"}

Hiring signal:
- Company/organisation: ${signal.company_name}
- Signal type: ${signal.signal_type || "unknown"}
- Industry: ${signal.industry || "unknown"}
- Location: ${signal.location || "unknown"}
- Company size: ${signal.company_size || "unknown"}
- Description: ${signal.description || ""}
- Why they are hiring now: ${signal.why_now || "unknown"}
- Scale: ${signal.amount || "unknown"} ${signal.funding_stage || ""}
- Likely roles: ${(signal.likely_roles || []).join(", ") || "unknown"}
- Departments: ${(signal.departments || []).join(", ") || "unknown"}
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

// ===== Auth & Quota Helpers (aligned with the app's real usage tables) =====

const PLAN_RADAR_LIMITS: Record<string, number> = { free: 0, trial: 5, pro: 30, elite: 100 };

async function requireUser(authHeader: string | null, adminClient: any) {
  if (!authHeader) throw new Error("Unauthorized - No authorization header");

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authClient = createClient(supabaseUrl, anonKey);

  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data?.user) throw new Error("Unauthorized - Invalid token");

  let tier = "free";
  const { data: subRows } = await adminClient
    .from("user_subscriptions")
    .select("tier, plan_status, updated_at")
    .eq("user_id", data.user.id)
    .order("updated_at", { ascending: false })
    .limit(1);
  const sub = subRows?.[0];
  if ((sub?.plan_status === "active" || sub?.plan_status === "trialing") && sub?.tier) {
    const raw = String(sub.tier);
    if (raw === "trial") tier = "trial";
    else if (raw === "starter" || raw === "pro") tier = "pro";
    else if (raw === "premium" || raw === "elite") tier = "elite";
  }

  return { id: data.user.id, tier };
}

async function enforceQuota(adminClient: any, userId: string, tier: string, feature: string) {
  const tierLimit = PLAN_RADAR_LIMITS[tier] ?? 0;

  if (tierLimit === 0) {
    throw new Error("Your current plan does not include radar scans. Upgrade to Pro or Elite to use this feature.");
  }

  const { data: usageRow } = await adminClient
    .from("user_usage")
    .select("used")
    .eq("user_id", userId)
    .eq("feature", feature)
    .maybeSingle();

  const currentUsage = usageRow?.used ?? 0;

  if (currentUsage >= tierLimit) {
    throw new Error(
      `Monthly radar scan limit reached (${currentUsage}/${tierLimit}). ` +
      `${tier === "pro" ? "Upgrade to Elite" : "Contact support"} for more.`
    );
  }

  return { tier, currentUsage, tierLimit, remaining: tierLimit - currentUsage };
}

async function recordUsage(adminClient: any, userId: string, feature: string) {
  const { data: existing } = await adminClient
    .from("user_usage")
    .select("used")
    .eq("user_id", userId)
    .eq("feature", feature)
    .maybeSingle();

  const resetDate = new Date();
  resetDate.setDate(resetDate.getDate() + 30);

  const { error } = await adminClient.from("user_usage").upsert({
    user_id: userId,
    feature,
    used: (existing?.used ?? 0) + 1,
    reset_date: resetDate.toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,feature" });

  if (error) console.error("Error recording usage:", error);
}

// ===== Main Handler =====

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SEED_SECRET = Deno.env.get("SEED_SECRET");
    const providedSecret = req.headers.get("x-cron-secret");
    const isCron = !!SEED_SECRET && providedSecret === SEED_SECRET;

    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    const hasUserJwt = !!authHeader && authHeader.toLowerCase().startsWith("bearer ");

    if (!isCron && !hasUserJwt) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    let requestingUserId: string | null = null;
    if (hasUserJwt) {
      const user = await requireUser(authHeader, supabase);
      requestingUserId = user.id;
      await enforceQuota(supabase, user.id, user.tier, "radar_alert");
    }

    // Load the requesting user's career preferences so the scan searches for
    // their actual target role / industry / work style, not just generic signals.
    let requesterPreferences: any = null;
    if (requestingUserId) {
      const { data: prefRow } = await supabase
        .from("career_preferences")
        .select("target_role, target_industry, target_location, experience_level, target_salary, work_style")
        .eq("user_id", requestingUserId)
        .maybeSingle();
      requesterPreferences = prefRow || null;
    }
    const prefQueries = buildPreferenceQueries(requesterPreferences);
    const newsQueries = [...prefQueries.news, ...NEWS_QUERIES];
    const googleNewsQueries = [...prefQueries.googleNews, ...GOOGLE_NEWS_QUERIES];
    console.log(
      `Preference-driven queries: ${prefQueries.news.length + prefQueries.googleNews.length}` +
      ` (role: ${requesterPreferences?.target_role || "none"}, remote: ${prefQueries.remote})`
    );

    const allArticles: any[] = [];
    const seenUrls = new Set<string>();
    const pushArticle = (a: any) => {
      if (!a.url || seenUrls.has(a.url)) return;
      seenUrls.add(a.url);
      allArticles.push(a);
    };


    // SOURCE 1: NewsAPI — cross-industry hiring intent queries
    if (NEWS_API_KEY) {
      try {
        const since = new Date();
        since.setDate(since.getDate() - 4);
        const from = since.toISOString().split("T")[0];
        const results = await Promise.allSettled(
          newsQueries.map((q) =>
            fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&from=${from}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`)
              .then((r) => r.json())
          )
        );
        for (const result of results) {
          if (result.status === "fulfilled" && result.value?.articles) {
            for (const a of result.value.articles) {
              pushArticle({
                title: a.title || "",
                description: a.description || "",
                url: a.url,
                sourceName: a.source?.name || "News",
                publishedAt: a.publishedAt || new Date().toISOString(),
              });
            }
          }
        }
        console.log(`NewsAPI: ${allArticles.length} articles`);
      } catch (e) { console.error("NewsAPI failed:", e); }
    }

    // SOURCE 2: Google News RSS — free, global, every sector.
    // Remote-focused users get worldwide editions, not just the US edition.
    const locales = prefQueries.remote
      ? [
          { hl: "en-US", gl: "US", ceid: "US:en" },
          { hl: "en-GB", gl: "GB", ceid: "GB:en" },
          { hl: "en-IN", gl: "IN", ceid: "IN:en" },
        ]
      : [{ hl: "en-US", gl: "US", ceid: "US:en" }];
    try {
      const before = allArticles.length;
      const results = await Promise.allSettled(
        googleNewsQueries.flatMap((q) => locales.map((loc) =>
          fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:7d")}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.ceid}`, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" },
          }).then((r) => r.text())
        ))
      );
      for (const r of results) {
        if (r.status === "fulfilled") {
          for (const item of parseRssItems(r.value, "Google News", true)) pushArticle(item);
        }
      }
      console.log(`Google News RSS: ${allArticles.length - before} articles`);
    } catch (e) { console.error("Google News RSS failed:", e); }

    // SOURCE 3: Sector newswires (business, industry, public sector)
    const RSS_FEEDS: { url: string; name: string }[] = [
      { url: "https://techcrunch.com/category/venture/feed/", name: "TechCrunch" },
      { url: "https://venturebeat.com/feed/", name: "VentureBeat" },
      { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC Business" },
      { url: "https://www.retaildive.com/feeds/news/", name: "Retail Dive" },
      { url: "https://www.healthcaredive.com/feeds/news/", name: "Healthcare Dive" },
      { url: "https://www.constructiondive.com/feeds/news/", name: "Construction Dive" },
      { url: "https://www.supplychaindive.com/feeds/news/", name: "Supply Chain Dive" },
      { url: "https://www.manufacturingdive.com/feeds/news/", name: "Manufacturing Dive" },
      { url: "https://www.restaurantdive.com/feeds/news/", name: "Restaurant Dive" },
      { url: "https://www.bankingdive.com/feeds/news/", name: "Banking Dive" },
      { url: "https://www.hrdive.com/feeds/news/", name: "HR Dive" },
      { url: "https://www.hotelmanagement.net/rss.xml", name: "Hotel Management" },
      { url: "https://www.utilitydive.com/feeds/news/", name: "Utility Dive" },
      { url: "https://www.k12dive.com/feeds/news/", name: "K-12 Dive" },
    ];
    try {
      const before = allArticles.length;
      const results = await Promise.allSettled(
        RSS_FEEDS.map((f) =>
          fetch(f.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" },
            signal: AbortSignal.timeout(12000),
          })
            .then((r) => r.text())
            .then((xml) => ({ xml, name: f.name }))
        )
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          for (const item of parseRssItems(r.value.xml, r.value.name, true)) pushArticle(item);
        }
      }
      console.log(`Sector RSS: ${allArticles.length - before} articles`);
    } catch (e) { console.error("Sector RSS failed:", e); }

    // Cap work per scan so the function stays within its time budget.
    const articles = allArticles.slice(0, 90);
    console.log(`Total unique articles: ${allArticles.length}, analysing ${articles.length}`);

    // STEP 2: Extract rich, cross-industry hiring signals
    const signals: any[] = [];
    for (let i = 0; i < articles.length; i += 10) {
      const batch = articles.slice(i, i + 10);
      const results = await Promise.allSettled(batch.map(async (article) => {
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              temperature: 0.1,
              response_format: { type: "json_object" },
              messages: [{
                role: "user",
                content: `You are a hiring-intelligence analyst covering EVERY industry — technology, healthcare, retail, hospitality, construction, logistics, manufacturing, energy, education, finance, government, non-profit, agriculture, media, transport.

Decide whether this news article implies an organisation is likely to hire soon. Hiring intent can come from: funding rounds, expansion, new locations/facilities/stores/plants/clinics, contract or tender wins, mergers/acquisitions, large investments, government programmes, seasonal ramp-ups, or an explicit hiring announcement. Ignore layoffs, opinion pieces, product reviews, and pure market commentary.

Return JSON only:
{
 "is_hiring_signal": true|false,
 "company_name": "organisation name",
 "company_domain": "official company website hostname, such as stripe.com; empty string unless you are highly confident it belongs to this exact organisation",
 "signal_type": "Funding|Expansion|New Facility|Contract Win|Acquisition|Investment|Hiring Announcement|Public Programme",
 "industry": "e.g. Healthcare, Retail, Construction, Logistics, Fintech, Education, Energy, Hospitality",
 "location": "city, region or country if known, else empty string",
 "company_size": "Startup|Small|Mid-market|Enterprise|Public sector|Unknown",
 "amount": "scale of the event if stated, e.g. $50M, 500 jobs, 3 new sites, else empty string",
 "funding_stage": "Seed/Series A/Series B/Series C/Growth/N-A",
 "description": "one clear sentence a job seeker understands",
 "why_now": "one sentence on why this creates jobs in the near term",
 "likely_roles": ["4-6 realistic job titles for THIS industry, not generic tech titles"],
 "departments": ["2-4 departments likely to hire, e.g. Operations, Clinical, Field Sales"],
 "hiring_window": "e.g. 30-60 days",
 "outreach_angle": "one sentence the job seeker can actually use when contacting them",
 "confidence": 0-100
}

Set is_hiring_signal false if there is no credible hiring implication. Never use the news publisher, a social network, or a guessed domain as company_domain.

Source: ${article.sourceName}
Title: ${article.title}
Description: ${article.description}`
              }],
            }),
          });
          const data = await res.json();
          const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
          if (!parsed.is_hiring_signal || !parsed.company_name) return null;
          if (Number(parsed.confidence ?? 0) < 45) return null;
          return {
            company_name: String(parsed.company_name).slice(0, 160),
            company_domain: normalizeCompanyDomain(parsed.company_domain, article.url),
            signal_type: parsed.signal_type || "Hiring Announcement",
            industry: parsed.industry || null,
            location: parsed.location || null,
            company_size: parsed.company_size || null,
            amount: parsed.amount || null,
            funding_stage: parsed.funding_stage && parsed.funding_stage !== "N-A" ? parsed.funding_stage : null,
            description: parsed.description || null,
            why_now: parsed.why_now || null,
            likely_roles: Array.isArray(parsed.likely_roles) ? parsed.likely_roles.slice(0, 6) : [],
            departments: Array.isArray(parsed.departments) ? parsed.departments.slice(0, 4) : [],
            hiring_window: parsed.hiring_window || null,
            outreach_angle: parsed.outreach_angle || null,
            confidence: clampMatch(parsed.confidence),
            source_name: article.sourceName || null,
            source_url: article.url,
            published_at: article.publishedAt,
          };
        } catch { return null; }
      }));
      for (const r of results) { if (r.status === "fulfilled" && r.value) signals.push(r.value); }
      if (i + 10 < articles.length) await new Promise((r) => setTimeout(r, 300));
    }
    console.log(`Extracted ${signals.length} valid signals`);

    // STEP 3: Store signals (upsert on source_url)
    const storedSignals: { id: string; signal: any }[] = [];
    for (const signal of signals) {
      const { data: existing } = await supabase.from("radar_signals").select("id").eq("source_url", signal.source_url).maybeSingle();
      if (existing) {
        await supabase.from("radar_signals").update({
          company_name: signal.company_name,
          company_domain: signal.company_domain,
          signal_type: signal.signal_type,
          industry: signal.industry,
          location: signal.location,
          company_size: signal.company_size,
          amount: signal.amount,
          funding_stage: signal.funding_stage,
          description: signal.description,
          why_now: signal.why_now,
          likely_roles: signal.likely_roles,
          departments: signal.departments,
          hiring_window: signal.hiring_window,
          outreach_angle: signal.outreach_angle,
          confidence: signal.confidence,
          source_name: signal.source_name,
        }).eq("id", existing.id);
        storedSignals.push({ id: existing.id, signal });
        continue;
      }
      const { data: inserted, error } = await supabase.from("radar_signals").insert(signal).select("id").single();
      if (error) console.error("Insert signal failed:", error.message);
      if (!error && inserted) storedSignals.push({ id: inserted.id, signal });
    }
    console.log(`Prepared ${storedSignals.length} signals for matching`);

    if (storedSignals.length === 0 && requestingUserId) {
      const { data: recentSignals } = await supabase
        .from("radar_signals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
      for (const signal of recentSignals || []) storedSignals.push({ id: signal.id, signal });
    }

    // STEP 4: Match signals against user preferences
    let usersQuery = supabase.from("career_preferences").select("user_id, target_role, target_industry, experience_level, target_salary, work_style");
    if (requestingUserId) usersQuery = usersQuery.eq("user_id", requestingUserId);
    const { data: users } = await usersQuery;
    const usersToMatch = requestingUserId && (!users || users.length === 0)
      ? [{ user_id: requestingUserId, target_role: null, target_industry: null, experience_level: null, target_salary: null, work_style: null }]
      : users || [];

    let alertsCreated = 0;
    let alertsUpdated = 0;
    const matchLimit = storedSignals.slice(0, 40);

    for (const user of usersToMatch) {
      for (let i = 0; i < matchLimit.length; i += 5) {
        const chunk = matchLimit.slice(i, i + 5);
        const scored = await Promise.all(chunk.map(async ({ id: signalId, signal }) => ({
          signalId,
          match: await scoreSignalWithAI(signal, user, OPENAI_API_KEY),
        })));
        for (const { signalId, match } of scored) {
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

    if (requestingUserId) {
      await recordUsage(supabase, requestingUserId, "radar_alert");
    }

    return jsonResponse({
      success: true,
      articlesFound: allArticles.length,
      articlesAnalysed: articles.length,
      signalsExtracted: signals.length,
      signalsMatched: storedSignals.length,
      signalsStored: storedSignals.length,
      alertsCreated,
      alertsUpdated,
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
