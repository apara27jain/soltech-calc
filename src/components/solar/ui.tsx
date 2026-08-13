import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BrandHeader({ logoUrl }: { logoUrl?: string }) {
  return (
    <header className="flex items-center justify-between gap-3 px-1 py-4">
      <div className="flex items-center gap-2.5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Soltech Energy logo"
            className="h-9 w-9 rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-lg font-bold">
            ☀️
          </div>
        )}
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-primary">
            Soltech Energy
          </p>
          <p className="text-[11px] text-muted-foreground">
            Solar Savings Calculator
          </p>
        </div>
      </div>
      <span className="rounded-full bg-solar/15 px-3 py-1 text-[11px] font-semibold text-solar-foreground">
        Jaipur · Rajasthan
      </span>
    </header>
  );
}

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          Step {step} of {total}
        </span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-solar transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function QuestionHead({
  title,
  helper,
}: {
  title: string;
  helper?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      {helper ? <p className="mt-1.5 text-sm text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

export function OptionCard({
  label,
  helper,
  selected,
  onClick,
}: {
  label: string;
  helper?: string | undefined;
  selected?: boolean | undefined;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-card px-4 py-4 text-left transition-all active:scale-[0.99]",
        selected
          ? "border-primary bg-accent shadow-card"
          : "border-border hover:border-primary/50 hover:bg-accent/50",
      )}
    >
      <span>
        <span className="block font-semibold text-foreground">{label}</span>
        {helper ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{helper}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-border",
        )}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-primary-foreground" /> : null}
      </span>
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  className,
}: 

{
  children: ReactNode;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  type?: "button" | "submit";
  variant?: "primary" | "solar" | "success" | "outline" | "ghost";
  className?: string | undefined;
}) 

{
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-card shadow-card",
    solar:
      "bg-gradient-solar text-solar-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:brightness-90 active:translate-y-0 active:brightness-95",
    success:
      "bg-success text-success-foreground hover:bg-success/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-card shadow-card",
    outline:
      "border-2 border-primary/25 bg-card text-primary hover:bg-accent hover:border-primary/50 hover:-translate-y-0.5",
    ghost: "text-muted-foreground hover:text-foreground",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean | undefined;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
        {label}
        {optional ? (
          <span className="text-xs font-medium text-muted-foreground">Optional</span>
        ) : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-2xl border-2 border-border bg-card px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";
