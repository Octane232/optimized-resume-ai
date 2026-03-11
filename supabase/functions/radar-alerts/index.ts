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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const unreadOnly = url.searchParams.get("unread") === "true";
    const industry = url.searchParams.get("industry") || null;
    let query = supabase.from("radar_alerts").select(`id, match_score, match_reasons, insight, is_read, created_at, radar_signals (id, company_name, amount, funding_stage, industry, description, likely_roles, hiring_window, source_url, published_at)`).eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit);
    if (unreadOnly) query = query.eq("is_read", false);
    const { data: alerts, error: alertsError } = await query;
    if (alertsError) throw alertsError;
    const filteredAlerts = industry && industry !== "all" ? (alerts || []).filter((a: any) => a.radar_signals?.industry?.toLowerCase() === industry.toLowerCase()) : alerts || [];
    const { count: unreadCount } = await supabase.from("radar_alerts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false);
    const industryCounts: Record<string, number> = {};
    for (const alert of (alerts || [])) {
      const ind = (alert as any).radar_signals?.industry;
      if (ind) industryCounts[ind] = (industryCounts[ind] || 0) + 1;
    }
    const { data: lastSignal } = await supabase.from("radar_signals").select("created_at").order("created_at", { ascending: false }).limit(1).single();
    return new Response(JSON.stringify({ alerts: filteredAlerts, unreadCount: unreadCount || 0, totalCount: (alerts || []).length, industryCounts, lastScanAt: lastSignal?.created_at || null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});