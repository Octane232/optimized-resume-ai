import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ===== Constants =====
const DEFAULT_LIMIT = 50;

// ===== Helper Functions =====
const createErrorResponse = (message: string, status: number = 500): Response => {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
};

const createSuccessResponse = (data: any): Response => {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
};

const getSupabaseClient = () => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase not configured");
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
};

const authenticateUser = async (supabase: any, authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No authorization header");
  }
  
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    throw new Error("Unauthorized");
  }
  
  return user;
};

const parseQueryParams = (url: URL) => {
  return {
    limit: parseInt(url.searchParams.get("limit") || String(DEFAULT_LIMIT)),
    unreadOnly: url.searchParams.get("unread") === "true",
    industry: url.searchParams.get("industry") || null,
  };
};

// ===== Alert Handlers =====
const fetchAlerts = async (supabase: any, userId: string, limit: number, unreadOnly: boolean) => {
  let query = supabase
    .from("radar_alerts")
    .select("id, signal_id, match_score, match_reasons, insight, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (unreadOnly) {
    query = query.eq("is_read", false);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data || [];
};

const fetchSignalsByIds = async (supabase: any, signalIds: string[]) => {
  if (signalIds.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("radar_signals")
    .select("id, company_name, amount, funding_stage, industry, description, likely_roles, hiring_window, source_url, published_at, created_at")
    .in("id", signalIds);
  
  if (error) throw error;
  return data || [];
};

const fetchAllSignals = async (supabase: any, limit: number) => {
  const { data, error } = await supabase
    .from("radar_signals")
    .select("id, company_name, amount, funding_stage, industry, description, likely_roles, hiring_window, source_url, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

const getUnreadCount = async (supabase: any, userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("radar_alerts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  
  if (error) throw error;
  return count || 0;
};

const getLastScanDate = async (supabase: any): Promise<string | null> => {
  const { data, error } = await supabase
    .from("radar_signals")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) return null;
  return data.created_at;
};

// ===== Filtering Logic =====
const buildSignalMap = (signals: any[]): Map<string, any> => {
  return new Map(signals.map((signal) => [signal.id, signal]));
};

const enrichAlertsWithSignals = (alerts: any[], signalMap: Map<string, any>) => {
  return alerts
    .map((alert) => ({ ...alert, radar_signals: signalMap.get(alert.signal_id) || null }))
    .filter((alert) => alert.radar_signals);
};

const filterByIndustry = <T extends { radar_signals?: any; industry?: string }>(
  items: T[],
  industry: string | null,
  getIndustry: (item: T) => string | null
): T[] => {
  if (!industry || industry === "all") return items;
  
  return items.filter((item) => {
    const itemIndustry = getIndustry(item);
    return itemIndustry?.toLowerCase() === industry.toLowerCase();
  });
};

const calculateIndustryCounts = (signals: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  for (const signal of signals) {
    const industry = signal.industry;
    if (industry) {
      counts[industry] = (counts[industry] || 0) + 1;
    }
  }
  
  return counts;
};

// ===== Main Handler =====
const handleRadarAlerts = async (req: Request): Promise<Response> => {
  // Initialize Supabase client
  const supabase = getSupabaseClient();
  
  // Authenticate user
  const authHeader = req.headers.get("Authorization");
  const user = await authenticateUser(supabase, authHeader);
  
  // Parse query parameters
  const url = new URL(req.url);
  const { limit, unreadOnly, industry } = parseQueryParams(url);
  
  // Fetch alerts and signals in parallel
  const [alerts, allSignals] = await Promise.all([
    fetchAlerts(supabase, user.id, limit, unreadOnly),
    fetchAllSignals(supabase, limit),
  ]);
  
  // Fetch associated signals for alerts
  const signalIds = [...new Set(alerts.map((a: any) => a.signal_id).filter(Boolean))];
  const alertSignals = await fetchSignalsByIds(supabase, signalIds);
  const signalMap = buildSignalMap(alertSignals);
  
  // Enrich alerts with signal data
  let enrichedAlerts = enrichAlertsWithSignals(alerts, signalMap);
  
  // Apply industry filters
  const filteredAlerts = filterByIndustry(
    enrichedAlerts,
    industry,
    (alert) => alert.radar_signals?.industry
  );
  
  const filteredSignals = filterByIndustry(
    allSignals,
    industry,
    (signal) => signal.industry
  );
  
  // Get additional metadata
  const [unreadCount, lastScanAt, industryCounts] = await Promise.all([
    getUnreadCount(supabase, user.id),
    getLastScanDate(supabase),
    calculateIndustryCounts(filteredSignals),
  ]);
  
  // Return response
  return createSuccessResponse({
    alerts: filteredAlerts,
    signals: filteredSignals,
    unreadCount,
    totalCount: filteredAlerts.length,
    industryCounts,
    lastScanAt,
  });
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    return await handleRadarAlerts(req);
  } catch (error) {
    console.error("Radar alerts error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage === "Unauthorized" || errorMessage === "No authorization header" ? 401 : 500;
    return createErrorResponse(errorMessage, status);
  }
});
