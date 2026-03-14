import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, jobTitle, company } = await req.json();
    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Both resume and job description are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are an expert ATS and hiring specialist. Return JSON with: match_score (0-100), is_good_fit (boolean), fit_summary (string), strengths (array of {point, impact}), gaps (array of {gap, severity, suggestion}), recommendations (array of {action, section, priority, example}), keyword_matches (string array), missing_keywords (array of {keyword, importance, context}), ats_warnings (string array). Be honest and specific.` },
          { role: "user", content: `Analyze this resume against this job.${jobTitle ? `\nTarget: ${jobTitle}${company ? ` at ${company}` : ''}` : ''}\n\nJOB:\n${jobDescription}\n\nRESUME:\n${resumeText}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return new Response(JSON.stringify(analysisResult), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in analyze-resume-match:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
