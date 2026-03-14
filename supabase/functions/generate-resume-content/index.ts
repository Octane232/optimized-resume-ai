import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, targetRole, experience, education, skills, jobDescription } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    let userPrompt: string;
    if (jobDescription) {
      userPrompt = `Analyze this job description and create a tailored resume.\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCandidate: ${name || "Candidate"}, ${email || ""}, ${phone || ""}\nTarget: ${targetRole || "As in job posting"}\n\nGenerate JSON with: summary, recommendedTemplate (tech/creative/executive/modern/classic), experience (array of {title, company, startDate, endDate, responsibilities:[]}), education (array of {degree, institution, startYear, endYear}), projects (array of {title, description, technologies:[]}), skills (string array). Optimize for ATS.`;
    } else {
      userPrompt = `Create resume for:\nName: ${name}\nTarget: ${targetRole}\nExperience: ${experience}\nEducation: ${education}\nSkills: ${skills?.join(', ') || ''}\n\nGenerate JSON with: summary, recommendedTemplate (tech/creative/executive/modern/classic), experience, education, projects, skills. Optimize for ATS.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are an expert resume writer. Generate professional, ATS-optimized resume content as JSON." },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const resumeContent = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    const fullResumeData = {
      contact: { name: name || "Your Name", email: email || "", phone: phone || "", title: targetRole || resumeContent.experience?.[0]?.title || "", location: '', linkedin: '', portfolio: '', github: '' },
      summary: resumeContent.summary,
      skills: resumeContent.skills || skills || [],
      experience: resumeContent.experience,
      education: resumeContent.education,
      projects: resumeContent.projects,
      certifications: [], languages: [], awards: []
    };

    return new Response(JSON.stringify({ data: fullResumeData, recommendedTemplate: resumeContent.recommendedTemplate }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error generating resume:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
