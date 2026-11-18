export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  sections: { heading: string; paragraphs: string[] }[];
  sources?: { label: string; url: string; note?: string }[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'predicting-hiring-from-company-news',
    title: 'I tried to predict hiring from company news. Most of the signal was noise.',
    category: 'Engineering',
    description: 'What happened when I asked an LLM whether press releases meant a company was about to hire, what outside data says about the lead time, and where the approach still fails.',
    readTime: '7 min read',
    sections: [
      { heading: 'Why look before the job post', paragraphs: [
        'Public job listings fill up fast. In mid-2025 LinkedIn told the New York Times it was receiving about 11,000 applications a minute, up more than 45% in a year [2]. LinkedIn’s own 2026 research says US applicants per open role have doubled since spring 2022 [1]. One remote Scrum Master listing I checked showed 938 applicants, 99 of them in the past day.',
        'Companies usually hire after something happens: a funding round closes, a large contract is signed, a new executive arrives. Those events often reach the news before they reach a job board. Published estimates of that gap range from about five to about nine weeks, so I set out to see how much of it could be detected automatically. This post covers what I built, what outside data says, and where it still fails.'
      ] },
      { heading: 'The naive version', paragraphs: [
        'My first prototype pulled RSS feeds and press releases, then asked an LLM a single question per article: does this suggest the company is about to hire?',
        'It flagged almost everything. Awards, rebrands and anniversary posts all read as momentum, and the model rewarded tone instead of substance. A press release is written to sound like growth, so asking a model whether it sounds like growth tells you very little.'
      ] },
      { heading: 'Three frames instead of one question', paragraphs: [
        'Rather than asking the model to guess in isolation, I grouped articles into candidate frames and discarded everything else. Outside research gives context for them, but none of it proves them, so treat them as hypotheses:',
        '1. Concrete capital deployment. Articles that say what money will be spent on (a new market, infrastructure, headcount) rather than only announcing the money. Funding does tend to precede hiring, but the effect is modest once you control for normal growth (see below).',
        '2. Leadership changes. A new head of engineering or product may precede team growth. Research shows senior-team turnover rises when an outsider becomes CEO [5], but that measures departures, not hiring.',
        '3. Specific operational constraints. Quotes about a real bottleneck, such as compliance in a new market or a deployment backlog, rather than vision statements. I found no outside source on this one.'
      ] },
      { heading: 'The pipeline', paragraphs: [
        'Stage 1, deduplication and entity resolution: drop syndicated reprints so one press release on twenty sites counts once, and map name variants to a single company.',
        'Stage 2, frame classification: discard PR, awards and vanity milestones; keep articles that fit one of the three frames.',
        'Stage 3, role inference: map the trigger to departments and roles that plausibly follow it, then match against a user’s saved role, location and work style.',
        'Every published signal keeps a link to its original source and its date, and the hiring language is deliberately hedged: a signal is a reason to research a company, not evidence that a vacancy exists.'
      ] },
      { heading: 'What outside data says about lead time', paragraphs: [
        'The gap between a trigger and a job post looks real, but published estimates disagree, and the most detailed ones come from companies that sell hiring-signal data. I treat them as context, not proof.',
        'Funding to first hire: about five weeks. Signalbase looked at 474 startups funded in 2026. Among the 107 where it detected a staffing signal, the median lag from announcement to first observable hire was 35 days, and 47% moved within 30 days [3]. Caveats: a small sample, a vendor, and most of those first signals were LinkedIn job changes rather than job posts.',
        'Funding to first posting: about nine weeks, with a weak effect. Employbl tracked Greenhouse, Lever and Ashby boards. Among companies that posted after a raise, the median gap to the first new posting was 62 days, and 28% of rounds had no new postings at all in the six months around the announcement. With a control group, post-raise posting growth was +58% against +51% in the same companies’ no-raise quarters [4].',
        'Listings are already old when you see them. SeekerScore found a median posting age of 28 days the first time a posting is seen, across about 50,000 postings [6]. That measures age on boards, not lag from a trigger, but it explains why being early matters.',
        'The Employbl result is the one to take seriously: a naive before-and-after comparison made funding look far more predictive than it was. Any honest evaluation of a system like this has to compare flagged companies against a baseline of unflagged ones, so you see the lift over normal hiring. That evaluation is the next thing I am building, and I will publish the numbers whether or not they flatter the product.'
      ] },
      { heading: 'What still doesn’t work', paragraphs: [
        'The hardest case is acquisitions and restructuring. Press releases about a merger use the same growth language as a genuine expansion, even when the reality is a hiring freeze or layoffs. Separating organic expansion from consolidation is what I am working on now; for now, acquisition signals are labelled as possibly leading to hiring rather than stated as fact.',
        'Leadership-change signals are similarly unproven. Until there is data showing hiring follows executive appointments, they stay a hypothesis in the ranking.'
      ] },
      { heading: 'Try it', paragraphs: [
        'The output runs as a live feed in Vaylance, free to browse during the beta without an account.',
        'I would especially like feedback on one question: how would you build a ground truth for lead time when job posts are often removed, reposted or never published at all?'
      ] }
    ],
    sources: [
      { label: 'LinkedIn Research: Talent 2026', url: 'https://news.linkedin.com/2026/LinkedIn-Research-Talent-2026', note: 'US applicants per open role doubled since spring 2022.' },
      { label: 'Semafor, June 24, 2025', url: 'https://www.semafor.com/article/06/24/2025/recruiters-swamped-with-ai-generated-job-applications', note: '11,000 LinkedIn applications per minute, up 45%, as reported by the New York Times.' },
      { label: 'Signalbase: Is the fundraising signal still useful in 2026?', url: 'https://www.trysignalbase.com/article/is-the-fundraising-signal-still-useful-in-2026', note: 'Vendor analysis of funding-to-hire lag.' },
      { label: 'Employbl: post-raise hiring spike with a control group', url: 'https://www.employbl.com/blog/post-raise-hiring-spike-control-group', note: 'Vendor analysis of funding rounds against job postings.' },
      { label: 'Stanford GSB: new CEOs and executive turnover', url: 'https://www.gsb.stanford.edu/news/research/hr_ceos.shtml', note: 'Senior-team turnover after outsider CEO appointments.' },
      { label: 'SeekerScore: job posting age', url: 'https://www.seekerscore.com/insights/job-posting-age-two-clocks-2026', note: 'Median age of postings when first seen.' },
      { label: 'Chicago Booth BFI: venture capital and startup growth', url: 'https://bfi.uchicago.edu/insight/research-summary/synergizing-ventures', note: 'Background: VC-funded startups grow employment faster.' }
    ]
  },
  {
    slug: 'find-hiring-signals-before-job-postings',
    title: 'How to spot hiring signals before a job is posted',
    category: 'Job search',
    description: 'Expansion, funding and contract wins can point to opportunity. Here’s how to separate a useful lead from a hopeful guess.',
    readTime: '4 min read',
    sections: [
      { heading: 'Start with the business event, not the prediction', paragraphs: ['A company opening a new office, winning a contract or raising funding may need additional people. None of those events guarantees hiring. Acquisitions can also lead to consolidation or layoffs, and funding may go toward costs other than recruitment.', 'Treat a business signal as a reason to research a company, not as evidence that a specific vacancy exists.'] },
      { heading: 'Check the original source', paragraphs: ['Look for the company announcement, an official contract award or a dated release. Confirm the company name, what actually happened and when it happened. A republished story is not necessarily a new event.', 'Then check the company’s careers page. A live vacancy and an early hiring-intent signal are different kinds of evidence; keep that distinction clear.'] },
      { heading: 'Connect the event to your actual role', paragraphs: ['Ask what work the event could create. A new software product may call for engineering or customer support; a distribution centre may need operations staff. A healthcare expansion is not automatically a strong lead for a software developer.', 'Check location, remote eligibility and seniority separately. “Remote” does not always mean you can work from any country. If the announcement does not specify eligibility, leave that question open.'] },
      { heading: 'Make a small, specific next move', paragraphs: ['If the evidence fits, identify the relevant team and send a short message referencing the actual event. Mention one genuine skill or accomplishment that could help, and ask whether the team expects to need support.', 'Record the source, your message and any reply. Judge the method by useful conversations and interviews over time—not by a prediction score alone.'] },
    ],
  },
  {
    slug: 'tailor-your-resume-without-inventing-experience',
    title: 'Tailor your resume without inventing experience',
    category: 'Resume & ATS',
    description: 'Make your relevant experience easier to find while keeping every claim honest and your document readable.',
    readTime: '3 min read',
    sections: [
      { heading: 'Separate relevance from keyword overlap', paragraphs: ['An ATS keyword match asks whether your resume uses the language in the job description. A relevance review asks whether your actual experience demonstrates the work. Both matter, but they are not the same thing.', 'A high score is not a promise of an interview. Use feedback to identify unclear evidence and missing terminology, rather than trying to maximise a number at any cost.'] },
      { heading: 'Use the employer’s language where it is accurate', paragraphs: ['Read the responsibilities and identify the skills you genuinely have. Where a job description uses a standard term for work you already did, use that term naturally in your resume.', 'Do not add a technology, qualification or responsibility you have not held. If you lack a requirement, acknowledge the gap and emphasise relevant transferable experience instead.'] },
      { heading: 'Rewrite evidence, not your history', paragraphs: ['Choose the accomplishments most relevant to the role. Explain the action you took and the result, using numbers only when you can support them.', 'Review any AI-generated edits line by line. Keep your dates, employer names, qualifications and claims accurate. You are responsible for the final document.'] },
      { heading: 'Inspect the exported document', paragraphs: ['Check headings, page breaks, spacing and whether the text remains selectable in the PDF. Open the final DOCX or PDF before sending it; a preview alone may not reveal every layout issue.', 'Follow the employer’s requested file format. Keep an editable copy so you can make careful changes for the next application.'] },
    ],
  },
  {
    slug: 'write-outreach-that-starts-a-conversation',
    title: 'Write outreach that starts a real conversation',
    category: 'Outreach',
    description: 'A relevant event, one genuine strength and a clear question are better than a long, generic introduction.',
    readTime: '3 min read',
    sections: [
      { heading: 'Show why you chose this company', paragraphs: ['Reference a specific, verified event rather than saying you admire the company. Name the product launch, expansion or contract and explain why it relates to the team you want to contact.', 'Avoid saying the company is hiring unless you have confirmed a vacancy. “I wondered whether this expansion might create a need for…” leaves room for an honest answer.'] },
      { heading: 'Offer one genuine strength', paragraphs: ['Choose a skill or achievement you can back up. Connect it to the possible work rather than listing every tool you know.', 'For example, if you genuinely built API integrations, describe that experience and why it may help the team. Do not copy another person’s skills into your own message.'] },
      { heading: 'Ask a question that is easy to answer', paragraphs: ['Keep the message short and ask whether the team expects relevant openings or who would be the appropriate person to contact. Avoid demanding a referral or attaching several documents without context.', 'Use professional contact channels and respect the recipient’s privacy. A public profile is not an invitation to repeated unsolicited messages.'] },
      { heading: 'Track the reply, not just the send', paragraphs: ['Save the company, source, date and exact message so a follow-up stays consistent. If you follow up, be brief and add useful context rather than sending the same pitch again.', 'If the recipient declines or asks not to be contacted, stop. The goal is a relevant conversation, not maximum message volume.'] },
    ],
  },
];