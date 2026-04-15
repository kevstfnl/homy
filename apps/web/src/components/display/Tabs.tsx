import { Tabs as TabsArkUI } from "@ark-ui/solid";
import { For, type ParentProps, splitProps } from "solid-js";

export interface TabItem {
	value: string;
	label: string;
	disabled?: boolean;
}

interface TabsProps extends ParentProps {
	items: TabItem[];
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	class?: string;
}

export function Tabs(props: TabsProps) {
	const [, rest] = splitProps(props, ["items", "defaultValue", "onValueChange", "class", "children"]);

	return (
		<TabsArkUI.Root
			defaultValue={props.defaultValue || props.items[0]?.value}
			onValueChange={(details) => props.onValueChange?.(details.value)}
		>
			<TabsArkUI.List class="flex gap-1 border-b border-border">
				<For each={props.items}>
					{(item) => (
						<TabsArkUI.Trigger
							value={item.value}
							disabled={item.disabled}
							class="px-4 py-2 text-sm font-medium text-text-muted hover:text-text data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-colors duration-200"
						>
							{item.label}
						</TabsArkUI.Trigger>
					)}
				</For>
			</TabsArkUI.List>

			<For each={props.items}>
				{(item) => (
					<TabsArkUI.Content value={item.value} class={`mt-4 ${props.class || ""}`} {...rest}>
						{props.children}
					</TabsArkUI.Content>
				)}
			</For>
		</TabsArkUI.Root>
	);
}
