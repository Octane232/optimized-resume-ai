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
    const { jobTitle, companyName, yourName, yourExperience, keySkills, whyInterested } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt with all provided information
    let prompt = `Write a professional cover letter for ${yourName} applying for the ${jobTitle} position at ${companyName}.`;
    
    if (yourExperience) {
      prompt += `\n\nRelevant Experience: ${yourExperience}`;
    }
    
    if (keySkills) {
      prompt += `\n\nKey Skills: ${keySkills}`;
    }
    
    if (whyInterested) {
      prompt += `\n\nWhy interested in this role: ${whyInterested}`;
    }
    
    prompt += `\n\nThe cover letter should be professional, engaging, and tailored to the role. Include an appropriate greeting, 3-4 paragraphs highlighting relevant experience and skills, and a strong closing. Format it as a proper letter.`;

    console.log('Generating cover letter with prompt:', prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are an expert career advisor and professional writer specializing in creating compelling cover letters. Write clear, professional cover letters that highlight the candidate's strengths and enthusiasm for the role."
          },
          { 
            role: "user", 
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const coverLetter = data.choices[0].message.content;

    console.log('Cover letter generated successfully');

    return new Response(
      JSON.stringify({ coverLetter }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
