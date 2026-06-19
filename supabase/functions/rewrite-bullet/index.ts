import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser } from "../_shared/requireUser.ts";
import { enforceQuota, recordUsage } from "../_shared/quota.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // 1. Auth required
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    // 2. Enforce quota for bullet rewrites
    const { remaining, tier, tierLimit } = await enforceQuota(auth.user.id, "bullet_rewrite");

    const { bullet, jobContext, targetRole } = await req.json();
    if (!bullet) throw new Error("Bullet point text is required");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are an expert resume writer. Transform weak bullet points into powerful, ATS-optimized statements. Return JSON: {original, rewritten, improvements:[], score_before (0-100), score_after (0-100), action_verb, has_metrics}` },
          { role: "user", content: `Rewrite this bullet:\n"${bullet}"${targetRole ? `\nTarget role: ${targetRole}` : ''}${jobContext ? `\nContext: ${jobContext}` : ''}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    // 3. Record usage after successful rewrite
    await recordUsage(auth.user.id, "bullet_rewrite");

    return jsonResponse({ 
      ...result,
      usage: {
        remaining,
        limit: tierLimit,
        tier
      }
    });
  } catch (error) {
    console.error("Error in rewrite-bullet:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("limit reached") || message.includes("expired") || message.includes("does not include") 
      ? 429 
      : 500;
    return jsonResponse({ error: message }, status);
  }
});
