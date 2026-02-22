import { Title } from "@solidjs/meta";
import { createMemo, createSignal } from "solid-js";
import { calculateSalary, finalizeSalary } from "~/lib/salary";

export default function Home() {
    const [mode, setMode] = createSignal<"gross" | "net">("gross");
    const [amount, setAmount] = createSignal<number>(0);

    const salary = createMemo(() => {
        const rawSalary = calculateSalary({ type: mode(), amount: amount() });
        return finalizeSalary(rawSalary);
    });

    return (
        <main class="grid place-content-center h-full bg-surface text-on-surface">
            <Title>SalarySense</Title>
            <section>
                <div class="flex">
                    <button
                        type="button"
                        class="px-4 py-2 border border-outline"
                        onClick={() => setMode("gross")}
                    >
                        {mode() === "gross" && (
                            <span class="mr-1">&check;</span>
                        )}
                        Gross
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 border border-t-outline -ml-px"
                        onClick={() => setMode("net")}
                    >
                        {mode() === "net" && <span class="mr-1">&check;</span>}
                        Net
                    </button>
                </div>

                <input
                    type="number"
                    value={amount()}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </section>

            <br />

            <section>
                <p>Your gross salary is: {salary().gross}</p>
                <p>Your net salary is: {salary().net}</p>
                <p>Total contributions: {salary().contributions.total}</p>
                <p>Total tax: {salary().tax.incomeTax}</p>
            </section>

            <br />

            <section>
                <p>
                    Pension and disability:{" "}
                    {salary().contributions.pensionAndDisability}
                </p>
                <p>
                    Health insurance: {salary().contributions.healthInsurance}
                </p>
                <p>
                    Unemployment insurance:{" "}
                    {salary().contributions.unemploymentInsurance}
                </p>
                <p>
                    Additional health insurance:{" "}
                    {salary().contributions.additionalHealthInsurance}
                </p>
            </section>

            <br />

            <section>
                <p>Taxable base: {salary().tax.taxableBase}</p>
                <p>Incom tax: {salary().tax.incomeTax}</p>
            </section>
        </main>
    );
}
