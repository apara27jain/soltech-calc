/**
 * Real WhatsApp Business API integration (server-only).
 *
 * Supports Meta WhatsApp Cloud API and Twilio. Credentials are read from
 * environment variables at call time — never in frontend code.
 *
 * Meta Cloud API:
 *   WHATSAPP_PROVIDER=meta
 *   WHATSAPP_ACCESS_TOKEN=...
 *   WHATSAPP_PHONE_NUMBER_ID=...
 *   WHATSAPP_TEMPLATE_NAME=...            (optional; plain text used if unset)
 *   WHATSAPP_TEMPLATE_LANGUAGE=en         (optional)
 *
 * Twilio:
 *   WHATSAPP_PROVIDER=twilio
 *   TWILIO_ACCOUNT_SID=...
 *   TWILIO_AUTH_TOKEN=...
 *   TWILIO_WHATSAPP_FROM=whatsapp:+1415...
 */

export type WhatsAppSendResult = {
  status: "sent" | "not_configured" | "failed";
  error?: string;
};

export function buildResultMessage(input: {
  name: string;
  recommendedKw: number;
  monthlySavings: number;
  annualSavings: number;
  city: string;
}): string {
  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  return [
    `Hi ${input.name}! 👋`,
    ``,
    `Thank you for using Soltech Energy's Solar Savings Calculator.`,
    ``,
    `Based on the details you provided:`,
    ``,
    `☀️ Recommended System: ${input.recommendedKw} kW`,
    `💰 Estimated Monthly Savings: ${inr(input.monthlySavings)}`,
    `📈 Estimated Annual Savings: ${inr(input.annualSavings)}`,
    `🏠 Location: ${input.city}`,
    ``,
    `These figures are indicative and may vary based on your actual electricity consumption, roof conditions, shadow analysis, electricity tariff and final system design.`,
    ``,
    `If you'd like a more accurate assessment or quotation, our Soltech Energy team would be happy to help.`,
    ``,
    `Reply 'QUOTE' or contact us for assistance.`,
    ``,
    `— Soltech Energy, Jaipur`,
    `Powering homes. Saving more.`,
  ].join("\n");
}

/** Normalises an Indian mobile number to E.164 digits (no plus). */
export function toE164Digits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

export async function sendWhatsAppMessage(
  to: string,
  message: string,
  params: string[] = [],
): Promise<WhatsAppSendResult> {
  const provider = (process.env["WHATSAPP_PROVIDER"] ?? "meta").toLowerCase();
  const recipient = toE164Digits(to);

  try {
    if (provider === "twilio") {
      const sid = process.env["TWILIO_ACCOUNT_SID"];
      const token = process.env["TWILIO_AUTH_TOKEN"];
      const from = process.env["TWILIO_WHATSAPP_FROM"];
      if (!sid || !token || !from) return { status: "not_configured" };

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: from,
            To: `whatsapp:+${recipient}`,
            Body: message,
          }),
        },
      );
      if (!res.ok) {
        const body = await res.text();
        console.error(`Twilio WhatsApp failed [${res.status}]: ${body}`);
        return { status: "failed", error: `${res.status}: ${body.slice(0, 400)}` };
      }
      return { status: "sent" };
    }

    // Meta WhatsApp Cloud API
    const accessToken = process.env["WHATSAPP_ACCESS_TOKEN"];
    const phoneNumberId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
    if (!accessToken || !phoneNumberId) return { status: "not_configured" };

    const templateName = process.env["WHATSAPP_TEMPLATE_NAME"];
    const payload = templateName
      ? {
          messaging_product: "whatsapp",
          to: recipient,
          type: "template",
          template: {
            name: templateName,
            language: { code: process.env["WHATSAPP_TEMPLATE_LANGUAGE"] ?? "en" },
            components: params.length
              ? [
                  {
                    type: "body",
                    parameters: params.map((text) => ({ type: "text", text })),
                  },
                ]
              : [],
          },
        }
      : {
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: { preview_url: false, body: message },
        };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`WhatsApp Cloud API failed [${res.status}]: ${body}`);
      return { status: "failed", error: `${res.status}: ${body.slice(0, 400)}` };
    }
    return { status: "sent" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("WhatsApp send error:", msg);
    return { status: "failed", error: msg };
  }
}
