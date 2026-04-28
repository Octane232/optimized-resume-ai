import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// ===== Constants =====
const VALID_OPTIMIZATION_TYPES = ["headline", "summary", "experience", "skills", "about"] as const;
type OptimizationType = typeof VALID_OPTIMIZATION_TYPES[number];

// ===== Prompt Templates =====
const getPrompt = (
  type: OptimizationType,
  currentContent: string,
  targetRole: string,
  industry: string
): string => {
  const role = targetRole || "professional";
  const ind = industry || "your industry";

  const prompts: Record<OptimizationType, string> = {
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

  return prompts[type];
};

// ===== Helper Functions =====
const createErrorResponse = (message: string, status: number = 500): Response => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
};

const createSuccessResponse = (data: unknown): Response => {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
};

// ===== Main Handler =====
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== Validate Environment Variables =====
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiApiKey) {
      console.error("OPENAI_API_KEY not configured");
      return createErrorResponse("OpenAI API key not configured", 500);
    }

    // ===== Parse and Validate Request Body =====
    let requestBody: {
      type: OptimizationType;
      currentContent?: string;
      targetRole?: string;
      industry?: string;
    };

    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return createErrorResponse("Invalid JSON payload", 400);
    }

    const { type, currentContent = "", targetRole = "", industry = "" } = requestBody;

    // Validate type
    if (!type || !VALID_OPTIMIZATION_TYPES.includes(type)) {
      return createErrorResponse(
        `Invalid type. Must be one of: ${VALID_OPTIMIZATION_TYPES.join(", ")}`,
        400
      );
    }

    // ===== Generate Optimization Prompt =====
    const prompt = getPrompt(type, currentContent, targetRole, industry);

    // ===== Call OpenAI API =====
    let response: Response;
    let responseData: unknown;

    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert LinkedIn profile optimizer. Return only the requested content — no preamble, no explanation."
            },
            {
              role: "user",
              content: prompt
            },
          ],
        }),
      });

      responseData = await response.json();
    } catch (networkError) {
      console.error("Network error calling OpenAI:", networkError);
      return createErrorResponse("Failed to connect to OpenAI", 502);
    }

    // Handle rate limiting
    if (response.status === 429) {
      return createErrorResponse("Rate limit exceeded. Try again shortly.", 429);
    }

    // Handle other API errors
    if (!response.ok) {
      console.error("OpenAI API error:", responseData);
      return createErrorResponse(`OpenAI error: ${response.status}`, response.status);
    }

    // Extract optimized content
    const optimizedContent = (responseData as any)?.choices?.[0]?.message?.content?.trim();
    if (!optimizedContent) {
      console.error("No content returned from OpenAI:", responseData);
      return createErrorResponse("No content returned from AI", 500);
    }

    // ===== Return Success Response =====
    return createSuccessResponse({
      optimizedContent,
      type,
    });

  } catch (error) {
    // Handle unexpected errors
    console.error("LinkedIn optimization error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage, 500);
  }
});
