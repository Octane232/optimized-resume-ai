import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Structured output schema for resume parsing
const resumeParsingTool = {
  type: "function",
  function: {
    name: "parse_resume",
    description: "Parse and extract structured data from resume text",
    parameters: {
      type: "object",
      properties: {
        contact: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name of the candidate" },
            email: { type: "string", description: "Email address" },
            phone: { type: "string", description: "Phone number" },
            location: { type: "string", description: "City, State/Country" },
            linkedin: { type: "string", description: "LinkedIn profile URL or username" },
            github: { type: "string", description: "GitHub profile URL or username" },
            portfolio: { type: "string", description: "Personal website or portfolio URL" },
          },
          required: ["name", "email"],
        },
        summary: { type: "string", description: "Professional summary or objective statement" },
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Skill name" },
              normalizedName: { type: "string", description: "Standardized skill name (e.g., 'JS' becomes 'JavaScript')" },
              category: { 
                type: "string", 
                enum: ["technical", "soft", "tool", "language"],
                description: "Skill category" 
              },
              confidence: { 
                type: "number", 
                description: "Confidence score 0-100 based on frequency and context" 
              },
              isExplicit: { 
                type: "boolean", 
                description: "True if skill is explicitly listed in skills section" 
              },
            },
            required: ["name", "normalizedName", "category", "confidence", "isExplicit"],
          },
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Job title" },
              normalizedTitle: { type: "string", description: "Standardized title (e.g., 'Sr. SWE' becomes 'Senior Software Engineer')" },
              company: { type: "string", description: "Company name" },
              startDate: { type: "string", description: "Start date (e.g., 'Jan 2020' or '2020')" },
              endDate: { type: "string", description: "End date or 'Present'" },
              duration: { type: "number", description: "Duration in months" },
              isCurrent: { type: "boolean", description: "True if this is the current job" },
              bullets: { 
                type: "array", 
                items: { type: "string" },
                description: "List of bullet points describing responsibilities and achievements" 
              },
              keywords: { 
                type: "array", 
                items: { type: "string" },
                description: "Key skills and technologies mentioned in this role" 
              },
            },
            required: ["title", "normalizedTitle", "company", "startDate", "endDate", "duration", "isCurrent", "bullets", "keywords"],
          },
        },
        education: {
          type: "array",
          items: {
            type: "object",
            properties: {
              degree: { type: "string", description: "Degree type (e.g., 'Bachelor of Science')" },
              field: { type: "string", description: "Field of study (e.g., 'Computer Science')" },
              institution: { type: "string", description: "School or university name" },
              startYear: { type: "string", description: "Start year" },
              endYear: { type: "string", description: "End year or expected graduation" },
              gpa: { type: "string", description: "GPA if mentioned" },
            },
            required: ["degree", "field", "institution", "endYear"],
          },
        },
        certifications: {
          type: "array",
          items: { type: "string" },
          description: "List of certifications and licenses",
        },
        projects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Project name" },
              description: { type: "string", description: "Brief description of the project" },
              technologies: { 
                type: "array", 
                items: { type: "string" },
                description: "Technologies used in the project" 
              },
            },
            required: ["title", "description", "technologies"],
          },
        },
        totalYearsExperience: { 
          type: "number", 
          description: "Total years of professional experience calculated from work history" 
        },
        seniorityLevel: { 
          type: "string", 
          enum: ["entry", "mid", "senior", "lead", "executive"],
          description: "Estimated seniority level based on titles and experience" 
        },
        detectedSections: {
          type: "array",
          items: { type: "string" },
          description: "List of sections found in resume: summary, experience, education, skills, projects, certifications, awards",
        },
        parsingConfidence: {
          type: "number",
          description: "Overall confidence score 0-100 for parsing quality",
        },
      },
      required: ["contact", "skills", "experience", "education", "totalYearsExperience", "seniorityLevel", "detectedSections", "parsingConfidence"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Parsing resume with ${resumeText.length} characters`);

    const systemPrompt = `You are an expert resume parser with deep knowledge of HR practices, ATS systems, and career development. Your task is to extract structured data from resume text with high accuracy.

PARSING GUIDELINES:
1. **Contact Info**: Extract all contact details. Normalize phone numbers and URLs.

2. **Skills Normalization**:
   - Standardize abbreviations: "JS" → "JavaScript", "TS" → "TypeScript", "py" → "Python"
   - Normalize frameworks: "React.js" → "React", "Node" → "Node.js"
   - Categorize as: technical (programming, tools), soft (leadership, communication), tool (software), language (human languages)
   - Set confidence higher (80-100) for explicitly listed skills, lower (40-70) for inferred skills from experience

3. **Experience Parsing**:
   - Normalize titles: "Sr. SWE" → "Senior Software Engineer", "PM" → "Product Manager"
   - Calculate duration in months between start and end dates
   - Extract ALL bullet points as achievements
   - Identify keywords/technologies mentioned in each role

4. **Education**:
   - Expand degree abbreviations: "BS" → "Bachelor of Science", "MS" → "Master of Science"
   - Extract field of study, institution name, and years

5. **Seniority Detection**:
   - entry: 0-2 years, junior titles
   - mid: 2-5 years, no seniority prefix
   - senior: 5+ years, "Senior" title
   - lead: "Lead", "Principal", "Staff" titles
   - executive: "Director", "VP", "Chief" titles

6. **Confidence Scoring**:
   - High (85-100): Clear structure, all sections present, complete contact info
   - Medium (60-84): Some sections, basic contact info, parseable experience
   - Low (0-59): Missing sections, unclear structure, incomplete data

Be thorough and accurate. Do not hallucinate information not present in the resume.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse the following resume text and extract all structured information:\n\n${resumeText}` },
        ],
        tools: [resumeParsingTool],
        tool_choice: { type: 'function', function: { name: 'parse_resume' } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    console.log('AI response received');

    // Extract the parsed resume from tool call
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No structured output returned from AI');
    }

    const parsedResume = JSON.parse(toolCall.function.arguments);
    console.log('Resume parsed successfully:', {
      skills: parsedResume.skills?.length || 0,
      experience: parsedResume.experience?.length || 0,
      confidence: parsedResume.parsingConfidence,
    });

    return new Response(
      JSON.stringify(parsedResume),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-resume-ai:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to parse resume' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
