import { formatINR, type CalcResult } from "@/lib/solar-calc";
import { SOLAR_CONFIG } from "@/lib/solar-config";
import { PrimaryButton } from "./ui";

type Props = {
  result: CalcResult;
  name: string;
  city: string;
  whatsappStatus: string;
  waMessage: string;
  onRestart: () => void;
};

export function ResultView({
  result,
  name,
  city,
  whatsappStatus,
  waMessage,
  onRestart,
}: Props) {
  const businessWa = SOLAR_CONFIG.business.whatsappNumber;
  const selfLink = `https://wa.me/${businessWa}?text=${encodeURIComponent(waMessage)}`;
  const quoteLink = `https://wa.me/${businessWa}?text=${encodeURIComponent(
    `Hi Soltech Energy, I'm ${name} from ${city}. I used your Solar Savings Calculator (${result.recommendedKw} kW recommended) and would like a free quote.`,
  )}`;

  return (
    <div className="animate-step-in">
      <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated">
        <p className="text-xs font-semibold uppercase tracking-wider text-solar">
          Estimate ready
        </p>
        <h2 className="mt-2 text-2xl font-bold">Here's your estimated solar savings</h2>
        <p className="mt-1.5 text-sm text-primary-foreground/75">
          Based on the details you provided
        </p>

        <div className="mt-5 rounded-2xl bg-primary-foreground/10 p-4 backdrop-blur">
          <p className="text-xs text-primary-foreground/70">
            Recommended Solar System Size
          </p>
          <p className="font-display text-4xl font-extrabold text-solar">
            {result.recommendedKw} kW
          </p>
          <p className="mt-1 text-xs text-primary-foreground/70">
            Estimated generation ≈ {result.monthlyGenerationKwh.toLocaleString("en-IN")}{" "}
            units / month · {city}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SavingsCard label="Estimated Monthly Savings" value={formatINR(result.monthlySavings)} />
        <SavingsCard label="Estimated Annual Savings" value={formatINR(result.annualSavings)} />
        <SavingsCard label="Estimated 5-Year Savings" value={formatINR(result.fiveYearSavings)} />
      </div>

      <div className="mt-4 rounded-2xl border-2 border-border bg-card p-5">
        <h3 className="text-sm font-bold text-foreground">Key assumptions used</h3>
        <ul className="mt-3 space-y-2">
          {result.assumptions.map((a) => (
            <li key={a} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-solar" />
              {a}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          These figures are indicative estimates and are not guaranteed. Actual savings may
          vary based on electricity consumption, roof orientation, shading, tariff, system
          design and site conditions.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-success/25 bg-success/5 p-4 text-sm text-foreground">
        {whatsappStatus === "sent" ? (
          <p>
            ✅ Your estimate has been sent to your WhatsApp number. Our team will reach out
            shortly.
          </p>
        ) : (
          <p>
            ✅ Your details are saved and our team has been notified. You can also send this
            estimate to yourself on WhatsApp below.
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <a href={quoteLink} target="_blank" rel="noopener noreferrer" className="block">
          <PrimaryButton variant="solar">Get a Free Quote</PrimaryButton>
        </a>
        <a
          href={`https://wa.me/${businessWa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <PrimaryButton variant="success">Talk to Soltech on WhatsApp</PrimaryButton>
        </a>
        <a href={selfLink} target="_blank" rel="noopener noreferrer" className="block">
          <PrimaryButton variant="outline">Send result on WhatsApp</PrimaryButton>
        </a>
        <PrimaryButton variant="ghost" onClick={onRestart}>
          Start Again
        </PrimaryButton>
      </div>
    </div>
  );
}

function SavingsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-success/20 bg-card p-4 shadow-card">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-success">{value}</p>
    </div>
  );
}
