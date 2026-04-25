import { type JSX, mergeProps, splitProps } from "solid-js";

type ButtonVariant = "filled" | "outlined" | "text" | "elevated" | "tonal";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    icon?: JSX.Element;
}

export function Button(props: ButtonProps) {
    const merged = mergeProps({ variant: "filled" as ButtonVariant }, props);

    const [local, others] = splitProps(merged, [
        "variant",
        "icon",
        "class",
        "children",
    ]);

    const baseStyles =
        "inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-40 disabled:pointer-events-none";

    const variantStyles: Record<ButtonVariant, string> = {
        filled: "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 shadow-sm",
        outlined:
            "border border-outline text-primary bg-transparent hover:bg-primary/10 active:bg-primary/20",
        text: "text-primary bg-transparent hover:bg-primary/10 active:bg-primary/20 px-3",
        elevated:
            "bg-surface-container-low text-primary shadow-sm hover:shadow-md hover:bg-surface-container active:bg-surface-container-high",
        tonal: "bg-secondary text-on-secondary hover:bg-secondary/90 active:bg-secondary/80",
    };

    return (
        <button
            class={`${baseStyles} ${variantStyles[local.variant]} ${local.class || ""}`}
            {...others}
        >
            {local.icon && <span class="w-4 h-4">{local.icon}</span>}
            {local.children}
        </button>
    );
}
