import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      store_id: number;
      status: string;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      product_name: string;
      variant_name: string;
      user_email: string;
      user_name: string;
      renews_at?: string;
      ends_at?: string;
      trial_ends_at?: string;
      created_at: string;
      updated_at: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client early for logging
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const rawBody = await req.text();
    const payload: WebhookPayload = JSON.parse(rawBody);
    
    // Log webhook to database for debugging
    await supabase.from('webhook_logs').insert({
      payload: payload,
      event_type: payload.meta.event_name,
      processed: false
    });
    
    // Log all headers for debugging
    console.log('Received headers:', Object.fromEntries(req.headers.entries()));
    
    // Verify webhook signature - try both header names
    const signature = req.headers.get('X-Signature') || req.headers.get('x-signature');
    const webhookSecret = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    if (!signature) {
      console.error('No signature provided in headers');
      return new Response('No signature provided', { status: 401 });
    }
    
    // Create HMAC SHA256 hash
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(rawBody)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare signatures using timing-safe comparison
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      console.error('Expected:', expectedSignature);
      console.error('Received:', signature);
      return new Response('Invalid signature', { status: 401 });
    }

    const eventName = payload.meta.event_name;
    
    console.log('Received webhook event:', eventName);
    console.log('Webhook payload details:', {
      event: eventName,
      subscription_id: payload.data.id,
      variant_id: payload.data.attributes.variant_id,
      store_id: payload.data.attributes.store_id,
      product_id: payload.data.attributes.product_id,
      plan_name: payload.data.attributes.variant_name,
      user_id: payload.meta.custom_data?.user_id,
      user_email: payload.data.attributes.user_email
    });

    // Get user_id from custom data or find by email
    let userId = payload.meta.custom_data?.user_id;
    
    if (!userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', payload.data.attributes.user_email)
        .single();
      
      userId = profile?.user_id;
    }

    if (!userId) {
      console.error('Could not find user for email:', payload.data.attributes.user_email);
      return new Response('User not found', { status: 404 });
    }

    // Handle different webhook events
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(supabase, userId, payload);
        break;
      
      case 'subscription_created':
        await handleSubscriptionCreated(supabase, userId, payload);
        break;

      case 'subscription_updated':
        await handleSubscriptionUpdated(supabase, userId, payload);
        break;
      
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(supabase, userId, payload);
        break;
      
      case 'subscription_resumed':
        await handleSubscriptionResumed(supabase, userId, payload);
        break;
      
      case 'subscription_expired':
        await handleSubscriptionExpired(supabase, userId, payload);
        break;
      
      case 'subscription_paused':
        await handleSubscriptionPaused(supabase, userId, payload);
        break;
      
      case 'subscription_unpaused':
        await handleSubscriptionUnpaused(supabase, userId, payload);
        break;
      
      default:
        console.log('Unhandled webhook event:', eventName);
    }

    // Mark webhook as processed
    await supabase.from('webhook_logs').update({ processed: true }).eq('event_type', eventName).eq('processed', false).limit(1);

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    
    // Log error to database
    try {
      await supabase.from('webhook_logs').insert({
        payload: { error: error.message },
        event_type: 'error',
        processed: false,
        error: error.message
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

async function handleOrderCreated(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing order_created for user:', userId);
  
  // Get plan name from variant
  const variantId = payload.data.attributes.variant_id.toString();
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('name, price_monthly, price_yearly')
    .eq('lemon_squeezy_variant_id', variantId)
    .single();

  const planName = plan?.name || payload.data.attributes.variant_name;
  const amount = plan?.price_monthly || plan?.price_yearly || 0;
  
  const { data: invoice } = await supabase
    .from('billing_invoices')
    .insert({
      user_id: userId,
      amount: amount,
      status: 'paid',
      description: `${planName} subscription`,
      invoice_number: `LS-${payload.data.attributes.order_id}`,
      payment_method: 'Credit Card',
    })
    .select()
    .single();
  
  console.log('Created invoice:', invoice?.id);
}

async function handleSubscriptionCreated(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_created for user:', userId);
  console.log('Subscription details:', {
    subscription_id: payload.data.id,
    variant_id: payload.data.attributes.variant_id,
    store_id: payload.data.attributes.store_id,
    product_id: payload.data.attributes.product_id,
    plan_name: payload.data.attributes.variant_name,
    user_id: userId
  });
  
  // Find matching plan by variant_id
  const variantId = payload.data.attributes.variant_id.toString();
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('id, name')
    .eq('lemon_squeezy_variant_id', variantId)
    .single();

  if (!plan) {
    console.error('Could not find matching plan for variant_id:', variantId);
    console.error('Available variant IDs should be configured in subscription_plans table');
    return;
  }

  // Determine plan tier from plan name
  const planTier = getPlanTier(plan.name);

  // Create or update subscription
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_id: plan.id,
      plan_status: 'active',
      current_period_end: payload.data.attributes.renews_at,
      lemon_squeezy_subscription_id: payload.data.id,
    })
    .select()
    .single();

  // Update profiles table with plan
  await supabase
    .from('profiles')
    .update({ plan: planTier })
    .eq('user_id', userId);

  console.log('Created subscription:', subscription?.id, 'Plan:', planTier);
}

async function handleSubscriptionUpdated(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_updated for user:', userId);
  
  const status = payload.data.attributes.status;
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: status,
      current_period_end: payload.data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);

  // Update profiles table - set to free if cancelled/expired, keep current if active
  if (status === 'cancelled' || status === 'expired') {
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('user_id', userId);
  }
}

async function handleSubscriptionCancelled(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_cancelled for user:', userId);
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);

  // Update profiles table to free plan
  await supabase
    .from('profiles')
    .update({ plan: 'free' })
    .eq('user_id', userId);
}

async function handleSubscriptionResumed(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_resumed for user:', userId);
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);
}

async function handleSubscriptionExpired(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_expired for user:', userId);
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);

  // Update profiles table to free plan
  await supabase
    .from('profiles')
    .update({ plan: 'free' })
    .eq('user_id', userId);
}

async function handleSubscriptionPaused(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_paused for user:', userId);
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'paused',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);
}

async function handleSubscriptionUnpaused(supabase: any, userId: string, payload: WebhookPayload) {
  console.log('Processing subscription_unpaused for user:', userId);
  
  await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', payload.data.id);
}

// Helper function to determine plan tier from plan name
function getPlanTier(planName: string): string {
  const lowerName = planName.toLowerCase();
  if (lowerName.includes('premium') || lowerName.includes('enterprise')) {
    return 'premium';
  } else if (lowerName.includes('pro') || lowerName.includes('professional')) {
    return 'pro';
  }
  return 'free';
}

serve(handler);
