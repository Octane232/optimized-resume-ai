import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract text from PDF using basic parsing (handles most text-based PDFs)
function extractTextFromPDF(uint8Array: Uint8Array): string {
  const text = new TextDecoder('latin1').decode(uint8Array);
  const textSegments: string[] = [];
  
  // Find text between BT (begin text) and ET (end text) markers
  const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
  let match;
  
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    
    // Extract text from Tj (show text) operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textSegments.push(tjMatch[1]);
    }
    
    // Extract text from TJ (show text with positioning) operators
    const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
    let tjArrayMatch;
    while ((tjArrayMatch = tjArrayRegex.exec(block)) !== null) {
      const content = tjArrayMatch[1];
      const stringRegex = /\(([^)]*)\)/g;
      let stringMatch;
      while ((stringMatch = stringRegex.exec(content)) !== null) {
        textSegments.push(stringMatch[1]);
      }
    }
  }
  
  // Also try to find readable text patterns directly
  const readableRegex = /\(([A-Za-z0-9\s\.,!?@#$%&*\-_+=:;'"\/\\]+)\)/g;
  let readableMatch;
  while ((readableMatch = readableRegex.exec(text)) !== null) {
    const extracted = readableMatch[1].trim();
    if (extracted.length > 2 && !textSegments.includes(extracted)) {
      textSegments.push(extracted);
    }
  }
  
  // Clean up extracted text
  let result = textSegments
    .join(' ')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If basic extraction didn't work well, try to find any readable content
  if (result.length < 100) {
    // Look for streams that might contain readable text
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let streamMatch;
    const streamTexts: string[] = [];
    
    while ((streamMatch = streamRegex.exec(text)) !== null) {
      const streamContent = streamMatch[1];
      // Try to find readable text in streams
      const cleanStream = streamContent
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Only keep meaningful chunks
      const words = cleanStream.split(' ').filter(w => w.length > 2 && /[a-zA-Z]/.test(w));
      if (words.length > 5) {
        streamTexts.push(words.join(' '));
      }
    }
    
    if (streamTexts.join(' ').length > result.length) {
      result = streamTexts.join(' ');
    }
  }
  
  return result;
}

// Extract text from DOCX (which is a ZIP containing XML)
async function extractTextFromDOCX(uint8Array: Uint8Array): Promise<string> {
  // DOCX files are ZIP archives - we need to find the document.xml content
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  let rawContent = textDecoder.decode(uint8Array);
  
  // Try to find XML content patterns typical in DOCX
  const textParts: string[] = [];
  
  // Look for <w:t> tags which contain the actual text
  const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let match;
  while ((match = wtRegex.exec(rawContent)) !== null) {
    if (match[1].trim()) {
      textParts.push(match[1]);
    }
  }
  
  // If we found XML text content
  if (textParts.length > 0) {
    return textParts.join(' ').replace(/\s+/g, ' ').trim();
  }
  
  // Fallback: try to extract any readable text
  const cleanText = rawContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Filter to meaningful words
  const words = cleanText.split(' ').filter(w => 
    w.length > 1 && /[a-zA-Z]/.test(w) && !/^[0-9]+$/.test(w)
  );
  
  return words.join(' ');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let extractedText = '';

    console.log(`Processing file: ${fileName}, type: ${fileType}, size: ${uint8Array.length} bytes`);

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      // Plain text file
      extractedText = new TextDecoder().decode(uint8Array);
      console.log(`TXT extraction successful: ${extractedText.length} chars`);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // PDF file
      try {
        extractedText = extractTextFromPDF(uint8Array);
        console.log(`PDF extraction result: ${extractedText.length} chars`);
        
        if (extractedText.length < 50) {
          return new Response(
            JSON.stringify({ 
              error: 'Could not extract text from this PDF. The PDF may be image-based or encrypted. Please copy and paste your resume text instead.',
              suggestion: 'paste'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return new Response(
          JSON.stringify({ 
            error: 'Could not parse PDF. Please try pasting your resume text instead.',
            suggestion: 'paste'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // DOCX file
      try {
        extractedText = await extractTextFromDOCX(uint8Array);
        console.log(`DOCX extraction result: ${extractedText.length} chars`);
        
        if (extractedText.length < 50) {
          return new Response(
            JSON.stringify({ 
              error: 'Could not extract text from this DOCX file. Please copy and paste your resume text instead.',
              suggestion: 'paste'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return new Response(
          JSON.stringify({ 
            error: 'Could not parse DOCX. Please try pasting your resume text instead.',
            suggestion: 'paste'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Final cleanup
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not extract meaningful text from the file. Please try pasting your resume text instead.',
          suggestion: 'paste'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted ${extractedText.length} characters`);

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-resume-file:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to parse file. Please try pasting your resume text instead.',
        suggestion: 'paste'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
