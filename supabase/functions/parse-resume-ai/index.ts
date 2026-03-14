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
    const { resumeText } = await req.json();
    if (!resumeText || typeof resumeText !== 'string') {
      return new Response(JSON.stringify({ error: 'Resume text is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limit exceeded.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const result = await response.json();
    const parsedResume = JSON.parse(result.choices?.[0]?.message?.content || '{}');

    return new Response(JSON.stringify(parsedResume), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in parse-resume-ai:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to parse resume' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
