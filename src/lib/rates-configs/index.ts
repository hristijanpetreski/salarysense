import { RATES as RATES_2020 } from "./2020";
import { RATES as RATES_2021 } from "./2021";
import { RATES as RATES_2022 } from "./2022";
import { RATES as RATES_2023 } from "./2023";
import { RATES as RATES_2024 } from "./2024";
import { RATES as RATES_2025 } from "./2025";
import { RATES as RATES_2026 } from "./2026";
import type { RatesConfig } from "./types";

export const AvailableYears = [
    2026, 2025, 2024, 2023, 2022, 2021, 2020,
] as const;

const RatesMap: Record<number, RatesConfig> = {
    2026: RATES_2026,
    2025: RATES_2025,
    2024: RATES_2024,
    2023: RATES_2023,
    2022: RATES_2022,
    2021: RATES_2021,
    2020: RATES_2020,
};

export function getRates(year?: number): RatesConfig {
    if (year == null) {
        return RatesMap[AvailableYears[AvailableYears.length - 1]];
    }

    const found = RatesMap[year];
    if (!found) {
        throw new Error(`Rates for year ${year} not available`);
    }

    return found;
}
