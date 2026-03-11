import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
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

    // STEP 3: Store new signals
    const storedSignals: { id: string; signal: any }[] = [];
    for (const signal of signals) {
      const { data: existing } = await supabase.from("radar_signals").select("id").eq("source_url", signal.source_url).single();
      if (existing) continue;
      const { data: inserted, error } = await supabase.from("radar_signals").insert({ company_name: signal.company_name, amount: signal.amount, funding_stage: signal.funding_stage, industry: signal.industry, description: signal.description, source_url: signal.source_url, published_at: signal.published_at, likely_roles: signal.likely_roles, hiring_window: signal.hiring_window }).select("id").single();
      if (!error && inserted) storedSignals.push({ id: inserted.id, signal });
    }
    console.log(`Stored ${storedSignals.length} new signals`);

    // STEP 4: Match signals against users
    const { data: users } = await supabase.from("career_preferences").select("user_id, target_role, target_industry");
    let alertsCreated = 0;
    if (users && users.length > 0) {
      for (const { id: signalId, signal } of storedSignals) {
        for (const user of users) {
          let score = 40;
          const reasons: string[] = [];
          if (user.target_industry && signal.industry?.toLowerCase().includes(user.target_industry.toLowerCase())) { score += 30; reasons.push(`Industry match: ${signal.industry}`); }
          if (user.target_role && signal.likely_roles?.some((r: string) => r.toLowerCase().includes(user.target_role.toLowerCase()) || user.target_role.toLowerCase().includes(r.toLowerCase()))) { score += 30; reasons.push(`Role match: ${user.target_role}`); }
          if (score < 60) continue;
          const { data: existing } = await supabase.from("radar_alerts").select("id").eq("user_id", user.user_id).eq("signal_id", signalId).single();
          if (existing) continue;
          let insight = `${signal.company_name} just raised ${signal.amount} and will hire ${user.target_role || "for your target roles"} in the next ${signal.hiring_window}. Apply before this goes public.`;
          try {
            const insightRes = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: `Write exactly 2 sentences for a job seeker alert. Company: ${signal.company_name}. Funding: ${signal.amount} ${signal.funding_stage}. User target role: ${user.target_role || "not specified"}. Hiring window: ${signal.hiring_window}. Sentence 1: what this funding means for hiring. Sentence 2: what they should do right now. Second person, direct, no fluff.` }] }) });
            const insightData = await insightRes.json();
            insight = insightData.choices?.[0]?.message?.content || insight;
          } catch { /* use fallback */ }
          const { error } = await supabase.from("radar_alerts").insert({ user_id: user.user_id, signal_id: signalId, match_score: Math.min(score, 100), match_reasons: reasons.length > 0 ? reasons : ["General relevance"], insight, is_read: false });
          if (!error) alertsCreated++;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, articlesFound: allArticles.length, signalsExtracted: signals.length, signalsStored: storedSignals.length, alertsCreated }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Radar scan error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});