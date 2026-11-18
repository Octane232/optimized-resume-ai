export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export const blogArticles: BlogArticle[] = [
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