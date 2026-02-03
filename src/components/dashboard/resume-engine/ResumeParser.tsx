import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Check, X, AlertTriangle, User, Briefcase, GraduationCap, Wrench, FileText, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Parsed resume structure following standard taxonomy
export interface ParsedContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ParsedExperience {
  title: string;
  normalizedTitle: string; // Standardized title (e.g., "Sr. SWE" → "Senior Software Engineer")
  company: string;
  startDate: string;
  endDate: string;
  duration: number; // Months
  isCurrent: boolean;
  bullets: string[];
  keywords: string[];
}

export interface ParsedEducation {
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface ParsedSkill {
  name: string;
  normalizedName: string; // Mapped to taxonomy (e.g., "JS" → "JavaScript")
  category: 'technical' | 'soft' | 'tool' | 'language';
  confidence: number; // 0-100 based on frequency and context
  isExplicit: boolean; // From skills section vs. inferred
}

export interface ParsedResume {
  contact: ParsedContact;
  summary: string;
  skills: ParsedSkill[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  certifications: string[];
  projects: { title: string; description: string; technologies: string[] }[];
  totalYearsExperience: number;
  seniorityLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  detectedSections: string[];
  parsingConfidence: number;
}

interface ResumeParserProps {
  rawText: string;
  onParsingComplete?: (parsed: ParsedResume) => void;
}

// Skill normalization map
const SKILL_NORMALIZATION: Record<string, string> = {
  'js': 'JavaScript',
  'ts': 'TypeScript',
  'py': 'Python',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'react.js': 'React',
  'reactjs': 'React',
  'vue.js': 'Vue',
  'vuejs': 'Vue',
  'angular.js': 'Angular',
  'angularjs': 'Angular',
  'postgres': 'PostgreSQL',
  'mongo': 'MongoDB',
  'k8s': 'Kubernetes',
  'aws': 'Amazon Web Services',
  'gcp': 'Google Cloud Platform',
  'azure': 'Microsoft Azure',
};

// Title normalization map
const TITLE_NORMALIZATION: Record<string, string> = {
  'sr.': 'Senior',
  'sr ': 'Senior ',
  'jr.': 'Junior',
  'jr ': 'Junior ',
  'swe': 'Software Engineer',
  'sde': 'Software Development Engineer',
  'pm': 'Product Manager',
  'em': 'Engineering Manager',
  'vp': 'Vice President',
  'cto': 'Chief Technology Officer',
  'ceo': 'Chief Executive Officer',
};

// Section detection patterns
const SECTION_PATTERNS: Record<string, RegExp> = {
  summary: /\b(summary|professional summary|objective|profile|about me|career summary)\b/i,
  experience: /\b(experience|work experience|employment|professional experience|work history|career history)\b/i,
  education: /\b(education|academic|qualifications|degrees?|university|college)\b/i,
  skills: /\b(skills|technical skills|competencies|expertise|proficiencies|technologies)\b/i,
  projects: /\b(projects|portfolio|personal projects|side projects)\b/i,
  certifications: /\b(certifications?|certificates?|licenses?|credentials?|accreditations?)\b/i,
  awards: /\b(awards?|honors?|achievements?|recognition)\b/i,
};

// Common skills database for detection
const COMMON_SKILLS = {
  technical: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'rails', 'laravel',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material ui',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab ci',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
    'rest api', 'graphql', 'grpc', 'websocket', 'microservices', 'serverless',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
    'data science', 'data analysis', 'pandas', 'numpy', 'scikit-learn',
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'time management', 'collaboration', 'mentoring', 'presentation',
    'agile', 'scrum', 'kanban', 'strategic planning', 'decision making',
  ],
  tool: [
    'excel', 'powerpoint', 'word', 'tableau', 'power bi', 'looker', 'figma', 'sketch',
    'photoshop', 'illustrator', 'vs code', 'intellij', 'xcode', 'postman', 'insomnia',
  ],
};

// Parse resume text
const parseResumeText = (rawText: string): ParsedResume => {
  const text = rawText.trim();
  const lines = text.split('\n').filter(l => l.trim());
  const lowerText = text.toLowerCase();

  // Detect sections
  const detectedSections = Object.entries(SECTION_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([section]) => section);

  // Extract contact info
  const contact = extractContact(text, lines);

  // Extract summary
  const summary = extractSummary(text);

  // Extract skills with confidence scoring
  const skills = extractSkills(text);

  // Extract experience
  const experience = extractExperience(text);

  // Extract education
  const education = extractEducation(text);

  // Extract certifications
  const certifications = extractCertifications(text);

  // Calculate total experience
  const totalYearsExperience = experience.reduce((acc, exp) => acc + (exp.duration / 12), 0);

  // Determine seniority level
  const seniorityLevel = determineSeniority(totalYearsExperience, experience);

  // Calculate parsing confidence
  const parsingConfidence = calculateParsingConfidence(contact, skills, experience, education, detectedSections);

  return {
    contact,
    summary,
    skills,
    experience,
    education,
    certifications,
    projects: [], // Would extract from projects section
    totalYearsExperience: Math.round(totalYearsExperience * 10) / 10,
    seniorityLevel,
    detectedSections,
    parsingConfidence,
  };
};

// Extract contact information
const extractContact = (text: string, lines: string[]): ParsedContact => {
  const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  const portfolioMatch = text.match(/(?:portfolio|website):\s*(https?:\/\/[^\s]+)/i) || 
                         text.match(/(https?:\/\/(?!linkedin|github)[^\s]+\.(com|io|dev|me))/i);
  const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/);
  
  // First non-trivial line is likely the name
  const possibleName = lines.find(l => {
    const trimmed = l.trim();
    return trimmed.length > 2 && 
           trimmed.length < 50 && 
           !trimmed.includes('@') &&
           !trimmed.includes('http') &&
           !/\d{3}/.test(trimmed);
  })?.trim() || '';

  return {
    name: possibleName,
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    location: locationMatch?.[0] || '',
    linkedin: linkedinMatch?.[0] || '',
    github: githubMatch?.[0] || '',
    portfolio: portfolioMatch?.[1] || '',
  };
};

// Extract summary section
const extractSummary = (text: string): string => {
  const summaryMatch = text.match(/(?:summary|professional summary|objective|profile|about me)[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment)|\n\n\n|$)/i);
  if (summaryMatch) {
    return summaryMatch[1].trim().slice(0, 500);
  }
  return '';
};

// Extract and normalize skills
const extractSkills = (text: string): ParsedSkill[] => {
  const lowerText = text.toLowerCase();
  const skills: ParsedSkill[] = [];
  const seenSkills = new Set<string>();

  // Extract from explicit skills section
  const skillsSectionMatch = text.match(/(?:skills|technical skills|competencies)[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|projects|certifications)|\n\n\n|$)/i);
  const skillsSectionText = skillsSectionMatch?.[1]?.toLowerCase() || '';

  // Check all common skills
  const allSkills = [
    ...COMMON_SKILLS.technical.map(s => ({ name: s, category: 'technical' as const })),
    ...COMMON_SKILLS.soft.map(s => ({ name: s, category: 'soft' as const })),
    ...COMMON_SKILLS.tool.map(s => ({ name: s, category: 'tool' as const })),
  ];

  allSkills.forEach(({ name, category }) => {
    const lowerName = name.toLowerCase();
    if (lowerText.includes(lowerName) && !seenSkills.has(lowerName)) {
      seenSkills.add(lowerName);
      
      // Normalize skill name
      const normalizedName = SKILL_NORMALIZATION[lowerName] || 
        name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Calculate confidence based on frequency and location
      const inSkillsSection = skillsSectionText.includes(lowerName);
      const occurrences = (lowerText.match(new RegExp(lowerName, 'g')) || []).length;
      const confidence = Math.min(100, (inSkillsSection ? 50 : 20) + (occurrences * 10));

      skills.push({
        name,
        normalizedName,
        category,
        confidence,
        isExplicit: inSkillsSection,
      });
    }
  });

  return skills.sort((a, b) => b.confidence - a.confidence);
};

// Extract experience
const extractExperience = (text: string): ParsedExperience[] => {
  const experiences: ParsedExperience[] = [];
  
  // Simple pattern matching for job entries
  const jobPatterns = [
    /([A-Za-z\s]+)\s+(?:at|@|–|-)\s+([A-Za-z\s&.]+)\s*[|•·]\s*((?:\d{4}|present|current))/gi,
    /([A-Za-z\s]+),?\s+([A-Za-z\s&.]+)\s*[|•·–-]\s*((?:\w+\s+)?\d{4})\s*(?:to|–|-)\s*((?:\w+\s+)?\d{4}|present|current)/gi,
  ];

  // Detect leadership keywords
  const leadershipKeywords = ['led', 'managed', 'mentored', 'architected', 'designed', 'built', 'created', 'developed', 'implemented'];
  const hasLeadershipIndicators = leadershipKeywords.some(kw => text.toLowerCase().includes(kw));

  // Extract bullet points
  const bulletMatches = text.match(/[•\-–>▸◆]\s*([^\n•\-–>▸◆]+)/g) || [];
  const bullets = bulletMatches.map(b => b.replace(/^[•\-–>▸◆]\s*/, '').trim()).filter(b => b.length > 10);

  // Create a basic experience entry if we can't parse structured data
  if (bullets.length > 0) {
    const keywords = bullets.flatMap(b => 
      [...COMMON_SKILLS.technical, ...COMMON_SKILLS.soft]
        .filter(skill => b.toLowerCase().includes(skill.toLowerCase()))
    );

    experiences.push({
      title: 'Professional Experience',
      normalizedTitle: 'Professional Experience',
      company: '',
      startDate: '',
      endDate: 'Present',
      duration: 0,
      isCurrent: true,
      bullets: bullets.slice(0, 10),
      keywords: [...new Set(keywords)],
    });
  }

  return experiences;
};

// Extract education
const extractEducation = (text: string): ParsedEducation[] => {
  const education: ParsedEducation[] = [];
  
  // Common degree patterns
  const degreePatterns = [
    /\b(bachelor'?s?|master'?s?|ph\.?d\.?|m\.?s\.?|b\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?)\b.*?((?:of|in)\s+[\w\s]+)?/gi,
    /\b(computer science|engineering|business|mathematics|physics|chemistry|biology)\b/gi,
  ];

  const institutionPatterns = [
    /\b(university|college|institute|school)\s+(?:of\s+)?[\w\s]+/gi,
    /\b([\w\s]+)\s+(university|college|institute)/gi,
  ];

  const degreeMatch = text.match(degreePatterns[0]);
  const institutionMatch = text.match(institutionPatterns[0]) || text.match(institutionPatterns[1]);
  const yearMatch = text.match(/\b(19|20)\d{2}\b/g);

  if (degreeMatch || institutionMatch) {
    education.push({
      degree: degreeMatch?.[0]?.trim() || '',
      field: '',
      institution: institutionMatch?.[0]?.trim() || '',
      startYear: yearMatch?.[0] || '',
      endYear: yearMatch?.[1] || yearMatch?.[0] || '',
    });
  }

  return education;
};

// Extract certifications
const extractCertifications = (text: string): string[] => {
  const certs: string[] = [];
  const certPatterns = [
    /\b(aws certified|google cloud|azure certified|pmp|scrum master|cissp|ceh|comptia)/gi,
  ];

  certPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      certs.push(...matches);
    }
  });

  return [...new Set(certs)];
};

// Determine seniority level
const determineSeniority = (
  totalYears: number, 
  experience: ParsedExperience[]
): ParsedResume['seniorityLevel'] => {
  const titles = experience.map(e => e.title.toLowerCase()).join(' ');
  
  if (titles.includes('chief') || titles.includes('vp') || titles.includes('director')) {
    return 'executive';
  }
  if (titles.includes('lead') || titles.includes('principal') || titles.includes('staff')) {
    return 'lead';
  }
  if (titles.includes('senior') || titles.includes('sr') || totalYears >= 5) {
    return 'senior';
  }
  if (totalYears >= 2) {
    return 'mid';
  }
  return 'entry';
};

// Calculate parsing confidence
const calculateParsingConfidence = (
  contact: ParsedContact,
  skills: ParsedSkill[],
  experience: ParsedExperience[],
  education: ParsedEducation[],
  sections: string[]
): number => {
  let score = 0;
  
  // Contact completeness (25 points)
  if (contact.name) score += 5;
  if (contact.email) score += 10;
  if (contact.phone) score += 5;
  if (contact.linkedin || contact.github) score += 5;
  
  // Skills detection (25 points)
  if (skills.length > 0) score += 10;
  if (skills.length > 5) score += 10;
  if (skills.some(s => s.isExplicit)) score += 5;
  
  // Experience detection (25 points)
  if (experience.length > 0) score += 15;
  if (experience.some(e => e.bullets.length > 2)) score += 10;
  
  // Education detection (10 points)
  if (education.length > 0) score += 10;
  
  // Section detection (15 points)
  score += Math.min(15, sections.length * 3);
  
  return Math.min(100, score);
};

const ResumeParser: React.FC<ResumeParserProps> = ({ rawText, onParsingComplete }) => {
  const parsed = useMemo(() => {
    const result = parseResumeText(rawText);
    onParsingComplete?.(result);
    return result;
  }, [rawText, onParsingComplete]);

  const SectionStatus = ({ 
    found, 
    label, 
    critical = false,
    icon: Icon 
  }: { 
    found: boolean; 
    label: string; 
    critical?: boolean;
    icon: React.ElementType;
  }) => (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${
      found ? 'bg-emerald-500/10' : critical ? 'bg-red-500/10' : 'bg-amber-500/10'
    }`}>
      {found ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : critical ? (
        <X className="w-4 h-4 text-red-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      )}
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Parsing Results</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <div className="flex items-center gap-2">
            <Progress value={parsed.parsingConfidence} className="w-20 h-2" />
            <span className="text-sm font-medium text-foreground">{parsed.parsingConfidence}%</span>
          </div>
        </div>
      </div>

      {/* Sections Detected */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Detected Sections
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SectionStatus found={parsed.detectedSections.includes('summary')} label="Summary" critical icon={FileText} />
          <SectionStatus found={parsed.detectedSections.includes('experience')} label="Experience" critical icon={Briefcase} />
          <SectionStatus found={parsed.detectedSections.includes('education')} label="Education" critical icon={GraduationCap} />
          <SectionStatus found={parsed.detectedSections.includes('skills')} label="Skills" critical icon={Wrench} />
          <SectionStatus found={parsed.detectedSections.includes('projects')} label="Projects" icon={FileText} />
          <SectionStatus found={parsed.detectedSections.includes('certifications')} label="Certifications" icon={Award} />
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Contact Information
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(parsed.contact).map(([key, value]) => (
            <div 
              key={key}
              className={`flex items-center gap-2 p-2 rounded ${
                value ? 'bg-muted/50' : 'bg-red-500/10'
              }`}
            >
              {value ? (
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-red-500 shrink-0" />
              )}
              <span className="text-xs text-muted-foreground capitalize w-16">{key}:</span>
              <span className="text-xs truncate font-mono">{value || 'Not found'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Preview */}
      {parsed.skills.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Extracted Skills ({parsed.skills.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {parsed.skills.slice(0, 15).map((skill, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded text-xs ${
                  skill.isExplicit
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
                title={`${skill.confidence}% confidence`}
              >
                {skill.normalizedName}
              </span>
            ))}
            {parsed.skills.length > 15 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{parsed.skills.length - 15} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{parsed.totalYearsExperience}</p>
          <p className="text-xs text-muted-foreground">Years Exp.</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground capitalize">{parsed.seniorityLevel}</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{parsed.skills.length}</p>
          <p className="text-xs text-muted-foreground">Skills</p>
        </div>
      </div>
    </motion.div>
  );
};

export { parseResumeText };
export default ResumeParser;
