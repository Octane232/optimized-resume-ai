import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth required to prevent unmetered chat abuse. No quota — chat is unlimited per session.
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    const { messages, mode } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: "messages array is required" }, 400);
    }
    // Cap conversation context to prevent extremely large requests
    const trimmedMessages = messages.slice(-20);

    const systemPrompt = mode === 'hunter'
      ? `You are Vaylance AI, a helpful career assistant focused on job hunting. Help with finding jobs, optimizing resumes, interview prep, tracking applications, and career strategy. Be concise, actionable, and encouraging.`
      : `You are Vaylance AI, a helpful career growth assistant. Help with career development, skill building, salary negotiation, networking, and long-term planning. Be concise, actionable, and encouraging.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...trimmedMessages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return jsonResponse({ error: "Rate limit exceeded." }, 429);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
    return jsonResponse({ content });
  } catch (error) {
    console.error("Vaylance chat error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
