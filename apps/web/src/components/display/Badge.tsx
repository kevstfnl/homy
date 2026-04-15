import { type ParentProps, splitProps } from "solid-js";

export interface BadgeProps extends ParentProps {
	variant?: "default" | "success" | "warning" | "error" | "info";
	class?: string;
}

const variantStyles = {
	default: "bg-primary/10 text-primary",
	success: "bg-success/10 text-success",
	warning: "bg-warning/10 text-warning",
	error: "bg-error/10 text-error",
	info: "bg-info/10 text-info",
};

export function Badge(props: BadgeProps) {
	const [, rest] = splitProps(props, ["variant", "class", "children"]);
	const variant = () => props.variant || "default";

	return (
		<span
			class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant()]} ${props.class || ""}`}
			{...rest}
		>
			{props.children}
		</span>
	);
}
