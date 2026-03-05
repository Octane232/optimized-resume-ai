import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Users, Copy, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Company {
  company_name: string;
  count: number;
}

const ReferralNetwork: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('job_applications')
        .select('company_name')
        .eq('user_id', user.id);

      if (data) {
        const grouped: Record<string, number> = {};
        data.forEach(d => {
          grouped[d.company_name] = (grouped[d.company_name] || 0) + 1;
        });
        setCompanies(Object.entries(grouped).map(([company_name, count]) => ({ company_name, count })));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const coldIntroMessage = (company: string) =>
    `Hi! I noticed you work at ${company}. I'm currently exploring opportunities there and would love to learn more about your experience. Would you be open to a brief chat?`;

  const copyMessage = (company: string) => {
    navigator.clipboard.writeText(coldIntroMessage(company));
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Referral Network</h2>
        <p className="text-muted-foreground text-sm mt-1">Your saved and applied companies</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No companies yet</p>
          <p className="text-sm mt-1">Apply to jobs in Mission Control to build your referral network.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {companies.map((c) => (
            <button
              key={c.company_name}
              onClick={() => setSelectedCompany(c.company_name)}
              className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">{c.company_name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.count} application{c.count > 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedCompany && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCompany}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Connections</h3>
                  <p className="text-sm text-muted-foreground">
                    LinkedIn connection scraping coming soon. You'll see 1st and 2nd degree connections here.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">AI Cold Intro Message</h3>
                  <div className="p-3 rounded-lg bg-muted text-sm text-foreground">
                    {coldIntroMessage(selectedCompany)}
                  </div>
                  <Button onClick={() => copyMessage(selectedCompany)} variant="outline" size="sm" className="mt-2 gap-2">
                    <Copy className="w-3.5 h-3.5" /> Copy Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReferralNetwork;
