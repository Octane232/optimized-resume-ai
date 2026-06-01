import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authClient = createClient(supabaseUrl, anonKey);

    const { data, error } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (error || !data?.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { query, location, jobType, datePosted, page } = await req.json();
    if (!query) throw new Error("query is required");

    const searchQuery = location ? `${query} in ${location}` : query;

    const params = new URLSearchParams({
      query: searchQuery,
      page: page?.toString() || "1",
      num_pages: "1",
    });

    if (datePosted && datePosted !== "all") {
      params.append("date_posted", datePosted);
    }

    if (jobType === "remote") {
      params.append("remote_jobs_only", "true");
    } else if (jobType && jobType !== "all") {
      params.append("employment_types", jobType.toUpperCase());
    }

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?${params}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("JSearch error response:", errText);
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const apiData = await response.json();

    const jobs = (apiData.data || []).map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}, ${job.job_state || job.job_country}`
        : job.job_country || "Remote",
      isRemote: job.job_is_remote,
      jobType: job.job_employment_type,
      salary: job.job_min_salary && job.job_max_salary
        ? `$${Math.round(job.job_min_salary / 1000)}k - $${Math.round(job.job_max_salary / 1000)}k`
        : job.job_salary || null,
      applyLink: job.job_apply_link,
      postedAt: job.job_posted_at_datetime_utc,
      description: job.job_description?.slice(0, 300) + "...",
      logo: job.employer_logo || null,
      highlights: job.job_highlights?.Qualifications?.slice(0, 3) || [],
    }));

    return jsonResponse({ success: true, jobs });

  } catch (error) {
    console.error("job-search error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
