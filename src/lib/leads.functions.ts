import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^(\+?91)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(120),
  pinCode: z.string().trim().max(10).optional().or(z.literal("")),
  landmark: z.string().trim().max(200).optional().or(z.literal("")),
  timeline: z.string().trim().min(1).max(60),
  roofType: z.string().trim().min(1).max(60),
  terraceSize: z.string().trim().min(1).max(60),
  powerCuts: z.string().trim().min(1).max(60),
  billRange: z.string().trim().min(1).max(60),
  recommendedKw: z.number().min(0).max(100),
  monthlyGenerationKwh: z.number().min(0).max(100000),
  monthlySavings: z.number().min(0).max(10000000),
  annualSavings: z.number().min(0).max(100000000),
  fiveYearSavings: z.number().min(0).max(1000000000),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  campaign: z.string().trim().max(120).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildResultMessage, sendWhatsAppMessage } = await import("./whatsapp.server");

    // 1. Persist the lead FIRST — it must survive WhatsApp failures.
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        full_name: data.fullName,
        whatsapp_number: data.whatsappNumber,
        pin_code: data.pinCode || null,
        timeline: data.timeline,
        roof_type: data.roofType,
        terrace_size: data.terraceSize,
        bill_range: data.billRange,
        recommended_kw: data.recommendedKw,
        monthly_generation_kwh: data.monthlyGenerationKwh,
        monthly_savings: data.monthlySavings,
        annual_savings: data.annualSavings,
        five_year_savings: data.fiveYearSavings,
        source: data.source || null,
        campaign: data.campaign || null,
      })
      .select("id")
      .single();

    if (error || !lead) {
      console.error("Lead insert failed:", error?.message);
      throw new Error("We could not save your details. Please try again.");
    }

    // 2. Internal notification for the Soltech team.
    const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
    await supabaseAdmin.from("lead_notifications").insert({
      lead_id: lead.id,
      title: `New solar lead: ${data.fullName} (${data.city})`,
      body: [
        `Name: ${data.fullName}`,
        `Phone: ${data.whatsappNumber}`,
        `Location: ${data.city}${data.pinCode ? ` - ${data.pinCode}` : ""}`,
        `Timeline: ${data.timeline}`,
        `Roof type: ${data.roofType}`,
        `Terrace size: ${data.terraceSize}`,
        `Monthly bill: ${data.billRange}`,
        `Recommended system: ${data.recommendedKw} kW`,
        `Estimated monthly savings: ${inr(data.monthlySavings)}`,
        `Estimated annual savings: ${inr(data.annualSavings)}`,
        `Estimated 5-year savings: ${inr(data.fiveYearSavings)}`,
      ].join("\n"),
    });

    // 3. Attempt the WhatsApp delivery (never blocks lead capture).
    const message = buildResultMessage({
      name: data.fullName,
      recommendedKw: data.recommendedKw,
      monthlySavings: data.monthlySavings,
      annualSavings: data.annualSavings,
    });

    const result = await sendWhatsAppMessage(data.whatsappNumber, message, [
      data.fullName,
      String(data.recommendedKw),
      inr(data.monthlySavings),
      inr(data.annualSavings),
    ]);

    await supabaseAdmin
      .from("leads")
      .update({ whatsapp_status: result.status, whatsapp_error: result.error ?? null })
      .eq("id", lead.id);

    return { leadId: lead.id, whatsappStatus: result.status, message };
  });
