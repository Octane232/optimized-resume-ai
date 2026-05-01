import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const overQuota = await enforceQuota(auth, "interview_prep");
    if (overQuota) return overQuota;

    const { question, answer, position } = await req.json();
    if (!question || !answer) throw new Error("question and answer are required");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are a STRICT interview coach. Score 1-10. Return JSON: {"score":number,"feedback":"string","strengths":["string"],"improvements":["string"]}. Empty/irrelevant answers get 1-3. Be harsh but constructive.` },
          { role: "user", content: `Position: ${position || 'General'}\nQuestion: ${question}\nAnswer: ${answer}\n\nEvaluate strictly.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const feedback = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    feedback.score = Math.min(10, Math.max(1, feedback.score || 1));

    await recordUsage(auth, "interview_prep");
    return jsonResponse(feedback);
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
