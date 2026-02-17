import type { RATES } from "./constants";

/**
 * Returns the total employee contribution rate by summing the individual
 * employee-side contribution rates on `rates.contributions`.
 *
 * Rates are expected to be decimals (e.g. 0.1 for 10%). This helper is used by
 * other calculations to derive gross/net conversions and thresholds. The
 * returned value is a decimal (no rounding is performed).
 *
 * @param {typeof RATES} rates - Rates object containing a `contributions` property with:
 *   - pensionAndDisability: number
 *   - healthInsurance: number
 *   - unemploymentInsurance: number
 *   - additionalHealthInsurance: number
 * @returns {number} Sum of the employee contribution rates (decimal). For example, 0.25 represents 25%.
 */

export function getTotalContributionRate(rates: typeof RATES): number {
  const {
    pensionAndDisability,
    healthInsurance,
    unemploymentInsurance,
    additionalHealthInsurance,
  } = rates.contributions;
  return (
    pensionAndDisability +
    healthInsurance +
    unemploymentInsurance +
    additionalHealthInsurance
  );
}

type ContributionsBreakdown = {
  pensionAndDisability: number;
  healthInsurance: number;
  additionalHealthInsurance: number;
  unemploymentInsurance: number;
  total: number;
};

/**
 * Calculates employee contributions based on a gross salary and contribution rates.
 *
 * The function multiplies the provided gross amount by each of the contribution
 * rates (pensionAndDisability, healthInsurance, unemploymentInsurance, additionalHealthInsurance) found in rates.contributions
 * and returns a ContributionsBreakdown with the individual amounts and their total.
 *
 * Values are returned as raw numbers (no rounding) and the rates are expected
 * to be provided as decimals (for example, 0.1 for 10%).
 *
 * @param {number} gross - Gross salary amount used to compute contributions.
 * @param {typeof RATES} rates - Rates object containing the contribution rates:
 *   - rates.contributions.pensionAndDisability: pension contribution rate (decimal).
 *   - rates.contributions.healthInsurance contribution rate (decimal).
 *   - rates.contributions.unemploymentInsurance: unemployment contribution rate (decimal).
 *   - rates.contributions.additionalHealthInsurance: additional health/injury contribution rate (decimal).
 * @returns {ContributionsBreakdown} Breakdown with fields:
 *   - pensionAndDisability: number - pension contribution amount
 *   - healthInsurance: number - health contribution amount
 *   - additionalHealthInsurance: number - unemployment contribution amount
 *   - unemploymentInsurance: number - injury contribution amount
 *   - total: number - sum of all contribution amounts
 */
export function calculateContributions(
  gross: number,
  rates: typeof RATES,
): ContributionsBreakdown {
  const {
    pensionAndDisability,
    healthInsurance,
    unemploymentInsurance,
    additionalHealthInsurance,
  } = rates.contributions;

  const total =
    gross * pensionAndDisability +
    gross * healthInsurance +
    gross * unemploymentInsurance +
    gross * additionalHealthInsurance;

  return {
    pensionAndDisability: gross * pensionAndDisability,
    healthInsurance: gross * healthInsurance,
    additionalHealthInsurance: gross * additionalHealthInsurance,
    unemploymentInsurance: gross * unemploymentInsurance,
    total,
  };
}

export type TaxBreakdown = {
  taxableBase: number;
  incomeTax: number;
};

/**
 * Calculates tax information based on the gross salary after employee contributions.
 *
 * The function determines the taxable base by subtracting the tax-free allowance
 * from the grossAfterContributions and clamping the result to a minimum of 0.
 * It then applies the flat tax rate to the taxable base to compute the income tax.
 *
 * @param {number} grossAfterContributions - Gross salary remaining after employee contributions have been deducted.
 * @param {typeof RATES} rates - Rates object containing the tax rate and allowance:
 *   - rates.tax: flat income tax rate (e.g. 0.2 for 20%)
 *   - rates.allowance: tax-free allowance amount
 * @returns {TaxBreakdown} Object containing:
 *   - taxableBase: number - amount subject to income tax (>= 0)
 *   - incomeTax: number - income tax computed as taxableBase * tax
 */
export function calculateTax(
  grossAfterContributions: number,
  rates: typeof RATES,
): TaxBreakdown {
  const { tax, allowance } = rates;

  const taxableBase = Math.max(0, grossAfterContributions - allowance);

  const incomeTax = taxableBase * tax;

  return {
    taxableBase,
    incomeTax,
  };
}

export type SalaryBreakdown = {
  gross: number;
  net: number;
  contributions: ContributionsBreakdown;
  tax: TaxBreakdown;
};

/**
 * Calculates the net salary and full breakdown for a given gross salary.
 *
 * Steps:
 * - Calculates employee contributions (pension, health, unemployment, injury).
 * - Subtracts total contributions from gross to obtain grossAfterContributions.
 * - Computes taxable base as max(0, grossAfterContributions - allowance).
 * - Applies flat income tax to the taxable base and derives net = grossAfterContributions - incomeTax.
 *
 * @param {number} gross - Gross salary amount (before contributions and tax).
 * @param {typeof RATES} rates - Rates object containing contributions, tax and allowance.
 * @returns {SalaryBreakdown} Salary breakdown: { gross, net, contributions, tax }.
 */
export function calculateNetSalary(
  gross: number,
  rates: typeof RATES,
): SalaryBreakdown {
  const contributions = calculateContributions(gross, rates);
  const grossAfterContributions = gross - contributions.total;
  const tax = calculateTax(grossAfterContributions, rates);
  const net = grossAfterContributions - tax.incomeTax;

  return {
    gross,
    net,
    contributions,
    tax,
  };
}

/**
 * Given a target net salary, derives the required gross salary and returns the
 * full salary breakdown (gross, net, contributions, tax).
 *
 * The calculation accounts for employee contributions (pension, health,
 * unemployment, injury) and a flat income tax with a tax-free allowance.
 *
 * There are two branches:
 * - No-tax zone: if the provided `net` is less than or equal to the net
 *   threshold at which taxable income would become zero (after deducting
 *   contributions and allowance), no income tax applies. In this case the gross
 *   is obtained by reversing only the contribution deduction:
 *     gross = net / (1 - contributionRate)
 * - Taxable zone: if `net` exceeds that threshold, income tax applies. The
 *   algebraic solution that accounts for both contributions and tax is used:
 *     gross = (net - tax * allowance) / ((1 - contributionRate) * (1 - tax))
 *
 * The returned object has the same shape as `calculateNetSalary`:
 * { gross, net, contributions, tax }.
 *
 * @param {number} net - Target net salary (after contributions and income tax).
 * @param {typeof RATES} rates - Rates object containing contributions, tax and allowance.
 * @returns {SalaryBreakdown} Salary breakdown for the computed gross amount.
 */

export function calculateGrossSalary(
  net: number,
  rates: typeof RATES,
): SalaryBreakdown {
  const contributionRate = getTotalContributionRate(rates);

  const { tax, allowance } = rates;

  const multiplier = (1 - contributionRate) * (1 - tax);
  const constant = tax * allowance;
  const thresholdGross = allowance / (1 - contributionRate);
  const thresholdNet = (1 - contributionRate) * thresholdGross;

  let gross: number;

  if (net <= thresholdNet) {
    // No tax zone
    gross = net / (1 - contributionRate);
  } else {
    gross = (net - constant) / multiplier;
  }

  return calculateNetSalary(gross, rates);
}

type SalaryInput =
  | { type: "gross"; amount: number }
  | { type: "net"; amount: number };

/**
 * Calculates a salary conversion and breakdown.
 *
 * Depending on the input.type this function either:
 * - converts a gross amount into a net amount (including contributions and tax), or
 * - derives the gross amount that results in the given net amount and returns the full breakdown.
 *
 * @param input - Object specifying the type ("gross" | "net") and the amount to convert.
 * @param rates - Rates object (contributions, tax, allowance) used for the calculation.
 * @returns An object containing gross, net, contributions and tax breakdown for the computed salary.
 */
export function calculateSalary(
  input: SalaryInput,
  rates: typeof RATES,
): SalaryBreakdown {
  if (input.type === "gross") {
    return calculateNetSalary(input.amount, rates);
  }

  return calculateGrossSalary(input.amount, rates);
}
