
import { ResumeData } from '@/types/resume';

export const classicResueSample: ResumeData = {
  contact: {
    name: "Sarah Johnson",
    title: "Senior Marketing Manager",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/sarahjohnson",
    location: "New York, NY"
  },
  summary: "Results-driven marketing professional with 8+ years of experience developing and executing integrated marketing campaigns. Proven track record of increasing brand awareness by 150% and driving revenue growth through strategic digital marketing initiatives.",
  skills: ["Digital Marketing", "Content Strategy", "SEO/SEM", "Marketing Analytics", "Team Leadership", "Budget Management", "Social Media Marketing", "Email Campaigns"],
  experience: [
    {
      title: "Senior Marketing Manager",
      company: "TechCorp Solutions",
      startDate: "Jan 2020",
      endDate: "Present",
      responsibilities: [
        "Lead cross-functional team of 6 marketing professionals",
        "Developed integrated marketing campaigns resulting in 40% increase in qualified leads",
        "Managed annual marketing budget of $2.5M with 15% cost reduction",
        "Implemented marketing automation tools increasing efficiency by 60%"
      ]
    },
    {
      title: "Marketing Specialist",
      company: "Digital Innovations Inc",
      startDate: "Jun 2018",
      endDate: "Dec 2019",
      responsibilities: [
        "Created content marketing strategy increasing organic traffic by 200%",
        "Managed social media accounts with 50K+ followers",
        "Collaborated with sales team to develop lead nurturing campaigns"
      ]
    }
  ],
  education: [
    {
      degree: "MBA in Marketing",
      institution: "Columbia Business School",
      startYear: "2016",
      endYear: "2018"
    },
    {
      degree: "Bachelor of Business Administration",
      institution: "University of Pennsylvania",
      startYear: "2012",
      endYear: "2016"
    }
  ],
  certifications: [
    { name: "Google Analytics Certified", issuer: "Google", date: "2023" },
    { name: "HubSpot Content Marketing Certified", issuer: "HubSpot", date: "2022" },
    { name: "Facebook Blueprint Certified", issuer: "Meta", date: "2023" }
  ]
};

export const modernResumeSample: ResumeData = {
  contact: {
    name: "Alex Chen",
    title: "Full Stack Developer",
    email: "alex.chen@email.com",
    phone: "(555) 987-6543",
    linkedin: "linkedin.com/in/alexchen",
    location: "San Francisco, CA"
  },
  summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong advocate for clean code, test-driven development, and agile methodologies.",
  skills: ["JavaScript", "React", "Node.js", "Python", "TypeScript", "AWS", "Docker", "MongoDB", "PostgreSQL", "GraphQL", "Git", "Agile/Scrum"],
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "InnovateTech",
      startDate: "Mar 2021",
      endDate: "Present",
      responsibilities: [
        "Architected and developed microservices handling 1M+ daily requests",
        "Led migration from monolithic to microservices architecture",
        "Mentored 3 junior developers and established code review processes",
        "Reduced application load time by 70% through optimization techniques"
      ]
    },
    {
      title: "Software Developer",
      company: "StartupXYZ",
      startDate: "Aug 2019",
      endDate: "Feb 2021",
      responsibilities: [
        "Developed full-stack web applications using React and Node.js",
        "Implemented CI/CD pipelines reducing deployment time by 80%",
        "Collaborated with UX team to improve user engagement by 45%"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      institution: "Stanford University",
      startYear: "2015",
      endYear: "2019",
      gpa: "3.8"
    }
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce solution with React, Node.js, and Stripe integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "github.com/alexchen/ecommerce"
    },
    {
      title: "Task Management App",
      description: "Developed a collaborative task management tool with real-time updates",
      technologies: ["TypeScript", "React", "Socket.io", "PostgreSQL"]
    }
  ]
};

export const creativeResumeSample: ResumeData = {
  contact: {
    name: "Maya Rodriguez",
    title: "UI/UX Designer",
    email: "maya.rodriguez@email.com",
    phone: "(555) 246-8135",
    linkedin: "linkedin.com/in/mayarodriguez",
    location: "Los Angeles, CA"
  },
  summary: "Creative and detail-oriented UI/UX designer with 6+ years of experience crafting intuitive digital experiences. Passionate about user-centered design and creating accessible interfaces that drive engagement and conversion.",
  skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Wireframing", "Design Systems", "HTML/CSS", "JavaScript", "Accessibility Design"],
  experience: [
    {
      title: "Senior UI/UX Designer",
      company: "Creative Digital Agency",
      startDate: "Jan 2021",
      endDate: "Present",
      responsibilities: [
        "Lead design for 15+ client projects with budgets ranging from $50K-$500K",
        "Conducted user research and usability testing for major redesign projects",
        "Created comprehensive design systems used across multiple products",
        "Collaborated with development teams to ensure pixel-perfect implementation"
      ]
    },
    {
      title: "UX Designer",
      company: "FinTech Solutions",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      responsibilities: [
        "Redesigned mobile banking app resulting in 35% increase in user engagement",
        "Created wireframes and prototypes for new product features",
        "Established design guidelines and component library"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Fine Arts in Digital Design",
      institution: "Art Center College of Design",
      startYear: "2017",
      endYear: "2019"
    },
    {
      degree: "Bachelor of Graphic Design",
      institution: "UCLA",
      startYear: "2013",
      endYear: "2017"
    }
  ],
  projects: [
    {
      title: "Healthcare App Redesign",
      description: "Complete UX overhaul of patient portal increasing user satisfaction by 60%",
      link: "behance.net/mayarodriguez"
    },
    {
      title: "E-learning Platform",
      description: "Designed intuitive learning management system for 10,000+ students"
    }
  ]
};

export const executiveResumeSample: ResumeData = {
  contact: {
    name: "Robert Williams",
    title: "Chief Technology Officer",
    email: "robert.williams@email.com",
    phone: "(555) 369-2580",
    linkedin: "linkedin.com/in/robertwilliams",
    location: "Boston, MA"
  },
  summary: "Visionary technology executive with 15+ years of experience leading digital transformation initiatives. Proven track record of scaling engineering teams from 10 to 200+ members while delivering $50M+ in revenue growth through innovative technology solutions.",
  skills: ["Strategic Leadership", "Digital Transformation", "Team Building", "Product Strategy", "Cloud Architecture", "Agile Methodology", "Budget Management", "Stakeholder Relations"],
  experience: [
    {
      title: "Chief Technology Officer",
      company: "Enterprise Solutions Corp",
      startDate: "Jan 2019",
      endDate: "Present",
      responsibilities: [
        "Lead technology strategy for $2B revenue organization with 500+ employees",
        "Spearheaded cloud migration project saving $5M annually in infrastructure costs",
        "Built and scaled engineering organization from 50 to 200+ team members",
        "Established technology roadmap aligned with business objectives"
      ]
    },
    {
      title: "VP of Engineering",
      company: "TechGlobal Inc",
      startDate: "Mar 2015",
      endDate: "Dec 2018",
      responsibilities: [
        "Managed engineering teams across 4 global offices",
        "Led product development resulting in 300% increase in customer acquisition",
        "Implemented DevOps practices reducing deployment time by 90%"
      ]
    },
    {
      title: "Engineering Director",
      company: "Innovation Labs",
      startDate: "Jun 2012",
      endDate: "Feb 2015",
      responsibilities: [
        "Directed R&D initiatives for emerging technologies",
        "Managed $10M annual technology budget",
        "Partnered with C-suite executives on strategic technology decisions"
      ]
    }
  ],
  education: [
    {
      degree: "Executive MBA",
      institution: "Harvard Business School",
      startYear: "2013",
      endYear: "2015"
    },
    {
      degree: "Master of Computer Science",
      institution: "MIT",
      startYear: "2008",
      endYear: "2010"
    },
    {
      degree: "Bachelor of Engineering",
      institution: "Georgia Tech",
      startYear: "2004",
      endYear: "2008"
    }
  ]
};

export const techResumeSample: ResumeData = {
  contact: {
    name: "David Kim",
    title: "Senior Software Engineer",
    email: "david.kim@email.com",
    phone: "(555) 147-9630",
    linkedin: "linkedin.com/in/davidkim",
    location: "Seattle, WA"
  },
  summary: "Experienced software engineer specializing in distributed systems and machine learning applications. Passionate about building scalable solutions and contributing to open-source projects. Strong background in algorithm optimization and system design.",
  skills: ["Python", "Java", "Go", "Kubernetes", "TensorFlow", "Apache Kafka", "Redis", "Elasticsearch", "System Design", "Machine Learning", "Microservices", "API Design"],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "CloudTech Systems",
      startDate: "Feb 2020",
      endDate: "Present",
      responsibilities: [
        "Designed and implemented distributed data processing pipeline handling 10TB+ daily",
        "Optimized machine learning algorithms improving prediction accuracy by 25%",
        "Led technical architecture decisions for microservices platform",
        "Contributed to open-source projects with 1000+ GitHub stars"
      ]
    },
    {
      title: "Software Engineer",
      company: "DataFlow Inc",
      startDate: "Jul 2018",
      endDate: "Jan 2020",
      responsibilities: [
        "Developed real-time analytics platform serving 1M+ concurrent users",
        "Implemented caching strategies reducing API response time by 60%",
        "Collaborated with ML team to deploy predictive models in production"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Computer Science",
      institution: "University of Washington",
      startYear: "2016",
      endYear: "2018",
      gpa: "3.9"
    },
    {
      degree: "Bachelor of Computer Engineering",
      institution: "UC Berkeley",
      startYear: "2012",
      endYear: "2016",
      gpa: "3.7"
    }
  ],
  projects: [
    {
      title: "Distributed ML Training Framework",
      description: "Built open-source framework for distributed machine learning training",
      technologies: ["Python", "TensorFlow", "Kubernetes", "gRPC"],
      link: "github.com/davidkim/ml-framework"
    },
    {
      title: "Real-time Recommendation Engine",
      description: "Developed recommendation system processing 100K+ requests per second",
      technologies: ["Go", "Redis", "Kafka", "PostgreSQL"]
    }
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
    { name: "Certified Kubernetes Administrator", issuer: "Cloud Native Computing Foundation", date: "2022" },
    { name: "TensorFlow Developer Certificate", issuer: "Google", date: "2023" }
  ]
};
