import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface Opening {
  title: string;
  location: string | null;
  department: string | null;
  url: string;
}

const TIMEOUT_MS = 6000;

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VaylanceRadar/1.0)",
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|company|co|group|holdings|plc|gmbh|sa|ag)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const slugifyDashed = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|company|co|group|holdings|plc|gmbh|sa|ag)\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function candidateSlugs(companyName: string, domain?: string | null): string[] {
  const out = new Set<string>();
  if (companyName) {
    out.add(slugify(companyName));
    out.add(slugifyDashed(companyName));
  }
  if (domain) {
    const root = domain.replace(/^www\./, "").split(".")[0];
    if (root) {
      out.add(slugify(root));
      out.add(slugifyDashed(root));
    }
  }
  return [...out].filter((s) => s.length > 1).slice(0, 4);
}

// ===== Step 1: the company's own careers page =====
const CAREER_PATHS = ["/careers", "/jobs", "/careers/", "/about/careers", "/company/careers", "/work-with-us"];

async function findCompanyCareersPage(domain: string): Promise<{ url: string } | null> {
  const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  for (const path of CAREER_PATHS) {
    const url = `https://${host}${path}`;
    try {
      const res = await fetchWithTimeout(url, { method: "GET" });
      if (!res.ok) continue;
      const html = (await res.text()).toLowerCase();
      // Guard against soft 404 pages
      if (html.includes("page not found") || html.includes("404 not found")) continue;
      const looksLikeCareers =
        html.includes("open position") ||
        html.includes("open role") ||
        html.includes("job opening") ||
        html.includes("current openings") ||
        html.includes("apply now") ||
        html.includes("view job") ||
        html.includes("join our team") ||
        html.includes("careers");
      if (looksLikeCareers) return { url: res.url || url };
    } catch (_e) {
      // try the next path
    }
  }
  return null;
}

// ===== Step 2: public ATS boards (fallback only) =====
async function tryGreenhouse(slug: string): Promise<Opening[]> {
  const res = await fetchWithTimeout(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=false`,
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data?.jobs)) return [];
  return data.jobs.map((j: any) => ({
    title: String(j.title || "Role"),
    location: j.location?.name ?? null,
    department: Array.isArray(j.departments) && j.departments[0]?.name ? j.departments[0].name : null,
    url: String(j.absolute_url || `https://boards.greenhouse.io/${slug}`),
  }));
}

async function tryLever(slug: string): Promise<Opening[]> {
  const res = await fetchWithTimeout(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((j: any) => ({
    title: String(j.text || "Role"),
    location: j.categories?.location ?? null,
    department: j.categories?.team ?? j.categories?.department ?? null,
    url: String(j.hostedUrl || `https://jobs.lever.co/${slug}`),
  }));
}

async function tryAshby(slug: string): Promise<Opening[]> {
  const res = await fetchWithTimeout(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=false`,
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data?.jobs)) return [];
  return data.jobs.map((j: any) => ({
    title: String(j.title || "Role"),
    location: j.location ?? null,
    department: j.department ?? j.team ?? null,
    url: String(j.jobUrl || `https://jobs.ashbyhq.com/${slug}`),
  }));
}

async function findOnAts(companyName: string, domain?: string | null) {
  const slugs = candidateSlugs(companyName, domain);
  const providers: Array<{ name: string; fn: (s: string) => Promise<Opening[]>; board: (s: string) => string }> = [
    { name: "Greenhouse", fn: tryGreenhouse, board: (s) => `https://boards.greenhouse.io/${s}` },
    { name: "Lever", fn: tryLever, board: (s) => `https://jobs.lever.co/${s}` },
    { name: "Ashby", fn: tryAshby, board: (s) => `https://jobs.ashbyhq.com/${s}` },
  ];

  for (const slug of slugs) {
    for (const provider of providers) {
      try {
        const jobs = await provider.fn(slug);
        if (jobs.length > 0) {
          return { provider: provider.name, boardUrl: provider.board(slug), jobs: jobs.slice(0, 25) };
        }
      } catch (_e) {
        // keep trying
      }
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "Not configured" }, 500);

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const companyName = typeof body.company_name === "string" ? body.company_name.trim().slice(0, 120) : "";
    const domainRaw = typeof body.company_domain === "string" ? body.company_domain.trim().slice(0, 160) : "";
    if (!companyName) return json({ error: "company_name is required" }, 400);

    const domain = domainRaw
      ? domainRaw.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase()
      : "";

    // Step 1 — the company's own site always wins.
    if (domain) {
      const site = await findCompanyCareersPage(domain);
      if (site) {
        return json({
          status: "company_site",
          company_url: `https://${domain.replace(/^www\./, "")}`,
          careers_url: site.url,
          jobs: [],
        });
      }
    }

    // Step 2 — fall back to public ATS boards.
    const ats = await findOnAts(companyName, domain || null);
    if (ats) {
      return json({
        status: "ats",
        provider: ats.provider,
        board_url: ats.boardUrl,
        company_url: domain ? `https://${domain.replace(/^www\./, "")}` : null,
        jobs: ats.jobs,
      });
    }

    // Step 3 — nothing public yet: a genuine pre-market signal.
    return json({
      status: "pre_market",
      company_url: domain ? `https://${domain.replace(/^www\./, "")}` : null,
      jobs: [],
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
