import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm, location, page = 1 } = await req.json();
    
    const ADZUNA_API_ID = Deno.env.get("ADZUNA_API_ID");
    const ADZUNA_API_KEY = Deno.env.get("ADZUNA_API_KEY");

    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      throw new Error("Adzuna API credentials not configured");
    }

    // Build Adzuna API URL
    const country = "us"; // Default to US, can be made dynamic later
    const baseUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    
    const params = new URLSearchParams({
      app_id: ADZUNA_API_ID,
      app_key: ADZUNA_API_KEY,
      results_per_page: "50",
      ...(searchTerm && { what: searchTerm }),
      ...(location && { where: location }),
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Adzuna response to match our Job interface
    const transformedJobs = data.results?.map((job: any) => ({
      id: job.id,
      slug: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "Not specified",
      jobTypes: job.contract_time ? [job.contract_time] : ["Full Time"],
      tags: job.category?.tag ? [job.category.tag] : [],
      description: job.description || "",
      url: job.redirect_url,
      createdAt: job.created,
      salary: job.salary_min && job.salary_max 
        ? { min: job.salary_min, max: job.salary_max }
        : null,
    })) || [];

    return new Response(
      JSON.stringify({
        data: transformedJobs,
        count: data.count || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error searching jobs:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
