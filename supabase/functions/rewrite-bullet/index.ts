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
    const { bullet, jobContext, targetRole } = await req.json();

    if (!bullet) {
      throw new Error("Bullet point text is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume writer who transforms weak bullet points into powerful, ATS-optimized accomplishment statements. 

Your rewrites should:
1. Start with a strong action verb
2. Include quantifiable metrics when possible (%, $, time saved, etc.)
3. Show impact and results, not just responsibilities
4. Be concise but impactful (max 2 sentences)
5. Use industry keywords naturally
6. Follow the STAR format (Situation, Task, Action, Result) implicitly

Examples of transformations:
- "Worked on projects" → "Led 5 cross-functional projects delivering $2.5M in revenue, completing 15% ahead of schedule"
- "Helped with customer service" → "Resolved 150+ customer inquiries weekly, achieving 98% satisfaction rating and reducing escalations by 40%"
- "Responsible for social media" → "Grew social media presence by 300%, driving 50K new followers and 25% increase in engagement within 6 months"`;

    const userPrompt = `Rewrite this resume bullet point to be more impactful and ATS-friendly:

Original bullet: "${bullet}"
${targetRole ? `Target role: ${targetRole}` : ''}
${jobContext ? `Job context: ${jobContext}` : ''}

Provide both the rewritten bullet and a brief explanation of what was improved.`;

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
            name: "provide_rewritten_bullet",
            description: "Provide a rewritten resume bullet point with improvements",
            parameters: {
              type: "object",
              properties: {
                original: { 
                  type: "string", 
                  description: "The original bullet point" 
                },
                rewritten: { 
                  type: "string", 
                  description: "The improved, ATS-optimized bullet point" 
                },
                improvements: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of specific improvements made"
                },
                score_before: {
                  type: "number",
                  description: "Estimated ATS score before (0-100)"
                },
                score_after: {
                  type: "number",
                  description: "Estimated ATS score after (0-100)"
                },
                action_verb: {
                  type: "string",
                  description: "The strong action verb used to start the bullet"
                },
                has_metrics: {
                  type: "boolean",
                  description: "Whether the rewritten bullet includes quantifiable metrics"
                }
              },
              required: ["original", "rewritten", "improvements", "score_before", "score_after"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "provide_rewritten_bullet" } }
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

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in rewrite-bullet:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
