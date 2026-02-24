import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionUpdateRequest {
  email: string;
  name: string;
  updateType: "upgrade" | "downgrade" | "cancel" | "renew";
  oldPlan?: string;
  newPlan?: string;
  effectiveDate?: string;
}

async function sendZeptoMail(apiKey: string, from: string, to: string, subject: string, htmlBody: string) {
  const res = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
    body: JSON.stringify({
      from: { address: from, name: "Vaylance" },
      to: [{ email_address: { address: to } }],
      subject,
      htmlbody: htmlBody,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`ZeptoMail error ${res.status}: ${errBody}`);
  }
  return res.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, updateType, oldPlan, newPlan, effectiveDate }: SubscriptionUpdateRequest = await req.json();

    if (!email || !updateType) {
      return new Response(
        JSON.stringify({ error: "Email and update type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const zeptoKey = Deno.env.get("ZEPTOMAIL_API_KEY");

    if (!zeptoKey) {
      console.error("Missing ZeptoMail API key");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updateMessages = {
      upgrade: {
        title: "Subscription Upgraded! 🎉",
        message: `You've upgraded from ${oldPlan || "your previous plan"} to ${newPlan}!`,
        color: "#10b981"
      },
      downgrade: {
        title: "Subscription Changed",
        message: `Your plan has been changed from ${oldPlan || "your previous plan"} to ${newPlan}.`,
        color: "#f59e0b"
      },
      cancel: {
        title: "Subscription Cancelled",
        message: `Your ${oldPlan || "subscription"} has been cancelled. You'll have access until ${effectiveDate || "the end of your billing period"}.`,
        color: "#ef4444"
      },
      renew: {
        title: "Subscription Renewed! 🎉",
        message: `Your ${newPlan || "subscription"} has been successfully renewed!`,
        color: "#10b981"
      }
    };

    const updateInfo = updateMessages[updateType];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${updateInfo.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${updateInfo.color}; }
            .button { display: inline-block; background: ${updateInfo.color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${updateInfo.title}</h1>
            </div>
            <div class="content">
              <p>Hi ${name || "there"},</p>
              
              <div class="info-box">
                <p>${updateInfo.message}</p>
                ${effectiveDate ? `<p><strong>Effective Date:</strong> ${effectiveDate}</p>` : ""}
              </div>

              ${updateType === "cancel" ? `
                <p>We're sorry to see you go! If you change your mind, you can reactivate your subscription anytime before ${effectiveDate || "the end of your billing period"}.</p>
              ` : `
                <p>Thank you for continuing to use Vaylance to advance your career!</p>
              `}

              <p style="text-align: center;">
                <a href="https://vaylance.com/dashboard/billing" class="button">View Billing Details</a>
              </p>

              <p>If you have any questions, our support team is here to help.</p>

              <p>Best regards,<br>The Vaylance Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vaylance. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendZeptoMail(zeptoKey, "noreply@vaylance.com", email, `${updateInfo.title} - Vaylance`, htmlContent);

    console.log("Subscription update email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Subscription update email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending subscription update email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
