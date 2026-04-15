import { type ParentProps, splitProps } from "solid-js";

interface SeparatorProps extends ParentProps {
	class?: string;
	vertical?: boolean;
}

export function Separator(props: SeparatorProps) {
	const [, rest] = splitProps(props, ["class", "vertical", "children"]);

	return (
		<div
			class={`${props.vertical ? "w-px h-full bg-border" : "h-px w-full bg-border"} ${props.class || ""}`}
			{...rest}
		/>
	);
}
