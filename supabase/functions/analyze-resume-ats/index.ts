import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeContent, jobDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze the provided resume and score it based on ATS compatibility and best practices. Consider:
- Formatting and structure
- Keyword optimization
- Experience relevance
- Education credentials
- Overall ATS compatibility

Provide scores out of 100 for each category and overall.`;

    const userPrompt = `Analyze this resume${jobDescription ? ' for the following job' : ''}:

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}Resume Content:
${JSON.stringify(resumeContent, null, 2)}

Provide a detailed ATS analysis.`;

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
    console.error("Error in analyze-resume-ats:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});