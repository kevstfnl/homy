import { Field } from "@ark-ui/solid";
import { For, Show, splitProps } from "solid-js";

export interface SelectItem {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface SelectProps {
	label?: string;
	error?: string;
	helperText?: string;
	items: SelectItem[];
	id?: string;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	class?: string;
	onChange?: (value: string) => void;
}

export function SelectField(props: SelectProps) {
	const [, rest] = splitProps(props, [
		"label",
		"error",
		"helperText",
		"items",
		"id",
		"placeholder",
		"value",
		"disabled",
		"class",
		"onChange",
	]);
	const fieldId = () => props.id || `select-${Math.random().toString(36).slice(2, 11)}`;

	return (
		<Field.Root>
			<Show when={props.label}>
				<Field.Label for={fieldId()} class="label">
					{props.label}
				</Field.Label>
			</Show>

			<select
				id={fieldId()}
				value={props.value || ""}
				disabled={props.disabled}
				onChange={(e) => props.onChange?.(e.currentTarget.value)}
				class={`field ${props.class || ""}`}
				{...rest}
			>
				<option value="">{props.placeholder || "Select an option"}</option>
				<For each={props.items}>
					{(item) => (
						<option value={item.value} disabled={item.disabled}>
							{item.label}
						</option>
					)}
				</For>
			</select>

			<Show when={props.error}>
				<Field.ErrorText class="field-error">{props.error}</Field.ErrorText>
			</Show>

			<Show when={props.helperText && !props.error}>
				<div class="field-helper">{props.helperText}</div>
			</Show>
		</Field.Root>
	);
}
