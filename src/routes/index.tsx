import { createFileRoute } from "@tanstack/react-router";
import { SolarCalculator } from "@/components/solar/SolarCalculator";

const title = "Solar Savings Calculator — Soltech Energy, Jaipur";
const description =
  "Estimate your rooftop solar system size and monthly, annual and 5-year savings in under 60 seconds. Free, indicative estimate from Soltech Energy, Jaipur.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background pb-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/60 to-transparent" />
      <div className="relative">
        <SolarCalculator />
      </div>
    </main>
  );
}
