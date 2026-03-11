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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { jobTitle, company, location, yearsExperience, currentSalary } = await req.json();
    if (!jobTitle) throw new Error("jobTitle is required");

    const [benchmarkRes, negotiationRes] = await Promise.all([
      // Call 1: Salary benchmark data
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{
            role: "user",
            content: `You are a compensation expert. Return salary benchmark data as JSON for this role.

Job Title: ${jobTitle}
Company: ${company || "not specified"}
Location: ${location || "United States"}
Years of Experience: ${yearsExperience || "not specified"}

Return exactly this JSON structure:
{
  "title": "exact job title",
  "location": "location used",
  "salaryRange": { "low": 000000, "median": 000000, "high": 000000 },
  "totalCompRange": { "low": 000000, "median": 000000, "high": 000000 },
  "breakdown": { "baseSalary": 000000, "bonus": 000000, "equity": "e.g. $0-50K/yr", "benefits": "e.g. $15K/yr" },
  "marketDemand": "High/Medium/Low",
  "demandReason": "one sentence why",
  "topPayingCompanies": ["company1", "company2", "company3", "company4", "company5"],
  "salaryFactors": ["factor1", "factor2", "factor3"],
  "isUnderpaid": ${currentSalary ? `true or false based on whether ${currentSalary} is below median` : "null"},
  "underpaidBy": ${currentSalary ? "number representing how much below median, or 0 if at or above" : "null"}
}`
          }]
        }),
      }).then(r => r.json()),

      // Call 2: Negotiation scripts
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{
            role: "user",
            content: `Write 3 salary negotiation scripts for a ${jobTitle}${company ? ` at ${company}` : ""}${location ? ` in ${location}` : ""}${yearsExperience ? ` with ${yearsExperience} years experience` : ""}.

Return exactly this JSON:
{
  "scripts": [
    {
      "style": "Confident",
      "label": "Direct and assertive",
      "opening": "exact opening line to say",
      "body": "2-3 sentences making the case",
      "closing": "exact closing line"
    },
    {
      "style": "Collaborative",
      "label": "Win-win framing",
      "opening": "exact opening line",
      "body": "2-3 sentences",
      "closing": "exact closing line"
    },
    {
      "style": "Data-driven",
      "label": "Lead with market data",
      "opening": "exact opening line",
      "body": "2-3 sentences with market data references",
      "closing": "exact closing line"
    }
  ],
  "keyTips": ["tip1", "tip2", "tip3"],
  "counterOfferAdvice": "one paragraph on handling counter offers",
  "timingAdvice": "one sentence on when to negotiate"
}`
          }]
        }),
      }).then(r => r.json()),
    ]);

    const benchmark = JSON.parse(benchmarkRes.choices?.[0]?.message?.content || "{}");
    const negotiation = JSON.parse(negotiationRes.choices?.[0]?.message?.content || "{}");

    return new Response(
      JSON.stringify({ success: true, benchmark, negotiation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("salary-intel error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});