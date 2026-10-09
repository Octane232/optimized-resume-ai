// Shared ZeptoMail REST API client (HTTPS, no SMTP).
export interface ZeptoMailMessage {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

const ZEPTO_URL = "https://api.zeptomail.com/v1.1/email";
const FROM_ADDRESS = "noreply@vaylance.com";
const FROM_NAME = "Vaylance";

export async function sendZeptoMail(msg: ZeptoMailMessage): Promise<void> {
  const raw = Deno.env.get("ZEPTOMAIL_API_KEY");
  if (!raw) throw new Error("ZEPTOMAIL_API_KEY is not configured");
  const auth = raw.startsWith("Zoho-enczapikey") ? raw : `Zoho-enczapikey ${raw}`;

  const res = await fetch(ZEPTO_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify({
      from: { address: FROM_ADDRESS, name: FROM_NAME },
      to: [{ email_address: { address: msg.to, name: msg.toName ?? msg.to } }],
      subject: msg.subject,
      htmlbody: msg.html,
      ...(msg.text ? { textbody: msg.text } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ZeptoMail error ${res.status}: ${body}`);
  }
}
