import { Field, Switch as SwitchArkUI } from "@ark-ui/solid";
import { Show, splitProps } from "solid-js";

export interface SwitchProps {
	label?: string;
	helperText?: string;
	checked?: boolean;
	disabled?: boolean;
	id?: string;
	class?: string;
	onChange?: (checked: boolean) => void;
}

export function SwitchField(props: SwitchProps) {
	const [, rest] = splitProps(props, ["label", "helperText", "checked", "disabled", "id", "class", "onChange"]);
	const fieldId = () => props.id || `switch-${Math.random().toString(36).slice(2, 11)}`;

	return (
		<Field.Root>
			<div class="flex items-center gap-3">
				<SwitchArkUI.Root
					id={fieldId()}
					checked={props.checked || false}
					onCheckedChange={(details) => props.onChange?.(details.checked)}
					disabled={props.disabled}
					{...rest}
				>
					<SwitchArkUI.Control class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-text-muted data-[state=checked]:bg-primary">
						<SwitchArkUI.Thumb class="inline-block h-4 w-4 transform rounded-full bg-surface shadow transition-transform data-[state=checked]:translate-x-5" />
					</SwitchArkUI.Control>
				</SwitchArkUI.Root>

				<Show when={props.label}>
					<Field.Label for={fieldId()} class="label cursor-pointer">
						{props.label}
					</Field.Label>
				</Show>
			</div>

			<Show when={props.helperText}>
				<div class="field-helper">{props.helperText}</div>
			</Show>
		</Field.Root>
	);
}
