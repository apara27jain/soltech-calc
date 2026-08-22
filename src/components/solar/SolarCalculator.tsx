import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import logo from "@/assets/soltech-logo.png";
import { submitLead } from "@/lib/leads.functions";
import { calculateSolar, type CalcResult } from "@/lib/solar-calc";
import {
  SOLAR_CONFIG,
  type BillRangeKey,
  type RoofTypeKey,
  type TerraceSizeKey,
  type TimelineKey,
} from "@/lib/solar-config";
import { ResultView } from "./ResultView";
import {
  BrandHeader,
  Field,
  OptionCard,
  PrimaryButton,
  ProgressBar,
  QuestionHead,
  inputClass,
} from "./ui";

const TOTAL_STEPS = 5;

type Answers = {
  timeline?: TimelineKey;
  roofType?: RoofTypeKey;
  terraceSize?: TerraceSizeKey;
  billRange?: BillRangeKey;
  pinCode: string;
  fullName: string;
  whatsappNumber: string;
};

const emptyAnswers: Answers = {
  pinCode: "",
  fullName: "",
  whatsappNumber: "",
};

const entries = <T extends Record<string, { label: string; helper?: string }>>(obj: T) =>
  Object.entries(obj) as [keyof T & string, { label: string; helper?: string }][];

export function SolarCalculator() {
  const send = useServerFn(submitLead);
  const [step, setStep] = useState(0); // 0 = intro, 1..7 questions, 8 = result
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState("not_configured");
  const [waMessage, setWaMessage] = useState("");

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const pick = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    set(key, value);
    setTimeout(() => setStep((s) => s + 1), 140);
  };

  const back = () => {
    setErrors({});
    setSubmitError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const validateLocation = () => {
    const next: Record<string, string> = {};
    if (answers.city.trim().length < 2) next["city"] = "Please enter your city or area";
    if (answers.pinCode && !/^\d{6}$/.test(answers.pinCode.trim()))
      next["pinCode"] = "PIN code should be 6 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateContact = () => {
    const next: Record<string, string> = {};
    if (answers.fullName.trim().length < 2) next["fullName"] = "Please enter your full name";
      const digits = answers.whatsappNumber;
      if (!/^[6-9]\d{9}$/.test(digits)) {
        next["whatsappNumber"] = "Enter a valid 10-digit WhatsApp number";
      }
    if (!/^\d{6}$/.test(answers.pinCode.trim())) {
      next["pinCode"] = "PIN code should be exactly 6 digits";
      }
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting || !validateContact()) return;
    if (!answers.billRange || !answers.terraceSize || !answers.roofType) return;

    setSubmitting(true);
    setSubmitError(null);

    const calc = calculateSolar({
      billRange: answers.billRange,
      terraceSize: answers.terraceSize,
      roofType: answers.roofType,
    });

    try {
      const params = new URLSearchParams(window.location.search);
      const res = await send({
        data: {
          fullName: answers.fullName.trim(),
          whatsappNumber: answers.whatsappNumber.replace(/\s|-/g, ""),
          pinCode: answers.pinCode.trim(),
          timeline: SOLAR_CONFIG.timelines[answers.timeline!].label,
          roofType: SOLAR_CONFIG.roofTypes[answers.roofType].label,
          terraceSize: SOLAR_CONFIG.terraceSizes[answers.terraceSize].label,
          billRange: SOLAR_CONFIG.billRanges[answers.billRange].label,
          recommendedKw: calc.recommendedKw,
          monthlyGenerationKwh: calc.monthlyGenerationKwh,
          monthlySavings: calc.monthlySavings,
          annualSavings: calc.annualSavings,
          fiveYearSavings: calc.fiveYearSavings,
          source: params.get("source") ?? "",
          campaign: params.get("campaign") ?? params.get("utm_campaign") ?? "",
        },
      });
      setResult(calc);
      setWhatsappStatus(res.whatsappStatus);
      setWaMessage(res.message);
      setStep(8);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setAnswers(emptyAnswers);
    setResult(null);
    setErrors({});
    setSubmitError(null);
    setStep(0);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-14">
      <BrandHeader logoUrl="/soltech-logo.png" />

      {step === 0 ? (
    <section className="animate-step-in mt-4 flex min-h-[560px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-hero p-7 text-center text-primary-foreground shadow-elevated">
      {/* Top Aligned Text Content */}
      <div className="flex flex-col items-center pt-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-solar/20 px-4 py-1.5 text-xs font-semibold text-solar">
          ✦ 100% Free Savings Check
        </span>
        <h1 className="mt-6 w-full text-center text-4xl font-extrabold leading-tight px-4 sm:text-5xl">
          Let's Calculate <br /> your <br /> Solar Savings
        </h1>
        <p className="mt-4 text-sm text-primary-foreground/80 max-w-sm">
          See your estimated solar savings in less than 60 seconds.
        </p>
      </div>
      {/* Bottom Aligned Button & Guarantee Disclaimer */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <PrimaryButton variant="solar" onClick={() => setStep(1)} className="h-14 max-w-xs">
          Start Calculation
        </PrimaryButton>
        <p className="text-center text-[11px] text-primary-foreground/60">
          5 quick questions · Instant Savings Calculation
        </p>
      </div>
    </section>
      ) : null}

      {step >= 1 && step <= TOTAL_STEPS ? (
        <section className="mt-2 rounded-3xl border-2 border-border bg-card p-5 shadow-card sm:p-6">
          <ProgressBar step={step} total={TOTAL_STEPS} />

          <div key={step} className="animate-step-in">
            {step === 1 ? (
              <>
                <QuestionHead
                  title="When are you planning to get solar?"
                  helper="Tell us your expected timeline."
                />
                <div className="space-y-3">
                  {entries(SOLAR_CONFIG.timelines).map(([key, opt]) => (
                    <OptionCard
                      key={key}
                      label={opt.label}
                      selected={answers.timeline === key}
                      onClick={() => pick("timeline", key as TimelineKey)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <QuestionHead
                  title="What type of roof do you have?"
                  helper="So we can plan the right structure for your home."
                />
                <div className="space-y-3">
                  {entries(SOLAR_CONFIG.roofTypes).map(([key, opt]) => (
                    <OptionCard
                      key={key}
                      label={opt.label}
                      helper={opt.helper}
                      selected={answers.roofType === key}
                      onClick={() => pick("roofType", key as RoofTypeKey)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <QuestionHead
                  title="How big is your terrace?"
                  helper="This helps estimate how much you can save."
                />
                <div className="space-y-3">
                  {entries(SOLAR_CONFIG.terraceSizes).map(([key, opt]) => (
                    <OptionCard
                      key={key}
                      label={opt.label}
                      helper={opt.helper}
                      selected={answers.terraceSize === key}
                      onClick={() => pick("terraceSize", key as TerraceSizeKey)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <QuestionHead
                  title="What's your average monthly electricity bill?"
                  helper="This drives your savings estimate."
                />
                <div className="space-y-3">
                  {entries(SOLAR_CONFIG.billRanges).map(([key, opt]) => (
                    <OptionCard
                      key={key}
                      label={opt.label}
                      selected={answers.billRange === key}
                      onClick={() => pick("billRange", key as BillRangeKey)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {step === 5 ? (
              <>
                <QuestionHead
                  title="Almost there!"
                  helper="Enter your details to see your personalized solar savings estimate."
                />
                <div className="space-y-4">
                  <Field label="Full Name" error={errors["fullName"]}>
                    <input
                      className={inputClass}
                      value={answers.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="Your name"
                      maxLength={100}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="WhatsApp Number" error={errors["whatsappNumber"]}>
                    <input
                      className={inputClass}
                      value={answers.whatsappNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        set("whatsappNumber", value);
                      }}
                      placeholder="98XXXXXXXX"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      />
                  </Field>
                  <Field label="PIN Code" error={errors["pinCode"]}>
                    <input
                      className={inputClass}
                      value={answers.pinCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        set("pinCode", value);
                      }}
                      placeholder="302020"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                      />
                  </Field>
                  {submitError ? (
                    <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                      {submitError}
                    </p>
                  ) : null}
                  <PrimaryButton variant="solar" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Calculating…" : "See My Savings"}
                  </PrimaryButton>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
            >
              ← Back
            </button>
          </div>
        </section>
      ) : null}

      {step === 8 && result ? (
        <ResultView
          result={result}
          name={answers.fullName}
          city={answers.city}
          whatsappStatus={whatsappStatus}
          waMessage={waMessage}
          onRestart={restart}
        />
      ) : null}

      <footer className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
        © {new Date().getFullYear()} Soltech Energy, Jaipur · Powering homes. Saving more.
        <br />
        All savings shown are indicative estimates, not guaranteed figures.
      </footer>
    </div>
  );
}
