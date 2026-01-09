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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume optimization specialist with 15+ years of recruiting experience. You analyze resumes against specific job descriptions to provide actionable, specific feedback that helps candidates get past ATS filters and impress hiring managers.

IMPORTANT: The resume data you receive may include enriched "Vault" data:
- "allSkills": Combined skills from the resume AND manually added skills the candidate has
- "certifications": Professional certifications the candidate holds
- "projects": Side projects or portfolio work with technologies used

When analyzing, consider ALL this data - not just the core resume content. A candidate may have relevant skills or certifications in their Vault that should boost their match score even if not yet in their resume. Point out opportunities to add these to the resume.

Your analysis should be:
- Specific and actionable (not generic advice)
- Focused on what will actually improve their chances
- Honest about gaps while being encouraging
- Prioritized by impact
- Consider certifications and projects when evaluating qualifications`;

    const jobContext = jobTitle || company 
      ? `\n\nTarget Position: ${jobTitle || 'Not specified'}${company ? ` at ${company}` : ''}`
      : '';

    // Parse the resume to check for vault data
    let parsedResume;
    try {
      parsedResume = typeof resumeText === 'string' ? JSON.parse(resumeText) : resumeText;
    } catch {
      parsedResume = { rawText: resumeText };
    }

    const hasVaultData = parsedResume?.vaultEnriched === true;
    const vaultContext = hasVaultData ? `

ADDITIONAL VAULT DATA (candidate's enriched profile):
- All Skills (resume + manually added): ${parsedResume.allSkills?.join(', ') || 'None'}
- Certifications: ${parsedResume.certifications?.map((c: any) => c.name + (c.issuer ? ` (${c.issuer})` : '')).join(', ') || 'None'}
- Projects: ${parsedResume.projects?.map((p: any) => p.name + (p.technologies ? `: ${p.technologies}` : '')).join('; ') || 'None'}

Consider these Vault items when scoring and providing recommendations. If they have relevant certifications or projects, suggest adding them to the resume.` : '';

    const userPrompt = `Analyze this resume for the following job opportunity:
${jobContext}

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeText}
${vaultContext}

Provide a comprehensive match analysis with specific, actionable recommendations. Consider:
1. How well does the candidate's experience align with the role requirements?
2. What specific keywords from the job posting are missing from the resume?
3. If they have relevant certifications or projects in their Vault, recommend adding them
4. What concrete changes would improve their match score?
5. Are there any red flags an ATS might catch?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_match_analysis",
            description: "Provide detailed resume-job match analysis with specific actionable recommendations",
            parameters: {
              type: "object",
              properties: {
                match_score: { 
                  type: "number", 
                  description: "Overall match score (0-100) based on skills, experience, and keyword alignment" 
                },
                is_good_fit: {
                  type: "boolean",
                  description: "Whether the resume is a good fit for the job (score >= 70)"
                },
                fit_summary: {
                  type: "string",
                  description: "A 1-2 sentence summary of overall fit and main recommendation"
                },
                strengths: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      point: { type: "string", description: "The strength" },
                      impact: { type: "string", enum: ["high", "medium"], description: "How much this helps their candidacy" }
                    },
                    required: ["point", "impact"]
                  },
                  description: "Key strengths that align with the job (max 5)"
                },
                gaps: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      gap: { type: "string", description: "The missing skill or experience" },
                      severity: { type: "string", enum: ["critical", "moderate", "minor"], description: "How important this gap is" },
                      suggestion: { type: "string", description: "How to address this gap in the resume" }
                    },
                    required: ["gap", "severity", "suggestion"]
                  },
                  description: "Missing skills or experience gaps (max 5)"
                },
                recommendations: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      action: { type: "string", description: "Specific action to take" },
                      section: { type: "string", enum: ["summary", "experience", "skills", "education", "other"], description: "Which resume section to modify" },
                      priority: { type: "string", enum: ["high", "medium", "low"], description: "Priority level" },
                      example: { type: "string", description: "Optional: example text or rewording" }
                    },
                    required: ["action", "section", "priority"]
                  },
                  description: "Specific, actionable recommendations to improve match (max 6)"
                },
                keyword_matches: {
                  type: "array",
                  items: { type: "string" },
                  description: "Important keywords from the job that are present in the resume"
                },
                missing_keywords: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      importance: { type: "string", enum: ["must-have", "nice-to-have"] },
                      context: { type: "string", description: "Where/how to add this keyword" }
                    },
                    required: ["keyword", "importance"]
                  },
                  description: "Important keywords missing from the resume"
                },
                ats_warnings: {
                  type: "array",
                  items: { type: "string" },
                  description: "Any formatting or content issues that might cause ATS problems"
                }
              },
              required: ["match_score", "is_good_fit", "fit_summary", "strengths", "gaps", "recommendations", "keyword_matches", "missing_keywords"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "provide_match_analysis" } }
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
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
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
    console.error("Error in analyze-resume-match:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
