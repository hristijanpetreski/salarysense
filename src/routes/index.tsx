import { Title } from "@solidjs/meta";
import { createMemo, createSignal } from "solid-js";
import { formatMkd } from "~/lib/formatters";
import { calculateSalary, finalizeSalary } from "~/lib/salary";
import Input from "~/lib/ui/input";
import {
    SegmentedButton,
    SegmentedButtonGroup,
} from "~/lib/ui/segmented-button";

type SalaryMode = "gross" | "net";

export default function Home() {
    const [mode, setMode] = createSignal<SalaryMode>("gross");
    const [amount, setAmount] = createSignal<string>("");

    const salary = createMemo(() => {
        const rawSalary = calculateSalary({
            type: mode(),
            amount: Number(amount()),
        });
        return finalizeSalary(rawSalary);
    });

    return (
        <main class="h-full bg-surface text-on-surface">
            <Title>SalarySense</Title>
            <section class="flex flex-col items-center">
                <div>
                    <SegmentedButtonGroup
                        value={mode()}
                        onChange={(e) => setMode(e as SalaryMode)}
                    >
                        <SegmentedButton value="gross">Gross</SegmentedButton>
                        <SegmentedButton value="net">Net</SegmentedButton>
                    </SegmentedButtonGroup>
                </div>

                <Input
                    label="Amount"
                    type="number"
                    placeholder="Amount"
                    supportingText={`Enter your ${mode()} salary`}
                    value={amount()}
                    onInput={(e) => setAmount(e.target.value)}
                />
            </section>

            <br />

            <section>
                <p>Your gross salary is: {formatMkd(salary().gross)}</p>
                <p>Your net salary is: {formatMkd(salary().net)}</p>
                <p>
                    Total contributions:{" "}
                    {formatMkd(salary().contributions.total)}
                </p>
                <p>Total tax: {formatMkd(salary().tax.incomeTax)}</p>
            </section>

            <br />

            <section>
                <p>
                    Pension and disability:{" "}
                    {formatMkd(salary().contributions.pensionAndDisability)}
                </p>
                <p>
                    Health insurance:{" "}
                    {formatMkd(salary().contributions.healthInsurance)}
                </p>
                <p>
                    Unemployment insurance:{" "}
                    {formatMkd(salary().contributions.unemploymentInsurance)}
                </p>
                <p>
                    Additional health insurance:{" "}
                    {formatMkd(
                        salary().contributions.additionalHealthInsurance,
                    )}
                </p>
            </section>

            <br />

            <section>
                <p>Taxable base: {formatMkd(salary().tax.taxableBase)}</p>
                <p>Incom tax: {formatMkd(salary().tax.incomeTax)}</p>
            </section>
        </main>
    );
}
