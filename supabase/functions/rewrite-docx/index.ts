import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders, requireUser, jsonResponse, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

interface ParaItem {
  id: number;
  text: string;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    const quotaResp = await enforceQuota(auth, "docx_rewrite");
    if (quotaResp) return quotaResp;

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = (formData.get("jobDescription") as string | null) || "";

    if (!file) return jsonResponse({ error: "No file provided" }, 400);
    if (!jobDescription.trim()) return jsonResponse({ error: "Job description required" }, 400);
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".docx")) {
      return jsonResponse({ error: "Only .docx files supported for AI editing" }, 400);
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    const zip = new JSZip();
    await zip.loadAsync(buf);

    const docFile = zip.file("word/document.xml");
    if (!docFile) return jsonResponse({ error: "Invalid DOCX (no document.xml)" }, 400);

    let xml = await docFile.async("string");

    // Extract paragraphs
    const paraRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
    const wtRegex = /<w:t(\s[^>]*)?>([\s\S]*?)<\/w:t>/g;

    const paras: { full: string; inner: string; index: number; text: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = paraRegex.exec(xml)) !== null) {
      const inner = m[1];
      const texts: string[] = [];
      let tm: RegExpExecArray | null;
      const re = new RegExp(wtRegex.source, "g");
      while ((tm = re.exec(inner)) !== null) {
        texts.push(tm[2]);
      }
      const joined = texts.join("");
      paras.push({ full: m[0], inner, index: m.index, text: joined });
    }

    const items: ParaItem[] = paras
      .map((p, i) => ({ id: i, text: p.text }))
      .filter((p) => p.text.trim().length > 0);

    if (items.length === 0) return jsonResponse({ error: "No editable text found" }, 400);

    // Ask GPT to rewrite each paragraph
    const systemPrompt = `You are an expert resume writer. Rewrite each paragraph of a candidate's resume to better match the provided job description. RULES:
- Preserve all proper nouns, company names, dates, locations, contact info, section headings, and personal data EXACTLY as-is.
- Only improve phrasing, integrate relevant keywords from the JD naturally, strengthen action verbs and quantifiable impact.
- Keep each paragraph roughly the same length (within ~20%). Do NOT merge or split paragraphs.
- If a paragraph is a heading, name, contact line, date, or short label — return it UNCHANGED.
- Never invent jobs, degrees, certifications, or metrics that aren't implied by the original.
- Return ONLY valid JSON.`;

    const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME PARAGRAPHS (JSON array, each with id and text). Return JSON: { "items": [{ "id": <number>, "rewritten": "<new text>" }, ...] } with the SAME ids.\n\n${JSON.stringify(items)}`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenAI error:", aiRes.status, errText);
      return jsonResponse({ error: "AI rewrite failed" }, 500);
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";
    let parsed: { items?: { id: number; rewritten: string }[] } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      return jsonResponse({ error: "AI returned invalid JSON" }, 500);
    }

    const rewriteMap = new Map<number, string>();
    for (const it of parsed.items || []) {
      if (typeof it.id === "number" && typeof it.rewritten === "string") {
        rewriteMap.set(it.id, it.rewritten);
      }
    }

    // Replace paragraphs in XML — process from end to start to preserve indices
    const updates: { start: number; end: number; replacement: string }[] = [];
    paras.forEach((p, idx) => {
      const newText = rewriteMap.get(idx);
      if (newText === undefined || newText === p.text) return;

      // Replace text inside w:t tags: put all new text into the FIRST w:t, blank the rest
      let firstReplaced = false;
      const newInner = p.inner.replace(wtRegex, (_full, attrs, _txt) => {
        const attrPart = attrs || "";
        const hasSpace = / xml:space=/.test(attrPart);
        const finalAttrs = hasSpace ? attrPart : `${attrPart} xml:space="preserve"`;
        if (!firstReplaced) {
          firstReplaced = true;
          return `<w:t${finalAttrs}>${escapeXml(newText)}</w:t>`;
        }
        return `<w:t${finalAttrs}></w:t>`;
      });

      const newFull = p.full.replace(p.inner, newInner);
      updates.push({ start: p.index, end: p.index + p.full.length, replacement: newFull });
    });

    // Apply updates back-to-front
    updates.sort((a, b) => b.start - a.start);
    for (const u of updates) {
      xml = xml.slice(0, u.start) + u.replacement + xml.slice(u.end);
    }

    // Repack DOCX
    zip.file("word/document.xml", xml);
    const outBuf = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
    const base64 = encodeBase64(outBuf);

    // Combined plain text preview for display
    const previewText = paras
      .map((p, i) => rewriteMap.get(i) ?? p.text)
      .filter((t) => t.trim().length > 0)
      .join("\n");

    return jsonResponse({
      docxBase64: base64,
      previewText,
      rewrittenCount: updates.length,
      totalParagraphs: items.length,
    });
  } catch (error) {
    console.error("rewrite-docx error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
