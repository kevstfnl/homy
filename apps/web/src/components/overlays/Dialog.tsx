import { Dialog as DialogArkUI } from "@ark-ui/solid";
import { type ParentProps, splitProps } from "solid-js";

interface DialogProps extends ParentProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function Dialog(props: DialogProps) {
	const [, rest] = splitProps(props, ["open", "onOpenChange", "children"]);
	return (
		<DialogArkUI.Root open={props.open} onOpenChange={(details) => props.onOpenChange?.(details.open)} {...rest}>
			{props.children}
		</DialogArkUI.Root>
	);
}

const Trigger = (props: ParentProps & { class?: string }) => (
	<DialogArkUI.Trigger class={`btn-md btn-primary ${props.class || ""}`}>{props.children}</DialogArkUI.Trigger>
);

const Content = (props: ParentProps & { class?: string }) => (
	<DialogArkUI.Positioner>
		<DialogArkUI.Content
			class={`card max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200 ${props.class || ""}`}
		>
			{props.children}
		</DialogArkUI.Content>
	</DialogArkUI.Positioner>
);

const Title = (props: ParentProps & { class?: string }) => (
	<DialogArkUI.Title class={`text-lg font-semibold ${props.class || ""}`}>{props.children}</DialogArkUI.Title>
);

const Description = (props: ParentProps & { class?: string }) => (
	<DialogArkUI.Description class={`text-sm text-text-muted mt-2 ${props.class || ""}`}>
		{props.children}
	</DialogArkUI.Description>
);

const Close = (props: ParentProps & { class?: string }) => (
	<DialogArkUI.CloseTrigger class={`btn-md btn-secondary ${props.class || ""}`}>
		{props.children || "Close"}
	</DialogArkUI.CloseTrigger>
);

Dialog.Trigger = Trigger;
Dialog.Content = Content;
Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Close = Close;

export { Dialog };
