import type { RatesConfig } from "./types";

export const RATES: RatesConfig = {
    contributions: {
        pensionAndDisability: 0.188,
        healthInsurance: 0.075,
        additionalHealthInsurance: 0.005,
        unemploymentInsurance: 0.012,
    },
    tax: 0.1,
    allowance: 8438,
} as const;
