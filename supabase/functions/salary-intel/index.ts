import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, requireUser, enforceQuota, recordUsage } from "../_shared/requireUser.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = await requireUser(req);
    if (auth instanceof Response) return auth;
    const overQuota = await enforceQuota(auth, "salary_intel");
    if (overQuota) return overQuota;

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const { jobTitle, company, location, yearsExperience, currentSalary } = await req.json();
    if (!jobTitle) throw new Error("jobTitle is required");

    const [benchmarkRes, negotiationRes] = await Promise.all([
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: `You are a compensation analyst providing general market estimates. Be conservative and realistic — do not invent specific internal data.

Job Title: ${jobTitle}
Company: ${company || "not specified"}
Location: ${location || "United States"}
Years of Experience: ${yearsExperience || "not specified"}

Return exactly this JSON:
{
  "title": "exact job title",
  "location": "location used",
  "salaryRange": { "low": 0, "median": 0, "high": 0 },
  "totalCompRange": { "low": 0, "median": 0, "high": 0 },
  "breakdown": { "baseSalary": 0, "bonus": 0, "equity": "e.g. $0-50K/yr or N/A", "benefits": "e.g. ~$15K/yr" },
  "marketDemand": "High or Medium or Low",
  "demandReason": "one sentence",
  "topPayingCompanies": ["co1","co2","co3","co4","co5"],
  "salaryFactors": ["factor1","factor2","factor3"],
  "isUnderpaid": ${currentSalary ? `true or false vs median` : "null"},
  "underpaidBy": ${currentSalary ? "number or 0" : "null"}
}` }]
        }),
      }).then(r => r.json()),

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: `Write 3 salary negotiation scripts for a ${jobTitle}${company ? ` at ${company}` : ""}${location ? ` in ${location}` : ""}.

Return exactly this JSON:
{
  "scripts": [
    { "style": "Confident", "label": "Direct and assertive", "opening": "line", "body": "2-3 sentences", "closing": "line" },
    { "style": "Collaborative", "label": "Win-win framing", "opening": "line", "body": "2-3 sentences", "closing": "line" },
    { "style": "Data-driven", "label": "Lead with market data", "opening": "line", "body": "2-3 sentences", "closing": "line" }
  ],
  "keyTips": ["tip1","tip2","tip3"],
  "counterOfferAdvice": "one paragraph",
  "timingAdvice": "one sentence"
}` }]
        }),
      }).then(r => r.json()),
    ]);

    const benchmark = JSON.parse(benchmarkRes.choices?.[0]?.message?.content || "{}");
    const negotiation = JSON.parse(negotiationRes.choices?.[0]?.message?.content || "{}");

    // Always include disclaimer and verification links
    const disclaimer = "⚠️ These figures are AI-generated estimates based on general market knowledge. Always verify with real salary data sources before negotiating.";
    const verificationLinks = [
      { label: "Glassdoor", url: "https://www.glassdoor.com/Salaries/index.htm" },
      { label: "Levels.fyi", url: "https://www.levels.fyi" },
      { label: "LinkedIn Salary", url: "https://www.linkedin.com/salary/" },
      { label: "Payscale", url: "https://www.payscale.com" },
    ];

    return new Response(JSON.stringify({ success: true, benchmark, negotiation, disclaimer, verificationLinks }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("salary-intel error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
