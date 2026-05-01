import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const overQuota = await enforceQuota(auth, "resume_ats");
    if (overQuota) return overQuota;

    const { resumeText, jobDescription, jobTitle, company } = await req.json();
    if (!resumeText || !jobDescription) {
      return jsonResponse({ error: "Both resume and job description are required" }, 400);
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
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    await recordUsage(auth, "resume_ats");
    return jsonResponse(analysisResult);
  } catch (error) {
    console.error("Error in analyze-resume-match:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Analysis failed" }, 500);
  }
});
