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
    const { jobDescription, userResume, userName } = await req.json();

    if (!jobDescription || !userResume) {
      throw new Error("Job description and resume are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Run all three AI calls simultaneously for speed
    const [resumeResponse, coverLetterResponse, atsResponse] = await Promise.all([
      // 1. Tailor the resume
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: `Rewrite this resume to match the job description naturally.
Incorporate missing keywords. Do not fabricate experience. Keep it to one page.
Resume: ${userResume}
Job Description: ${jobDescription}`
          }],
        }),
      }),

      // 2. Write the cover letter
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: `Write a concise 3-paragraph cover letter for this role.
Use the resume to reference real experience. Be professional but personable.
${userName ? `Applicant name: ${userName}` : ''}
Resume: ${userResume}
Job Description: ${jobDescription}`
          }],
        }),
      }),

      // 3. Score ATS match
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: `Score this resume against this job description.
Return JSON only: { "beforeScore": number, "afterScore": number, "missingKeywords": string[], "improvements": string[] }
Resume: ${userResume}
Job: ${jobDescription}`
          }],
          tools: [{
            type: "function",
            function: {
              name: "ats_score",
              description: "Return ATS scoring results",
              parameters: {
                type: "object",
                properties: {
                  beforeScore: { type: "number", description: "ATS score before optimization (0-100)" },
                  afterScore: { type: "number", description: "ATS score after optimization (0-100)" },
                  missingKeywords: { type: "array", items: { type: "string" }, description: "Keywords missing from the resume" },
                  improvements: { type: "array", items: { type: "string" }, description: "Specific improvements made" }
                },
                required: ["beforeScore", "afterScore", "missingKeywords", "improvements"],
                additionalProperties: false
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "ats_score" } }
        }),
      }),
    ]);

    // Check for rate limits
    for (const resp of [resumeResponse, coverLetterResponse, atsResponse]) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("AI gateway error:", resp.status, errorText);
        throw new Error(`AI gateway error: ${resp.status}`);
      }
    }

    const [resumeData, coverLetterData, atsData] = await Promise.all([
      resumeResponse.json(),
      coverLetterResponse.json(),
      atsResponse.json(),
    ]);

    const tailoredResume = resumeData.choices?.[0]?.message?.content || "";
    const coverLetter = coverLetterData.choices?.[0]?.message?.content || "";
    
    // Extract ATS data from tool call
    let atsResult = { beforeScore: 0, afterScore: 0, missingKeywords: [], improvements: [] };
    const toolCall = atsData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      try {
        atsResult = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse ATS tool call");
      }
    }

    return new Response(JSON.stringify({
      tailoredResume,
      coverLetter,
      atsData: atsResult,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Apply bundle error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});