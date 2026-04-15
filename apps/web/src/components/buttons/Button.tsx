import { type ParentProps, splitProps } from "solid-js";

export interface ButtonProps extends ParentProps {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	class?: string;
	onClick?: (e: MouseEvent) => void;
}

export function Button(props: ButtonProps) {
	const [, rest] = splitProps(props, ["variant", "size", "disabled", "type", "class", "onClick", "children"]);
	const variant = () => props.variant || "primary";
	const size = () => props.size || "md";

	return (
		<button
			type={props.type || "button"}
			disabled={props.disabled}
			onClick={props.onClick}
			class={`btn-${size()} btn-${variant()} ${props.class || ""}`}
			{...rest}
		>
			{props.children}
		</button>
	);
}
