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

// Everyday, frontline and public-sector hiring — not just corporate/tech.
const MIN_ALERT_MATCH = 45;

const EVERYDAY_QUERIES = [
  '"recruiting teachers" OR "teacher vacancies" OR "teaching assistants" hiring',
  '"school" "new teachers" recruitment',
  '"hiring nurses" OR "nurse recruitment" OR "care workers" hiring',
  '"NHS trust" recruitment OR "hospital" "new staff"',
  '"council" "recruitment drive" OR "jobs created" council',
  '"warehouse" OR "distribution centre" jobs created',
  '"supermarket" OR "new store" jobs hiring',
  '"drivers" recruitment drive',
  '"hotel" OR "restaurant" opening "staff" hiring',
  '"remote-first" company hiring',
];

type Locale = { hl: string; gl: string; ceid: string };
const LOCALES: Record<string, Locale> = {
  GB: { hl: "en-GB", gl: "GB", ceid: "GB:en" },
  US: { hl: "en-US", gl: "US", ceid: "US:en" },
  CA: { hl: "en-CA", gl: "CA", ceid: "CA:en" },
  AU: { hl: "en-AU", gl: "AU", ceid: "AU:en" },
  IE: { hl: "en-IE", gl: "IE", ceid: "IE:en" },
  IN: { hl: "en-IN", gl: "IN", ceid: "IN:en" },
  NG: { hl: "en-NG", gl: "NG", ceid: "NG:en" },
  ZA: { hl: "en-ZA", gl: "ZA", ceid: "ZA:en" },
};

const COUNTRY_PATTERNS: [string, RegExp][] = [
  ["GB", /\b(uk|united kingdom|england|scotland|wales|northern ireland|britain|london|manchester|birmingham|leeds|glasgow|liverpool|bristol|edinburgh)\b/i],
  ["US", /\b(us|usa|united states|america|new york|california|texas|florida|chicago)\b/i],
  ["CA", /\b(canada|toronto|vancouver|montreal|ontario)\b/i],
  ["AU", /\b(australia|sydney|melbourne|brisbane)\b/i],
  ["IE", /\b(ireland|dublin|europe|eu)\b/i],
  ["IN", /\b(india|bangalore|bengaluru|mumbai|delhi)\b/i],
  ["NG", /\b(nigeria|lagos|abuja)\b/i],
  ["ZA", /\b(south africa|johannesburg|cape town)\b/i],
];

function countryCode(value: unknown): string | null {
  const text = String(value || "");
  for (const [code, re] of COUNTRY_PATTERNS) if (re.test(text)) return code;
  return null;
}

function resolveLocales(targetLocation: unknown, remote: boolean): Locale[] {
  const code = countryCode(targetLocation);
  const worldwide = !code || /worldwide|global|anywhere|any/i.test(String(targetLocation || ""));
  if (worldwide) return [LOCALES.GB, LOCALES.US, LOCALES.CA, LOCALES.AU, LOCALES.IE];
  const primary = LOCALES[code!];
  return remote && code !== "US" ? [primary, LOCALES.US] : [primary];
}

// Which user countries a regional-remote label covers.
function regionCovers(region: string, userCode: string): boolean {
  const r = region.toLowerCase();
  if (/worldwide|global|anywhere/.test(r)) return true;
  const groups: Record<string, string[]> = {
    GB: ["uk", "united kingdom", "britain", "europe", "emea", "eu"],
    IE: ["ireland", "europe", "emea", "eu"],
    US: ["us", "usa", "united states", "north america", "americas"],
    CA: ["canada", "north america", "americas"],
    AU: ["australia", "apac", "asia pacific", "oceania"],
    IN: ["india", "apac", "asia"],
    NG: ["nigeria", "africa", "emea"],
    ZA: ["south africa", "africa", "emea"],
  };
  return (groups[userCode] || []).some((g) => new RegExp(`\\b${g}\\b`).test(r));
}

function isEligible(signal: any, user: any): boolean {
  if (signal?.trust_tier === "low") return false;
  if (signal?.expires_at && new Date(signal.expires_at).getTime() < Date.now()) return false;
  const userCode = countryCode(user?.target_location);
  if (!userCode) return true; // worldwide / not set
  const wt = signal?.workplace_type || "onsite";
  if (wt === "remote_worldwide") return true;
  if (wt === "remote_regional") return signal?.remote_region ? regionCovers(signal.remote_region, userCode) : true;
  const sigCode = countryCode(`${signal?.country || ""} ${signal?.location || ""}`);
  return !sigCode || sigCode === userCode;
}

const SCAM_RULES: [string, RegExp][] = [
  ["upfront_fee", /(registration|training|starter|application)\s+fee|pay (a|the) fee|deposit required/i],
  ["commission_only", /commission[- ]only|unlimited earning|be your own boss/i],
  ["crypto", /\b(crypto|bitcoin|forex|nft)\b.*\b(earn|income|trading)\b/i],
  ["messaging_contact", /\b(telegram|whatsapp)\b/i],
  ["wfh_scheme", /(earn|make) \$?£?\d+[k,]?\d* (a|per) (day|week) from home|no experience.*work from home|data entry from home/i],
];

async function checkDomain(domain: string, companyName: string) {
  try {
    const res = await fetch(`https://${domain}`, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { https_ok: false, mentions_employer: false };
    const html = (await res.text()).slice(0, 200000).toLowerCase();
    const token = companyName.toLowerCase().replace(/\b(ltd|limited|inc|plc|llc|group|the)\b/g, "").trim().split(/\s+/)[0] || "";
    return { https_ok: res.url.startsWith("https://"), mentions_employer: token.length > 2 && html.includes(token) };
  } catch {
    return { https_ok: false, mentions_employer: false };
  }
}

async function verifySignal(input: {
  text: string; companyName: string; companyDomain: string | null;
  official: boolean; trustedRemote: boolean; scamTone: boolean;
}): Promise<{ tier: "high" | "medium" | "low"; flags: Record<string, unknown> }> {
  const scamHits = SCAM_RULES.filter(([, re]) => re.test(input.text)).map(([name]) => name);
  const flags: Record<string, unknown> = {
    official_source: input.official,
    trusted_remote_board: input.trustedRemote,
    scam_rules: scamHits,
    scam_tone: input.scamTone,
    domain: input.companyDomain,
  };
  if (scamHits.length || input.scamTone) return { tier: "low", flags };
  if (input.official) return { tier: "high", flags };
  if (input.companyDomain) {
    const d = await checkDomain(input.companyDomain, input.companyName);
    Object.assign(flags, d);
    if (d.https_ok && d.mentions_employer) return { tier: "high", flags };
    if (input.trustedRemote && d.https_ok) return { tier: "high", flags };
    return { tier: "medium", flags };
  }
  return { tier: "medium", flags };
}

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

type FitDimension = "role_fit" | "industry_fit" | "location_fit" | "seniority_fit";

const FIT_WEIGHTS: Record<FitDimension, number> = {
  role_fit: 50,
  industry_fit: 25,
  location_fit: 15,
  seniority_fit: 10,
};

const normalise = (value: unknown) => String(value || "").trim().toLowerCase();

const phraseFit = (target: string, candidates: string[]): number => {
  if (!target || candidates.length === 0) return 0;
  if (candidates.some((candidate) => candidate.includes(target) || target.includes(candidate))) return 100;

  const targetTokens = new Set(target.split(/[^a-z0-9]+/).filter((token) => token.length > 2));
  if (targetTokens.size === 0) return 0;
  const bestOverlap = candidates.reduce((best, candidate) => {
    const candidateTokens = new Set(candidate.split(/[^a-z0-9]+/).filter((token) => token.length > 2));
    const shared = [...targetTokens].filter((token) => candidateTokens.has(token)).length;
    return Math.max(best, shared / targetTokens.size);
  }, 0);
  return clampMatch(bestOverlap * 75);
};

const calculateWeightedFit = (
  dimensions: Partial<Record<FitDimension, unknown>>,
  preferences: any,
): number => {
  const active: FitDimension[] = [];
  if (normalise(preferences?.target_role)) active.push("role_fit");
  if (normalise(preferences?.target_industry)) active.push("industry_fit");
  if (normalise(preferences?.target_location) || normalise(preferences?.work_style)) active.push("location_fit");
  if (normalise(preferences?.experience_level)) active.push("seniority_fit");
  if (active.length === 0) return 0;

  const totalWeight = active.reduce((sum, key) => sum + FIT_WEIGHTS[key], 0);
  const weightedScore = active.reduce(
    (sum, key) => sum + clampMatch(dimensions[key]) * FIT_WEIGHTS[key],
    0,
  );
  return clampMatch(weightedScore / totalWeight);
};

const fallbackPreferenceScore = (signal: any, preferences: any) => {
  const targetRole = normalise(preferences?.target_role);
  const targetIndustry = normalise(preferences?.target_industry);
  const targetLocation = normalise(preferences?.target_location);
  const workStyle = normalise(preferences?.work_style);
  const experienceLevel = normalise(preferences?.experience_level);
  const roles = Array.isArray(signal?.likely_roles) ? signal.likely_roles.map(normalise) : [];
  const departments = Array.isArray(signal?.departments) ? signal.departments.map(normalise) : [];
  const industry = normalise(signal?.industry);
  const location = normalise(signal?.location);
  const signalText = normalise(`${signal?.description || ""} ${signal?.why_now || ""}`);
  const remoteRequested = /remote|anywhere|distributed|work from home/.test(workStyle);
  const remoteOffered = /remote|anywhere|distributed|work from home/.test(`${location} ${signalText}`);

  const dimensions = {
    role_fit: phraseFit(targetRole, [...roles, ...departments]),
    industry_fit: phraseFit(targetIndustry, [industry]),
    location_fit: remoteRequested
      ? (remoteOffered ? 100 : 20)
      : phraseFit(targetLocation, [location]),
    seniority_fit: phraseFit(experienceLevel, roles),
  };
  const reasons: string[] = [];
  if (dimensions.role_fit >= 70) reasons.push(`Role aligns with ${preferences.target_role}`);
  if (dimensions.industry_fit >= 70) reasons.push(`Industry aligns with ${preferences.target_industry}`);
  if (dimensions.location_fit >= 70) reasons.push(remoteRequested ? "Remote work preference aligns" : `Location aligns with ${preferences.target_location}`);
  if (dimensions.seniority_fit >= 70) reasons.push(`Seniority aligns with ${preferences.experience_level}`);

  const matchScore = calculateWeightedFit(dimensions, preferences);
  return {
    dimensions,
    match_score: matchScore,
    match_reasons: reasons.length
      ? reasons
      : matchScore === 0
        ? ["Add your target role, industry and location to calculate a fit score"]
        : ["This signal has limited overlap with your saved preferences"],
    insight: matchScore === 0
      ? `Set your career preferences before assessing ${signal.company_name}.`
      : `${signal.company_name} is showing a hiring signal, but the available details have limited confirmed alignment. Review the likely roles before reaching out.`,
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
          content: `You are matching a job seeker to a hidden hiring signal from ANY industry (tech, healthcare, retail, construction, logistics, hospitality, education, finance, energy, manufacturing, public sector, non-profit). Judge meaning-level fit, including adjacent and transferable roles, but do not inflate uncertain matches. Score each dimension independently. Use null when the user did not specify that preference. Return JSON only:
{"role_fit":0-100|null,"industry_fit":0-100|null,"location_fit":0-100|null,"seniority_fit":0-100|null,"match_reasons":["2-4 short evidence-based reasons, including mismatches"],"insight":"2 direct sentences: why this is or is not a fit and the single next action to take"}

Scoring anchors: 90-100 is direct and strongly evidenced; 70-89 is strong with a minor gap; 45-69 is plausible or adjacent; 20-44 is weak; 0-19 is conflicting or unsupported. Location fit must account for the user's work style. Do not create a final score; the server calculates it with role 50%, industry 25%, location/work style 15%, and seniority 10%, reweighted when a preference is absent.

User preferences:
- Target role: ${preferences?.target_role || "not specified"}
- Target industry: ${preferences?.target_industry || "not specified"}
- Target location: ${preferences?.target_location || "not specified"}
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
    // Missing/invalid AI values fall back to the rule-based dimension, never silently to 0.
    const pick = (v: unknown, fb: number) =>
      v === null || v === undefined || !Number.isFinite(Number(v)) ? fb : v;
    const dimensions = {
      role_fit: pick(parsed.role_fit, fallback.dimensions.role_fit),
      industry_fit: pick(parsed.industry_fit, fallback.dimensions.industry_fit),
      location_fit: pick(parsed.location_fit, fallback.dimensions.location_fit),
      seniority_fit: pick(parsed.seniority_fit, fallback.dimensions.seniority_fit),
    };
    return {
      match_score: calculateWeightedFit(dimensions, preferences),
      match_reasons: Array.isArray(parsed.match_reasons) && parsed.match_reasons.length ? parsed.match_reasons.slice(0, 4) : fallback.match_reasons,
      insight: parsed.insight || fallback.insight,
    };
  } catch {
    return fallback;
  }
}

// ===== Auth & Quota Helpers (aligned with the app's real usage tables) =====

const PLAN_RADAR_LIMITS: Record<string, number> = { free: 1, trial: 5, pro: 30, elite: 100 };

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
    const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const SEED_SECRET = Deno.env.get("SEED_SECRET");
    const providedSecret = req.headers.get("x-cron-secret");
    let isCron = !!SEED_SECRET && !!providedSecret && providedSecret === SEED_SECRET;
    if (!isCron && providedSecret) {
      // Scheduled job token stored in the database vault.
      const { data: ok } = await supabase.rpc("verify_radar_cron_token", { _token: providedSecret });
      isCron = ok === true;
    }

    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    const hasUserJwt = !isCron && !!authHeader && authHeader.toLowerCase().startsWith("bearer ");

    if (!isCron && !hasUserJwt) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

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

    // SOURCE 2: Google News RSS — country-aware editions for the user's target market.
    const locales = resolveLocales(requesterPreferences?.target_location, prefQueries.remote);
    // Preference-driven queries dominate; generic everyday queries only fill gaps.
    const everydayFill = prefQueries.googleNews.length >= 3 ? EVERYDAY_QUERIES.slice(0, 3) : EVERYDAY_QUERIES;
    const allNewsQueries = [...prefQueries.googleNews, ...GOOGLE_NEWS_QUERIES.slice(0, Math.max(2, 10 - prefQueries.googleNews.length)), ...everydayFill];
    try {
      const before = allArticles.length;
      const results = await Promise.allSettled(
        allNewsQueries.flatMap((q) => locales.map((loc) =>
          fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:7d")}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.ceid}`, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" },
            signal: AbortSignal.timeout(12000),
          }).then((r) => r.text()).then((xml) => ({ xml, gl: loc.gl }))
        ))
      );
      for (const r of results) {
        if (r.status === "fulfilled") {
          for (const item of parseRssItems(r.value.xml, `Google News ${r.value.gl}`, true)) pushArticle(item);
        }
      }
      console.log(`Google News RSS (${locales.map((l) => l.gl).join(",")}): ${allArticles.length - before} articles`);
    } catch (e) { console.error("Google News RSS failed:", e); }

    // SOURCE 3: Regional + sector newswires, plus vetted remote job boards.
    const RSS_FEEDS: { url: string; name: string; remoteFeed?: boolean; regions?: string[] }[] = [
      { url: "https://weworkremotely.com/remote-jobs.rss", name: "We Work Remotely", remoteFeed: true },
      { url: "https://remoteok.com/remote-jobs.rss", name: "RemoteOK", remoteFeed: true },
      { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC Business", regions: ["GB"] },
      { url: "https://www.theguardian.com/uk/business/rss", name: "The Guardian Business", regions: ["GB"] },
      { url: "https://www.uktech.news/feed", name: "UKTN", regions: ["GB"] },
      { url: "https://sifted.eu/feed", name: "Sifted", regions: ["GB", "IE", "EU"] },
      { url: "https://www.cbc.ca/webfeed/rss/rss-business", name: "CBC Business", regions: ["CA"] },
      { url: "https://www.abc.net.au/news/feed/51892/rss.xml", name: "ABC Business", regions: ["AU"] },
      { url: "https://techcrunch.com/category/venture/feed/", name: "TechCrunch", regions: ["US"] },
      { url: "https://www.healthcaredive.com/feeds/news/", name: "Healthcare Dive", regions: ["US"] },
      { url: "https://www.k12dive.com/feeds/news/", name: "K-12 Dive", regions: ["US"] },
      { url: "https://www.retaildive.com/feeds/news/", name: "Retail Dive", regions: ["US"] },
      { url: "https://www.supplychaindive.com/feeds/news/", name: "Supply Chain Dive", regions: ["US"] },
      { url: "https://www.constructiondive.com/feeds/news/", name: "Construction Dive", regions: ["US"] },
      { url: "https://www.restaurantdive.com/feeds/news/", name: "Restaurant Dive", regions: ["US"] },
    ];
    const wanted = new Set(locales.map((l) => l.gl));
    const activeFeeds = RSS_FEEDS.filter((f) =>
      f.remoteFeed ? prefQueries.remote || wanted.size > 2 : !f.regions || f.regions.some((r) => wanted.has(r) || (r === "EU" && wanted.has("IE")))
    );
    try {
      const before = allArticles.length;
      const results = await Promise.allSettled(
        activeFeeds.map((f) =>
          fetch(f.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" },
            signal: AbortSignal.timeout(12000),
          })
            .then((r) => r.text())
            .then((xml) => ({ xml, feed: f }))
        )
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          for (const item of parseRssItems(r.value.xml, r.value.feed.name, !r.value.feed.remoteFeed).slice(0, 15)) {
            pushArticle({ ...item, remoteFeed: !!r.value.feed.remoteFeed });
          }
        }
      }
      console.log(`Feeds: ${allArticles.length - before} articles`);
    } catch (e) { console.error("Feed fetch failed:", e); }

    // SOURCE 4: Official public contract awards — winners must staff up to deliver.
    const fmtMoney = (amount: number, currency: string) =>
      `${currency === "GBP" ? "£" : currency === "USD" ? "$" : currency + " "}${amount >= 1e6 ? (amount / 1e6).toFixed(1) + "M" : Math.round(amount / 1e3) + "k"}`;
    const sinceDate = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const wantsUK = wanted.has("GB") || wanted.size > 2;
    const wantsUS = wanted.has("US") || wanted.size > 2;
    const contractTasks: Promise<void>[] = [];
    if (wantsUK) {
      contractTasks.push((async () => {
        const res = await fetch(
          `https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?stages=award&publishedFrom=${sinceDate}&limit=100`,
          { signal: AbortSignal.timeout(15000) },
        );
        const data = await res.json();
        let added = 0;
        for (const rel of data?.releases || []) {
          const award = rel.awards?.[0];
          const supplier = award?.suppliers?.[0]?.name;
          const amount = Number(award?.value?.amount ?? rel.tender?.value?.amount ?? 0);
          if (!supplier || amount < 250000) continue;
          const url = award?.documents?.find((d: any) => d.url)?.url || `https://www.contractsfinder.service.gov.uk/Notice/${String(rel.id).split("-").slice(0, 5).join("-")}`;
          const value = fmtMoney(amount, award?.value?.currency || "GBP");
          pushArticle({
            title: `${supplier} awarded ${value} contract by ${rel.buyer?.name || "UK public body"}: ${rel.tender?.title || ""}`,
            description: `Contract award. Supplier: ${supplier}. Buyer: ${rel.buyer?.name || ""}. Category: ${rel.tender?.classification?.description || ""}. ${String(rel.tender?.description || "").slice(0, 250)} Contract period ${rel.tender?.contractPeriod?.startDate?.slice(0, 10) || ""} to ${rel.tender?.contractPeriod?.endDate?.slice(0, 10) || ""}. Country: United Kingdom.`,
            url,
            sourceName: "UK Contracts Finder",
            publishedAt: award?.datePublished || rel.date || new Date().toISOString(),
            official: true,
            contractAward: true,
          });
          added++;
        }
        console.log(`UK Contracts Finder: ${added} awards`);
      })().catch((e) => console.error("Contracts Finder failed:", e)));
    }
    if (wantsUS) {
      contractTasks.push((async () => {
        const res = await fetch("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            filters: {
              award_type_codes: ["A", "B", "C", "D"],
              time_period: [{ start_date: sinceDate, end_date: new Date().toISOString().split("T")[0], date_type: "new_awards_only" }],
              award_amounts: [{ lower_bound: 1000000 }],
            },
            fields: ["Award ID", "Recipient Name", "Award Amount", "Awarding Agency", "Description", "Start Date", "generated_internal_id", "Place of Performance State Code"],
            limit: 40,
            sort: "Award Amount",
            order: "desc",
          }),
        });
        const data = await res.json();
        let added = 0;
        for (const a of data?.results || []) {
          if (!a["Recipient Name"] || !a.generated_internal_id) continue;
          const value = fmtMoney(Number(a["Award Amount"] || 0), "USD");
          pushArticle({
            title: `${a["Recipient Name"]} awarded ${value} federal contract by ${a["Awarding Agency"]}`,
            description: `Contract award. ${String(a.Description || "").slice(0, 300)} Place of performance: ${a["Place of Performance State Code"] || ""}, United States. Start ${a["Start Date"] || ""}.`,
            url: `https://www.usaspending.gov/award/${a.generated_internal_id}`,
            sourceName: "USAspending.gov",
            publishedAt: a["Start Date"] ? new Date(a["Start Date"]).toISOString() : new Date().toISOString(),
            official: true,
            contractAward: true,
          });
          added++;
        }
        console.log(`USAspending: ${added} awards`);
      })().catch((e) => console.error("USAspending failed:", e)));
    }
    // Corporate newswire: contract wins, expansions and executive appointments across every sector.
    contractTasks.push((async () => {
      const feeds = [
        { url: "https://www.prnewswire.com/rss/news-releases-list.rss", name: "PR Newswire" },
        { url: "https://www.globenewswire.com/RssFeed/subjectcode/27-Contracts/feedTitle/GlobeNewswire%20-%20Contracts", name: "GlobeNewswire Contracts" },
        { url: "https://www.globenewswire.com/RssFeed/subjectcode/45-Management%20Changes/feedTitle/GlobeNewswire%20-%20Management%20Changes", name: "GlobeNewswire Appointments" },
      ];
      const leadership = /\b(appoints|appointed|names|named|joins as|hires)\b.*\b(chief|ceo|cto|cfo|coo|vp|vice president|head of|director|president)\b/i;
      const contract = /\b(awarded|wins|win|secures|selected|contract|tender|agreement|expands|expansion|opens|new facility)\b/i;
      const results = await Promise.allSettled(feeds.map((f) =>
        fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)" }, signal: AbortSignal.timeout(12000) })
          .then((r) => r.text()).then((xml) => ({ xml, f }))
      ));
      let added = 0;
      for (const r of results) {
        if (r.status !== "fulfilled") continue;
        for (const item of parseRssItems(r.value.xml, r.value.f.name, false)) {
          const text = `${item.title} ${item.description}`;
          if (!contract.test(text) && !leadership.test(text)) continue;
          pushArticle(item);
          if (++added >= 40) break;
        }
      }
      console.log(`Newswires: ${added} contract/expansion/appointment releases`);
    })().catch((e) => console.error("Newswire failed:", e)));
    await Promise.allSettled(contractTasks);

    // Round-robin across sources so one noisy source can't crowd out the rest.
    const bySource = new Map<string, any[]>();
    for (const a of allArticles) {
      const key = a.sourceName || "other";
      if (!bySource.has(key)) bySource.set(key, []);
      bySource.get(key)!.push(a);
    }
    const articles: any[] = [];
    const buckets = [...bySource.values()];
    for (let idx = 0; articles.length < 90 && buckets.some((b) => b.length > idx); idx++) {
      for (const b of buckets) if (b[idx] && articles.length < 90) articles.push(b[idx]);
    }
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

Decide whether this news article implies an organisation is likely to hire soon. Hiring intent can come from: funding rounds, expansion, new locations/facilities/stores/plants/clinics, contract or tender wins (including official public-procurement award notices — the supplier is the company that will hire, not the buyer), new senior leaders (a new VP/Head/Chief usually builds a team within 60 days), mergers/acquisitions, large investments, government programmes, seasonal ramp-ups, or an explicit hiring announcement. Ignore layoffs, opinion pieces, product reviews, and pure market commentary.

Return JSON only:
{
 "is_hiring_signal": true|false,
 "company_name": "organisation name",
 "company_domain": "official company website hostname, such as stripe.com; empty string unless you are highly confident it belongs to this exact organisation",
 "signal_type": "Funding|Expansion|New Facility|Contract Win|Leadership Hire|Acquisition|Investment|Hiring Announcement|Public Programme",
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
 "confidence": 0-100,
 "is_direct_vacancy": true if this is an actual job advert/vacancy, false if it is a news lead,
 "workplace_type": "remote_worldwide|remote_regional|hybrid|onsite",
 "remote_region": "for remote_regional only: e.g. UK, Europe, US, North America, EMEA; else empty string",
 "country": "ISO country name of the job, e.g. United Kingdom, United States; empty if worldwide remote",
 "sector": "Education|Healthcare|Public Sector|Retail|Hospitality|Logistics|Construction|Manufacturing|Technology|Finance|Energy|Other",
 "scam_tone": true if the text shows scam signs (vague work-from-home, upfront fees, commission-only, crypto, Telegram/WhatsApp contact, unrealistic pay)
}

Include everyday and frontline roles (teachers, teaching assistants, nurses, care workers, drivers, warehouse, retail, hospitality, admin) — not just senior or tech roles. Set is_hiring_signal false if there is no credible hiring implication. Never use the news publisher, a job board, a social network, or a guessed domain as company_domain.

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
          const companyDomain = normalizeCompanyDomain(parsed.company_domain, article.url);
          const workplace = ["remote_worldwide", "remote_regional", "hybrid", "onsite"].includes(parsed.workplace_type)
            ? parsed.workplace_type
            : (article.remoteFeed ? "remote_worldwide" : "onsite");
          const verification = await verifySignal({
            text: `${article.title} ${article.description}`,
            companyName: String(parsed.company_name),
            companyDomain,
            official: !!article.official,
            trustedRemote: !!article.remoteFeed,
            scamTone: !!parsed.scam_tone,
          });
          const isRemote = workplace.startsWith("remote");
          // Remote roles must clear the strict bar: only High trust is published.
          if (verification.tier === "low") return null;
          if (isRemote && verification.tier !== "high") return null;
          const kind = !article.contractAward && (article.official || article.remoteFeed || parsed.is_direct_vacancy) ? "posting" : "lead";
          const published = new Date(article.publishedAt || Date.now());
          const expires = new Date(published.getTime() + (kind === "posting" ? 21 : 45) * 86400000);
          if (expires.getTime() < Date.now()) return null;
          return {
            company_name: String(parsed.company_name).slice(0, 160),
            company_domain: companyDomain,
            signal_type: article.contractAward ? "Contract Win" : (parsed.signal_type || "Hiring Announcement"),
            industry: parsed.industry || null,
            location: parsed.location || (workplace === "remote_worldwide" ? "Remote · Worldwide" : null),
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
            published_at: published.toISOString(),
            kind,
            trust_tier: verification.tier,
            workplace_type: workplace,
            remote_region: workplace === "remote_regional" ? (parsed.remote_region || null) : null,
            country: parsed.country || null,
            sector: parsed.sector || null,
            check_flags: verification.flags,
            expires_at: expires.toISOString(),
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
          kind: signal.kind,
          trust_tier: signal.trust_tier,
          workplace_type: signal.workplace_type,
          remote_region: signal.remote_region,
          country: signal.country,
          sector: signal.sector,
          check_flags: signal.check_flags,
          expires_at: signal.expires_at,
        }).eq("id", existing.id);
        storedSignals.push({ id: existing.id, signal });
        continue;
      }
      const { data: inserted, error } = await supabase.from("radar_signals").insert(signal).select("id").single();
      if (error) console.error("Insert signal failed:", error.message);
      if (!error && inserted) storedSignals.push({ id: inserted.id, signal });
    }
    console.log(`Prepared ${storedSignals.length} signals for matching`);

    if (requestingUserId && storedSignals.length < 15) {
      // Read from the verified pool built by earlier/scheduled scans — only recent
      // discoveries, so old signals are not recycled into a fresh feed.
      const recencyCutoff = new Date(Date.now() - SIGNAL_RECENCY_DAYS * 86400000).toISOString();
      const { data: recentSignals } = await supabase
        .from("radar_signals")
        .select("*")
        .neq("trust_tier", "low")
        .gte("created_at", recencyCutoff)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false })
        .limit(60);
      const have = new Set(storedSignals.map((s) => s.id));
      for (const signal of recentSignals || []) if (!have.has(signal.id)) storedSignals.push({ id: signal.id, signal });
    }

    // STEP 4: Match signals against user preferences
    let usersQuery = supabase.from("career_preferences").select("user_id, target_role, target_industry, target_location, experience_level, target_salary, work_style");
    if (requestingUserId) usersQuery = usersQuery.eq("user_id", requestingUserId);
    const { data: users } = await usersQuery;
    const usersToMatch = requestingUserId && (!users || users.length === 0)
      ? [{ user_id: requestingUserId, target_role: null, target_industry: null, target_location: null, experience_level: null, target_salary: null, work_style: null }]
      : users || [];

    let alertsCreated = 0;
    let alertsUpdated = 0;

    for (const user of usersToMatch) {
      // Hard eligibility filter BEFORE scoring (e.g. US-only remote for a UK user),
      // and at most one signal per company so one employer can't dominate the feed.
      const seenCompanies = new Set<string>();
      const matchLimit = storedSignals
        .filter(({ signal }) => isEligible(signal, user))
        .filter(({ signal }) => {
          const key = normalise(signal?.company_name);
          if (!key) return true;
          if (seenCompanies.has(key)) return false;
          seenCompanies.add(key);
          return true;
        })
        .slice(0, 40);
      for (let i = 0; i < matchLimit.length; i += 5) {
        const chunk = matchLimit.slice(i, i + 5);
        const scored = await Promise.all(chunk.map(async ({ id: signalId, signal }) => ({
          signalId,
          match: await scoreSignalWithAI(signal, user, OPENAI_API_KEY),
        })));
        for (const { signalId, match } of scored) {
          const { data: existing } = await supabase.from("radar_alerts").select("id").eq("user_id", user.user_id).eq("signal_id", signalId).maybeSingle();
          // Only keep genuinely relevant matches; drop weak ones from the feed.
          if ((match.match_score || 0) < MIN_ALERT_MATCH) {
            if (existing) await supabase.from("radar_alerts").delete().eq("id", existing.id);
            continue;
          }
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
