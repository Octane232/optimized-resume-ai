import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno import
import * as pdfParse from "https://esm.sh/pdf-parse@1.1.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let extractedText = '';

    if (fileType === 'text/plain') {
      // Plain text file
      extractedText = new TextDecoder().decode(uint8Array);
    } else if (fileType === 'application/pdf') {
      // PDF file - extract text using pdf-parse
      try {
        const pdfData = await pdfParse.default(uint8Array);
        extractedText = pdfData.text || '';
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return new Response(
          JSON.stringify({ error: 'Could not parse PDF. Please try pasting your resume text instead.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // DOCX file - basic XML extraction
      try {
        // DOCX is a ZIP file containing XML - extract text from document.xml
        const textDecoder = new TextDecoder();
        const zipContent = textDecoder.decode(uint8Array);
        
        // Look for text content between XML tags
        // This is a simplified extraction - finds text between <w:t> tags
        const textMatches = zipContent.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
        if (textMatches) {
          extractedText = textMatches
            .map(match => match.replace(/<[^>]+>/g, ''))
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
        
        // If that didn't work well, try a broader approach
        if (extractedText.length < 50) {
          // Extract any readable text
          const cleanText = zipContent
            .replace(/<[^>]+>/g, ' ')
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Filter to get meaningful content (sentences with common words)
          if (cleanText.length > extractedText.length) {
            extractedText = cleanText;
          }
        }
        
        if (!extractedText || extractedText.length < 50) {
          return new Response(
            JSON.stringify({ error: 'Could not extract text from DOCX. Please try pasting your resume text instead.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return new Response(
          JSON.stringify({ error: 'Could not parse DOCX. Please try pasting your resume text instead.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .replace(/\s+\n/g, '\n')
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return new Response(
        JSON.stringify({ error: 'Could not extract meaningful text from the file. Please try pasting your resume text instead.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted ${extractedText.length} characters from ${fileType}`);

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-resume-file:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to parse file' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
