import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const { jobDescription, userResume, userName } = await req.json();
    if (!jobDescription || !userResume) throw new Error("jobDescription and userResume are required");

    // Run all three AI calls at the same time
    const [resumeRes, coverLetterRes, atsRes] = await Promise.all([

      // 1. Tailor the resume
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "user",
            content: `Rewrite this resume to match the job description. Add missing keywords naturally. Do not fabricate experience. Keep it concise.\n\nRESUME:\n${userResume}\n\nJOB DESCRIPTION:\n${jobDescription}`
          }]
        }),
      }).then(r => r.json()),

      // 2. Write the cover letter
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "user",
            content: `Write a concise 3-paragraph cover letter for this role. Use real experience from the resume. Professional but personable.${userName ? `\nApplicant name: ${userName}` : ""}\n\nRESUME:\n${userResume}\n\nJOB DESCRIPTION:\n${jobDescription}`
          }]
        }),
      }).then(r => r.json()),

      // 3. ATS score before and after
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{
            role: "user",
            content: `You are an ATS system. Analyse the resume against the job description and return JSON only:
{
  "beforeScore": number between 0-100,
  "afterScore": number between 0-100 (assume optimised version),
  "foundKeywords": ["keywords present in resume"],
  "missingKeywords": ["important keywords missing from resume"],
  "partialKeywords": ["keywords partially matched"],
  "improvements": ["specific reason 1 why score was low", "specific reason 2", "what was fixed"]
}

RESUME:\n${userResume}\n\nJOB DESCRIPTION:\n${jobDescription}`
          }]
        }),
      }).then(r => r.json()),
    ]);

    const tailoredResume = resumeRes.choices?.[0]?.message?.content || "";
    const coverLetter = coverLetterRes.choices?.[0]?.message?.content || "";
    const atsData = JSON.parse(atsRes.choices?.[0]?.message?.content || "{}");

    return new Response(
      JSON.stringify({ success: true, tailoredResume, coverLetter, atsData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("apply-bundle error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});