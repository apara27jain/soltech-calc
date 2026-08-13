/**
 * Solar savings estimation configuration.
 *
 * ALL calculation constants live here so Soltech can tune the engine in one
 * place. No random numbers are used anywhere in the estimator.
 */

export const SOLAR_CONFIG = {
  /** Average grid tariff (INR per kWh) used to convert units into savings. */
  tariffPerKwh: 8,

  /**
   * Conservative daily generation per installed kW (kWh/kW/day) for Rajasthan.
   * Industry range is ~4.0-4.8; we deliberately use the lower end.
   */
  generationPerKwPerDay: 4.2,

  daysPerMonth: 30,

  /** Share of generated units that actually offset the bill (conservative). */
  selfConsumptionFactor: 0.9,

  /** System sizes are rounded to this step, in kW. */
  kwStep: 0.5,
  minKw: 1,
  maxKw: 10,

  /** Optional subsidy. Disabled by default — enable only if explicitly needed. */
  subsidy: {
    enabled: false,
    /** Flat amount (INR) shown as an upfront benefit when enabled. */
    amount: 0,
  },

  /** Approximate roof area required per kW of rooftop solar (sq. ft.). */
  areaPerKwSqFt: 100,

  /** Terrace size buckets → usable area (sq. ft.) → max supportable kW. */
  terraceSizes: {
    small: { label: "Small", helper: "< 200 sq. ft.", usableSqFt: 180 },
    medium: { label: "Medium", helper: "200–400 sq. ft.", usableSqFt: 350 },
    large: { label: "Large", helper: "400+ sq. ft.", usableSqFt: 700 },
  },

  /** Monthly electricity bill buckets (INR). */
  billRanges: {
    below2000: { label: "Below ₹2,000", avgBill: 1500 },
    "2000to4000": { label: "₹2,000 – ₹4,000", avgBill: 3000 },
    "4000to6000": { label: "₹4,000 – ₹6,000", avgBill: 5000 },
    "6000to10000": { label: "₹6,000 – ₹10,000", avgBill: 8000 },
    above10000: { label: "Above ₹10,000", avgBill: 12000 },
  },

  /** Roof type derating (structure / orientation constraints). */
  roofTypes: {
    concrete: { label: "Concrete Roof", helper: "Full eligibility", factor: 1 },
    metal: { label: "Metal Sheet Roof", helper: "Owner approval", factor: 0.95 },
    brick: { label: "Brick Roof", helper: "Owner approval", factor: 0.9 },
  },

  /** Timeline options (qualification only, no effect on savings). */
  timelines: {
    immediately: { label: "Immediately" },
    within3months: { label: "Within 3 months" },
    within6months: { label: "Within 6 months" },
    exploring: { label: "Just exploring" },
  },

  /** Power cut options (system recommendation context only). */
  powerCuts: {
    none: { label: "No power cuts" },
    under1h: { label: "Less than 1 hour" },
    "1to4h": { label: "1–4 hours" },
    over4h: { label: "More than 4 hours" },
  },

  /**
   * Location irradiance multipliers. Default applies to any city not listed.
   * Keys are matched case-insensitively against the entered city.
   */
  locationFactors: {
    default: 1,
    jaipur: 1,
    jodhpur: 1.02,
    bikaner: 1.03,
    udaipur: 1,
    kota: 1,
    ajmer: 1,
  } as Record<string, number>,

  /** Business contact details used for WhatsApp fallbacks and CTAs. */
  business: {
    name: "Soltech Energy",
    city: "Jaipur",
    /** E.164 without the leading + (used for wa.me links). */
    whatsappNumber: "919999999999",
    tagline: "Powering homes. Saving more.",
  },
} as const;

export type TerraceSizeKey = keyof typeof SOLAR_CONFIG.terraceSizes;
export type BillRangeKey = keyof typeof SOLAR_CONFIG.billRanges;
export type RoofTypeKey = keyof typeof SOLAR_CONFIG.roofTypes;
export type TimelineKey = keyof typeof SOLAR_CONFIG.timelines;
export type PowerCutKey = keyof typeof SOLAR_CONFIG.powerCuts;
