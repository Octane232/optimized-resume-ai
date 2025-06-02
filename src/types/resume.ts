
export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  location: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: string[];
}
