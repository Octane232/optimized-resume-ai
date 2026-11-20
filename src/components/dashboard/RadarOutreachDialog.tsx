import { useState } from 'react';
import { Copy, ExternalLink, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { buildSignalPitches, contactSearches, emailCandidates, mailtoUrl, type OutreachSignal, type OutreachDrafts } from '@/lib/radarOutreach';
import { saveRadarOpportunity } from '@/lib/saveRadarOpportunity';

export default function RadarOutreachDialog({ signal, targetRole, open, onOpenChange, onSaved }: {
  signal: OutreachSignal; targetRole?: string | null; open: boolean;
  onOpenChange: (open: boolean) => void; onSaved: () => void;
}) {
  const { toast } = useToast();
  const [role, setRole] = useState((targetRole || signal.likely_roles?.[0] || '').trim());
  const [strength, setStrength] = useState('');
  const [name, setName] = useState('');
  const [drafts, setDrafts] = useState<OutreachDrafts | null>(null);
  const [selected, setSelected] = useState(0);
  const [saving, setSaving] = useState(false);
  const contacts = contactSearches(signal, role);
  const emails = emailCandidates(signal.company_domain, name);
  const [toEmail, setToEmail] = useState('');
  const recipient = toEmail || emails.patterns[0] || emails.inboxes[0] || '';
  const update = (field: 'dm' | 'email' | 'subject' | 'headline', value: string) => setDrafts(d => d ? { ...d, [field]: value } : d);
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); toast({ title: 'Copied' }); }
    catch { toast({ title: 'Could not copy', description: 'Select and copy the text manually.', variant: 'destructive' }); }
  };
  const generate = () => {
    try { setDrafts(buildSignalPitches(signal, role, strength, name)); }
    catch (error) { toast({ title: 'Add your details', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' }); }
  };
  const save = async () => {
    if (!drafts) return;
    setSaving(true);
    try {
      await saveRadarOpportunity(signal, role, drafts, contacts[selected]?.title);
      onSaved(); toast({ title: 'Pitch saved to Mission Control' });
    } catch (error) { toast({ title: 'Could not save', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' }); }
    finally { setSaving(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
      <DialogHeader><DialogTitle>Outreach to {signal.company_name}</DialogTitle></DialogHeader>
      <a href={signal.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary inline-flex items-center gap-2 break-all"><ExternalLink className="h-4 w-4 shrink-0" />View news source</a>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium space-y-1">Target role<Input value={role} onChange={e => { setRole(e.target.value); setDrafts(null); }} /></label>
        <label className="text-sm font-medium space-y-1">Recipient name (optional)<Input value={name} onChange={e => setName(e.target.value)} /></label>
      </div>
      <label className="text-sm font-medium space-y-1">One genuine skill or achievement<Textarea value={strength} onChange={e => setStrength(e.target.value)} rows={2} maxLength={600} /></label>
      <Button onClick={generate} disabled={!role.trim() || !strength.trim()}>{drafts ? 'Regenerate pitches' : 'Create pitches'}</Button>
      <p className="text-xs text-muted-foreground">Possible contacts · search results, not verified people</p>
      <div className="grid gap-2 sm:grid-cols-3">{contacts.map((contact, index) => <Button key={contact.category} variant={selected === index ? 'default' : 'outline'} className="h-auto min-h-16 whitespace-normal flex-col items-start text-left" onClick={() => setSelected(index)}><span className="text-xs">{contact.category}</span><span>{contact.title}</span></Button>)}</div>
      <Button variant="outline" className="gap-2" onClick={() => window.open(contacts[selected]?.url, '_blank', 'noopener,noreferrer')}><ExternalLink className="h-4 w-4" />Search LinkedIn</Button>
      {drafts && <>
        <label className="text-sm font-medium space-y-1">Connection note<Textarea rows={3} value={drafts.notes[selected] || ''} onChange={e => { const value = e.target.value; setDrafts(d => d ? { ...d, notes: d.notes.map((note, i) => i === selected ? value : note) } : d); }} /></label>
        <Button variant="outline" className="gap-2" onClick={() => copy(drafts.notes[selected] || '')}><Copy className="h-4 w-4" />Copy connection note</Button>
        <Tabs defaultValue="dm"><TabsList className="w-full"><TabsTrigger value="dm">LinkedIn DM</TabsTrigger><TabsTrigger value="email">Cold email</TabsTrigger><TabsTrigger value="headline">Profile snippet</TabsTrigger></TabsList>
          <TabsContent value="dm" className="space-y-2"><Textarea aria-label="LinkedIn DM" rows={6} value={drafts.dm} onChange={e => update('dm', e.target.value)} /><Button variant="outline" className="gap-2" onClick={() => copy(drafts.dm)}><Copy className="h-4 w-4" />Copy DM</Button></TabsContent>
          <TabsContent value="email" className="space-y-2"><Input aria-label="Email subject" value={drafts.subject} onChange={e => update('subject', e.target.value)} /><Textarea aria-label="Cold email" rows={7} value={drafts.email} onChange={e => update('email', e.target.value)} /><Button variant="outline" className="gap-2" onClick={() => copy(`Subject: ${drafts.subject}\n\n${drafts.email}`)}><Copy className="h-4 w-4" />Copy email</Button></TabsContent>
          <TabsContent value="headline" className="space-y-2"><Textarea aria-label="Profile snippet" rows={3} value={drafts.headline} onChange={e => update('headline', e.target.value)} /><Button variant="outline" className="gap-2" onClick={() => copy(drafts.headline)}><Copy className="h-4 w-4" />Copy snippet</Button></TabsContent>
        </Tabs>

        <div className="rounded-lg border border-border p-3 space-y-2">
          <p className="text-sm font-medium">Email them directly</p>
          {emails.inboxes.length === 0 ? <p className="text-xs text-muted-foreground">No company website found, so we can't suggest an email. Use LinkedIn above.</p> : <>
            <p className="text-xs text-muted-foreground">{emails.patterns.length ? 'Likely addresses from the common company formats, plus their hiring inboxes. Not verified, so the first may bounce.' : 'Add the recipient name above to see their likely personal address. Hiring inboxes:'}</p>
            <div className="flex flex-wrap gap-2">{[...emails.patterns, ...emails.inboxes].map(e => <Button key={e} size="sm" variant={recipient === e ? 'default' : 'outline'} className="h-auto py-1 break-all" onClick={() => setToEmail(e)}>{e}</Button>)}</div>
            <Input aria-label="Send to" value={recipient} onChange={e => setToEmail(e.target.value)} />
            <Button className="gap-2" disabled={!recipient} onClick={() => { window.location.href = mailtoUrl(recipient, drafts.subject, drafts.email); }}><Mail className="h-4 w-4" />Send email</Button>
          </>}
        </div>
        <Button disabled={saving} className="gap-2" onClick={save}><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save pitch to Mission Control'}</Button>
      </>}
    </DialogContent>
  </Dialog>;
}