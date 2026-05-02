import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

// Weighted scoring formula (deterministic — calculated in code, not by AI)
// Final = 0.30 * skills + 0.25 * experience + 0.10 * education + 0.20 * semantic + 0.15 * keywords
const WEIGHTS = {
  skills: 0.30,
  experience: 0.25,
  education: 0.10,
  semantic: 0.20,
  keywords: 0.15,
};

const clamp = (n: any) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
};

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

    // Step 1+2+3: Ask AI for STRUCTURED dimension scores (no overall % from AI).
    // Use semantic understanding so phrases like "organized office schedules" partially
    // satisfy "scheduling meetings", "calendar management", etc.
    const systemPrompt = `You are an expert ATS analyst. You MUST score each dimension independently using SEMANTIC understanding (meaning), not just exact keyword matches. A phrase like "organized office schedules" partially satisfies "scheduling meetings" or "calendar management".

Return JSON with this EXACT shape:
{
  "skills_match": 0-100,
  "experience_match": 0-100,
  "education_match": 0-100,
  "semantic_relevance": 0-100,
  "keyword_match": 0-100,
  "is_good_fit": boolean,
  "fit_summary": "1-2 sentence honest verdict",
  "strengths": [{"point": "specific strength", "impact": "high"|"medium"}],
  "gaps": [{"gap": "specific gap", "severity": "critical"|"moderate"|"minor", "suggestion": "actionable fix"}],
  "recommendations": [{"action": "what to do", "section": "summary"|"experience"|"skills"|"education"|"other", "priority": "high"|"medium"|"low", "example": "rewritten line"}],
  "keyword_matches": ["exact ATS keywords found in resume"],
  "missing_keywords": [{"keyword": "term", "importance": "must-have"|"nice-to-have", "context": "why it matters"}],
  "ats_warnings": ["formatting/structural ATS issues"]
}

Scoring rules:
- skills_match: how well candidate's skills/tools cover required ones (semantic, not literal)
- experience_match: relevance + depth + seniority alignment
- education_match: required degree/field alignment (default 80 if no requirement)
- semantic_relevance: overall meaning-level fit beyond keywords
- keyword_match: % of EXACT ATS keywords present verbatim
- missing_keywords: only EXACT verbatim keywords missing — NOT concepts already covered semantically.

Be honest. Do not inflate. Do not return an overall percentage — that is calculated separately.`;

    const userPrompt = `Analyze this resume against this job.${jobTitle ? `\nTarget: ${jobTitle}${company ? ` at ${company}` : ''}` : ''}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const ai = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    // Step 3: Calculate final weighted score IN CODE (deterministic, consistent)
    const dims = {
      skills: clamp(ai.skills_match),
      experience: clamp(ai.experience_match),
      education: clamp(ai.education_match),
      semantic: clamp(ai.semantic_relevance),
      keywords: clamp(ai.keyword_match),
    };

    const overallMatch = Math.round(
      dims.skills * WEIGHTS.skills +
      dims.experience * WEIGHTS.experience +
      dims.education * WEIGHTS.education +
      dims.semantic * WEIGHTS.semantic +
      dims.keywords * WEIGHTS.keywords
    );

    // Build response — preserve legacy keys for the existing UI, add new structured fields.
    const result = {
      // Legacy keys (UI already consumes these)
      match_score: overallMatch,
      is_good_fit: typeof ai.is_good_fit === 'boolean' ? ai.is_good_fit : overallMatch >= 70,
      fit_summary: ai.fit_summary || '',
      strengths: ai.strengths || [],
      gaps: ai.gaps || [],
      recommendations: ai.recommendations || [],
      keyword_matches: ai.keyword_matches || [],
      missing_keywords: ai.missing_keywords || [],
      ats_warnings: ai.ats_warnings || [],

      // New: structured breakdown so UI can show "Overall Match" separately from "ATS Keywords"
      overall_match: overallMatch,
      score_breakdown: {
        skills_match: dims.skills,
        experience_match: dims.experience,
        education_match: dims.education,
        semantic_relevance: dims.semantic,
        keyword_match: dims.keywords,
      },
      weights: WEIGHTS,
    };

    await recordUsage(auth, "resume_ats");
    return jsonResponse(result);
  } catch (error) {
    console.error("Error in analyze-resume-match:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Analysis failed" }, 500);
  }
});
