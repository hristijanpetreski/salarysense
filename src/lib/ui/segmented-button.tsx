import { cva, type VariantProps } from "class-variance-authority";
import {
    type Accessor,
    createContext,
    type JSX,
    Show,
    splitProps,
    useContext,
} from "solid-js";
import { cn } from "~/lib/utils";

// --- Context Setup ---
type SegmentedButtonGroupState = {
    selectedValue: Accessor<string | string[]>;
    onSelect: (value: string) => void;
    multiple: boolean;
};

const SegmentedButtonGroupContext = createContext<SegmentedButtonGroupState>();

// --- Segmented Button Group ---
export type SegmentedButtonGroupProps = Omit<
    JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "onChange"
> &
    (
        | {
              multiple: true;
              value: string[];
              onChange: (value: string[]) => void;
          }
        | {
              multiple?: false | undefined;
              value: string;
              onChange: (value: string) => void;
          }
    );

export function SegmentedButtonGroup(props: SegmentedButtonGroupProps) {
    const [local, rest] = splitProps(props, [
        "value",
        "onChange",
        "multiple",
        "class",
        "children",
    ]);

    const handleSelect = (val: string) => {
        if (local.multiple) {
            // Narrow types: when multiple is true, value is string[] and onChange expects string[]
            const current = Array.isArray(local.value) ? local.value : [];
            const onChangeMultiple = local.onChange as (v: string[]) => void;
            if (current.includes(val)) {
                onChangeMultiple(current.filter((v) => v !== val));
            } else {
                onChangeMultiple([...current, val]);
            }
        } else {
            // Narrow types: when multiple is false/undefined, value is string and onChange expects string
            const onChangeSingle = local.onChange as (v: string) => void;
            onChangeSingle(val);
        }
    };

    return (
        <SegmentedButtonGroupContext.Provider
            value={{
                selectedValue: () => local.value,
                onSelect: handleSelect,
                multiple: local.multiple ?? false,
            }}
        >
            <fieldset
                class={cn(
                    // M3 Group Styles: Pill shape, outer outline, hidden overflow for the segments
                    "inline-flex h-10 w-fit items-center rounded-full border border-outline overflow-hidden",
                    local.class,
                )}
                {...rest}
            >
                {local.children}
            </fieldset>
        </SegmentedButtonGroupContext.Provider>
    );
}

// --- Segmented Button Variants (CVA) ---
const segmentedButtonVariants = cva(
    // Base M3 Segment Styles: internal borders, centering, transitions
    "relative inline-flex flex-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 border-r border-outline last:border-r-0",
    {
        variants: {
            selected: {
                true: "bg-secondary-container text-on-secondary-container hover:bg-on-secondary-container/10",
                false: "bg-surface text-on-surface hover:bg-on-surface/10",
            },
            disabled: {
                true: "pointer-events-none opacity-38", // M3 uses 38% opacity for disabled states
                false: "",
            },
        },
        defaultVariants: {
            selected: false,
            disabled: false,
        },
    },
);

// --- Individual Segmented Button ---
export interface SegmentedButtonProps
    extends
        Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
        Omit<VariantProps<typeof segmentedButtonVariants>, "disabled"> {
    value: string;
    label?: string;
    icon?: JSX.Element;
}

export function SegmentedButton(props: SegmentedButtonProps) {
    const [local, rest] = splitProps(props, [
        "class",
        "value",
        "label",
        "icon",
        "disabled",
        "children",
    ]);
    const context = useContext(SegmentedButtonGroupContext);

    if (!context) {
        throw new Error(
            "SegmentedButton must be used within a SegmentedButtonGroup",
        );
    }

    // Reactive selection check
    const isSelected = () => {
        const val = context.selectedValue();
        if (context.multiple) {
            return Array.isArray(val) && val.includes(local.value);
        }
        return val === local.value;
    };

    const handleClick = () => {
        if (!local.disabled) {
            context.onSelect(local.value);
        }
    };

    return (
        <button
            type="button"
            class={cn(
                segmentedButtonVariants({
                    selected: isSelected(),
                    disabled: local.disabled,
                }),
                local.class,
            )}
            onClick={handleClick}
            disabled={local.disabled}
            aria-pressed={isSelected()}
            {...rest}
        >
            {/* M3 Spec: Checkmark overrides the icon when selected */}
            <Show when={isSelected()} fallback={local.icon}>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <title>Check icon</title>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            </Show>

            {local.label || local.children}
        </button>
    );
}
