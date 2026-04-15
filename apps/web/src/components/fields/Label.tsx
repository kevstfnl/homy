import { type ParentProps, splitProps } from "solid-js";

interface LabelProps extends ParentProps {
	for?: string;
	required?: boolean;
	class?: string;
}

export function Label(props: LabelProps) {
	const [, rest] = splitProps(props, ["for", "required", "class", "children"]);

	return (
		<label for={props.for} class={`label ${props.class || ""}`} {...rest}>
			{props.children}
			{props.required && <span class="text-error ml-0.5">*</span>}
		</label>
	);
}
