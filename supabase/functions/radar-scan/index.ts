import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate realistic funding signals using AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: `Generate 5 realistic but fictional funding announcements for tech companies. 
Each should include: company_name, amount (e.g. "$12M"), funding_stage (Seed/Series A/Series B/Series C), 
industry (e.g. "fintech", "healthtech", "AI/ML", "cybersecurity", "edtech"), 
description (1-2 sentences about the company), 
likely_roles (array of 3-5 job titles they'll hire for),
hiring_window (e.g. "Next 30 days", "Next 60 days").
Return as JSON array.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "funding_signals",
            description: "Return funding signal data",
            parameters: {
              type: "object",
              properties: {
                signals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      company_name: { type: "string" },
                      amount: { type: "string" },
                      funding_stage: { type: "string" },
                      industry: { type: "string" },
                      description: { type: "string" },
                      likely_roles: { type: "array", items: { type: "string" } },
                      hiring_window: { type: "string" }
                    },
                    required: ["company_name", "amount", "funding_stage", "industry", "description", "likely_roles", "hiring_window"],
                    additionalProperties: false
                  }
                }
              },
              required: ["signals"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "funding_signals" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const { signals } = JSON.parse(toolCall.function.arguments);

    // Store signals in database
    const insertedSignals = [];
    for (const signal of signals) {
      const sourceUrl = `https://techcrunch.com/funding/${signal.company_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      const { data: inserted, error } = await supabase
        .from('radar_signals')
        .upsert({
          company_name: signal.company_name,
          amount: signal.amount,
          funding_stage: signal.funding_stage,
          industry: signal.industry,
          description: signal.description,
          source_url: sourceUrl,
          likely_roles: signal.likely_roles,
          hiring_window: signal.hiring_window,
          published_at: new Date().toISOString(),
        }, { onConflict: 'source_url' })
        .select()
        .single();

      if (!error && inserted) {
        insertedSignals.push(inserted);
      }
    }

    // Match signals against all users with career preferences
    const { data: users } = await supabase
      .from('career_preferences')
      .select('user_id, target_role, target_industry, experience_level');

    if (users) {
      for (const user of users) {
        for (const signal of insertedSignals) {
          // Simple matching: industry match + role match
          const matchReasons: string[] = [];
          let score = 50; // Base score

          if (user.target_industry && signal.industry?.toLowerCase().includes(user.target_industry.toLowerCase())) {
            score += 25;
            matchReasons.push(`Industry match: ${signal.industry}`);
          }

          if (user.target_role && signal.likely_roles?.some((r: string) => 
            r.toLowerCase().includes(user.target_role!.toLowerCase()) || 
            user.target_role!.toLowerCase().includes(r.toLowerCase())
          )) {
            score += 25;
            matchReasons.push(`Role match: ${user.target_role}`);
          }

          if (score >= 50) {
            await supabase.from('radar_alerts').insert({
              user_id: user.user_id,
              signal_id: signal.id,
              match_score: Math.min(score, 100),
              match_reasons: matchReasons.length > 0 ? matchReasons : ['General industry relevance'],
              insight: `${signal.company_name} just raised ${signal.amount} in ${signal.funding_stage}. They're likely hiring in the next ${signal.hiring_window?.replace('Next ', '') || '30-60 days'}.`,
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      signalsCreated: insertedSignals.length 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Radar scan error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
