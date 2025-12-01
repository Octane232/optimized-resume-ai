import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Check,
  ExternalLink,
  Wallet,
  Calendar,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateError) throw affiliateError;

      if (affiliate.status !== 'approved') {
        navigate('/affiliate-program');
        return;
      }

      setAffiliateData(affiliate);

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (referralsError) throw referralsError;
      setReferrals(referralsData || []);

      // Fetch commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commissions')
        .select('*')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (commissionsError) throw commissionsError;
      setCommissions(commissionsData || []);

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('*')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (payoutsError) throw payoutsError;
      setPayouts(payoutsData || []);

    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load affiliate data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${affiliateData?.affiliate_code}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (amount > affiliateData.available_balance) {
      toast({
        title: 'Error',
        description: 'Amount exceeds available balance',
        variant: 'destructive'
      });
      return;
    }

    setSubmittingPayout(true);
    try {
      const { error } = await supabase
        .from('payouts')
        .insert({
          affiliate_id: affiliateData.id,
          amount: amount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Payout Requested',
        description: 'Your payout request has been submitted for processing',
      });

      setShowPayoutDialog(false);
      setPayoutAmount('');
      fetchAffiliateData();
    } catch (error: any) {
      console.error('Error requesting payout:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to request payout',
        variant: 'destructive'
      });
    } finally {
      setSubmittingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 py-12 px-4">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-pink-700 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
            Affiliate Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your earnings and manage your affiliate account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">${affiliateData?.total_earnings?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold">${affiliateData?.available_balance?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold">{affiliateData?.total_referrals || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Share this link to earn {affiliateData?.commission_rate}% commission on every sale
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={getReferralLink()} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button onClick={copyReferralLink} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payout Section */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Request Payout</CardTitle>
              <Button 
                onClick={() => setShowPayoutDialog(true)}
                disabled={!affiliateData?.available_balance || affiliateData.available_balance <= 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No payout requests yet
                </p>
              ) : (
                payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">${parseFloat(payout.amount).toFixed(2)}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(new Date(payout.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge 
                      className={
                        payout.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        payout.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        payout.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }
                    >
                      {payout.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Referrals */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referrals.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No referrals yet. Start sharing your link!
                  </p>
                ) : (
                  referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">
                          {referral.converted ? '✓ Converted' : 'Click'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {referral.converted && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                          Converted
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Commissions */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Recent Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissions.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No commissions earned yet
                  </p>
                ) : (
                  commissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium">${parseFloat(commission.amount).toFixed(2)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {commission.description || 'Commission earned'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(commission.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        {commission.commission_rate}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Enter the amount you'd like to withdraw from your available balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Available Balance: ${affiliateData?.available_balance?.toFixed(2) || '0.00'}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max={affiliateData?.available_balance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <Button 
              onClick={handleRequestPayout}
              disabled={submittingPayout}
              className="w-full"
            >
              {submittingPayout ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateDashboard;
