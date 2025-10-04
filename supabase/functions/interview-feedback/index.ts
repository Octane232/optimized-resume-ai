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
    const { question, answer, position } = await req.json();
    
    if (!question || !answer) {
      throw new Error('Question and answer are required');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert interview coach providing feedback on interview answers. 
Your feedback should be constructive, specific, and actionable. 
Evaluate the answer on: clarity, structure, specific examples, relevance, and completeness.
Provide a score from 1-10 and detailed feedback.
Format your response as JSON with fields: score (number), feedback (string), strengths (array), improvements (array)`;

    const userPrompt = `Position: ${position || 'General'}
Question: ${question}
Candidate's Answer: ${answer}

Please evaluate this interview answer and provide detailed feedback.`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI feedback");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to text parsing
    let feedback;
    try {
      feedback = JSON.parse(aiResponse);
    } catch {
      // If not JSON, create a structured response from the text
      const scoreMatch = aiResponse.match(/score[:\s]+(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
      
      feedback = {
        score: Math.min(10, Math.max(1, score)),
        feedback: aiResponse,
        strengths: [],
        improvements: []
      };
    }

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
