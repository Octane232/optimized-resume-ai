import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Convert structured resume data to human-readable text
function formatResumeAsText(content: any): string {
  if (!content) return '';
  
  const sections: string[] = [];
  
  // Contact Information - prioritize 'contact' (classic templates) over 'personalInfo'
  const contact = content.contact || content.personalInfo || {};
  const name = contact.name || contact.fullName || '';
  const title = contact.title || '';
  const email = contact.email || '';
  const phone = contact.phone || '';
  const location = contact.location || '';
  const linkedin = contact.linkedin || contact.website || contact.portfolio || '';
  const github = contact.github || '';
  
  if (name || email || phone) {
    sections.push('=== CONTACT INFORMATION ===');
    if (name) sections.push(`Name: ${name}`);
    if (title) sections.push(`Title: ${title}`);
    if (email) sections.push(`Email: ${email}`);
    if (phone) sections.push(`Phone: ${phone}`);
    if (location) sections.push(`Location: ${location}`);
    if (linkedin) sections.push(`LinkedIn/Website: ${linkedin}`);
    if (github) sections.push(`GitHub: ${github}`);
  }
  
  // Professional Summary
  if (content.summary && typeof content.summary === 'string' && content.summary.trim().length > 0) {
    sections.push('\n=== PROFESSIONAL SUMMARY ===');
    sections.push(content.summary.trim());
  }
  
  // Skills - handle both array and string formats
  const skills = content.skills || [];
  if (Array.isArray(skills) && skills.length > 0) {
    sections.push('\n=== SKILLS ===');
    sections.push(skills.join(', '));
  } else if (typeof skills === 'string' && skills.trim().length > 0) {
    sections.push('\n=== SKILLS ===');
    sections.push(skills);
  }
  
  // Work Experience - handle 'responsibilities' (classic) and 'bullets' (modern)
  const experience = content.experience || [];
  if (Array.isArray(experience) && experience.length > 0) {
    sections.push('\n=== WORK EXPERIENCE ===');
    experience.forEach((exp: any, index: number) => {
      const expTitle = exp.title || exp.position || '';
      const company = exp.company || '';
      const startDate = exp.startDate || '';
      const endDate = exp.endDate || 'Present';
      
      if (expTitle || company) {
        sections.push(`\n${index + 1}. ${expTitle || 'Position'}${company ? ` at ${company}` : ''}`);
        if (startDate || endDate) sections.push(`   Duration: ${startDate} - ${endDate}`);
        
        // Handle both 'responsibilities' (classic) and 'bullets' (modern)
        const bullets = exp.responsibilities || exp.bullets || exp.description || [];
        if (Array.isArray(bullets) && bullets.length > 0) {
          bullets.forEach((bullet: string) => {
            if (bullet && typeof bullet === 'string' && bullet.trim()) {
              sections.push(`   • ${bullet.trim()}`);
            }
          });
        } else if (typeof bullets === 'string' && bullets.trim()) {
          sections.push(`   ${bullets.trim()}`);
        }
      }
    });
  }
  
  // Education
  if (content.education && content.education.length > 0) {
    sections.push('\n=== EDUCATION ===');
    content.education.forEach((edu: any) => {
      const degree = edu.degree || '';
      const institution = edu.institution || edu.school || '';
      const startYear = edu.startYear || edu.startDate || '';
      const endYear = edu.endYear || edu.endDate || '';
      sections.push(`${degree} - ${institution}`);
      if (startYear || endYear) sections.push(`   ${startYear} - ${endYear}`);
    });
  }
  
  // Projects
  if (content.projects && content.projects.length > 0) {
    sections.push('\n=== PROJECTS ===');
    content.projects.forEach((proj: any) => {
      sections.push(`${proj.title || proj.name || 'Project'}`);
      if (proj.description) sections.push(`   ${proj.description}`);
      if (proj.technologies && proj.technologies.length > 0) {
        sections.push(`   Technologies: ${proj.technologies.join(', ')}`);
      }
    });
  }
  
  // Certifications
  if (content.certifications && content.certifications.length > 0) {
    sections.push('\n=== CERTIFICATIONS ===');
    content.certifications.forEach((cert: any) => {
      const certName = cert.name || cert.title || '';
      const issuer = cert.issuer || cert.organization || '';
      sections.push(`• ${certName}${issuer ? ` - ${issuer}` : ''}`);
    });
  }
  
  return sections.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeContent, jobDescription, mode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Handle both structured resume data and raw uploaded text
    let resumeText = '';
    if (resumeContent?.rawText) {
      // Uploaded/pasted resume text
      resumeText = resumeContent.rawText;
    } else {
      // Convert structured resume data into readable text format
      resumeText = formatResumeAsText(resumeContent);
    }

    const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze the provided resume and score it based on ATS compatibility and best practices. Consider:
- Formatting and structure
- Keyword optimization
- Experience relevance
- Education credentials
- Overall ATS compatibility
- Common mistakes (typos, grammar, unclear descriptions)

Provide scores out of 100 for each category and overall. Be thorough in identifying mistakes and areas for improvement.`;

    const userPrompt = `Analyze this resume${jobDescription ? ' for the following job' : ''}:

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}Resume Content:
${resumeText}

Provide a detailed ATS analysis. Focus on finding mistakes, formatting issues, and areas that need improvement.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_ats_score",
            description: "Provide ATS scoring and analysis for a resume",
            parameters: {
              type: "object",
              properties: {
                overall_score: { type: "number", description: "Overall ATS score (0-100)" },
                formatting_score: { type: "number", description: "Formatting score (0-100)" },
                keywords_score: { type: "number", description: "Keywords optimization score (0-100)" },
                experience_score: { type: "number", description: "Experience relevance score (0-100)" },
                education_score: { type: "number", description: "Education credentials score (0-100)" },
                missing_keywords: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Keywords missing from resume that are in job description"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "Key strengths of the resume"
                },
                weaknesses: {
                  type: "array",
                  items: { type: "string" },
                  description: "Areas needing improvement"
                },
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      suggestion: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] }
                    }
                  },
                  description: "Actionable improvement suggestions"
                }
              },
              required: ["overall_score", "formatting_score", "keywords_score", "experience_score", "education_score", "strengths", "weaknesses", "suggestions"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "provide_ats_score" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-resume-ats:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});