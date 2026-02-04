import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";

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

// Extract text from DOCX using JSZip to properly decompress
async function extractTextFromDOCX(uint8Array: Uint8Array): Promise<string> {
  try {
    const zip = new JSZip();
    await zip.loadAsync(uint8Array);
    
    // DOCX stores content in word/document.xml
    const documentXml = zip.file("word/document.xml");
    if (!documentXml) {
      console.log("No document.xml found in DOCX");
      return "";
    }
    
    const xmlContent = await documentXml.async("string");
    console.log(`Extracted document.xml: ${xmlContent.length} chars`);
    
    // Extract text from <w:t> tags (Word text elements)
    const textParts: string[] = [];
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    
    while ((match = wtRegex.exec(xmlContent)) !== null) {
      if (match[1].trim()) {
        textParts.push(match[1]);
      }
    }
    
    // Also check for <w:p> paragraph breaks to add newlines
    let result = "";
    const paragraphRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g;
    let paragraphMatch;
    
    while ((paragraphMatch = paragraphRegex.exec(xmlContent)) !== null) {
      const paragraphContent = paragraphMatch[1];
      const paragraphTexts: string[] = [];
      
      const textInParagraph = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let textMatch;
      while ((textMatch = textInParagraph.exec(paragraphContent)) !== null) {
        if (textMatch[1]) {
          paragraphTexts.push(textMatch[1]);
        }
      }
      
      if (paragraphTexts.length > 0) {
        result += paragraphTexts.join("") + "\n";
      }
    }
    
    // If paragraph parsing didn't work, fall back to simple extraction
    if (result.trim().length < 50 && textParts.length > 0) {
      result = textParts.join(" ");
    }
    
    console.log(`Parsed DOCX text: ${result.length} chars, preview: ${result.substring(0, 200)}`);
    return result.trim();
    
  } catch (error) {
    console.error("DOCX parsing error:", error);
    
    // Fallback: Try raw text extraction
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const rawContent = textDecoder.decode(uint8Array);
    
    const textParts: string[] = [];
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(rawContent)) !== null) {
      if (match[1].trim()) {
        textParts.push(match[1]);
      }
    }
    
    return textParts.join(' ').replace(/\s+/g, ' ').trim();
  }
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
        console.log(`PDF preview: ${extractedText.substring(0, 300)}`);
        
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
        console.log(`DOCX preview: ${extractedText.substring(0, 300)}`);
        
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

    console.log(`Final extracted text: ${extractedText.length} characters`);
    console.log(`Text preview: ${extractedText.substring(0, 500)}`);

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
