import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const overQuota = await enforceQuota(auth, "skill_gap");
    if (overQuota) return overQuota;

    const { userSkills, jobTitle, jobDescription } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a career development expert. Analyze skill gaps and return JSON: {required_skills:[], matching_skills:[], missing_skills:[], match_percentage (0-100), recommendations:[{skill, priority (critical/important/nice-to-have), learning_resources:[], estimated_time}]}" },
          { role: "user", content: `Job: ${jobTitle}\n${jobDescription ? `Description: ${jobDescription}\n` : ''}Skills: ${(userSkills || []).join(', ')}\n\nIdentify gaps and recommendations.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    await recordUsage(auth, "skill_gap");
    return jsonResponse(analysisResult);
  } catch (error) {
    console.error("Error in analyze-skill-gap:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
