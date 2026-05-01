import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // Auth required. No per-action quota — parsing is part of upload, not a metered feature.
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    const { resumeText } = await req.json();
    if (!resumeText || typeof resumeText !== 'string') {
      return jsonResponse({ error: 'Resume text is required' }, 400);
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `You are an expert resume parser. Extract structured data from resume text. Return JSON with: contact (name, email, phone, location, linkedin, github, portfolio), summary, skills (array of {name, normalizedName, category, confidence, isExplicit}), experience (array of {title, normalizedTitle, company, startDate, endDate, duration, isCurrent, bullets, keywords}), education (array of {degree, field, institution, startYear, endYear, gpa}), certifications (string array), projects (array of {title, description, technologies}), totalYearsExperience, seniorityLevel (entry/mid/senior/lead/executive), detectedSections, parsingConfidence (0-100). Normalize abbreviations. Do not hallucinate.` },
          { role: 'user', content: `Parse this resume:\n\n${resumeText}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: 'Rate limit exceeded.' }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const result = await response.json();
    const parsedResume = JSON.parse(result.choices?.[0]?.message?.content || '{}');
    return jsonResponse(parsedResume);
  } catch (error) {
    console.error('Error in parse-resume-ai:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Failed to parse resume' }, 500);
  }
});
