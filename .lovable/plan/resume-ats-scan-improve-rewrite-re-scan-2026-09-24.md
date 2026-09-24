# Resume + ATS: Scan → Improve → Rewrite → Re-scan

Use the open-source ATS Resume Improver (MIT licence) as the scoring engine, keep your OpenAI key for wording only, and keep the existing in-place DOCX rewriter.

## What the user will see

```text
Upload DOCX/PDF + paste job
   -> 1. SCAN      ATS score + Format score, missing keywords, formatting problems
   -> 2. IMPROVE   AI suggests better wording per bullet (never invents facts)
   -> 3. REVIEW    Original vs Improved, with Accept / Reject / Edit per line
   -> 4. RE-SCAN   "ATS 64 -> 89, Format 78 -> 96" with exact reasons
   -> Download DOCX (original layout kept)
```

- Choice before rewriting: **Preserve my design** (default) or **Optimize for ATS** (offered only when the scan finds columns, tables, text boxes or graphics; rebuilds into a simple ATS template).
- Score always comes from the rule-based engine, never from AI. AI only explains findings.

## What gets reused from the repo
- ATS analyzer (5-dimension score, section detection, formatting warnings)
- Keyword matcher and resume-type detection (7 profiles)
- Before/after diff viewer idea (restyled to the warm Vaylance look)
- Not reused: its API-key screen, browser-side AI calls, Claude/Ollama, its salary/interview/cover-letter tools (you already have those)

## Technical details
- Copy `atsAnalyzer.ts`, `keywordMatcher.ts`, `resumeTypeDetector.ts` into `src/lib/ats/` with MIT attribution; adapt types.
- Replace the current 50/30/20 blended score with engine scores: `atsScore` + `formatScore`.
- Split `rewrite-docx` into two calls: `suggest-rewrites` (returns `{id, original, improved, reason}` per paragraph, strict no-fabrication prompt) and `apply-rewrites` (writes only accepted/edited text into the DOCX XML, same layout-preserving method).
- Re-scan runs locally on the rewritten text; deterministic, so before/after is honest.
- Quotas unchanged (`resume_ats` for scan+suggest, `docx_rewrite` for apply).
- Rebuild ResumeEngine step rail to Scan / Improve / Review / Re-scan; keep cover letter tab and exports.
- Test with 4 resumes: real, badly formatted, clean ATS-friendly, PDF.
