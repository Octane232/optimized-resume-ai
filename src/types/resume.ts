
export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  location: string;
  portfolio?: string;
  github?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  achievements?: string[];
  keywords?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
  honors?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
  github?: string;
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  link?: string;
}

export interface Language {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  awards?: string[];
  volunteer?: WorkExperience[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface ResumeAnalysis {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface AIFeatures {
  jobMatcher: boolean;
  achievementRewriter: boolean;
  skillGapAnalyzer: boolean;
  interviewPrep: boolean;
  linkedinOptimizer: boolean;
}
