import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  message: z.string().trim().min(10, "Message too short").max(1000, "Message too long")
});

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
    const body = await req.json();
    const validated = contactFormSchema.parse(body);
    const { firstName, lastName, email, message } = validated;

    console.log("Processing contact form submission:", { firstName, lastName, email });

    const zeptoKey = Deno.env.get("ZEPTOMAIL_API_KEY");
    const zohoEmail = Deno.env.get("ZOHO_EMAIL");

    if (!zeptoKey || !zohoEmail) {
      console.error("ZeptoMail credentials not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; margin-top: 5px; }
          .message-box { background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${firstName} ${lastName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendZeptoMail(
      zeptoKey,
      zohoEmail,
      "contact@vaylance.com",
      `New Contact Form Submission from ${firstName} ${lastName}`,
      htmlContent
    );

    console.log("Contact form email sent successfully");

    return new Response(
      JSON.stringify({ message: "Your message has been sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-contact-form function:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send message" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
