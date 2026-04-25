import { createUniqueId, type JSX } from "solid-js";
import { cn } from "../utils";

type Props = {
    label: string;
    supportingText?: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
    label,
    supportingText,
    class: providedClass,
    ...props
}: Props) {
    const id = createUniqueId();

    return (
        <div>
            <div class="relative">
                <input
                    class={cn(
                        "peer focus:outline-2 focus:outline-primary placeholder:invisible rounded-sm outline outline-outline text-on-surface text-base/6 tracking-wide font-normal px-4 h-14",
                        providedClass,
                    )}
                    {...props}
                    id={`input-${id}`}
                />
                <label
                    for={`input-${id}`}
                    class="absolute peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 left-3 peer-focus:text-primary peer-focus:top-0 peer-focus:-translate-y-1/2 top-0 -translate-y-1/2 transition-all bg-surface peer-placeholder-shown:text-on-surface-variant font-normal peer-placeholder-shown:text-base/6 peer-placeholder-shown:tracking-wide px-1"
                >
                    {label}
                </label>
            </div>
            {supportingText && (
                <p class="mt-1 px-4 text-on-surface-variant text-xs/4 font-normal">
                    {supportingText}
                </p>
            )}
        </div>
    );
}
