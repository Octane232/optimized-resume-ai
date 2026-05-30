import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY not configured");

    const { query, location, jobType, datePosted, page } = await req.json();
    if (!query) throw new Error("query is required");

    // Build search query
    const searchQuery = location ? `${query} in ${location}` : query;
    
    const params = new URLSearchParams({
      query: searchQuery,
      page: page?.toString() || "1",
      num_pages: "1",
      date_posted: datePosted || "all",
      remote_jobs_only: jobType === "remote" ? "true" : "false",
    });

    if (jobType && jobType !== "remote") {
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
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();

    // Clean and return only what frontend needs
    const jobs = (data.data || []).map((job: any) => ({
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

    return jsonResponse({ success: true, jobs, total: data.status });

  } catch (error) {
    console.error("job-search error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
