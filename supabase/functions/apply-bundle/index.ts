import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

// ===== Constants =====
const OPENAI_MODEL = "gpt-4o-mini";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// ===== Helper Functions =====
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callOpenAIWithRetry = async (
  apiKey: string,
  prompt: string,
  responseFormat?: { type: string },
  retryCount: number = 0
): Promise<string> => {
  try {
    const body: any = {
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    };
    
    if (responseFormat) {
      body.response_format = responseFormat;
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${apiKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      
      // Retry on rate limit or server errors
      if ((response.status === 429 || response.status >= 500) && retryCount < MAX_RETRIES) {
        console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY_MS * (retryCount + 1));
        return callOpenAIWithRetry(apiKey, prompt, responseFormat, retryCount + 1);
      }
      
      throw new Error(`OpenAI error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }
    
    return content;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying after error... (${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY_MS * (retryCount + 1));
      return callOpenAIWithRetry(apiKey, prompt, responseFormat, retryCount + 1);
    }
    throw error;
  }
};

// ===== Prompt Builders =====
const buildResumePrompt = (userResume: string, jobDescription: string): string => {
  return `You are an expert resume writer and career coach.

Your job is to COMPLETELY rewrite the resume below to strongly match the job description. This is not a light edit — restructure, reorder, and rewrite aggressively in tone, structure, and language.

RULES:
1. Rewrite EVERY bullet point using strong, specific action verbs. Make each one sound impactful and professional.
2. If — and only if — the original resume already states or clearly implies a number, metric, or quantity (e.g. "served 50 customers a day", "managed a team of 5"), you may rephrase it more impressively. NEVER invent a number, percentage, or statistic that is not present or directly implied in the original resume. If there is no real number to work with, write a strong qualitative bullet instead (e.g. "consistently" / "regularly" / "significantly") rather than fabricating one.
3. Reorder sections and experience to prioritize what matters most for THIS role
4. Mirror the exact language and keywords from the job description naturally throughout
5. Rewrite the professional summary to speak directly to this specific role
6. Remove or de-emphasize experience irrelevant to this job
7. Add missing keywords from the job description where experience supports it
8. Do NOT fabricate experience, titles, companies, dates, metrics, percentages, or any other facts not present in the original
9. Output ONLY the rewritten resume — no explanations, no commentary, no preamble

FORMAT:
- Use clean markdown formatting
- Bold section headers
- Bullet points for experience
- Keep to 1-2 pages worth of content

RESUME:
${userResume}

JOB DESCRIPTION:
${jobDescription}`;
};

const buildCoverLetterPrompt = (userResume: string, jobDescription: string, userName?: string): string => {
  return `You are a professional cover letter writer.

Write a compelling, concise 3-paragraph cover letter for the NEW role described in the JOB DESCRIPTION below. The candidate is applying TO the company named or implied in the JOB DESCRIPTION — that is the target company this letter is addressed to and excited about.

The RESUME below describes the candidate's PAST or CURRENT work history. Any company named inside the RESUME (e.g. a current or former employer) is NOT the company being applied to — it is only a source of relevant experience to draw from. Do not confuse the candidate's past/current employer with the company they are applying to. Do not praise, address, or express excitement about the candidate's past/current employer as if it were the target company.

If the job description does not clearly name the target company, write the letter addressed generically to "the Hiring Manager" and refer to "your team" / "your company" rather than guessing or substituting a company name from the resume.

STRUCTURE:
- Paragraph 1: Hook + why you're excited about THIS specific role and the company named in the JOB DESCRIPTION (not the resume's employer)
- Paragraph 2: Your relevant achievements and skills from the RESUME that match the JOB DESCRIPTION's needs. If the resume already contains real numbers or metrics, highlight them. If it does not, describe the achievement strongly and specifically without inventing a number.
- Paragraph 3: Call to action + enthusiasm for next steps

RULES:
- Do NOT fabricate experience, employers, titles, dates, or any numbers/percentages/metrics that are not present or clearly implied in the original resume
- Do NOT fabricate claims of having researched or followed the target company unless the job description provides specific detail to reference
- Keep to 250-350 words
- Address the hiring manager directly (use "Dear Hiring Manager," if no name is available — do not output a literal placeholder like "[Hiring Manager's Name]")
- Sign off using the applicant name provided below. If no applicant name is provided, sign off as "Sincerely," with no name rather than inventing one or leaving a placeholder.
- Do NOT include letterhead placeholder fields such as [Your Address], [City, State, Zip], [Company Address], or [Your Contact Information]. Omit address blocks entirely and go straight to the date-less greeting and body.
- Use specific details from the job description
- Output ONLY the cover letter — no explanations, no preamble

${userName ? `Applicant name (use this exact name in the sign-off): ${userName}` : "No applicant name was provided — sign off as \"Sincerely,\" with no name."}

RESUME (background/experience only — NOT the company being applied to):
${userResume}

JOB DESCRIPTION (this defines the target role and target company):
${jobDescription}`;
};

const buildATSPrompt = (userResume: string, jobDescription: string): string => {
  return `You are an expert ATS (Applicant Tracking System) analyst.

Analyse the resume against the job description and return JSON only. Be honest and critical.

{
  "beforeScore": number between 0-100 (current resume match percentage),
  "afterScore": number between 0-100 (realistic optimized score after suggested improvements),
  "foundKeywords": ["keywords already present in resume"],
  "missingKeywords": ["important keywords missing from resume that should be added"],
  "partialKeywords": ["keywords partially matched or implied but not explicit"],
  "improvements": [
    "specific reason 1 why the beforeScore was low",
    "specific reason 2",
    "what was fixed to achieve the afterScore"
  ]
}

RESUME:
${userResume}

JOB DESCRIPTION:
${jobDescription}`;
};

// ===== Validation =====
const validateInputs = (jobDescription: string, userResume: string): void => {
  if (!jobDescription || typeof jobDescription !== 'string') {
    throw new Error("jobDescription is required and must be a string");
  }
  if (!userResume || typeof userResume !== 'string') {
    throw new Error("userResume is required and must be a string");
  }
  if (jobDescription.trim().length < 50) {
    throw new Error("Job description is too short (minimum 50 characters)");
  }
  if (userResume.trim().length < 50) {
    throw new Error("Resume is too short (minimum 50 characters)");
  }
};

// ===== ATS Data Parser =====
const parseATSData = (rawData: string, userResume: string, jobDescription: string): any => {
  try {
    const parsed = JSON.parse(rawData);
    
    // Validate required fields
    return {
      beforeScore: Math.min(100, Math.max(0, parsed.beforeScore || 50)),
      afterScore: Math.min(100, Math.max(0, parsed.afterScore || 70)),
      foundKeywords: Array.isArray(parsed.foundKeywords) ? parsed.foundKeywords.slice(0, 20) : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 20) : [],
      partialKeywords: Array.isArray(parsed.partialKeywords) ? parsed.partialKeywords.slice(0, 10) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 10) : [
        "Resume could better match job description keywords",
        "Consider adding more quantifiable achievements",
        "Professional summary should target this specific role"
      ],
    };
  } catch (parseError) {
    console.error("Failed to parse ATS response:", rawData);
    
    // Intelligent fallback based on resume/job length
    const hasContent = userResume.length > 200 && jobDescription.length > 200;
    
    return {
      beforeScore: hasContent ? 45 : 30,
      afterScore: 75,
      foundKeywords: [],
      missingKeywords: ["analysis failed - using fallback"],
      partialKeywords: [],
      improvements: [
        "Unable to fully analyze ATS compatibility due to parsing error",
        "Consider manually reviewing keyword matches",
        "Ensure your resume includes terms from the job description"
      ],
    };
  }
};

// ===== Main Handler =====
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const startTime = Date.now();
  
  try {
    // 1. Authentication
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    
    // 2. Quota Check
    const overQuota = await enforceQuota(auth, "resume_ats");
    if (overQuota) return overQuota;
    
    // 3. API Key Validation
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      throw new Error("OPENAI_API_KEY not configured");
    }
    
    // 4. Request Body Parsing
    const { jobDescription, userResume, userName } = await req.json();
    
    // 5. Input Validation
    validateInputs(jobDescription, userResume);
    
    // FIXED: Use auth.id instead of auth.user.id
    console.log(`[${auth.id}] Processing bundle...`);
    console.log(`  Resume: ${userResume.length} chars, ${userResume.split(/\s+/).length} words`);
    console.log(`  Job Desc: ${jobDescription.length} chars, ${jobDescription.split(/\s+/).length} words`);
    
    // 6. Parallel AI Calls
    const [tailoredResume, coverLetter, atsDataRaw] = await Promise.all([
      callOpenAIWithRetry(OPENAI_API_KEY, buildResumePrompt(userResume, jobDescription)),
      callOpenAIWithRetry(OPENAI_API_KEY, buildCoverLetterPrompt(userResume, jobDescription, userName)),
      callOpenAIWithRetry(OPENAI_API_KEY, buildATSPrompt(userResume, jobDescription), { type: "json_object" }),
    ]);
    
    // 7. Validate AI Responses
    if (!tailoredResume || tailoredResume.length < 50) {
      throw new Error("AI returned insufficient resume content");
    }
    if (!coverLetter || coverLetter.length < 100) {
      throw new Error("AI returned insufficient cover letter content");
    }
    
    // 8. Parse ATS Data
    const atsData = parseATSData(atsDataRaw, userResume, jobDescription);
    
    // 9. Record Usage
    await recordUsage(auth, "resume_ats");
    
    const duration = Date.now() - startTime;
    // FIXED: Use auth.id instead of auth.user.id
    console.log(`[${auth.id}] Bundle complete in ${duration}ms`);
    console.log(`  Resume: ${tailoredResume.length} chars`);
    console.log(`  Cover Letter: ${coverLetter.length} chars`);
    console.log(`  ATS Score: ${atsData.beforeScore} → ${atsData.afterScore}`);
    
    // 10. Return Response
    return jsonResponse({
      success: true,
      tailoredResume,
      coverLetter,
      atsData,
      metadata: {
        processingTimeMs: duration,
        resumeWordCount: tailoredResume.split(/\s+/).length,
        coverLetterWordCount: coverLetter.split(/\s+/).length,
      },
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[ERROR] apply-bundle failed after ${duration}ms:`, error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Handle specific error types
    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      return jsonResponse({ 
        error: "You have reached your usage limit. Please upgrade to continue.",
        code: "QUOTA_EXCEEDED"
      }, 429);
    }
    
    if (errorMessage.includes("API key") || errorMessage.includes("OPENAI_API_KEY")) {
      return jsonResponse({ 
        error: "Service configuration error. Please try again later.",
        code: "CONFIGURATION_ERROR"
      }, 500);
    }
    
    if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
      return jsonResponse({ 
        error: "Rate limit exceeded. Please try again in a moment.",
        code: "RATE_LIMIT"
      }, 429);
    }
    
    if (errorMessage.includes("minimum 50 characters")) {
      return jsonResponse({ 
        error: errorMessage,
        code: "INVALID_INPUT"
      }, 400);
    }
    
    return jsonResponse({ 
      error: errorMessage,
      code: "INTERNAL_ERROR"
    }, 500);
  }
});
