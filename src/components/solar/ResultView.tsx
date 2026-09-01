import { formatINR, type CalcResult } from "@/lib/solar-calc";
import { SOLAR_CONFIG } from "@/lib/solar-config";
import { PrimaryButton } from "./ui";

type Props = {
  result: CalcResult;
  name: string;
  whatsappStatus: string;
  waMessage: string;
  onRestart: () => void;
};

export function ResultView({
  result,
  name,
  whatsappStatus,
  waMessage,
  onRestart,
}: Props) {
  const businessWa = SOLAR_CONFIG.business.whatsappNumber;
  const quoteLink = `https://wa.me/${businessWa}?text=${encodeURIComponent(
    `Hi Soltech Energy, I'm ${name}. I checked my Solar Potential (${result.recommendedKw} kW recommended) and want to talk to an expert.`
  )}`;

  return (
    <div className="animate-step-in space-y-4 -mx-4 sm:-mx-12 max-w-[calc(100%+2rem)] sm:max-w-[calc(100%+6rem)]"> 
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated">
        <p className="text-xs font-semibold uppercase tracking-wider text-solar">
          Estimate Ready
        </p>
        <h2 className="mt-2 text-2xl font-bold">Your Solar Potential</h2>
        <p className="mt-1.5 text-sm text-primary-foreground/80">
          Based on the details you provided, here's an estimate of what your solar system could achieve.
        </p>

        <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
          <p className="text-xs text-primary-foreground/70">
            Recommended Solar System Size
          </p>
          <p className="font-display text-4xl font-extrabold text-solar mt-1">
            {result.recommendedKw} kW
          </p>
          <p className="mt-1.5 text-xs text-primary-foreground/70">
            Estimated generation ≈{" "}
            <span className="font-semibold text-white">
              {result.monthlyGenerationKwh.toLocaleString("en-IN")} units / month
            </span>
          </p>
        </div>
      </div>

      {/* Savings Metric Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <SavingsCard label="Monthly Savings" value={formatINR(result.monthlySavings)} />
        <SavingsCard label="Annual Savings" value={formatINR(result.annualSavings)} />
        <SavingsCard label="5-Year Savings" value={formatINR(result.fiveYearSavings)} />
      </div>

      {/* Key Assumptions Card */}
      <div className="rounded-2xl border border-blue-900/10 bg-white/80 p-5 shadow-sm backdrop-blur-md">
        <h3 className="text-sm font-bold text-foreground">Key assumptions used</h3>
        <ul className="mt-3 space-y-2">
          {result.assumptions.map((a) => (
            <li key={a} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-solar" />
              {a}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
          These figures are indicative estimates. Actual savings may vary based on consumption, roof orientation, shading, and local tariffs.
        </p>
      </div>

      {/* WhatsApp Delivery Status Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-foreground backdrop-blur-md">
        {whatsappStatus === "sent" ? (
          <p>
            ✅ Your estimate has been sent to your WhatsApp number. Our team will reach out shortly.
          </p>
        ) : (
          <p>
            ✅ Your estimate is ready. Connect directly with our experts on WhatsApp to get your accurate rooftop quotation.
          </p>
        )}
      </div>

      {/* Lead Generation Next Steps */}
      <div className="rounded-2xl border border-blue-900/10 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md space-y-3">
        <p className="text-sm font-bold text-foreground">
          Want to know exactly how much you can save?
        </p>
        <p className="text-xs text-muted-foreground">
          Our solar experts can help you find the right system for your home and provide a personalized estimate.
        </p>

        <div className="pt-2 space-y-2.5">
         <a href={quoteLink} target="_blank" rel="noopener noreferrer" className="block w-full">
           <PrimaryButton variant="whatsapp">Talk on Whatsapp</PrimaryButton>
         </a>
         <a href="https://soltech-energy-get-quote-form.vercel.app/" 
            target="_blank" rel="noopener noreferrer" className="block w-full">
           <PrimaryButton variant="quote">Get Free Quote</PrimaryButton>
         </a>
          
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Calculate Again
          </button>
        </div>
      </div>
    </div>
  );
}

function SavingsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-900/10 bg-white/80 p-2 sm:p-4 text-center shadow-sm backdrop-blur-md min-w-0">
      <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">{label}</p>
      <p className="mt-1 font-display text-sm sm:text-xl font-extrabold text-emerald-600 truncate">{value}</p>
    </div>
  );
}
