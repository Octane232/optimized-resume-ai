import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { variantId } = await req.json()

    if (!variantId) {
      throw new Error('Variant ID is required')
    }

    console.log('Creating checkout for variant:', variantId, 'user:', user.id)

    // Create checkout using Lemon Squeezy API
    const lemonSqueezyApiKey = Deno.env.get('LEMON_SQUEEZY_API_KEY')
    const storeId = Deno.env.get('LEMON_SQUEEZY_STORE_ID')

    if (!lemonSqueezyApiKey || !storeId) {
      throw new Error('Lemon Squeezy credentials not configured')
    }

    const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lemonSqueezyApiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
              desc: true,
              discount: true,
              dark: false,
              subscription_preview: true,
              button_color: '#7C3AED'
            },
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id
              }
            },
            expires_at: null,
            preview: false,
            test_mode: false
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId.toString()
              }
            }
          }
        }
      })
    })

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text()
      console.error('Lemon Squeezy API error:', errorText)
      throw new Error(`Failed to create checkout: ${errorText}`)
    }

    const checkoutData = await checkoutResponse.json()
    const checkoutUrl = checkoutData.data.attributes.url

    console.log('Checkout URL created:', checkoutUrl)

    return new Response(
      JSON.stringify({ url: checkoutUrl }),
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