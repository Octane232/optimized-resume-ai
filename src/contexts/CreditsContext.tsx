import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CreditsContextType {
  balance: number;
  loading: boolean;
  spendCredit: (action: string, description?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setBalance(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('[Credits] Error fetching balance:', error);
      } else if (data) {
        setBalance(data.balance);
      } else {
        // No row yet - create one with default 5 credits
        const { data: newRow, error: insertError } = await supabase
          .from('user_credits')
          .insert({ user_id: session.user.id, balance: 5, monthly_allowance: 5 })
          .select('balance')
          .single();
        
        if (!insertError && newRow) {
          setBalance(newRow.balance);
        }
      }
    } catch (error) {
      console.error('[Credits] Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchBalance();
      } else if (event === 'SIGNED_OUT') {
        setBalance(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchBalance]);

  const spendCredit = async (action: string, description?: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      // Use the atomic DB function
      const { data, error } = await supabase.rpc('spend_credit', {
        p_user_id: session.user.id,
        p_action: action,
        p_description: description || null,
      });

      if (error) {
        console.error('[Credits] Error spending credit:', error);
        return false;
      }

      if (data === true) {
        setBalance(prev => Math.max(0, prev - 1));
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Credits] Spend error:', error);
      return false;
    }
  };

  return (
    <CreditsContext.Provider value={{ balance, loading, spendCredit, refresh: fetchBalance }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};
