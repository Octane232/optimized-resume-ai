// Adapted from simeononsecurity/ats-resume-improver (MIT License).
import type { JobDescriptionData, KeywordAnalysis } from './types'

// Common tech skill synonyms / related terms
const SKILL_RELATIONS: Record<string, string[]> = {
  javascript: ['js', 'node', 'nodejs', 'react', 'vue', 'angular', 'typescript', 'ts'],
  python: ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'scikit'],
  java: ['spring', 'springboot', 'maven', 'gradle'],
  golang: ['go', 'go lang'],        // 'go' is a common English word — alias via golang
  kubernetes: ['k8s', 'helm', 'container orchestration'],
  docker: ['containers', 'containerization', 'podman'],
  aws: ['amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
  azure: ['microsoft azure', 'az-900', 'az-104'],
  gcp: ['google cloud', 'google cloud platform'],
  terraform: ['iac', 'infrastructure as code'],
  ci_cd: ['jenkins', 'github actions', 'gitlab ci', 'circleci', 'devops'],
  sql: ['mysql', 'postgresql', 'database', 'postgres'],
  nosql: ['mongodb', 'cassandra', 'dynamodb', 'redis'],
  machine_learning: ['ml', 'ai', 'artificial intelligence', 'deep learning', 'neural network'],
  agile: ['scrum', 'kanban', 'jira', 'sprint'],
  powershell: ['ps script', 'powershell scripting'],
  linux: ['ubuntu', 'centos', 'rhel', 'bash', 'shell scripting'],
  windows: ['active directory', 'group policy', 'hyper-v'],
  networking: ['tcp/ip', 'dns', 'dhcp', 'vpn', 'firewall', 'bgp', 'ospf'],
  security: ['cybersecurity', 'soc', 'siem', 'penetration testing', 'zero trust'],
}

// Short single-word tech terms that are also common English words and need
// word-boundary matching to avoid false positives (e.g. "Go" inside "MongoDB")
const WORD_BOUNDARY_TERMS = new Set([
  'go', 'r', 'c', 'ruby', 'rust', 'swift', 'kotlin', 'scala', 'perl',
  'lua', 'julia', 'dart', 'elm', 'clojure', 'haskell',
])

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[\s-_]+/g, ' ')
}

/**
 * Test whether a term appears in resumeText.
 * For short/ambiguous single-word terms (≤ 5 chars or in WORD_BOUNDARY_TERMS)
 * we require word boundaries so "Go" doesn't match "MongoDB" or prose "go".
 * Also handles "Go" / "Golang" equivalence.
 */
function termExistsInText(resumeLower: string, rawTerm: string): boolean {
  const termNorm = normalize(rawTerm)

  // "Go" (the language) — match "golang" or literally "\bgo\b" as a tech context
  // We require it to appear next to a tech context word OR as "golang"
  if (termNorm === 'go') {
    if (resumeLower.includes('golang')) return true
    if (resumeLower.includes('go lang')) return true
    // Only count standalone \bgo\b if it also appears near a tech indicator
    const goMatch = /\bgo\b/i.test(resumeLower)
    if (!goMatch) return false
    // Require a nearby tech-context word within the same line
    const lines = resumeLower.split('\n')
    return lines.some(line =>
      /\bgo\b/i.test(line) &&
      /\b(language|lang|program|develop|build|service|microservice|backend|api|tool|compil)/i.test(line)
    )
  }

  const needsBoundary = WORD_BOUNDARY_TERMS.has(termNorm) || (termNorm.length <= 3 && !termNorm.includes(' '))
  if (needsBoundary) {
    const escaped = termNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`, 'i').test(resumeLower)
  }

  return resumeLower.includes(termNorm)
}

function findRelated(term: string, resumeText: string): string[] {
  const termNorm = normalize(term)
  const related: string[] = []

  for (const [key, synonyms] of Object.entries(SKILL_RELATIONS)) {
    const groupTerms = [key.replace(/_/g, ' '), ...synonyms]
    const termInGroup = groupTerms.some(t => normalize(t) === termNorm || termNorm.includes(normalize(t)))

    if (termInGroup) {
      // Find other terms in this group that appear in the resume
      for (const sibling of groupTerms) {
        const sibNorm = normalize(sibling)
        if (sibNorm !== termNorm && resumeText.toLowerCase().includes(sibNorm)) {
          related.push(sibling)
        }
      }
    }
  }

  return [...new Set(related)]
}

export function analyzeKeywords(
  resumeText: string,
  jobData: JobDescriptionData
): KeywordAnalysis {
  const allTerms = [
    ...jobData.requiredSkills,
    ...jobData.preferredSkills,
    ...jobData.technologies,
    ...jobData.certifications,
  ]

  // Deduplicate
  const uniqueTerms = [...new Set(allTerms.map(t => t.trim()).filter(Boolean))]

  const resumeLower = resumeText.toLowerCase()

  const matching: string[] = []
  const missing: string[] = []
  const related: string[] = []

  for (const term of uniqueTerms) {
    if (termExistsInText(resumeLower, term)) {
      matching.push(term)
    } else {
      missing.push(term)
      // Find related skills in resume that could be mentioned as evidence
      const rels = findRelated(term, resumeText)
      related.push(...rels)
    }
  }

  const coveragePercent = uniqueTerms.length > 0
    ? Math.round((matching.length / uniqueTerms.length) * 100)
    : 0

  return {
    matching: [...new Set(matching)],
    missing: [...new Set(missing)],
    related: [...new Set(related)],
    coveragePercent,
  }
}

/**
 * Parse a raw job description text into structured data (no AI needed)
 */
export function parseJobDescriptionLocal(text: string): Partial<JobDescriptionData> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const requiredSkills: string[] = []
  const technologies: string[] = []
  const certifications: string[] = []

  // Common tech keywords to scan for
  const techKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Golang', 'Go', 'Rust', 'Ruby', 'PHP',
    'React', 'Vue', 'Angular', 'Node.js', 'Django', 'Flask', 'Spring',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'GitHub Actions',
    'Linux', 'Windows Server', 'PowerShell', 'Bash',
    'REST', 'GraphQL', 'gRPC', 'Microservices', 'API',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Spark', 'Hadoop',
    'Agile', 'Scrum', 'Kanban', 'Jira',
    'Active Directory', 'SIEM', 'Splunk', 'Security',
    'Networking', 'TCP/IP', 'DNS', 'DHCP', 'VPN', 'Firewall',
    'Intune', 'SCCM', 'ServiceNow',
  ]

  const certKeywords = [
    'AWS Certified', 'Azure', 'GCP', 'CompTIA', 'CISSP', 'CCNA', 'CCNP',
    'PMP', 'ITIL', 'Kubernetes (CKA', 'CKS', 'CKAD', 'Terraform Associate',
    'Security+', 'Network+', 'A+', 'CEH', 'OSCP',
  ]

  const textLower = text.toLowerCase()

  for (const tech of techKeywords) {
    if (termExistsInText(textLower, tech)) {
      technologies.push(tech)
    }
  }

  for (const cert of certKeywords) {
    if (textLower.includes(cert.toLowerCase())) {
      certifications.push(cert)
    }
  }

  // Extract required skills from "Required:" or "Requirements:" sections
  let inRequired = false
  for (const line of lines) {
    if (/required|requirements|must have|qualifications/i.test(line)) {
      inRequired = true
      continue
    }
    if (/preferred|nice to have|bonus|plus/i.test(line)) {
      inRequired = false
    }
    if (inRequired && line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      requiredSkills.push(line.replace(/^[•\-*]\s*/, ''))
    }
  }

  // First line or title-looking line
  const title = lines[0] || ''

  return {
    title,
    requiredSkills: [...new Set(requiredSkills)],
    preferredSkills: [],
    technologies: [...new Set(technologies)],
    certifications: [...new Set(certifications)],
    responsibilities: [],
    rawText: text,
  }
}

