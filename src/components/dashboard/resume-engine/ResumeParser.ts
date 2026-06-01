// Shared types for resume-engine sub-components.
export interface ParsedExperienceEntry {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: ParsedExperienceEntry[];
  education?: Array<Record<string, string | undefined>>;
  totalYearsExperience?: number;
  [key: string]: unknown;
}
