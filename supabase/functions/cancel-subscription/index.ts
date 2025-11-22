import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Cancelling subscription for user:', user.id);

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('lemon_squeezy_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription?.lemon_squeezy_subscription_id) {
      throw new Error('No active subscription found');
    }

    const lemonSqueezyApiKey = Deno.env.get('LEMON_SQUEEZY_API_KEY');
    if (!lemonSqueezyApiKey) {
      throw new Error('Lemon Squeezy API key not configured');
    }

    // Cancel subscription via Lemon Squeezy API
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscription.lemon_squeezy_subscription_id}`,
      {
        method: 'PATCH',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${lemonSqueezyApiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: 'subscriptions',
            id: subscription.lemon_squeezy_subscription_id,
            attributes: {
              cancelled: true,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Lemon Squeezy API error:', error);
      throw new Error('Failed to cancel subscription');
    }

    const result = await response.json();
    console.log('Subscription cancelled successfully:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription cancelled successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};

serve(handler);
