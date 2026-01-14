# PitchVaya

**Land Your Dream Job Faster & Smarter**

PitchVaya is a comprehensive AI-powered career platform that helps job seekers build ATS-optimized resumes, discover matching jobs, track applications, and get personalized AI coaching — all in one place.

---

## 🚀 Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Resume Builder** | Professional templates with real-time ATS scoring and drag-and-drop editing |
| **Job Scout** | Discover jobs matched to your skills, experience, and career goals |
| **Mission Control** | Track every application status, deadlines, and follow-ups in one dashboard |
| **Master Vault** | Store your career data, skills, achievements, and certifications |

### AI-Powered Features (Vaya AI)

| Feature | Description |
|---------|-------------|
| **AI Resume Generator** | Generate complete resume sections based on your experience |
| **Resume Optimizer** | Get instant suggestions to improve your ATS match rate |
| **Cover Letter Generator** | Create tailored cover letters for any job posting |
| **Interview Prep** | Practice with AI feedback on your answers |
| **Skill Gap Analysis** | See what skills you need for your target role |
| **Bullet Rewriter** | Transform weak bullet points into impactful achievements |
| **LinkedIn Optimizer** | Optimize your LinkedIn profile for recruiters |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Recharts** - Data visualization

### Backend (Supabase)
- **PostgreSQL** - Database
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless API
- **Authentication** - Email/password & OAuth

### Integrations
- **Stripe** - Payment processing
- **OpenAI** - AI features
- **html2pdf.js** - PDF generation

---

## 📁 Project Structure

```
pitchvaya/
├── public/                    # Static assets
│   ├── favicon.png
│   ├── og-image.png
│   └── templates/             # Template previews
├── src/
│   ├── assets/                # Images & logos
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── resume-engine/ # Resume analysis tools
│   │   │   └── vault/         # Career vault components
│   │   ├── templates/         # Resume template renderers
│   │   └── ui/                # shadcn UI components
│   ├── contexts/              # React contexts (Subscription)
│   ├── data/                  # Static data & samples
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/
│   │   └── supabase/          # Supabase client & types
│   ├── lib/                   # Utilities & configs
│   │   ├── stripe.ts          # Stripe integration
│   │   ├── tierConfig.ts      # Subscription tiers
│   │   └── utils.ts           # Helper functions
│   ├── pages/                 # Route pages
│   └── types/                 # TypeScript types
├── supabase/
│   ├── functions/             # Edge functions
│   │   ├── analyze-resume-ats/
│   │   ├── analyze-resume-match/
│   │   ├── analyze-skill-gap/
│   │   ├── generate-cover-letter/
│   │   ├── generate-resume-content/
│   │   ├── interview-feedback/
│   │   ├── rewrite-bullet/
│   │   └── ...
│   └── migrations/            # Database migrations
└── index.html
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun
- Supabase project (for backend)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pitchvaya

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For edge functions, set these in Supabase Dashboard:
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

---

## 💳 Subscription Tiers

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 3 resumes, 2 templates, 5 AI generations/month, 3 PDF downloads/month |
| **Pro** | $12/mo | Unlimited resumes, All templates, 50 AI generations/month, Unlimited downloads |
| **Premium** | $24/mo | Everything in Pro + Priority support, Advanced analytics, Custom branding |

---

## ⚡ Edge Functions

| Function | Description |
|----------|-------------|
| `analyze-resume-ats` | Analyzes resume for ATS compatibility |
| `analyze-resume-match` | Calculates job match percentage |
| `analyze-skill-gap` | Identifies missing skills for target role |
| `generate-cover-letter` | Creates tailored cover letters |
| `generate-resume-content` | AI-generates resume sections |
| `interview-feedback` | Provides feedback on interview answers |
| `rewrite-bullet` | Rewrites bullet points for impact |
| `create-checkout` | Creates Stripe checkout session |
| `stripe-webhook` | Handles Stripe payment events |
| `customer-portal` | Opens Stripe billing portal |

---

## 🚀 Deployment

### Lovable (Recommended)

1. Open [Lovable](https://lovable.dev)
2. Click **Publish** button
3. Your app is live!

### Custom Domain

1. Go to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow DNS setup instructions

### Self-Hosting

The app can be deployed to any static hosting:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 🔒 Security

- All data encrypted in transit (HTTPS) and at rest
- Row Level Security (RLS) on all database tables
- User data never shared with third parties
- SOC 2 compliant infrastructure (Supabase)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

- **Email**: support@pitchvaya.com
- **Documentation**: `/documentation` route in app
- **FAQ**: Available in the app footer

---

Built with ❤️ by the PitchVaya Team
