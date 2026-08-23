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
  if (!city) return SOLAR_CONFIG.locationFactors["default"] ?? 1;
  const key = city.trim().toLowerCase();
  return SOLAR_CONFIG.locationFactors[key] ?? SOLAR_CONFIG.locationFactors["default"] ?? 1;
}

export function calculateSolar(input: CalcInput): CalcResult {
  const c = SOLAR_CONFIG;

  // Safe fallback key extraction in case an answer key is undefined
  const defaultBillKey = Object.keys(c.billRanges)[0] as BillRangeKey;
  const defaultRoofKey = Object.keys(c.roofTypes)[0] as RoofTypeKey;
  const defaultTerraceKey = Object.keys(c.terraceSizes)[0] as TerraceSizeKey;

  const billKey = input?.billRange ?? defaultBillKey;
  const roofKey = input?.roofType ?? defaultRoofKey;
  const terraceKey = input?.terraceSize ?? defaultTerraceKey;

  // Safe object lookups
  const billData = c.billRanges[billKey] ?? { avgBill: 3000 };
  const roof = c.roofTypes[roofKey] ?? { factor: 1, label: "Standard Roof" };
  const terrace = c.terraceSizes[terraceKey] ?? { usableSqFt: 500, label: "Medium Terrace" };

  const avgBill = billData.avgBill;

  // 1. Monthly consumption implied by the bill
  const monthlyUnits = avgBill / c.tariffPerKwh;

  // 2. Units one installed kW produces per month
  const unitsPerKwPerMonth =
    c.generationPerKwPerDay * c.daysPerMonth * (roof.factor ?? 1);

  // 3. Size needed to offset consumption, capped by usable roof area and limits
  const kwForConsumption = monthlyUnits / unitsPerKwPerMonth;
  const kwForRoof = terrace.usableSqFt / c.areaPerKwSqFt;

  const rawKw = Math.min(kwForConsumption, kwForRoof, c.maxKw);
  const recommendedKw = Math.max(c.minKw, roundTo(rawKw, c.kwStep));

  // 4. Generation and savings calculation
  const monthlyGenerationKwh = recommendedKw * unitsPerKwPerMonth;
  const offsetUnits = Math.min(
    monthlyGenerationKwh * c.selfConsumptionFactor,
    monthlyUnits,
  );

  const monthlySavings = Math.round(offsetUnits * c.tariffPerKwh);
  const annualSavings = monthlySavings * 12;
  const fiveYearSavings = annualSavings * 5;

  const isSubsidyEnabled = c.subsidy?.enabled ?? false;
  const subsidyAmount = c.subsidy?.amount ?? 0;

  const annualKwh = Math.round(monthlyGenerationKwh * 12);
  const co2Tons = ((annualKwh * 0.82) / 1000).toFixed(1);
  const treesPlanted = Math.round(annualKwh * 0.04);

  const assumptions = [
    `Electricity rate calculated at ₹${c.tariffPerKwh}/unit`,
    `Requires ~${c.areaPerKwSqFt} sq. ft. shadow-free roof area per kW`,
    `Includes up to ₹78,000 central + ₹17,000 Rajasthan state subsidy (as per Govt T&C)`,
    `Saves ~${co2Tons} tons of CO₂ emissions annually`,
    `Equivalent to planting ~${treesPlanted} trees per year`,
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
