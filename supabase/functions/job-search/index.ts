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

// ===== Auth & Quota Helpers =====

async function requireUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error("Unauthorized - No authorization header");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authClient = createClient(supabaseUrl, anonKey);

  const token = authHeader.replace("Bearer ", "");
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

  // Default to free tier if no profile
  const tier = profile?.subscription_tier || "free";
  const subscriptionEnd = profile?.subscription_end 
    ? new Date(profile.subscription_end) 
    : null;

  // Check if trial has expired (free tier with expired subscription)
  if (tier === "free" && subscriptionEnd && subscriptionEnd < new Date()) {
    return { tier: "expired", isExpired: true };
  }

  return { tier, isExpired: false };
}

async function enforceQuota(userId: string, feature: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  // Get user's tier and usage
  const { tier, isExpired } = await getUserTier(userId);

  if (isExpired) {
    throw new Error("Trial expired - Please upgrade to continue using this feature");
  }

  // Monthly limits per tier
  const limits = {
    free: {
      job_search: 5, // 5 searches per month
    },
    pro: {
      job_search: 50, // 50 searches per month
    },
    elite: {
      job_search: 120, // 120 searches per month
    },
  };

  const tierLimit = limits[tier as keyof typeof limits]?.job_search || 0;
  
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

  if (currentUsage >= tierLimit) {
    const tierNames = {
      free: "Free",
      pro: "Pro",
      elite: "Elite"
    };
    throw new Error(
      `Monthly ${feature} limit reached (${currentUsage}/${tierLimit}). ` +
      `Your ${tierNames[tier as keyof typeof tierNames] || tier} plan includes ${tierLimit} searches per month. ` +
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
    // 1. Authenticate user
    const authHeader = req.headers.get("Authorization");
    const user = await requireUser(authHeader);
    
    // 2. Enforce quota
    const { remaining, tier, tierLimit } = await enforceQuota(user.id, "job_search");

    // 3. Execute search
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY not configured");

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

    // 4. Record usage after successful search
    await recordUsage(user.id, "job_search");

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

    return jsonResponse({ 
      success: true, 
      jobs,
      usage: {
        remaining,
        limit: tierLimit,
        tier
      }
    });

  } catch (error) {
    console.error("job-search error:", error);
    
    // Handle quota errors with specific status codes
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("limit reached") || message.includes("expired") 
      ? 429 
      : message.includes("Unauthorized") 
        ? 401 
        : 500;
    
    return jsonResponse(
      { error: message },
      status
    );
  }
});
