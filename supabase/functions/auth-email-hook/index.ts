// Supabase Auth "Send Email" hook → branded emails via ZeptoMail REST API.
import { Webhook } from "npm:standardwebhooks@1.0.0";
import { sendZeptoMail } from "../_shared/zeptomail.ts";

interface HookPayload {
  user: { email: string; new_email?: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

const COPY: Record<string, { subject: string; eyebrow: string; title: string; body: string; cta: string }> = {
  signup: {
    subject: "Confirm your Vaylance account",
    eyebrow: "Account Activation",
    title: "Verify your email address",
    body: "Welcome to Vaylance. Confirm your email to start tracking early hiring signals, scoring your resume, and getting ahead of job postings.",
    cta: "Verify Email Address",
  },
  recovery: {
    subject: "Reset your Vaylance password",
    eyebrow: "Password Reset",
    title: "Reset your password",
    body: "We received a request to reset your password. Click the button below to choose a new one.",
    cta: "Reset Password",
  },
  magiclink: {
    subject: "Your Vaylance sign-in link",
    eyebrow: "Sign In",
    title: "Sign in to Vaylance",
    body: "Click the button below to sign in to your account.",
    cta: "Sign In",
  },
  invite: {
    subject: "You've been invited to Vaylance",
    eyebrow: "Invitation",
    title: "Join Vaylance",
    body: "You've been invited to create a Vaylance account. Click below to accept.",
    cta: "Accept Invite",
  },
  email_change: {
    subject: "Confirm your new email for Vaylance",
    eyebrow: "Email Change",
    title: "Confirm your new email",
    body: "Click the button below to confirm the change to your account email.",
    cta: "Confirm Email",
  },
  reauthentication: {
    subject: "Your Vaylance verification code",
    eyebrow: "Verification",
    title: "Confirm it's you",
    body: "Use the code below to confirm this action.",
    cta: "",
  },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderHtml(c: (typeof COPY)[string], url: string, token: string): string {
  const button = c.cta
    ? `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:8px auto 20px auto;"><tr><td align="center" style="border-radius:8px;background-color:#1BA794;"><a href="${esc(url)}" target="_blank" style="font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;padding:14px 36px;display:inline-block;border-radius:8px;">${c.cta} &rarr;</a></td></tr></table>`
    : "";
  const code = token
    ? `<div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:12px 0 20px 0;text-align:center;"><p style="margin:0 0 6px 0;font-size:12px;color:#64748B;">${c.cta ? "Or enter this code if prompted:" : "Your code:"}</p><span style="display:inline-block;font-family:Menlo,Consolas,monospace;font-size:22px;font-weight:700;letter-spacing:4px;color:#0B132B;background:#FFFFFF;padding:6px 16px;border-radius:6px;border:1px solid #CBD5E1;">${esc(token)}</span></div>`
    : "";
  const fallback = c.cta
    ? `<tr><td style="padding:0 32px 28px 32px;"><div style="border-top:1px solid #F1F5F9;padding-top:16px;"><p style="margin:0 0 6px 0;font-size:11px;color:#94A3B8;">Button not working? Copy this link into your browser:</p><p style="margin:0;font-size:11px;color:#64748B;word-break:break-all;font-family:monospace;">${esc(url)}</p></div></td></tr>`
    : "";

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${c.subject}</title></head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC;"><tr><td align="center" style="padding:40px 16px 56px 16px;">
<table role="presentation" width="560" border="0" cellspacing="0" cellpadding="0" style="width:560px;max-width:100%;background-color:#FFFFFF;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;">
<tr><td style="background-color:#0B132B;padding:28px 32px;text-align:center;"><span style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#FFFFFF;">VAYLANCE<span style="color:#1BA794;">.</span></span><p style="margin:4px 0 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#94A3B8;">AI Career Intelligence</p></td></tr>
<tr><td style="padding:36px 32px 24px 32px;">
<p style="margin:0 0 8px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1BA794;">${c.eyebrow}</p>
<h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.35;font-weight:700;color:#0B132B;">${c.title}</h1>
<p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;color:#475569;">${c.body}</p>
${button}${code}
<p style="margin:20px 0 0 0;font-size:12px;line-height:1.5;color:#94A3B8;">If you didn't request this, you can safely ignore this email.</p>
</td></tr>${fallback}
<tr><td style="padding:24px 32px;background-color:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
<p style="margin:0 0 6px 0;font-size:11px;color:#94A3B8;"><a href="https://vaylance.com/contact" style="color:#64748B;">Contact Support</a> &bull; <a href="https://vaylance.com/privacy-policy" style="color:#64748B;">Privacy Policy</a></p>
<p style="margin:10px 0 0 0;font-size:11px;color:#CBD5E1;">&copy; 2026 Vaylance. All rights reserved.</p>
</td></tr></table></td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const payloadText = await req.text();
  const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
  if (!hookSecret) {
    console.error("SEND_EMAIL_HOOK_SECRET missing");
    return new Response(JSON.stringify({ error: { http_code: 500, message: "Hook not configured" } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  let data: HookPayload;
  try {
    const wh = new Webhook(hookSecret.replace("v1,whsec_", ""));
    data = wh.verify(payloadText, Object.fromEntries(req.headers)) as HookPayload;
  } catch (e) {
    console.error("Signature verification failed", e);
    return new Response(JSON.stringify({ error: { http_code: 401, message: "Invalid signature" } }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { user, email_data } = data;
    const type = email_data.email_action_type;
    const copy = COPY[type] ?? COPY.signup;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const redirect = email_data.redirect_to || email_data.site_url || "https://vaylance.com/dashboard";
    const url = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${type}&redirect_to=${encodeURIComponent(redirect)}`;

    await sendZeptoMail({
      to: type === "email_change" && user.new_email ? user.new_email : user.email,
      subject: copy.subject,
      html: renderHtml(copy, url, email_data.token),
      text: `${copy.title}\n\n${copy.body}\n\n${copy.cta ? url + "\n\n" : ""}Code: ${email_data.token}`,
    });

    return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Send failed", e);
    return new Response(JSON.stringify({ error: { http_code: 500, message: String(e) } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
