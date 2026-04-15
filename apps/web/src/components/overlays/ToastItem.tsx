import { splitProps } from "solid-js";

export interface ToastItemData {
	id: string;
	title: string;
	description?: string;
	type: "success" | "error" | "warning" | "info";
}

interface ToastItemProps {
	toast: ToastItemData;
	onRemove: (id: string) => void;
}

const typeStyles = {
	success: "bg-success/90",
	error: "bg-error/90",
	warning: "bg-warning/90",
	info: "bg-info/90",
};

export function ToastItem(props: ToastItemProps) {
	const [, rest] = splitProps(props, ["toast", "onRemove"]);

	return (
		<div
			class={`card text-white rounded-lg p-4 shadow-lg pointer-events-auto max-w-sm animate-in fade-in slide-in-from-right-4 duration-200 ${typeStyles[props.toast.type]}`}
			{...rest}
		>
			<div class="flex justify-between items-start gap-3">
				<div>
					<div class="font-semibold">{props.toast.title}</div>
					{props.toast.description && <div class="text-sm mt-1 opacity-90">{props.toast.description}</div>}
				</div>
				<button
					type="button"
					onClick={() => props.onRemove(props.toast.id)}
					class="text-lg cursor-pointer opacity-70 hover:opacity-100 shrink-0"
					aria-label="Close"
				>
					✕
				</button>
			</div>
		</div>
	);
}
