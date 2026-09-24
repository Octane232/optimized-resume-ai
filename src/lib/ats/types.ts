import type { AIConfig } from '../lib/aiProvider'

export interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications: string[]
  projects?: ProjectItem[]
  rawText: string
}

export interface ProjectItem {
  name: string
  description: string
  technologies?: string[]
  url?: string
}

export interface ExperienceItem {
  title: string
  company: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface EducationItem {
  degree: string
  institution: string
  year: string
  gpa?: string
}

export interface JobDescriptionData {
  title: string
  company: string
  requiredSkills: string[]
  preferredSkills: string[]
  technologies: string[]
  certifications: string[]
  responsibilities: string[]
  rawText: string
}

export interface AIKeywordMatch {
  keyword: string
  context: string
  strength: 'strong' | 'moderate' | 'weak'
}

export interface AIKeywordMissing {
  keyword: string
  importance: 'critical' | 'high' | 'medium' | 'low'
  suggestion: string
}

export interface KeywordAnalysis {
  matching: string[]
  missing: string[]
  related: string[]
  coveragePercent: number
  // AI-enhanced fields — populated when an API key / Ollama is available
  aiMatching?: AIKeywordMatch[]
  aiMissing?: AIKeywordMissing[]
  aiSummary?: string
  aiCoveragePercent?: number
}

export interface AtsIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
}

export interface AtsScore {
  overall: number
  readability: number
  keywordMatch: number
  skillsMatch: number
  completeness: number
  formatting: number
  issues: AtsIssue[]
}

export interface OptimizationOptions {
