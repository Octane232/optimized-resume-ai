import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentConfirmationRequest {
  email: string;
  name: string;
  amount: number;
  planName: string;
  invoiceNumber: string;
  billingCycle: string;
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

    const { email, name, amount, planName, invoiceNumber, billingCycle }: PaymentConfirmationRequest = await req.json();

    if (!email || !amount || !planName) {
      return new Response(
        JSON.stringify({ error: "Email, amount, and plan name are required" }),
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .invoice-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
            .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .invoice-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Successful!</h1>
            </div>
            <div class="content">
              <p>Hi ${name || "there"},</p>
              <p>Thank you for your payment! Your subscription has been confirmed.</p>
              
              <div class="invoice-box">
                <h3>Invoice Details</h3>
                <div class="invoice-row">
                  <span>Invoice Number:</span>
                  <span>${invoiceNumber || "N/A"}</span>
                </div>
                <div class="invoice-row">
                  <span>Plan:</span>
                  <span>${planName}</span>
                </div>
                <div class="invoice-row">
                  <span>Billing Cycle:</span>
                  <span>${billingCycle || "Monthly"}</span>
                </div>
                <div class="invoice-row">
                  <span>Amount Paid:</span>
                  <span>$${amount.toFixed(2)}</span>
                </div>
              </div>

              <p>Your subscription is now active and you have full access to all premium features!</p>

              <p style="text-align: center;">
                <a href="https://vaylance.com/dashboard" class="button">Go to Dashboard</a>
              </p>

              <p>If you have any questions about your subscription, feel free to contact our support team.</p>

              <p>Best regards,<br>The Vaylance Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vaylance. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendZeptoMail(zeptoKey, "noreply@vaylance.com", email, `Payment Confirmed - ${planName} Plan`, htmlContent);

    console.log("Payment confirmation email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Payment confirmation email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending payment confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
