// Deterministic ATS scan. AI never produces these numbers.
import { scoreResume } from './atsAnalyzer';
import { analyzeKeywords, parseJobDescriptionLocal } from './keywordMatcher';
import type { AtsIssue, JobDescriptionData, ResumeData } from './types';

const STOP = new Set(('about above after again against also among and any are because been before being below between both but can could did does doing down during each even every few for from further had has have having her here hers him his how into its itself just may might more most must need needs other our ours out over own same shall should some such than that the their them then there these they this those through too under until upon very was were what when where which while who whom why will with within without would you your yours able work working team role company candidate candidates experience years year strong excellent good great ability including include responsibilities requirements required preferred skills skill job position opportunity join looking new well across ensure support using use based level plus').split(' '));

function topTerms(text: string, n = 18): string[] {
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z+#./-]{3,}/g) || []) {
    const t = w.replace(/[./-]+$/, '');
    if (t.length < 4 || STOP.has(t)) continue;
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
}

export interface ScanResult {
  atsScore: number;
  formatScore: number;
  breakdown: { readability: number; keywordMatch: number; skillsMatch: number; completeness: number; formatting: number };
  matching: string[];
  missing: string[];
  issues: AtsIssue[];
}

export function runScan(resumeText: string, jobDescription: string): ScanResult {
  const local = parseJobDescriptionLocal(jobDescription);
  const terms = [...new Set([...(local.technologies || []), ...topTerms(jobDescription)])];
  const jobData: JobDescriptionData = {
    title: local.title || '', company: '', requiredSkills: terms, preferredSkills: [],
    technologies: local.technologies || [], certifications: local.certifications || [],
    responsibilities: [], rawText: jobDescription,
  };
  const resumeData: ResumeData = {
    name: '', email: '', phone: '', location: '', summary: '', experience: [], education: [],
    skills: [resumeText], certifications: [], rawText: resumeText,
  };
  const score = scoreResume(resumeText, resumeData, jobData);
  const kw = analyzeKeywords(resumeText, jobData);
  return {
    atsScore: score.overall,
    formatScore: Math.round((score.formatting + score.readability + score.completeness) / 3),
    breakdown: {
      readability: score.readability, keywordMatch: score.keywordMatch, skillsMatch: score.skillsMatch,
      completeness: score.completeness, formatting: score.formatting,
    },
    matching: kw.matching,
    missing: kw.missing,
    issues: score.issues,
  };
}

export function hasLayoutProblems(scan: ScanResult): boolean {
  return scan.issues.some((i) => i.category === 'Formatting' || /table|column|text box|graphic|image/i.test(i.message));
}
