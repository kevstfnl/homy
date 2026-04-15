import { Field } from "@ark-ui/solid";
import { type ParentProps, Show, splitProps } from "solid-js";

export interface InputProps extends ParentProps {
	label?: string;
	error?: string;
	helperText?: string;
	id?: string;
	type?: string;
	placeholder?: string;
	value?: string | number;
	disabled?: boolean;
	class?: string;
	onChange?: (e: Event) => void;
	onInput?: (e: Event) => void;
}

export function Input(props: InputProps) {
	const [, rest] = splitProps(props, [
		"label",
		"error",
		"helperText",
		"id",
		"type",
		"placeholder",
		"value",
		"disabled",
		"class",
		"onChange",
		"onInput",
		"children",
	]);
	const fieldId = () => props.id || `input-${Math.random().toString(36).slice(2, 11)}`;

	return (
		<Field.Root>
			<Show when={props.label}>
				<Field.Label for={fieldId()} class="label">
					{props.label}
				</Field.Label>
			</Show>

			<Field.Input
				id={fieldId()}
				type={props.type || "text"}
				placeholder={props.placeholder}
				value={props.value}
				disabled={props.disabled}
				onChange={props.onChange}
				onInput={props.onInput}
				class={`field ${props.class || ""}`}
				{...rest}
			/>

			<Show when={props.error}>
				<Field.ErrorText class="field-error">{props.error}</Field.ErrorText>
			</Show>

			<Show when={props.helperText && !props.error}>
				<div class="field-helper">{props.helperText}</div>
			</Show>
		</Field.Root>
	);
}
