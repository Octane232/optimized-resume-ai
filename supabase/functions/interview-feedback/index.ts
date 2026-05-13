import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// ===== Helper Functions =====
async function callOpenAI(apiKey: string, body: Record<string, unknown>) {
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error("OpenAI error", res.status, text);
    if (res.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`OpenAI ${res.status}`);
  }
  return await res.json();
}

const getOpenAIKey = (): string => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return apiKey;
};

// ===== Mode Handlers =====
interface GenerateQuestionsParams {
  position?: string;
  company?: string;
}

async function handleGenerateQuestions(apiKey: string, params: GenerateQuestionsParams) {
  const { position, company } = params;
  
  const data = await callOpenAI(apiKey, {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You generate 5 sharp, role-specific interview questions. Return JSON: {\"questions\":[\"q1\",\"q2\",\"q3\",\"q4\",\"q5\"]}. Mix behavioural and technical. Be specific to the role." },
      { role: "user", content: `Position: ${position || 'General'}${company ? `\nCompany: ${company}` : ''}\n\nGenerate 5 interview questions tailored to this role.` },
    ],
  });
  
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  const questions = Array.isArray(parsed.questions) ? parsed.questions.slice(0, 5) : [];
  
  return jsonResponse({ questions });
}

interface LiveCoachingParams {
  question: string;
  position?: string;
  company?: string;
}

async function handleLiveCoaching(apiKey: string, auth: any, params: LiveCoachingParams) {
  const { question, position, company } = params;
  
  if (!question) {
    return jsonResponse({ error: "question is required" }, 400);
  }
  
  const overQuota = await enforceQuota(auth, "interview_prep");
  if (overQuota) return overQuota;

  const data = await callOpenAI(apiKey, {
    model: "gpt-4o-mini",
    max_tokens: 600,
    messages: [
      { role: "system", content: "You are a real-time interview coach. The user is in a LIVE interview and just heard a question. Reply with a concise, specific answer they can deliver in 60-90 seconds. Use the STAR method when behavioural. Be concrete, not generic. Plain text, no markdown headings." },
      { role: "user", content: `Role: ${position || 'General'}${company ? `\nCompany: ${company}` : ''}\nQuestion just asked: "${question}"\n\nGive me a strong answer I can say right now.` },
    ],
  });
  
  const suggestion = data.choices?.[0]?.message?.content?.trim() || "";
  await recordUsage(auth, "interview_prep");
  
  return jsonResponse({ suggestion });
}

interface ScoreAnswerParams {
  question: string;
  answer: string;
  position?: string;
}

async function handleScoreAnswer(apiKey: string, auth: any, params: ScoreAnswerParams) {
  const { question, answer, position } = params;
  
  if (!question || !answer) {
    return jsonResponse({ error: "question and answer are required" }, 400);
  }
  
  const overQuota = await enforceQuota(auth, "interview_prep");
  if (overQuota) return overQuota;

  const data = await callOpenAI(apiKey, {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 1500,
    messages: [
      { role: "system", content: "You are a STRICT interview coach. Score 1-10. Return JSON: {\"score\":number,\"feedback\":\"string\",\"strengths\":[\"string\"],\"improvements\":[\"string\"]}. Empty/irrelevant answers get 1-3. Be harsh but constructive." },
      { role: "user", content: `Position: ${position || 'General'}\nQuestion: ${question}\nAnswer: ${answer}\n\nEvaluate strictly.` }
    ],
  });

  const feedback = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  feedback.score = Math.min(10, Math.max(1, feedback.score || 1));

  await recordUsage(auth, "interview_prep");
  
  return jsonResponse(feedback);
}

// ===== Main Request Handler =====
function isGenerateOnlyRequest(body: any): boolean {
  return body.generateOnly === true;
}

function isLiveModeRequest(body: any): boolean {
  return body.liveMode === true;
}

async function handleError(error: unknown): Promise<Response> {
  console.error("interview-feedback error:", error);
  const msg = error instanceof Error ? error.message : "Unknown error";
  
  if (msg === "RATE_LIMIT") {
    return jsonResponse({ error: "Rate limit exceeded. Try again shortly." }, 429);
  }
  
  return jsonResponse({ error: msg }, 500);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    // Get API key
    const OPENAI_API_KEY = getOpenAIKey();
    const body = await req.json();

    // Route to appropriate handler based on mode
    if (isGenerateOnlyRequest(body)) {
      return await handleGenerateQuestions(OPENAI_API_KEY, {
        position: body.position,
        company: body.company,
      });
    }

    if (isLiveModeRequest(body)) {
      return await handleLiveCoaching(OPENAI_API_KEY, auth, {
        question: body.question,
        position: body.position,
        company: body.company,
      });
    }

    // Default: Score an answer
    return await handleScoreAnswer(OPENAI_API_KEY, auth, {
      question: body.question,
      answer: body.answer,
      position: body.position,
    });
  } catch (error) {
    return await handleError(error);
  }
});
