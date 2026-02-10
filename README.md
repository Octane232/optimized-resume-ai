# Vaylance

**Your AI-Powered Career Command Center**

Vaylance is a comprehensive AI-driven career platform designed to help job seekers land their dream jobs faster and smarter. The platform combines intelligent resume building, job discovery, application tracking, interview preparation, and personalized AI coaching into one unified experience.

---

## 🎯 Platform Overview

Vaylance operates in two primary modes:

| Mode | Purpose |
|------|---------|
| **Hunter Mode** | Active job seeking - resume optimization, job search, application tracking |
| **Growth Mode** | Career development - skill building, professional growth (Coming Soon) |

---

## 📄 Pages & Their Functions

### Public Pages

#### **Homepage (`/`)**
The main landing page that introduces Vaylance to visitors. It includes:
- **Hero Section**: Compelling headline with call-to-action to get started
- **Stats Section**: Platform statistics (users helped, resumes created, success rate)
- **Trusted By Section**: Social proof with company logos
- **How It Works**: Step-by-step guide to using the platform
- **Product Showcase**: Visual demonstration of key features
- **Benefits Section**: Value proposition for job seekers
- **Testimonials**: Success stories from real users
- **Trust Badges**: Security and quality certifications
- **Pricing Section**: Subscription tier comparison
- **FAQ Section**: Common questions answered
- **Resources Section**: Blog posts, guides, and career tips

*Purpose: Convert visitors into registered users by demonstrating platform value.*

#### **Templates (`/templates`)**
A public gallery showcasing all available resume templates:
- Visual previews of each template design
- Template categorization (Professional, Modern, Creative, Tech)
- ATS compatibility indicators
- Direct link to start using any template

*Purpose: Allow users to browse templates before signing up.*

#### **Auth (`/auth`)**
Authentication page handling user registration and login:
- Email/password sign-up and sign-in
- Password reset functionality
- Session management
- Redirect to dashboard after successful authentication

*Purpose: Secure user authentication and account creation.*

#### **For Individuals (`/for-individuals`)**
Targeted landing page for individual job seekers:
- Personalized messaging for career changers
- Feature highlights relevant to individual users
- Success stories from similar users
- Custom pricing information

*Purpose: Convert individual job seekers with tailored messaging.*

#### **For Students (`/for-students`)**
Targeted landing page for students and recent graduates:
- Entry-level job seeking tips
- Features for building first resumes
- Internship and early-career focus
- Student discount information

*Purpose: Attract and convert student users with relevant content.*

#### **About Us (`/about-us`)**
Company information and mission:
- Team introduction
- Platform mission and values
- Company history and vision
- Contact information

*Purpose: Build trust and transparency with users.*

#### **Contact (`/contact`)**
Contact form and support information:
- Email support form
- FAQ quick links
- Social media links
- Office location (if applicable)

*Purpose: Provide customer support channel.*

#### **Documentation (`/documentation`)**
User guides and platform documentation:
- Getting started guide
- Feature tutorials
- API documentation (for integrations)
- Troubleshooting guides

*Purpose: Self-service support and user education.*

#### **Affiliate Program (`/affiliate-program`)**
Information about the referral program:
- Commission structure explanation
- How to become an affiliate
- Benefits of partnership
- Sign-up call-to-action

*Purpose: Recruit affiliates to drive platform growth.*

#### **Legal Pages**
- **Privacy Policy (`/privacy-policy`)**: Data handling, user rights, GDPR compliance
- **Terms of Service (`/terms-of-service`)**: Platform usage rules and agreements
- **Cookie Policy (`/cookie-policy`)**: Cookie usage and consent information

*Purpose: Legal compliance and user transparency.*

---

### Authenticated Pages (Dashboard)

#### **Dashboard (`/dashboard`)**
The main authenticated interface with a three-zone layout:

**Zone A - Sidebar Navigation:**
- Mode toggle (Hunter/Growth)
- Navigation to all dashboard sections
- Collapsible for more screen space
- User profile quick access

**Zone B - Main Content:**
Dynamic content area that renders based on active tab selection.

**Zone C - Vaylance AI Sidecar:**
Always-available AI assistant for contextual help and suggestions.

---

### Dashboard Sections

#### **Briefing (Hunter Dashboard)**
The command center homepage showing:
- **Daily Briefing**: Personalized action items for the day
- **Application Stats**: At-a-glance metrics (applied, interviews, offers)
- **Recent Activity Feed**: Timeline of recent actions
- **Career Streak**: Gamified engagement tracking
- **Quick Actions**: One-click access to common tasks
- **ATS Score Card**: Resume optimization summary

*Purpose: Provide a daily overview and prioritized action items.*

#### **Scout (Job Finder)**
Intelligent job discovery engine:
- **Job Listings**: Curated job matches based on user profile
- **Skill Matching**: Percentage match indicators
- **Save Jobs**: Bookmark interesting opportunities
- **Quick Apply**: Streamlined application process
- **Filters**: Location, salary, experience level, remote options

*Purpose: Help users discover and evaluate job opportunities.*

#### **Resume Builder (`/resume-builder`)**
Create new resumes from scratch:
- **Template Selection**: Choose from professional templates
- **AI Generation**: Generate content based on job description
- **Section Builder**: Add/edit experience, education, skills
- **Real-time Preview**: See changes instantly
- **Import Existing**: Upload and parse existing resume

*Purpose: Create optimized resumes quickly.*

#### **Resume Engine (ATS Resume Analyzer)**
The core of Vaylance's job matching capability. This powerful tool tells users honestly whether they're a good fit for a specific role:

**5-Stage Workflow:**
1. **Ingestion**: Upload resume (PDF, DOCX, TXT) or paste text
2. **Parsing**: AI extracts and normalizes skills, experience, seniority
3. **Matching**: Compare resume against job description with detailed scoring
4. **Enhancement**: Get specific, actionable fixes with examples
5. **Export**: Download optimized resume in multiple formats

**ATS Analyzer Features:**
- **Honest Fit Assessment**: Clear verdict - "You ARE/ARE NOT a good fit" with explanation
- **Match Score**: 0-100 score reflecting real interview chances
- **Strengths Identified**: What's working well in your resume
- **Gaps Analysis**: Critical, moderate, and minor gaps with severity levels
- **Actionable Fixes**: Specific recommendations with priority ranking
- **Example Text**: Copy-ready improved bullet points and sections
- **Keyword Analysis**: Missing keywords with context on where to add them
- **ATS Warnings**: Formatting issues that could cause automatic rejection

*Purpose: Give users honest, actionable feedback on their job application chances.*

#### **Resume Editor (`/resume-editor/:id`)**
Full-featured resume editing interface:
- **WYSIWYG Editor**: Visual editing with live preview
- **Template Switching**: Change templates without losing content
- **Section Management**: Drag-and-drop reordering
- **AI Bullet Rewriter**: Transform weak bullets into achievements
- **Export Suite**: High-fidelity PDF, HTML, and ATS-friendly DOCX
- **Auto-save**: Never lose work with automatic saving

*Purpose: Fine-tune resume content and design.*

#### **Cover Letter Generator**
AI-powered cover letter creation:
- **Job Analysis**: Parse job description for key requirements
- **Personalization**: Match user experience to job needs
- **Tone Selection**: Professional, enthusiastic, or balanced
- **Template Options**: Multiple formatting styles
- **Quick Edit**: Modify generated content
- **Export**: Download as PDF or copy text

*Purpose: Create tailored cover letters in minutes.*

#### **Interview Prep**
Interview practice and coaching:
- **Question Bank**: Common interview questions by role
- **AI Mock Interviews**: Practice with simulated interviewer
- **Answer Feedback**: Real-time analysis and suggestions
- **STAR Method Guidance**: Structured answer framework
- **Session History**: Review past practice sessions
- **Performance Tracking**: Track improvement over time

*Purpose: Build confidence and improve interview performance.*

#### **Skill Gap Analyzer**
Career development insights:
- **Current Skills Assessment**: Based on resume analysis
- **Target Role Requirements**: Skills needed for desired position
- **Gap Identification**: Missing skills highlighted
- **Learning Resources**: Recommended courses and certifications
- **Progress Tracking**: Monitor skill development

*Purpose: Identify and address skill gaps for career advancement.*

#### **LinkedIn Optimizer**
LinkedIn profile enhancement:
- **Headline Generator**: Craft attention-grabbing headlines
- **Summary Writer**: AI-generated professional summaries
- **Keyword Optimization**: Improve profile discoverability
- **Best Practices**: Tips for maximum visibility
- **Export**: Copy optimized content to clipboard

*Purpose: Maximize LinkedIn profile effectiveness.*

#### **Mission Control (Application Tracker)**
Comprehensive application management:
- **Kanban Board**: Visual application pipeline
- **Status Tracking**: Applied, Interview, Offer, Rejected
- **Deadline Reminders**: Never miss follow-ups
- **Contact Management**: Recruiter and hiring manager info
- **Notes**: Track conversations and details
- **Analytics**: Application success metrics

*Purpose: Stay organized throughout the job search process.*

#### **Billing**
Subscription and payment management:
- **Current Plan**: View active subscription tier
- **Usage Stats**: AI generations, downloads, resumes used
- **Upgrade Options**: Compare and upgrade plans
- **Invoice History**: Past payment records
- **Payment Methods**: Manage payment information
- **Cancel/Pause**: Subscription management

*Purpose: Manage subscription and billing.*

#### **Settings**
Account and preference configuration:
- **Profile Settings**: Name, email, avatar
- **Career Preferences**: Target role, industry, experience level
- **Notification Settings**: Email and in-app preferences
- **Connected Services**: Third-party integrations
- **Privacy Controls**: Data visibility options
- **Account Actions**: Password change, account deletion

*Purpose: Customize account and platform experience.*

#### **Affiliate Dashboard (`/affiliate-dashboard`)**
For registered affiliates:
- **Earnings Overview**: Commission totals and pending payments
- **Referral Tracking**: Link clicks and conversions
- **Payout History**: Past payment records
- **Marketing Materials**: Banners, links, promotional content
- **Performance Analytics**: Conversion rates and trends

*Purpose: Manage affiliate partnership and track earnings.*

---

## 🤖 AI Features (Vaylance AI)

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Resume Generator** | Creates complete resume sections from experience descriptions | New resume creation |
| **Resume Optimizer** | Analyzes and suggests improvements for ATS compatibility | Resume refinement |
| **Bullet Rewriter** | Transforms weak bullet points into impactful achievements | Resume enhancement |
| **Cover Letter Generator** | Creates personalized cover letters for specific jobs | Job applications |
| **Interview Coach** | Provides feedback on practice interview answers | Interview preparation |
| **Skill Gap Analyzer** | Identifies missing skills for target roles | Career planning |
| **LinkedIn Optimizer** | Improves LinkedIn profile content for recruiter visibility | Profile optimization |
| **Job Matching** | Calculates fit percentage between resume and job posting | Job evaluation |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built UI components |
| Framer Motion | Animations and transitions |
| React Router | Client-side routing |
| TanStack Query | Server state management |
| Recharts | Data visualization |

### Backend (Supabase)
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database |
| Row Level Security | Data access control |
| Edge Functions | Serverless API endpoints |
| Authentication | User identity management |
| Storage | File uploads and management |

### Integrations
| Service | Purpose |
|---------|---------|
| Stripe | Payment processing |
| OpenAI | AI-powered features |
| html2pdf.js | Client-side PDF generation |
| docx | Word document generation |

---

## 📁 Project Structure

```
vaylance/
├── public/                          # Static assets
│   ├── favicon.png                  # Browser tab icon
│   ├── og-image.png                 # Social media preview
│   ├── robots.txt                   # Search engine directives
│   ├── sitemap.xml                  # SEO sitemap
│   └── templates/                   # Template preview images
│
├── src/
│   ├── assets/                      # Images, logos, icons
│   │
│   ├── components/
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── resume-engine/       # Resume analysis tools
│   │   │   └── vault/               # Career data vault components
│   │   ├── templates/               # Resume template renderers
│   │   └── ui/                      # shadcn UI components
│   │
│   ├── contexts/                    # React contexts
│   │   └── SubscriptionContext.tsx  # Subscription state management
│   │
│   ├── data/                        # Static data and samples
│   │   └── sampleResumes.ts         # Demo resume content
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   ├── use-toast.ts             # Toast notifications
│   │   └── useSubscriptionLimits.ts # Usage limit checks
│   │
│   ├── integrations/
│   │   └── supabase/                # Supabase client and types
│   │
│   ├── lib/                         # Utilities and configs
│   │   ├── stripe.ts                # Stripe checkout helpers
│   │   ├── tierConfig.ts            # Subscription tier definitions
│   │   └── utils.ts                 # General utility functions
│   │
│   ├── pages/                       # Route page components
│   │   ├── Index.tsx                # Homepage
│   │   ├── Dashboard.tsx            # Main app interface
│   │   ├── Auth.tsx                 # Authentication
│   │   ├── ResumeEditor.tsx         # Resume editing
│   │   └── ...                      # Other pages
│   │
│   └── types/                       # TypeScript type definitions
│       └── resume.ts                # Resume data structures
│
├── supabase/
│   ├── functions/                   # Edge functions
│   │   ├── analyze-resume-ats/      # ATS compatibility analysis
│   │   ├── analyze-resume-match/    # Job match calculation
│   │   ├── analyze-skill-gap/       # Skill gap identification
│   │   ├── generate-cover-letter/   # AI cover letter creation
│   │   ├── generate-resume-content/ # AI resume generation
│   │   ├── interview-feedback/      # Interview answer analysis
│   │   ├── rewrite-bullet/          # Bullet point enhancement
│   │   ├── create-checkout/         # Stripe checkout session
│   │   ├── stripe-webhook/          # Payment event handling
│   │   └── customer-portal/         # Billing portal access
│   │
│   └── migrations/                  # Database schema migrations
│
└── index.html                       # App entry point
```

---

## ⚡ Edge Functions Reference

### AI Functions
| Function | Input | Output |
|----------|-------|--------|
| `analyze-resume-ats` | Resume content | ATS score, suggestions, keyword analysis |
| `analyze-resume-match` | Resume + job description | Match percentage, gaps, improvements |
| `analyze-skill-gap` | User skills + target role | Missing skills, resources, timeline |
| `generate-cover-letter` | Resume + job details | Personalized cover letter |
| `generate-resume-content` | Experience description | Formatted resume sections |
| `interview-feedback` | Question + answer | Score, feedback, improved version |
| `rewrite-bullet` | Original bullet | Enhanced achievement-focused bullet |
| `parse-resume-ai` | Uploaded file | Structured resume data |

### Payment Functions
| Function | Purpose |
|----------|---------|
| `create-checkout` | Create Stripe checkout session |
| `stripe-webhook` | Handle payment events |
| `customer-portal` | Open billing management |
| `check-subscription` | Verify user subscription status |

### Email Functions
| Function | Purpose |
|----------|---------|
| `send-welcome-email` | New user onboarding |
| `send-payment-confirmation` | Purchase receipts |
| `send-subscription-update` | Plan change notifications |
| `send-password-reset` | Password reset links |
| `send-contact-form` | Contact form submissions |

---

## 💳 Subscription Tiers

| Feature | Free | Pro ($12/mo) | Premium ($24/mo) |
|---------|------|--------------|------------------|
| Resumes | 3 | Unlimited | Unlimited |
| Templates | 2 Basic | All Templates | All + Premium |
| AI Generations | 5/month | 50/month | Unlimited |
| PDF Downloads | 3/month | Unlimited | Unlimited |
| ATS Analysis | Basic | Advanced | Advanced + History |
| Interview Prep | — | ✓ | ✓ |
| Priority Support | — | — | ✓ |
| Custom Branding | — | — | ✓ |

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase project

### Installation

```bash
# Clone repository
git clone <repository-url>
cd vaylance

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Edge function secrets (set in Supabase Dashboard):
- `OPENAI_API_KEY` - AI features
- `STRIPE_SECRET_KEY` - Payments
- `STRIPE_WEBHOOK_SECRET` - Payment webhooks

---

## 🚀 Deployment

### Vercel / Netlify (Recommended)
1. Connect your GitHub repository
2. Configure build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Custom Domain
1. Go to Project → Settings → Domains
2. Click "Connect Domain"
3. Follow DNS configuration steps

### Self-Hosting
```bash
# Build for production
npm run build

# Output in dist/ folder
# Deploy to any static host
```

---

## 🔒 Security Features

- **Transport Security**: All data encrypted via HTTPS
- **Row Level Security**: Database-level access control
- **Authentication**: Secure session management
- **Data Privacy**: No third-party data sharing
- **Infrastructure**: SOC 2 compliant (Supabase)
- **Payment Security**: PCI-compliant (Stripe)

---

## 📞 Support

- **Email**: support@vaylance.com
- **Documentation**: In-app `/documentation` route
- **FAQ**: Available in app footer

---

Built with ❤️ by the Vaylance Team
