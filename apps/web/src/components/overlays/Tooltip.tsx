import { Tooltip as TooltipArkUI } from "@ark-ui/solid";
import { type ParentProps, splitProps } from "solid-js";

export interface TooltipProps extends ParentProps {
	content: string;
	side?: "top" | "right" | "bottom" | "left";
	class?: string;
}

export function Tooltip(props: TooltipProps) {
	const [, rest] = splitProps(props, ["content", "side", "class", "children"]);

	return (
		<TooltipArkUI.Root>
			<TooltipArkUI.Trigger {...rest}>{props.children}</TooltipArkUI.Trigger>

			<TooltipArkUI.Positioner>
				<TooltipArkUI.Content
					class={`bg-text text-bg rounded-lg px-3 py-2 text-sm font-medium shadow-lg animate-in fade-in zoom-in-95 duration-150 ${props.class || ""}`}
				>
					{props.content}
					<TooltipArkUI.Arrow>
						<TooltipArkUI.ArrowTip />
					</TooltipArkUI.Arrow>
				</TooltipArkUI.Content>
			</TooltipArkUI.Positioner>
		</TooltipArkUI.Root>
	);
}
