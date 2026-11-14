import { supabase } from '@/integrations/supabase/client';
import { clean, opportunityNotes, type OutreachSignal, type OutreachDrafts } from './radarOutreach';

export async function saveRadarOpportunity(signal: OutreachSignal, role: string, drafts?: OutreachDrafts, contact?: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Please sign in again.');
  const target = clean(role || signal.likely_roles?.[0] || 'Target role');
  const escapePattern = (value: string) => value.replace(/[\\%_]/g, '\\$&');
  const { data: existing, error: lookupError } = await supabase.from('job_applications')
    .select('id, notes').eq('user_id', user.id)
    .ilike('company_name', escapePattern(clean(signal.company_name)))
    .ilike('job_title', escapePattern(target)).limit(1).maybeSingle();
  if (lookupError) throw lookupError;
  // A quick save must not erase previously edited pitches.
  if (existing && !drafts) return existing.id;
  const notes = opportunityNotes(signal, target, drafts, contact, existing?.notes);
  if (existing) {
    const { error } = await supabase.from('job_applications').update({ notes }).eq('id', existing.id).eq('user_id', user.id);
    if (error) throw error;
    return existing.id;
  }
  const { data, error } = await supabase.from('job_applications').insert({
    user_id: user.id, company_name: clean(signal.company_name), job_title: target,
    job_url: signal.source_url, location: signal.location || null, status: 'saved', notes,
  }).select('id').single();
  if (error) throw error;
  return data.id;
}