export interface OutreachSignal {
  id: string;
  company_name: string;
  source_url: string;
  description?: string | null;
  signal_type?: string | null;
  company_size?: string | null;
  industry?: string | null;
  location?: string | null;
  amount?: string | null;
  published_at?: string | null;
  likely_roles?: string[] | null;
}

export const clean = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/\s+,/g, ',');

export function signalEvent(signal: OutreachSignal): string {
  const description = clean(signal.description || '');
  const acquisition = description.match(/\bacquir(?:ed|es|ing)\s+([A-Z][\w&.-]*(?:\s+[A-Z][\w&.-]*)*)/);
  if (acquisition) return `the ${acquisition[1]} acquisition`;
  // Retain event details rather than reducing every expansion/contract to “recent news”.
  if (description) return description.split(/(?<=[.!?])\s+/)[0].replace(/[.!?]$/, '');
  return `${signal.company_name}'s ${signal.amount ? `${signal.amount} ` : ''}${signal.signal_type?.toLowerCase() || 'business announcement'}`;
}

export function contactSearches(signal: OutreachSignal, role: string) {
  const r = role.toLowerCase();
  const small = /\b(small|startup|seed|1-10|11-50)\b/i.test(signal.company_size || '');
  let department = 'Department Head';
  let senior = small ? 'Founder' : 'Operations Director';
  if (/software|developer|engineer|data/.test(r)) { department = 'Engineering Manager'; senior = small ? 'Technical Founder' : 'CTO'; }
  else if (/teach|school|educat/.test(r)) { department = 'Head of Department'; senior = 'Headteacher'; }
  else if (/nurs|health|doctor|clinical/.test(r)) { department = 'Clinical Lead'; senior = 'Clinical Director'; }
  else if (/sales|business development/.test(r)) { department = 'Head of Sales'; senior = small ? 'Founder' : 'Commercial Director'; }
  else if (/market|content/.test(r)) { department = 'Marketing Manager'; senior = small ? 'Founder' : 'Marketing Director'; }
  else if (/logistic|warehouse|supply|operat/.test(r)) { department = 'Operations Manager'; }
  else if (/financ|account/.test(r)) { department = 'Finance Manager'; senior = small ? 'Founder' : 'Finance Director'; }
  return [
    { category: 'Department leader', title: department },
    { category: 'Talent lead', title: small ? 'People Lead' : 'Talent Acquisition Manager' },
    { category: 'Senior leader', title: senior },
  ].map(contact => ({ ...contact, url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${signal.company_name} ${contact.title}`)}` }));
}

export interface OutreachDrafts { dm: string; email: string; subject: string; headline: string; notes: string[] }

export function buildSignalPitches(signal: OutreachSignal, role: string, strength: string, name: string): OutreachDrafts {
  const event = signalEvent(signal);
  const target = clean(role);
  const genuine = clean(strength);
  if (!target || !genuine) throw new Error('Add a target role and one genuine strength first.');
  const greeting = clean(name) ? `Hi ${clean(name)},` : 'Hello,';
  const opening = `I saw the news about ${event}.`;
  const value = `As a ${target}, I bring ${genuine}; if this creates opportunities, I would love to discuss where I could contribute.`;
  const ask = 'Would you be open to a brief conversation?';
  return {
    dm: `${opening} ${value} ${ask}`,
    subject: `${target} — ${signal.company_name}`,
    email: `${greeting}\n\n${opening}\n${value}\n${ask}`,
    headline: `${target} | ${genuine} | Interested in ${signal.industry || 'growing teams'}`,
    notes: contactSearches(signal, target).map(() => `${opening} I work as a ${target} and would welcome connecting with your team.`),
  };
}

const marker = '\n--- Radar opportunity ---\n';
export function opportunityNotes(signal: OutreachSignal, role: string, drafts?: OutreachDrafts, contact?: string, previous?: string | null) {
  const existing = (previous || '').split(marker)[0];
  return `${existing}${marker}${[
    `Signal ID: ${signal.id}`, `Company: ${signal.company_name}`, `Target role: ${clean(role)}`,
    `Event: ${signalEvent(signal)}`, `Source: ${signal.source_url}`,
    signal.published_at && `Published: ${signal.published_at}`,
    signal.description && `News: ${signal.description}`,
    'Hiring is inferred, not confirmed.', contact && `Contact search: ${contact}`,
    drafts && `LinkedIn DM:\n${drafts.dm}`,
    drafts && `Email subject: ${drafts.subject}\nEmail:\n${drafts.email}`,
    drafts && `Profile snippet:\n${drafts.headline}`,
    drafts && `Connection notes:\n${drafts.notes.join('\n\n')}`,
  ].filter(Boolean).join('\n\n')}`;
}