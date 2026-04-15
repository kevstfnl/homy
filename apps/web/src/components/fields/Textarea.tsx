import { Field } from "@ark-ui/solid";
import { type ParentProps, Show, splitProps } from "solid-js";

export interface TextareaProps extends ParentProps {
	label?: string;
	error?: string;
	helperText?: string;
	id?: string;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	rows?: number;
	class?: string;
	onChange?: (e: Event) => void;
	onInput?: (e: Event) => void;
}

export function Textarea(props: TextareaProps) {
	const [, rest] = splitProps(props, [
		"label",
		"error",
		"helperText",
		"id",
		"placeholder",
		"value",
		"disabled",
		"rows",
		"class",
		"onChange",
		"onInput",
		"children",
	]);
	const fieldId = () => props.id || `textarea-${Math.random().toString(36).slice(2, 11)}`;

	return (
		<Field.Root>
			<Show when={props.label}>
				<Field.Label for={fieldId()} class="label">
					{props.label}
				</Field.Label>
			</Show>

			<textarea
				id={fieldId()}
				placeholder={props.placeholder}
				value={props.value}
				disabled={props.disabled}
				rows={props.rows || 4}
				onChange={props.onChange}
				onInput={props.onInput}
				class={`field resize-none ${props.class || ""}`}
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
