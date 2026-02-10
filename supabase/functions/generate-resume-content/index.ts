import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, targetRole, experience, education, skills } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume writer and career coach. Generate professional, ATS-optimized resume content that highlights achievements and uses strong action verbs. Focus on quantifiable results and industry-specific keywords. Also recommend the most suitable resume template based on the role and industry.`;

    const userPrompt = `Create comprehensive resume content for:

Name: ${name}
Target Role: ${targetRole}
Experience Level: ${experience}
Education: ${education}
Skills: ${skills.join(', ')}

Generate:
1. A compelling professional summary (2-3 sentences) that highlights key strengths
2. 3-4 work experience entries with:
   - Job title, company name
   - Start and end dates (use realistic recent dates)
   - 3-4 bullet points per role with quantifiable achievements
3. 2 education entries with degree, institution, and graduation year
4. 3-5 relevant projects with titles, descriptions, and technologies
5. Recommend the best template type based on the role:
   - "tech" for software/IT roles
   - "creative" for design/marketing roles
   - "executive" for senior management/C-level positions
   - "modern" for contemporary corporate roles
   - "classic" for traditional industries (law, finance, academia)

Make it specific to ${targetRole} and optimize for ATS systems.`;

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
            name: "generate_resume",
            description: "Generate structured resume content",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                recommendedTemplate: { 
                  type: "string",
                  enum: ["tech", "creative", "executive", "modern", "classic"],
                  description: "Recommended template type based on the target role"
                },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      company: { type: "string" },
                      startDate: { type: "string" },
                      endDate: { type: "string" },
                      responsibilities: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["title", "company", "startDate", "endDate", "responsibilities"]
                  }
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      degree: { type: "string" },
                      institution: { type: "string" },
                      startYear: { type: "string" },
                      endYear: { type: "string" },
                      gpa: { type: "string" }
                    },
                    required: ["degree", "institution", "startYear", "endYear"]
                  }
                },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      technologies: {
                        type: "array",
                        items: { type: "string" }
                      },
                      link: { type: "string" }
                    },
                    required: ["title", "description", "technologies"]
                  }
                }
              },
              required: ["summary", "recommendedTemplate", "experience", "education", "projects"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_resume" } }
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
      throw new Error(`AI gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const resumeContent = JSON.parse(toolCall.function.arguments);

    // Combine with user input
    const fullResumeData = {
      contact: {
        name,
        email,
        phone,
        title: targetRole,
        location: '',
        linkedin: '',
        portfolio: '',
        github: ''
      },
      summary: resumeContent.summary,
      skills: skills,
      experience: resumeContent.experience,
      education: resumeContent.education,
      projects: resumeContent.projects,
      certifications: [],
      languages: [],
      awards: []
    };

    return new Response(
      JSON.stringify({ 
        data: fullResumeData,
        recommendedTemplate: resumeContent.recommendedTemplate 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating resume:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});