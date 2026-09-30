# Vaylance

**Your AI Career Coach — ATS scoring, hidden job discovery, and interview coaching in one place.**

Vaylance helps job seekers get hired faster: score and rewrite a resume against a real job description, uncover companies that are hiring before they post, generate cover letters, prep for interviews, and track every application.

---

## Product Modes

Vaylance is a single **Hunter** workspace (the previous "Growth Mode" placeholder was removed). Everything lives inside `/dashboard`, with **Job Radar** as the flagship feature.

---

## Feature Map

### Job Radar (Scout) — flagship
Finds hiring signals *before* jobs are posted, across **all industries** (tech, healthcare, logistics, retail, energy, finance, education, hospitality…).

- Scans cross-industry news and Google News / trade RSS feeds (funding, expansion, new offices, contracts)
- AI resolves the real company, likely roles, location, and company size
- AI matches each signal against the user's saved career preferences and returns a **% match**
- Rich intel per signal: **Why now**, **Likely roles**, **Outreach angle**, **Confidence**
- "Find Hiring Contact" deep-links to a LinkedIn people search for that company
- Backed by `radar_signals` + `radar_alerts` (the old `scouted_jobs` table is deprecated)

### Resume + ATS
The former "Resume Engine" — renamed because it is a scanner/optimizer, not a template builder.

- Upload **PDF, DOCX or TXT**, or paste raw text
- Structured AI parsing into a normalized resume schema
- **Multi-layered scoring** (not keyword-only):
  - **50%** Semantic match — AI understanding of role fit
  - **30%** Skills / experience overlap
  - **20%** Exact ATS keyword hits
- 4-step flow: **Extract → Compare → Score → Explain** (strengths, missing keywords, prioritized fixes with example text)
- **In-place DOCX rewrite**: the AI edits the uploaded `.docx` via JSZip so the user's original template and formatting are preserved — offered as an opt-in prompt after analysis
- Export as PDF (high fidelity) or DOCX (ATS-friendly structure)


### Other tools
| Tool | What it does |
|------|--------------|
| AI Cover Letter | Tailored cover letters from resume + job description |
| Interview Coach | Question bank, AI feedback, and Live Coach Mode (Elite) |
| Skill Gap Analyzer | Gaps between current skills and a target role |
| LinkedIn Optimizer | Headline + summary rewriting (Gemini) |
| Salary Intelligence | Compensation benchmarks and negotiation scripts |
| Mission Control | Kanban application tracker with stale-application flags |
| Career Wins / Streaks | XP, daily streaks, application goals |

---

## Pages

**Public:** `/` (landing), `/auth`, `/for-individuals`, `/for-students`, `/about-us`, `/contact`, `/documentation`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`

**Authenticated:** `/dashboard` (Briefing, Job Radar, Job Search, Resume + ATS, Cover Letter, Interview Coach, Skill Gap, LinkedIn, Mission Control, Billing, Settings), `/reset-password`

The affiliate program pages were removed.

---

## Plans & Quotas

There is **no in-app free trial** — trials, if any, are handled entirely by Stripe. Unpaid accounts sit on `free` (all feature limits `0`) and hit a paywall on every tool.

| | Free | Pro — $15/mo | Elite — $29/mo |
|---|---|---|---|
| Job Searches | 0 | 50 | 120 |
| Bullet Rewrites | 0 | 75 | 300 |
| Resume + ATS runs | 0 | 30 | 100 |
| Cover Letters | 0 | 30 | 100 |
| LinkedIn Optimizations | 0 | 15 | 50 |
| Skill Gap Analyses | 0 | 15 | 50 |
| Interview Prep sessions | 0 | 30 | 100 |
| Salary Insights | 0 | 10 | 30 |
| Job Radar Alerts | 0 | 15 | 50 |
| DOCX Rewrites | 0 | 10 | 50 |
| Resume Uploads | 0 | 100 | 500 |
| Priority Support | — | ✓ | ✓ |
| ATS Resume Review | — | — | ✓ |
| Live Coach Mode | — | — | ✓ |

### How quotas work
The system uses **per-feature monthly quotas** (not a shared credit wallet).

- Limits live in `plan_feature_limits` and `supabase/functions/_shared/tierLimits.ts`
- Usage is counted in `user_usage` and incremented by the `increment_usage` RPC, which enforces the rolling 30-day window **and** `current_period_end` — an expired subscription silently falls back to `free` limits
- Enforcement is **server-side only**, inside edge functions (`requireUser.ts` → `getEffectiveUsage()` / `enforceQuota()`), so the client cannot bypass it
- The UI mirrors the same numbers via `src/contexts/UsageLimitContext.tsx`
- Over-quota responses surface as friendly toasts through `src/lib/edgeError.ts`

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, React Router, TanStack Query, Recharts
**Backend:** Supabase (Postgres + RLS, Auth incl. Google OAuth, Edge Functions, Storage)
**AI:** `gpt-4o-mini` for chat, scoring, and rewriting; `gemini-2.5-flash` for resume parsing and the LinkedIn optimizer
**Payments:** Stripe only (live mode), with webhook-driven subscription sync
**Email:** Zoho ZeptoMail REST API (SMTP ports are blocked in the runtime)

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/            # Scout, ResumeEngine, MissionControl, …
│   │   ├── resume-engine/    # Parser, MatchingEngine, ExportPanel, suggestions
│   │   ├── billing/          # PricingCards, UsageHeader, PaidManagement, FAQ
│   │   ├── NewSidebar.tsx    # Job Radar highlighted, rest under "Tools"
│   │   ├── MobileNav.tsx     # Bottom tab bar (<768px)
│   │   └── PaywallGate.tsx   # Blocks free-tier access
│   └── …                     # Landing sections, Header, Footer, SEOHead
├── contexts/                 # SubscriptionContext, UsageLimitContext
├── hooks/                    # use-toast (canonical import), useSubscriptionLimits
├── integrations/supabase/    # client + generated types
├── lib/                      # edgeError, tierConfig, utils
└── pages/                    # Index, Dashboard, Auth, legal & marketing pages

supabase/
├── functions/
│   ├── _shared/              # cors, requireUser (auth + quota), tierLimits
│   ├── analyze-resume-match/ # Multi-layer ATS scoring
│   ├── parse-resume-ai/      # Gemini structured parsing
│   ├── parse-resume-file/    # PDF / DOCX / TXT extraction
│   ├── rewrite-docx/         # In-place DOCX rewriting (JSZip)
│   ├── rewrite-bullet/       # Achievement-focused bullet rewrites
│   ├── generate-resume-content/
│   ├── analyze-skill-gap/  interview-feedback/  optimize-linkedin/
│   ├── salary-intel/  apply-bundle/
│   ├── radar-scan/  radar-alerts/  radar-mark-read/
│   └── stripe-checkout/  stripe-webhook/  stripe-customer-portal/  check-subscription/
└── migrations/
```

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:8080
```

Client env (`.env`, publishable values only):

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Server secrets live **only** in Supabase edge function secrets — never in the repo:
`OPENAI_API_KEY`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ZEPTOMAIL_TOKEN`, `NEWS_API_KEY`.

---

## Design System

Strict semantic tokens only (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, …) defined in `src/index.css` and `tailwind.config.ts`. Hardcoded colors like `text-white` or `bg-[#hex]` are not allowed in components.

**Mobile-first:** every landing section uses reduced mobile padding and scaled typography; the dashboard swaps the desktop sidebar for `MobileNav` below 768px.

Import toasts from `@/hooks/use-toast` — never from `@/components/ui/use-toast`.

---

## Security

- Row Level Security on every user-facing table, with `GRANT`s issued per role
- Roles stored in a dedicated `user_roles` table and checked via a `security definer` `has_role()` function
- Quota enforcement and credit-sensitive writes happen server-side in edge functions
- Stripe handles all card data (PCI); no payment details touch the app database

---

## Support

- **Email:** support@vaylance.com
- **Contact form:** `/contact` (routes to `contact@` via ZeptoMail)
- **Docs:** `/documentation`

---

Built by the Vaylance team.
