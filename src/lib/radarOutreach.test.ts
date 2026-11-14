import { describe, expect, test } from 'bun:test';
import { buildSignalPitches, contactSearches, opportunityNotes, signalEvent } from './radarOutreach';

const signal = { id: 'signal-1', company_name: 'Vencora', source_url: 'https://example.org/release', description: 'Vencora acquired CT InsureTech, which serves insurers.', company_size: 'large', industry: 'Insurance technology' };

describe('Radar outreach evidence', () => {
  test('retains the acquired company in the event', () => {
    expect(signalEvent(signal)).toBe('the CT InsureTech acquisition');
  });
  test('requires a genuine strength instead of inventing Python skills', () => {
    expect(() => buildSignalPitches(signal, 'Software Developer', '', '')).toThrow();
    const draft = buildSignalPitches(signal, 'Software Developer ', 'Java and claims-system integrations', '');
    expect(draft.dm).toContain('Java and claims-system integrations');
    expect(draft.dm).not.toContain('Python');
  });
  test('does not state hiring as confirmed', () => {
    expect(buildSignalPitches(signal, 'Developer', 'API integrations', '').dm).toContain('if this creates opportunities');
  });
  test('provides three occupation-specific contact searches', () => {
    const contacts = contactSearches(signal, 'Teacher');
    expect(contacts).toHaveLength(3);
    expect(contacts[0].title).toBe('Head of Department');
    expect(contacts[2].title).toBe('Headteacher');
  });
  test('small software companies use a technical founder, not a VP', () => {
    expect(contactSearches({ ...signal, company_size: '11-50' }, 'Software Developer')[2].title).toBe('Technical Founder');
  });
  test('saves source and edited drafts without a dependency on live alerts', () => {
    const drafts = buildSignalPitches(signal, 'Developer', 'Java', '');
    drafts.dm = 'My edited LinkedIn pitch';
    const notes = opportunityNotes(signal, 'Developer', drafts, 'CTO', 'My previous notes');
    expect(notes).toContain('https://example.org/release');
    expect(notes).toContain('CT InsureTech acquisition');
    expect(notes).toContain('My edited LinkedIn pitch');
    expect(notes).toContain('My previous notes');
    expect(opportunityNotes(signal, 'Developer', drafts, 'CTO', notes).match(/--- Radar opportunity ---/g)).toHaveLength(1);
  });
});