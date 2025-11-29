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
    const { resumeText, jobDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume and job matching analyst. Analyze the resume against the job description and provide detailed feedback on how well the resume matches the job requirements.`;

    const userPrompt = `Analyze this resume for the following job:

Job Description:
${jobDescription}

Resume Content:
${resumeText}

Provide a comprehensive match analysis.`;

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
            name: "provide_match_analysis",
            description: "Provide detailed resume-job match analysis",
            parameters: {
              type: "object",
              properties: {
                match_score: { 
                  type: "number", 
                  description: "Overall match score (0-100)" 
                },
                is_good_fit: {
                  type: "boolean",
                  description: "Whether the resume is a good fit for the job"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "Key strengths and matches"
                },
                gaps: {
                  type: "array",
                  items: { type: "string" },
                  description: "Missing skills or experience"
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" },
                  description: "Specific recommendations to improve the resume for this job"
                },
                keyword_matches: {
                  type: "array",
                  items: { type: "string" },
                  description: "Important keywords that match"
                },
                missing_keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Important keywords missing from resume"
                }
              },
              required: ["match_score", "is_good_fit", "strengths", "gaps", "recommendations"],
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
