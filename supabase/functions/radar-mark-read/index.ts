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
    const body = await req.json();
    const { alertId, markAllRead } = body;
    if (markAllRead) {
      const { error } = await supabase.from("radar_alerts").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, action: "marked_all_read" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!alertId) return new Response(JSON.stringify({ error: "alertId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { error } = await supabase.from("radar_alerts").update({ is_read: true }).eq("id", alertId).eq("user_id", user.id);
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, action: "marked_read", alertId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});