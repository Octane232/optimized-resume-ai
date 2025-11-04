import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number | null
          price_yearly: number | null
          features: any
          is_popular: boolean
          icon_name: string | null
          color_class: string | null
          lemon_squeezy_variant_id: string | null
        }
        Insert: {
          name: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          features?: any
          is_popular?: boolean
          icon_name?: string | null
          color_class?: string | null
          lemon_squeezy_variant_id?: string | null
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify secret token for security
    const { secret } = await req.json().catch(() => ({}));
    const expectedSecret = Deno.env.get('SEED_SECRET');
    
    if (!expectedSecret || secret !== expectedSecret) {
      console.error('Unauthorized seed attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if plans already exist
    const { data: existingPlans } = await supabase
      .from('subscription_plans')
      .select('id')
      .limit(1)

    if (existingPlans && existingPlans.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Plans already seeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Insert plans
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for getting started',
        price_monthly: 0,
        price_yearly: 0,
        features: ['3 resumes max', 'Basic templates', 'Standard support', 'PDF export'],
        is_popular: false,
        icon_name: 'Shield',
        color_class: 'from-slate-500 to-slate-600',
        lemon_squeezy_variant_id: null
      },
      {
        name: 'Pitchsora Pro',
        description: 'Best for professionals',
        price_monthly: 9,
        price_yearly: null,
        features: ['Unlimited resumes', 'All premium templates', 'Priority support', 'AI-powered suggestions', 'Multiple exports (PDF, Word)', 'Custom branding'],
        is_popular: true,
        icon_name: 'Sparkles',
        color_class: 'from-blue-500 to-purple-600',
        lemon_squeezy_variant_id: '1065978'
      },
      {
        name: 'Pitchsora Pro Yearly',
        description: 'Best for professionals - Save 17%',
        price_monthly: null,
        price_yearly: 90,
        features: ['Unlimited resumes', 'All premium templates', 'Priority support', 'AI-powered suggestions', 'Multiple exports (PDF, Word)', 'Custom branding'],
        is_popular: true,
        icon_name: 'Sparkles',
        color_class: 'from-blue-500 to-purple-600',
        lemon_squeezy_variant_id: '1065979'
      },
      {
        name: 'Pitchsora Premium',
        description: 'For power users',
        price_monthly: 19.99,
        price_yearly: null,
        features: ['Everything in Pro', 'Advanced AI features', 'Cover letter generator', 'Interview preparation', 'Job matching', 'Resume analytics', 'Dedicated account manager', 'API access'],
        is_popular: false,
        icon_name: 'Crown',
        color_class: 'from-purple-500 to-pink-600',
        lemon_squeezy_variant_id: '1065981'
      },
      {
        name: 'Pitchsora Premium Yearly',
        description: 'For power users - Save 20%',
        price_monthly: null,
        price_yearly: 199.99,
        features: ['Everything in Pro', 'Advanced AI features', 'Cover letter generator', 'Interview preparation', 'Job matching', 'Resume analytics', 'Dedicated account manager', 'API access'],
        is_popular: false,
        icon_name: 'Crown',
        color_class: 'from-purple-500 to-pink-600',
        lemon_squeezy_variant_id: '1065987'
      }
    ]

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(plans)
      .select()

    if (error) {
      console.error('Error inserting plans:', error)
      throw error
    }

    console.log('Successfully seeded subscription plans:', data)

    return new Response(
      JSON.stringify({ message: 'Plans seeded successfully', data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
