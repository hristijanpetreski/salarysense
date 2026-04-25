export const mkdFormatter = new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency: "MKD",
    currencyDisplay: "code",
});

export function formatMkd(value: number | null | undefined) {
    if (value == null || Number.isNaN(Number(value))) return "";
    const formatted = mkdFormatter.format(Number(value));
    if (formatted.includes("ден")) return formatted;
    if (/MKD/.test(formatted)) return formatted.replace(/MKD/g, "ден.");
    return `${formatted} ден.`;
}
