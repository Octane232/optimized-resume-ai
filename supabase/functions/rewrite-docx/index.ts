import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders, requireUser, jsonResponse, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

// mode=suggest -> returns per-paragraph suggestions (AI, never writes the file)
// mode=apply   -> writes only accepted/edited text into the original DOCX (no AI)

const paraRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
const wtRegex = /<w:t(\s[^>]*)?>([\s\S]*?)<\/w:t>/g;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function unescapeXml(s: string): string {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function extractParas(xml: string) {
  const paras: { full: string; inner: string; index: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(paraRegex.source, "g");
  while ((m = re.exec(xml)) !== null) {
    const texts: string[] = [];
    let tm: RegExpExecArray | null;
    const tre = new RegExp(wtRegex.source, "g");
    while ((tm = tre.exec(m[1])) !== null) texts.push(tm[2]);
    paras.push({ full: m[0], inner: m[1], index: m.index, text: unescapeXml(texts.join("")) });
  }
  return paras;
}

const SYSTEM = `You are an expert resume editor. Improve paragraphs of a real candidate's resume for a target job.
You may improve the candidate's wording and presentation, but you cannot create experience, employers, education, certifications, skills, dates, achievements, metrics, or other qualifications that aren't supported by the original resume.
RULES:
- Preserve names, companies, dates, locations, contact details and section headings exactly. Leave headings, names, contact lines, dates and short labels out of your answer.
- Use job keywords only where the original text already supports them.
- Never add numbers or percentages that are not in the original.
- Keep each paragraph within ~20% of its original length. Do not merge or split paragraphs.
- Only return paragraphs you actually improved, with a one-sentence reason.
Return JSON: {"items":[{"id":number,"improved":string,"reason":string}]}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mode = ((formData.get("mode") as string | null) || "suggest").trim();
    if (!file) return jsonResponse({ error: "No file provided" }, 400);
    if (!file.name.toLowerCase().endsWith(".docx")) return jsonResponse({ error: "Only .docx files can be rewritten" }, 400);
    if (file.size > 10 * 1024 * 1024) return jsonResponse({ error: "File is larger than 10MB" }, 400);

    const zip = new JSZip();
    await zip.loadAsync(new Uint8Array(await file.arrayBuffer()));
    const docFile = zip.file("word/document.xml");
    if (!docFile) return jsonResponse({ error: "Invalid DOCX (no document.xml)" }, 400);
    let xml = await docFile.async("string");
    const paras = extractParas(xml);

    if (mode === "suggest") {
      const jobDescription = ((formData.get("jobDescription") as string | null) || "").trim();
      if (jobDescription.length < 30) return jsonResponse({ error: "Job description required" }, 400);
      const missing = ((formData.get("missingKeywords") as string | null) || "").slice(0, 1000);

      const quotaResp = await enforceQuota(auth, "docx_rewrite");
      if (quotaResp) return quotaResp;
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

      const items = paras.map((p, i) => ({ id: i, text: p.text })).filter((p) => p.text.trim().length > 25);
      if (items.length === 0) return jsonResponse({ error: "No editable text found" }, 400);

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `JOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}\n\nKEYWORDS THE SCANNER FOUND MISSING (use only if supported): ${missing}\n\nPARAGRAPHS:\n${JSON.stringify(items)}` },
          ],
        }),
      });
      if (!aiRes.ok) {
        const t = await aiRes.text();
        console.error("OpenAI error:", aiRes.status, t);
        return jsonResponse({ error: aiRes.status === 429 ? "AI is busy, try again shortly" : "AI suggestions failed" }, aiRes.status === 429 ? 429 : 502);
      }
      const aiData = await aiRes.json();
      let parsed: { items?: { id: number; improved: string; reason?: string }[] } = {};
      try { parsed = JSON.parse(aiData.choices?.[0]?.message?.content || "{}"); } catch { return jsonResponse({ error: "AI returned invalid data" }, 502); }

      const suggestions = (parsed.items || [])
        .filter((it) => typeof it.id === "number" && typeof it.improved === "string" && paras[it.id] && it.improved.trim() && it.improved.trim() !== paras[it.id].text.trim())
        .map((it) => ({ id: it.id, original: paras[it.id].text, improved: it.improved.trim(), reason: it.reason || "" }));

      await recordUsage(auth, "docx_rewrite");
      return jsonResponse({ suggestions, originalText: paras.map((p) => p.text).filter((t) => t.trim()).join("\n") });
    }

    if (mode === "apply") {
      let edits: Record<string, string> = {};
      try { edits = JSON.parse((formData.get("edits") as string | null) || "{}"); } catch { return jsonResponse({ error: "Invalid edits" }, 400); }

      const updates: { start: number; end: number; replacement: string }[] = [];
      paras.forEach((p, idx) => {
        const newText = edits[String(idx)];
        if (typeof newText !== "string" || !newText.trim() || newText === p.text) return;
        let first = false;
        const newInner = p.inner.replace(new RegExp(wtRegex.source, "g"), (_f, attrs) => {
          const a = attrs || "";
          const fa = / xml:space=/.test(a) ? a : `${a} xml:space="preserve"`;
          if (!first) { first = true; return `<w:t${fa}>${escapeXml(newText.slice(0, 3000))}</w:t>`; }
          return `<w:t${fa}></w:t>`;
        });
        updates.push({ start: p.index, end: p.index + p.full.length, replacement: p.full.replace(p.inner, newInner) });
      });
      updates.sort((a, b) => b.start - a.start);
      for (const u of updates) xml = xml.slice(0, u.start) + u.replacement + xml.slice(u.end);

      zip.file("word/document.xml", xml);
      const out = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
      const previewText = paras.map((p, i) => edits[String(i)] ?? p.text).filter((t) => t.trim()).join("\n");
      return jsonResponse({ docxBase64: encodeBase64(out), previewText, appliedCount: updates.length });
    }

    return jsonResponse({ error: "Unknown mode" }, 400);
  } catch (error) {
    console.error("rewrite-docx error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
