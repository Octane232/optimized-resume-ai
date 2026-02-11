import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, currentContent, targetRole } = await req.json();

    if (!type || !["headline", "summary"].includes(type)) {
      throw new Error("Invalid type. Must be 'headline' or 'summary'.");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert LinkedIn profile optimizer and career branding strategist. You write concise, keyword-rich, recruiter-friendly LinkedIn content. Never use emojis excessively. Be professional but personable.`;

    let userPrompt = "";

    if (type === "headline") {
      userPrompt = `Optimize this LinkedIn headline for a ${targetRole || "professional"} role.

${currentContent ? `Current headline: "${currentContent}"` : "No current headline provided."}

Requirements:
- Max 220 characters
- Include the target role and 2-3 relevant keywords recruiters search for
- Use pipes (|) or bullet separators to structure it
- Make it compelling and specific, not generic
- If current headline is provided, improve it while keeping relevant parts

Return ONLY the optimized headline text, nothing else.`;
    } else {
      userPrompt = `Optimize this LinkedIn summary/about section for a ${targetRole || "professional"} role.

${currentContent ? `Current summary: "${currentContent}"` : "No current summary provided."}

Requirements:
- 150-300 words
- Start with a compelling hook (no "I am a...")
- Include 3-4 key specialties or achievements
- Use short paragraphs for readability
- End with a soft call-to-action
- Include industry keywords naturally for SEO
- If current summary is provided, improve it while preserving the person's actual experience

Return ONLY the optimized summary text, nothing else.`;
    }

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const optimizedContent = data.choices?.[0]?.message?.content?.trim();

    if (!optimizedContent) {
      throw new Error("No content returned from AI");
    }

    return new Response(
      JSON.stringify({ optimizedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("LinkedIn optimization error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
