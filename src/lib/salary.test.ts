import { describe, expect, it } from "vitest";
import { RATES } from "./constants";
import {
  calculateContributions,
  calculateGrossSalary,
  calculateNetSalary,
  calculateSalary,
  calculateTax,
  getTotalContributionRate,
} from "./salary";

describe("getTotalContributionRate", () => {
  it("should sum all employee contribution rates correctly", () => {
    const result = getTotalContributionRate(RATES);
    const expected = 0.188 + 0.075 + 0.012 + 0.005;
    expect(result).toBe(expected);
  });
});

describe("calculateContributions", () => {
  it("should calculate contributions correctly for gross salary of 65000", () => {
    const gross = 65000;
    const result = calculateContributions(gross, RATES);

    expect(result.pensionAndDisability).toBe(
      gross * RATES.contributions.pensionAndDisability,
    );
    expect(result.healthInsurance).toBe(
      gross * RATES.contributions.healthInsurance,
    );
    expect(result.unemploymentInsurance).toBe(
      gross * RATES.contributions.unemploymentInsurance,
    );
    expect(result.additionalHealthInsurance).toBe(
      gross * RATES.contributions.additionalHealthInsurance,
    );
    expect(result.total).toBe(
      result.pensionAndDisability +
        result.healthInsurance +
        result.unemploymentInsurance +
        result.additionalHealthInsurance,
    );
  });

  it("should handle zero gross salary", () => {
    const result = calculateContributions(0, RATES);
    expect(result.pensionAndDisability).toBe(0);
    expect(result.healthInsurance).toBe(0);
    expect(result.unemploymentInsurance).toBe(0);
    expect(result.additionalHealthInsurance).toBe(0);
    expect(result.total).toBe(0);
  });

  it("should handle negative gross salary", () => {
    const gross = -50000;
    const result = calculateContributions(gross, RATES);
    expect(result.pensionAndDisability).toBe(
      gross * RATES.contributions.pensionAndDisability,
    );
    expect(result.total).toBeLessThan(0);
  });
});

describe("calculateTax", () => {
  it("should calculate tax correctly when grossAfterContributions exceeds allowance", () => {
    const grossAfterContributions = 50000;
    const result = calculateTax(grossAfterContributions, RATES);
    const expectedTaxableBase = grossAfterContributions - RATES.allowance;

    expect(result.taxableBase).toBe(expectedTaxableBase);
    expect(result.incomeTax).toBe(expectedTaxableBase * RATES.tax);
  });

  it("should return 0 taxable base and tax when grossAfterContributions is below allowance", () => {
    const grossAfterContributions = 5000;
    const result = calculateTax(grossAfterContributions, RATES);

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
  });

  it("should handle grossAfterContributions equal to allowance", () => {
    const result = calculateTax(RATES.allowance, RATES);

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
  });
});

describe("calculateNetSalary", () => {
  it("should calculate complete salary breakdown for gross of 65000", () => {
    const gross = 65000;
    const result = calculateNetSalary(gross, RATES);

    expect(result.gross).toBe(gross);
    expect(result.contributions).toEqual(calculateContributions(gross, RATES));

    const grossAfterContributions = gross - result.contributions.total;
    expect(result.tax).toEqual(calculateTax(grossAfterContributions, RATES));

    const expectedNet = grossAfterContributions - result.tax.incomeTax;
    expect(result.net).toBe(expectedNet);
  });
});

describe("calculateGrossSalary", () => {
  it("should derive gross from net in no-tax zone", () => {
    // Net amount that should be below the threshold
    const contributionRate = getTotalContributionRate(RATES);
    const thresholdNet =
      (RATES.allowance / (1 - contributionRate)) * (1 - contributionRate);
    const net = thresholdNet - 1000;

    const result = calculateGrossSalary(net, RATES);

    // Verify the net matches (within floating point precision)
    expect(result.net).toBeCloseTo(net, 5);
    expect(result.tax.incomeTax).toBe(0);
  });

  it("should derive gross from net in taxable zone", () => {
    // Higher net amount that triggers tax
    const net = 50000;
    const result = calculateGrossSalary(net, RATES);

    // Verify the net matches
    expect(result.net).toBeCloseTo(net, 5);
    expect(result.tax.incomeTax).toBeGreaterThan(0);
  });

  it("should handle zero net salary", () => {
    const result = calculateGrossSalary(0, RATES);

    expect(result.net).toBeCloseTo(0, 5);
    expect(result.gross).toBeCloseTo(0, 5);
  });

  it("should be reversible with calculateNetSalary", () => {
    const originalGross = 65000;
    const netResult = calculateNetSalary(originalGross, RATES);
    const derivedGross = calculateGrossSalary(netResult.net, RATES);

    expect(derivedGross.gross).toBeCloseTo(originalGross, 5);
    expect(derivedGross.net).toBeCloseTo(netResult.net, 5);
  });
});

describe("calculateSalary", () => {
  it("should calculate net salary when type is gross", () => {
    const gross = 65000;
    const result = calculateSalary({ type: "gross", amount: gross }, RATES);
    const expected = calculateNetSalary(gross, RATES);

    expect(result).toEqual(expected);
  });

  it("should calculate gross salary when type is net", () => {
    const net = 50000;
    const result = calculateSalary({ type: "net", amount: net }, RATES);
    const expected = calculateGrossSalary(net, RATES);

    expect(result).toEqual(expected);
  });

  it("should handle edge case: gross input of 0", () => {
    const result = calculateSalary({ type: "gross", amount: 0 }, RATES);

    expect(result.gross).toBe(0);
    expect(result.net).toBe(0);
  });

  it("should handle edge case: net input of 0", () => {
    const result = calculateSalary({ type: "net", amount: 0 }, RATES);

    expect(result.net).toBeCloseTo(0, 5);
    expect(result.gross).toBeCloseTo(0, 5);
  });
});
