import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function formatResumeAsText(content: any): string {
  if (!content) return '';
  const sections: string[] = [];
  const contact = content.contact || content.personalInfo || {};
  const name = contact.name || contact.fullName || '';
  const email = contact.email || '';
  const phone = contact.phone || '';
  if (name || email) { sections.push('=== CONTACT ==='); if (name) sections.push(`Name: ${name}`); if (email) sections.push(`Email: ${email}`); if (phone) sections.push(`Phone: ${phone}`); }
  if (content.summary) { sections.push('\n=== SUMMARY ==='); sections.push(content.summary); }
  const skills = content.skills || [];
  if (Array.isArray(skills) && skills.length > 0) { sections.push('\n=== SKILLS ==='); sections.push(skills.join(', ')); }
  const experience = content.experience || [];
  if (Array.isArray(experience) && experience.length > 0) {
    sections.push('\n=== EXPERIENCE ===');
    experience.forEach((exp: any, i: number) => {
      sections.push(`\n${i+1}. ${exp.title || 'Position'} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`);
      const bullets = exp.responsibilities || exp.bullets || [];
      if (Array.isArray(bullets)) bullets.forEach((b: string) => { if (b?.trim()) sections.push(`   - ${b.trim()}`); });
    });
  }
  if (content.education?.length > 0) { sections.push('\n=== EDUCATION ==='); content.education.forEach((e: any) => sections.push(`${e.degree || ''} - ${e.institution || ''}`)); }
  return sections.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeContent, jobDescription } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    let resumeText = '';
    if (resumeContent?.rawText) { resumeText = resumeContent.rawText; }
    else { resumeText = formatResumeAsText(resumeContent); }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are an ATS expert. Analyze the resume and return JSON: {overall_score, formatting_score, keywords_score, experience_score, education_score, missing_keywords:[], strengths:[], weaknesses:[], suggestions:[{category, suggestion, priority}]}. All scores 0-100.` },
          { role: "user", content: `Analyze this resume${jobDescription ? ' for this job' : ''}:\n${jobDescription ? `Job:\n${jobDescription}\n\n` : ''}Resume:\n${resumeText}` }
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
    console.error("Error in analyze-resume-ats:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
