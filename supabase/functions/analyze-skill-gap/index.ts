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
    const { userSkills, jobTitle, jobDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a career development expert specializing in skill gap analysis. Analyze the user's skills against job requirements and provide detailed recommendations.`;

    const userPrompt = `Analyze skill gaps for this scenario:

Job Title: ${jobTitle}
${jobDescription ? `Job Description: ${jobDescription}\n` : ''}
User's Current Skills: ${userSkills.join(', ')}

Identify required skills for this role, which skills the user has, which are missing, and provide learning recommendations.`;

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
            name: "analyze_skill_gap",
            description: "Analyze skill gaps and provide recommendations",
            parameters: {
              type: "object",
              properties: {
                required_skills: {
                  type: "array",
                  items: { type: "string" },
                  description: "Skills required for the job role"
                },
                matching_skills: {
                  type: "array",
                  items: { type: "string" },
                  description: "User's skills that match job requirements"
                },
                missing_skills: {
                  type: "array",
                  items: { type: "string" },
                  description: "Required skills the user is missing"
                },
                match_percentage: {
                  type: "number",
                  description: "Percentage of skills match (0-100)"
                },
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      skill: { type: "string" },
                      priority: { type: "string", enum: ["critical", "important", "nice-to-have"] },
                      learning_resources: {
                        type: "array",
                        items: { type: "string" }
                      },
                      estimated_time: { type: "string" }
                    }
                  },
                  description: "Learning recommendations for missing skills"
                }
              },
              required: ["required_skills", "matching_skills", "missing_skills", "match_percentage", "recommendations"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_skill_gap" } }
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
    console.error("Error in analyze-skill-gap:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});