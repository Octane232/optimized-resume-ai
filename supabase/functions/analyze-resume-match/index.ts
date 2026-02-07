import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, jobTitle, company } = await req.json();

    console.log("Analyzing resume match...");
    console.log("Resume text length:", resumeText?.length || 0);
    console.log("Job description length:", jobDescription?.length || 0);

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Both resume and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and hiring specialist with 20+ years of recruiting experience at top companies. Your job is to honestly assess whether a candidate is a good fit for a role and provide specific, actionable advice to improve their chances.

Be direct and honest:
- If they're not qualified, tell them clearly but constructively
- If they're overqualified, mention it
- If they're a great fit, celebrate their strengths
- Focus on what ACTUALLY matters for this specific role

Your analysis should be:
- Brutally honest but encouraging
- Specific to THIS job description (not generic advice)
- Actionable with concrete examples
- Prioritized by impact on their chances`;

    const jobContext = jobTitle || company 
      ? `\n\nTarget Position: ${jobTitle || 'Not specified'}${company ? ` at ${company}` : ''}`
      : '';

    const userPrompt = `Analyze this resume against this specific job and tell me: Will this candidate get an interview?
${jobContext}

=== JOB DESCRIPTION ===
${jobDescription}

=== CANDIDATE'S RESUME ===
${resumeText}

Be honest and specific. What are their real chances, and what EXACTLY should they change?`;

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
            description: "Provide honest resume-job match analysis with specific actionable recommendations",
            parameters: {
              type: "object",
              properties: {
                match_score: { 
                  type: "number", 
                  description: "Overall match score (0-100). Be honest: 0-40 = Poor fit, 40-60 = Possible with significant changes, 60-80 = Good fit with minor improvements, 80-100 = Excellent fit" 
                },
                is_good_fit: {
                  type: "boolean",
                  description: "True if the candidate has a realistic chance of getting an interview (score >= 65)"
                },
                fit_summary: {
                  type: "string",
                  description: "A direct 2-3 sentence verdict. Start with 'You ARE/ARE NOT a good fit for this role because...' Be specific about why."
                },
                strengths: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      point: { type: "string", description: "A specific strength that matches this job's requirements" },
                      impact: { type: "string", enum: ["high", "medium"], description: "How much this strength helps their candidacy" }
                    },
                    required: ["point", "impact"]
                  },
                  description: "3-5 specific strengths that align with THIS job (not generic compliments)"
                },
                gaps: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      gap: { type: "string", description: "The specific missing skill, experience, or qualification" },
                      severity: { type: "string", enum: ["critical", "moderate", "minor"], description: "Critical = dealbreaker, Moderate = hurts chances, Minor = nice-to-have" },
                      suggestion: { type: "string", description: "EXACTLY how to address this gap in the resume (specific wording or approach)" }
                    },
                    required: ["gap", "severity", "suggestion"]
                  },
                  description: "Up to 5 gaps, ordered by severity. Be specific about what's missing."
                },
                recommendations: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      action: { type: "string", description: "The specific action to take (e.g., 'Rewrite your summary to emphasize...')" },
                      section: { type: "string", enum: ["summary", "experience", "skills", "education", "other"], description: "Which resume section to modify" },
                      priority: { type: "string", enum: ["high", "medium", "low"], description: "High = do this first, it will make the biggest difference" },
                      example: { type: "string", description: "A concrete example of improved text they can use. Be specific!" }
                    },
                    required: ["action", "section", "priority"]
                  },
                  description: "5-7 specific, prioritized recommendations. Include EXAMPLES of improved bullet points or sections."
                },
                keyword_matches: {
                  type: "array",
                  items: { type: "string" },
                  description: "Important keywords/skills from the job that ARE in the resume"
                },
                missing_keywords: {
                  type: "array",
                  items: { 
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      importance: { type: "string", enum: ["must-have", "nice-to-have"] },
                      context: { type: "string", description: "Where/how to add this keyword naturally" }
                    },
                    required: ["keyword", "importance"]
                  },
                  description: "Important keywords/skills from the job that are MISSING from the resume"
                },
                ats_warnings: {
                  type: "array",
                  items: { type: "string" },
                  description: "Any formatting or content issues that might cause ATS rejection (e.g., missing contact info, unusual formatting)"
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
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI analysis failed. Please try again.");
    }

    const data = await response.json();
    console.log("AI response received");
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("No tool call in AI response:", JSON.stringify(data));
      throw new Error("AI did not return structured analysis");
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    console.log("Analysis complete. Match score:", analysisResult.match_score);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-resume-match:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Analysis failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
