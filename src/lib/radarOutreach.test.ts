import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSignalPitches, contactSearches, opportunityNotes, signalEvent } from './radarOutreach';

const signal = { id: 'signal-1', company_name: 'Vencora', source_url: 'https://example.org/release', description: 'Vencora acquired CT InsureTech, which serves insurers.', company_size: 'large', industry: 'Insurance technology' };

describe('Radar outreach evidence', () => {
  test('retains the acquired company in the event', () => {
    assert.equal(signalEvent(signal), 'the CT InsureTech acquisition');
  });
  test('requires a genuine strength instead of inventing Python skills', () => {
    assert.throws(() => buildSignalPitches(signal, 'Software Developer', '', ''));
    const draft = buildSignalPitches(signal, 'Software Developer ', 'Java and claims-system integrations', '');
    assert.ok(draft.dm.includes('Java and claims-system integrations'));
    assert.ok(!draft.dm.includes('Python'));
  });
  test('does not state hiring as confirmed', () => {
    assert.ok(buildSignalPitches(signal, 'Developer', 'API integrations', '').dm.includes('if this creates opportunities'));
  });
  test('provides three occupation-specific contact searches', () => {
    const contacts = contactSearches(signal, 'Teacher');
    assert.equal(contacts.length, 3);
    assert.equal(contacts[0].title, 'Head of Department');
    assert.equal(contacts[2].title, 'Headteacher');
  });
  test('small software companies use a technical founder, not a VP', () => {
    assert.equal(contactSearches({ ...signal, company_size: '11-50' }, 'Software Developer')[2].title, 'Technical Founder');
  });
  test('saves source and edited drafts without a dependency on live alerts', () => {
    const drafts = buildSignalPitches(signal, 'Developer', 'Java', '');
    drafts.dm = 'My edited LinkedIn pitch';
    const notes = opportunityNotes(signal, 'Developer', drafts, 'CTO', 'My previous notes');
    assert.ok(notes.includes('https://example.org/release'));
    assert.ok(notes.includes('CT InsureTech acquisition'));
    assert.ok(notes.includes('My edited LinkedIn pitch'));
    assert.ok(notes.includes('My previous notes'));
    assert.equal(opportunityNotes(signal, 'Developer', drafts, 'CTO', notes).match(/--- Radar opportunity ---/g)?.length, 1);
  });
});
import { emailCandidates, hiringPrecedent, mailtoUrl } from './radarOutreach';
describe('Radar email reach', () => {
  test('builds first.last first, plus hiring inboxes', () => {
    const r = emailCandidates('https://www.Acme.com/about', 'Sarah Jenkins');
    assert.equal(r.patterns[0], 'sarah.jenkins@acme.com');
    assert.ok(r.inboxes.includes('careers@acme.com'));
  });
  test('no domain means no guessed emails', () => {
    assert.deepEqual(emailCandidates(null, 'Sarah Jenkins').patterns, []);
  });
  test('mailto keeps the address readable and encodes the body', () => {
    assert.ok(mailtoUrl('a@b.com', 'Hi there', 'x&y').startsWith('mailto:a@b.com?subject=Hi%20there&body=x%26y'));
  });
  test('acquisitions are flagged as weak hiring evidence', () => {
    assert.equal(hiringPrecedent('Acquisition').strength, 'weak');
    assert.equal(hiringPrecedent('Funding').strength, 'strong');
  });
});
