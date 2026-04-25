export interface RatesConfig {
    contributions: {
        pensionAndDisability: number;
        healthInsurance: number;
        additionalHealthInsurance: number;
        unemploymentInsurance: number;
    };
    tax: number;
    allowance: number;
}
