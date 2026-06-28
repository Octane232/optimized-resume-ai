import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

const VALID_TYPES = ["headline", "summary", "experience", "skills", "about"];

// ===== Helper Functions =====
const getOpenAIKey = (): string => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  return apiKey;
};

const validateRequest = (type: string): void => {
  if (!type || !VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
  }
};

// ===== Prompt Builders =====
interface PromptParams {
  type: string;
  currentContent: string;
  targetRole: string;
  industry: string;
}

const buildPrompt = (params: PromptParams): string => {
  const { type, currentContent, targetRole, industry } = params;
  const role = targetRole || "professional";
  const ind = industry || "your industry";
  const hasContent = currentContent ? `Current ${type}: "${currentContent}"` : `No current ${type}.`;

  const prompts: Record<string, string> = {
    headline: `You are a LinkedIn expert. Write an optimized LinkedIn headline for a ${role} in ${ind}.
${hasContent}
Rules: Max 220 characters. Format: [Role] | [Skill 1] | [Skill 2] | [Value prop]. Keyword-rich. No buzzwords. Return ONLY the headline.`,

    summary: `You are a LinkedIn expert. Write an optimized LinkedIn About/Summary for a ${role} in ${ind}.
${hasContent}
Rules: 150-300 words. Hook first sentence. 3-4 specialties. If real numbers or metrics are present in the current content, weave them in naturally — but never invent a statistic that isn't there. Soft CTA at end. Return ONLY the summary.`,

    experience: `You are a LinkedIn expert. Rewrite these experience bullets for a ${role} in ${ind} to be more impactful.
Experience: "${currentContent || "No experience provided."}"
Rules: Strong action verb each bullet. Focus on impact, not just duties. If the original content already includes a number, metric, or percentage, you may rephrase it more impressively — but NEVER invent a number, percentage, or statistic that is not present or clearly implied in the original content. If there's no real metric to draw from, write a strong qualitative bullet instead. Max 2 lines per bullet. Return ONLY the bullets, one per line.`,

    skills: `You are a LinkedIn expert. Suggest the top 15 LinkedIn skills for a ${role} in ${ind}.
${hasContent}
Rules: Mix technical and soft skills. Include skills recruiters actually search for. Order by importance. Return ONLY a comma-separated list.`,

    about: `You are a LinkedIn expert. Write a compelling LinkedIn About section for a ${role} in ${ind}.
${hasContent}
Rules: 200-400 words. First-person. Tell their professional story. Include what drives them, key achievements, what they're seeking next. End with contact CTA. Return ONLY the about section.`,
  };

  return prompts[type];
};

// ===== OpenAI Client =====
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const callOpenAI = async (apiKey: string, prompt: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${apiKey}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert LinkedIn profile optimizer. Return only the requested content — no preamble, no explanation." 
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data: OpenAIResponse = await response.json();
  const optimizedContent = data.choices?.[0]?.message?.content?.trim();
  
  if (!optimizedContent) {
    throw new Error("No content returned from AI");
  }

  return optimizedContent;
};

// ===== Error Handler =====
const handleOpenAIError = (error: unknown): Response => {
  console.error("LinkedIn optimization error:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  
  if (errorMessage === "RATE_LIMIT") {
    return jsonResponse({ error: "Rate limit exceeded. Try again shortly." }, 429);
  }
  
  return jsonResponse({ error: errorMessage }, 500);
};

// ===== Main Handler =====
const handleOptimization = async (
  auth: any,
  apiKey: string,
  body: any
): Promise<Response> => {
  const { type, currentContent, targetRole, industry } = body;
  
  validateRequest(type);
  
  const prompt = buildPrompt({ type, currentContent, targetRole, industry });
  const optimizedContent = await callOpenAI(apiKey, prompt);
  
  await recordUsage(auth, "linkedin");
  
  return jsonResponse({ optimizedContent, type });
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication & Authorization
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    
    // Check quota
    const overQuota = await enforceQuota(auth, "linkedin");
    if (overQuota) return overQuota;

    // Get API key and request body
    const OPENAI_API_KEY = getOpenAIKey();
    const body = await req.json();
    
    // Process optimization
    return await handleOptimization(auth, OPENAI_API_KEY, body);
  } catch (error) {
    return handleOpenAIError(error);
  }
});
