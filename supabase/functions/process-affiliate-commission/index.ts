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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, subscriptionId, amount } = await req.json()

    console.log('Processing affiliate commission:', { userId, subscriptionId, amount })

    if (!userId || !subscriptionId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Find if this user was referred
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('id, affiliate_id, converted')
      .eq('referred_user_id', userId)
      .eq('converted', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (referralError) {
      console.error('Error finding referral:', referralError)
      throw referralError
    }

    if (!referral) {
      console.log('No unconverted referral found for user')
      return new Response(
        JSON.stringify({ success: true, message: 'No referral to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get affiliate details
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, commission_rate, total_earnings, available_balance, total_referrals')
      .eq('id', referral.affiliate_id)
      .single()

    if (affiliateError) {
      console.error('Error fetching affiliate:', affiliateError)
      throw affiliateError
    }

    // Calculate commission
    const commissionAmount = (parseFloat(amount) * affiliate.commission_rate) / 100

    console.log('Commission calculated:', { commissionAmount, rate: affiliate.commission_rate })

    // Create commission record
    const { error: commissionError } = await supabase
      .from('commissions')
      .insert({
        affiliate_id: affiliate.id,
        referral_id: referral.id,
        subscription_id: subscriptionId,
        amount: commissionAmount,
        commission_rate: affiliate.commission_rate,
        status: 'completed',
        description: `Commission from subscription purchase`
      })

    if (commissionError) {
      console.error('Error creating commission:', commissionError)
      throw commissionError
    }

    // Update referral as converted
    const { error: updateReferralError } = await supabase
      .from('referrals')
      .update({ 
        converted: true,
        converted_at: new Date().toISOString()
      })
      .eq('id', referral.id)

    if (updateReferralError) {
      console.error('Error updating referral:', updateReferralError)
      throw updateReferralError
    }

    // Update affiliate stats
    const { error: updateAffiliateError } = await supabase
      .from('affiliates')
      .update({
        total_earnings: parseFloat(affiliate.total_earnings) + commissionAmount,
        available_balance: parseFloat(affiliate.available_balance) + commissionAmount,
        total_referrals: affiliate.total_referrals + 1
      })
      .eq('id', affiliate.id)

    if (updateAffiliateError) {
      console.error('Error updating affiliate:', updateAffiliateError)
      throw updateAffiliateError
    }

    console.log('Commission processed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        commission: commissionAmount,
        affiliateId: affiliate.id
      }),
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
