import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const VALID_TYPES = ["headline", "summary", "experience", "skills", "about"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const { type, currentContent, targetRole, industry } = await req.json();
    if (!type || !VALID_TYPES.includes(type)) throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);

    const role = targetRole || "professional";
    const ind = industry || "your industry";

    const prompts: Record<string, string> = {
      headline: `You are a LinkedIn expert. Write an optimized LinkedIn headline for a ${role} in ${ind}.
${currentContent ? `Current headline: "${currentContent}"` : "No current headline."}
Rules: Max 220 characters. Format: [Role] | [Skill 1] | [Skill 2] | [Value prop]. Keyword-rich. No buzzwords. Return ONLY the headline.`,

      summary: `You are a LinkedIn expert. Write an optimized LinkedIn About/Summary for a ${role} in ${ind}.
${currentContent ? `Current: "${currentContent}"` : "No current summary."}
Rules: 150-300 words. Hook first sentence. 3-4 specialties. Quantified achievements. Soft CTA at end. Return ONLY the summary.`,

      experience: `You are a LinkedIn expert. Rewrite these experience bullets for a ${role} in ${ind} to be more impactful.
Experience: "${currentContent || "No experience provided."}"
Rules: Strong action verb each bullet. Quantify results with numbers/percentages. Focus on impact not duties. Max 2 lines per bullet. Return ONLY the bullets, one per line.`,

      skills: `You are a LinkedIn expert. Suggest the top 15 LinkedIn skills for a ${role} in ${ind}.
${currentContent ? `Current skills: "${currentContent}"` : "No current skills."}
Rules: Mix technical and soft skills. Include skills recruiters actually search for. Order by importance. Return ONLY a comma-separated list.`,

      about: `You are a LinkedIn expert. Write a compelling LinkedIn About section for a ${role} in ${ind}.
${currentContent ? `Background: "${currentContent}"` : "No background provided."}
Rules: 200-400 words. First-person. Tell their professional story. Include what drives them, key achievements, what they're seeking next. End with contact CTA. Return ONLY the about section.`,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert LinkedIn profile optimizer. Return only the requested content — no preamble, no explanation." },
          { role: "user", content: prompts[type] },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const optimizedContent = data.choices?.[0]?.message?.content?.trim();
    if (!optimizedContent) throw new Error("No content returned from AI");

    return new Response(JSON.stringify({ optimizedContent, type }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("LinkedIn optimization error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
