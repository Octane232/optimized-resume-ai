import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import { corsHeaders, requireUser, jsonResponse, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

// ===== Constants =====
const MIN_TEXT_LENGTH = 20;
const MIN_MEANINGFUL_LENGTH = 50;

const PDF_ERROR_RESPONSE = {
  error: 'Could not extract text from this PDF. The PDF may be image-based or encrypted. Please copy and paste your resume text instead.',
  suggestion: 'paste'
};

const DOCX_ERROR_RESPONSE = {
  error: 'Could not parse DOCX. Please try pasting your resume text instead.',
  suggestion: 'paste'
};

// ===== Helper Functions =====
const cleanExtractedText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const validateExtractedText = (text: string): boolean => {
  return Boolean(text && text.length >= MIN_TEXT_LENGTH);
};

const createErrorResponse = (error: string, suggestion?: string, status: number = 400): Response => {
  const body: any = { error };
  if (suggestion) body.suggestion = suggestion;
  return new Response(JSON.stringify(body), { 
    status, 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
};

const createSuccessResponse = (text: string): Response => {
  return new Response(
    JSON.stringify({ text }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

// ===== PDF Extraction =====
const extractTextFromPDF = (uint8Array: Uint8Array): string => {
  const text = new TextDecoder('latin1').decode(uint8Array);
  const textSegments: string[] = [];

  // Extract from BT/ET blocks
  const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
  let match;
  
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    
    // Extract from Tj operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textSegments.push(tjMatch[1]);
    }
    
    // Extract from TJ operators
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
  
  // Extract readable text patterns
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
  
  // Fallback for short results
  if (result.length < MIN_MEANINGFUL_LENGTH) {
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let streamMatch;
    const streamTexts: string[] = [];
    
    while ((streamMatch = streamRegex.exec(text)) !== null) {
      const streamContent = streamMatch[1];
      const cleanStream = streamContent
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
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
};

// ===== DOCX Extraction =====
const extractTextFromDOCX = async (uint8Array: Uint8Array): Promise<string> => {
  try {
    const zip = new JSZip();
    await zip.loadAsync(uint8Array);
    
    const documentXml = zip.file("word/document.xml");
    if (!documentXml) {
      console.log("No document.xml found in DOCX");
      return "";
    }
    
    const xmlContent = await documentXml.async("string");
    console.log(`Extracted document.xml: ${xmlContent.length} chars`);
    
    // Extract with paragraph preservation
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
    
    // Fallback if paragraph parsing failed
    if (result.trim().length < MIN_MEANINGFUL_LENGTH) {
      const textParts: string[] = [];
      const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let match;
      while ((match = wtRegex.exec(xmlContent)) !== null) {
        if (match[1].trim()) {
          textParts.push(match[1]);
        }
      }
      result = textParts.join(" ");
    }
    
    console.log(`Parsed DOCX text: ${result.length} chars`);
    return result.trim();
    
  } catch (error) {
    console.error("DOCX parsing error:", error);
    
    // Fallback: Raw text extraction
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
};

// ===== File Type Handlers =====
interface FileHandler {
  canHandle: (fileType: string, fileName: string) => boolean;
  extract: (uint8Array: Uint8Array, fileName: string) => Promise<string> | string;
}

const fileHandlers: FileHandler[] = [
  {
    canHandle: (fileType, fileName) => fileType === 'text/plain' || fileName.endsWith('.txt'),
    extract: (uint8Array) => new TextDecoder().decode(uint8Array)
  },
  {
    canHandle: (fileType, fileName) => fileType === 'application/pdf' || fileName.endsWith('.pdf'),
    extract: (uint8Array) => {
      const text = extractTextFromPDF(uint8Array);
      if (text.length < MIN_MEANINGFUL_LENGTH) {
        throw new Error('PDF_NO_CONTENT');
      }
      return text;
    }
  },
  {
    canHandle: (fileType, fileName) => 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx'),
    extract: async (uint8Array) => {
      const text = await extractTextFromDOCX(uint8Array);
      if (text.length < MIN_MEANINGFUL_LENGTH) {
        throw new Error('DOCX_NO_CONTENT');
      }
      return text;
    }
  }
];

const processFile = async (file: File, uint8Array: Uint8Array, fileName: string, fileType: string): Promise<string> => {
  const handler = fileHandlers.find(h => h.canHandle(fileType, fileName));
  
  if (!handler) {
    throw new Error('UNSUPPORTED_TYPE');
  }
  
  const extractedText = await handler.extract(uint8Array, fileName);
  const cleanedText = cleanExtractedText(extractedText);
  
  if (!validateExtractedText(cleanedText)) {
    throw new Error('NO_MEANINGFUL_CONTENT');
  }
  
  console.log(`Extracted text: ${cleanedText.length} chars`);
  console.log(`Preview: ${cleanedText.substring(0, 500)}`);
  
  return cleanedText;
};

// ===== Main Handler =====
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authentication
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    // Get file from request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return createErrorResponse('No file provided', undefined, 400);
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log(`Processing file: ${fileName}, type: ${fileType}, size: ${uint8Array.length} bytes`);

    // Process file based on type
    try {
      const extractedText = await processFile(file, uint8Array, fileName, fileType);
      return createSuccessResponse(extractedText);
    } catch (error: any) {
      console.error('File processing error:', error);
      
      // Handle specific error types
      if (error.message === 'UNSUPPORTED_TYPE') {
        return createErrorResponse('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      }
      
      if (error.message === 'PDF_NO_CONTENT') {
        return createErrorResponse(PDF_ERROR_RESPONSE.error, PDF_ERROR_RESPONSE.suggestion);
      }
      
      if (error.message === 'DOCX_NO_CONTENT') {
        return createErrorResponse(DOCX_ERROR_RESPONSE.error, DOCX_ERROR_RESPONSE.suggestion);
      }
      
      if (error.message === 'NO_MEANINGFUL_CONTENT') {
        return createErrorResponse(
          'Could not extract meaningful text from the file. Please try pasting your resume text instead.',
          'paste'
        );
      }
      
      // Re-throw other errors to be caught by outer catch
      throw error;
    }

  } catch (error) {
    console.error('Error in parse-resume-file:', error);
    return createErrorResponse(
      'Failed to parse file. Please try pasting your resume text instead.',
      'paste',
      500
    );
  }
});
