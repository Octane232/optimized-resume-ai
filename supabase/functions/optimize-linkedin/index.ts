import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, currentContent, targetRole } = await req.json();
    if (!type || !["headline", "summary"].includes(type)) throw new Error("Invalid type. Must be 'headline' or 'summary'.");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    let userPrompt = "";
    if (type === "headline") {
      userPrompt = `Optimize this LinkedIn headline for a ${targetRole || "professional"} role.\n${currentContent ? `Current: "${currentContent}"` : "No current headline."}\nMax 220 chars. Include role + 2-3 keywords. Use pipes. Return ONLY the headline.`;
    } else {
      userPrompt = `Optimize this LinkedIn summary for a ${targetRole || "professional"} role.\n${currentContent ? `Current: "${currentContent}"` : "No current summary."}\n150-300 words. Compelling hook. 3-4 specialties. Short paragraphs. Soft CTA. Include keywords. Return ONLY the summary.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert LinkedIn profile optimizer. Write concise, keyword-rich, recruiter-friendly content." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const optimizedContent = data.choices?.[0]?.message?.content?.trim();
    if (!optimizedContent) throw new Error("No content returned");

    return new Response(JSON.stringify({ optimizedContent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("LinkedIn optimization error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
