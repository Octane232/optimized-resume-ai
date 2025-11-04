import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const interviewFeedbackSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(1000, "Question too long"),
  answer: z.string().trim().min(1, "Answer is required").max(5000, "Answer too long"),
  position: z.string().trim().max(200, "Position too long").optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validated = interviewFeedbackSchema.parse(body);
    const { question, answer, position } = validated;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a STRICT and CRITICAL interview coach. Be HARSH and HONEST in your evaluation.

SCORING RULES - Follow these strictly:
- Empty, meaningless, or irrelevant answers: 1-2/10
- Very poor answers with minimal content: 2-3/10
- Poor answers lacking structure or examples: 3-4/10
- Below average answers: 4-5/10
- Average answers with some good points: 5-6/10
- Good answers with clear structure: 6-7/10
- Very good answers with examples: 7-8/10
- Excellent answers with great examples and structure: 8-9/10
- Perfect, exceptional answers: 9-10/10

If the candidate says nothing meaningful, gives a very short response, or clearly didn't answer the question properly, give them 1-3/10.

Evaluate strictly on:
1. Does the answer actually address the question?
2. Is there clear structure (e.g., STAR method)?
3. Are there specific, concrete examples?
4. Is the answer complete and thorough?
5. Does it demonstrate relevant skills/knowledge?`;

    const userPrompt = `Position: ${position || 'General'}
Interview Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer strictly. If it's poor, empty, or meaningless, score it 1-3/10.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_interview_answer",
              description: "Provide structured feedback on an interview answer",
              parameters: {
                type: "object",
                properties: {
                  score: {
                    type: "number",
                    description: "Score from 1-10, be strict"
                  },
                  feedback: {
                    type: "string",
                    description: "Detailed feedback on the answer"
                  },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of strengths (empty array if answer is poor)"
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of specific improvements needed"
                  }
                },
                required: ["score", "feedback", "strengths", "improvements"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "evaluate_interview_answer" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI feedback");
    }

    const data = await response.json();
    
    // Extract the structured tool call response
    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }
    
    const feedback = JSON.parse(toolCall.function.arguments);
    
    // Ensure score is within bounds
    feedback.score = Math.min(10, Math.max(1, feedback.score));

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
