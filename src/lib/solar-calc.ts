import {
  SOLAR_CONFIG,
  type BillRangeKey,
  type RoofTypeKey,
  type TerraceSizeKey,
} from "./solar-config";

export type CalcInput = {
  billRange: BillRangeKey;
  terraceSize: TerraceSizeKey;
  roofType: RoofTypeKey;
  city: string;
};

export type CalcResult = {
  recommendedKw: number;
  monthlyGenerationKwh: number;
  monthlySavings: number;
  annualSavings: number;
  fiveYearSavings: number;
  assumptions: string[];
};

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function locationFactor(city: string): number {
  const key = city.trim().toLowerCase();
  return SOLAR_CONFIG.locationFactors[key] ?? SOLAR_CONFIG.locationFactors["default"] ?? 1;
}

export function calculateSolar(input: CalcInput): CalcResult {
  const c = SOLAR_CONFIG;
  const avgBill = c.billRanges[input.billRange].avgBill;
  const roof = c.roofTypes[input.roofType];
  const terrace = c.terraceSizes[input.terraceSize];
  const locFactor = locationFactor(input.city);

  // 1. Monthly consumption implied by the bill.
  const monthlyUnits = avgBill / c.tariffPerKwh;

  // 2. Units one installed kW produces per month at this location.
  const unitsPerKwPerMonth =
    c.generationPerKwPerDay * c.daysPerMonth * locFactor * roof.factor;

  // 3. Size needed to offset consumption, capped by usable roof area and limits.
  const kwForConsumption = monthlyUnits / unitsPerKwPerMonth;
  const kwForRoof = terrace.usableSqFt / c.areaPerKwSqFt;

  const rawKw = Math.min(kwForConsumption, kwForRoof, c.maxKw);
  const recommendedKw = Math.max(c.minKw, roundTo(rawKw, c.kwStep));

  // 4. Generation and savings (never credit more than the home consumes).
  const monthlyGenerationKwh = recommendedKw * unitsPerKwPerMonth;
  const offsetUnits = Math.min(
    monthlyGenerationKwh * c.selfConsumptionFactor,
    monthlyUnits,
  );

  const monthlySavings = Math.round(offsetUnits * c.tariffPerKwh);
  const annualSavings = monthlySavings * 12;
  const fiveYearSavings = annualSavings * 5;

  const assumptions = [
    `Electricity tariff of ₹${c.tariffPerKwh}/unit`,
    `Conservative generation of ${c.generationPerKwPerDay} units per kW per day`,
    `${Math.round(c.selfConsumptionFactor * 100)}% of generated units offset your bill`,
    `Approx. ${c.areaPerKwSqFt} sq. ft. of shadow-free roof area per kW`,
    `${roof.label} structure factor applied`,
    c.subsidy.enabled
      ? `Subsidy benefit of ₹${c.subsidy.amount.toLocaleString("en-IN")} included`
      : "No government subsidy included in these figures",
  ];

  return {
    recommendedKw,
    monthlyGenerationKwh: Math.round(monthlyGenerationKwh),
    monthlySavings,
    annualSavings,
    fiveYearSavings,
    assumptions,
  };
}

export const formatINR = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;
