import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_RESUME_CHARS = 6000;

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

/** Trim the candidate CV text to a safe size for the prompt. */
function cleanResume(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const text = raw.replace(/\s+\n/g, "\n").trim();
  if (!text) return "";
  return text.length > MAX_RESUME_CHARS ? text.slice(0, MAX_RESUME_CHARS) : text;
}

function resumeBlock(resume: string): string {
  if (!resume) return "";
  return `\n\nCANDIDATE RESUME (the only source of facts about them):\n"""\n${resume}\n"""`;
}

const GROUNDING_RULE =
  "Ground everything in the candidate resume when it is provided: reference their real employers, projects, tools and numbers. " +
  "NEVER invent jobs, dates, metrics, employers or credentials that are not in the resume. " +
  "If the resume uses placeholders like [Company Name], keep it generic instead of inventing a name.";

function safeJson(raw: string | undefined): Record<string, unknown> {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

const asStrings = (v: unknown, max = 6): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).slice(0, max).map((x) => (x as string).trim()) : [];

const asText = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

// ===== Mode Handlers =====
interface GenerateQuestionsParams {
  position?: string;
  company?: string;
  resume?: string;
}

async function handleGenerateQuestions(apiKey: string, params: GenerateQuestionsParams) {
  const { position, company } = params;
  const resume = cleanResume(params.resume);

  const data = await callOpenAI(apiKey, {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content:
          "You generate 5 sharp, role-specific interview questions. " +
          'Return JSON: {"questions":["q1","q2","q3","q4","q5"]}. ' +
          "Mix behavioural and technical. Be specific to the role. " +
          "When a resume is supplied, at least 3 questions must probe real details from it (a named project, a tool they list, a claimed result, or a gap/short tenure). " +
          GROUNDING_RULE,
      },
      {
        role: "user",
        content:
          `Position: ${position || "General"}${company ? `\nCompany: ${company}` : ""}` +
          resumeBlock(resume) +
          `\n\nGenerate 5 interview questions tailored to this role${resume ? " and to this candidate's actual background" : ""}.`,
      },
    ],
  });

  const parsed = safeJson(data.choices?.[0]?.message?.content);
  const questions = asStrings(parsed.questions, 5);

  return jsonResponse({ questions, grounded: Boolean(resume) });
}

interface LiveCoachingParams {
  question: string;
  position?: string;
  company?: string;
  resume?: string;
}

async function handleLiveCoaching(apiKey: string, auth: any, params: LiveCoachingParams) {
  const { question, position, company } = params;
  const resume = cleanResume(params.resume);

  if (!question) {
    return jsonResponse({ error: "question is required" }, 400);
  }

  const overQuota = await enforceQuota(auth, "interview_prep");
  if (overQuota) return overQuota;

  const data = await callOpenAI(apiKey, {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content:
          "You are a real-time interview copilot. The candidate is LIVE in an interview and just heard a question. " +
          "They can only glance at the screen for two seconds, so answer as short cue-card fragments they can speak from, never paragraphs. " +
          'Return JSON exactly: {"opening":"one spoken sentence to start with (max 20 words)","situation":"the real context/story to use (max 18 words)","action":"what they did (max 20 words)","result":"the outcome, with a number if the resume has one (max 16 words)","keywords":["3-5 high-signal terms to drop"],"closing":"one short sentence to hand back to the interviewer (max 16 words)"}. ' +
          "For non-behavioural or technical questions, still use the same fields: situation = the framing, action = the approach/steps, result = the trade-off or outcome. " +
          "Plain text only, no markdown, no quotes around fields. " +
          GROUNDING_RULE,
      },
      {
        role: "user",
        content:
          `Role: ${position || "General"}${company ? `\nCompany: ${company}` : ""}` +
          resumeBlock(resume) +
          `\nQuestion just asked: "${question}"\n\nGive me glanceable cue-card talking points I can speak right now.`,
      },
    ],
  });

  const parsed = safeJson(data.choices?.[0]?.message?.content);
  const cue = {
    opening: asText(parsed.opening),
    situation: asText(parsed.situation),
    action: asText(parsed.action),
    result: asText(parsed.result),
    closing: asText(parsed.closing),
    keywords: asStrings(parsed.keywords, 5),
  };

  // Plain-text fallback so older clients / copy-to-clipboard still work.
  const suggestion = [cue.opening, cue.situation, cue.action, cue.result, cue.closing]
    .filter(Boolean)
    .join(" ");

  if (!suggestion) {
    throw new Error("Empty AI response");
  }

  await recordUsage(auth, "interview_prep");

  return jsonResponse({ cue, suggestion, grounded: Boolean(resume) });
}

interface ScoreAnswerParams {
  question: string;
  answer: string;
  position?: string;
  company?: string;
  resume?: string;
}

async function handleScoreAnswer(apiKey: string, auth: any, params: ScoreAnswerParams) {
  const { question, answer, position, company } = params;
  const resume = cleanResume(params.resume);

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
      {
        role: "system",
        content:
          "You are a STRICT interview coach scoring one answer. Return JSON: " +
          '{"score":number 1-10,"feedback":"2-3 sentence verdict","strengths":["string"],"improvements":["string"],' +
          '"star":{"situation":number 0-10,"task":number 0-10,"action":number 0-10,"result":number 0-10},' +
          '"starNotes":{"situation":"one line","task":"one line","action":"one line","result":"one line"},' +
          '"improvedAnswer":"a rewritten 60-90 word version of THEIR answer, spoken in first person"}. ' +
          "Empty or irrelevant answers score 1-3. Be harsh but constructive. " +
          "Score the STAR dimensions independently: result should be low unless they state a concrete outcome or number. " +
          "The improved answer must reuse the candidate's own experience — strengthen structure and specificity, do not fabricate. " +
          GROUNDING_RULE,
      },
      {
        role: "user",
        content:
          `Position: ${position || "General"}${company ? `\nCompany: ${company}` : ""}` +
          resumeBlock(resume) +
          `\nQuestion: ${question}\nTheir answer: ${answer}\n\nEvaluate strictly and rewrite it stronger.`,
      },
    ],
  });

  const parsed = safeJson(data.choices?.[0]?.message?.content);
  const clamp = (v: unknown) => Math.min(10, Math.max(0, Number(v) || 0));
  const rawStar = (parsed.star || {}) as Record<string, unknown>;
  const rawNotes = (parsed.starNotes || {}) as Record<string, unknown>;

  const feedback = {
    score: Math.min(10, Math.max(1, Number(parsed.score) || 1)),
    feedback: asText(parsed.feedback) || "Good attempt.",
    strengths: asStrings(parsed.strengths),
    improvements: asStrings(parsed.improvements),
    star: {
      situation: clamp(rawStar.situation),
      task: clamp(rawStar.task),
      action: clamp(rawStar.action),
      result: clamp(rawStar.result),
    },
    starNotes: {
      situation: asText(rawNotes.situation),
      task: asText(rawNotes.task),
      action: asText(rawNotes.action),
      result: asText(rawNotes.result),
    },
    improvedAnswer: asText(parsed.improvedAnswer),
    grounded: Boolean(resume),
  };

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
        resume: body.resume,
      });
    }

    if (isLiveModeRequest(body)) {
      return await handleLiveCoaching(OPENAI_API_KEY, auth, {
        question: body.question,
        position: body.position,
        company: body.company,
        resume: body.resume,
      });
    }

    // Default: Score an answer
    return await handleScoreAnswer(OPENAI_API_KEY, auth, {
      question: body.question,
      answer: body.answer,
      position: body.position,
      company: body.company,
      resume: body.resume,
    });
  } catch (error) {
    return await handleError(error);
  }
});
