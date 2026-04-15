import { createSignal, For } from "solid-js";
import { ToastItem, type ToastItemData } from "./ToastItem";

let toasterInstance: { add: (item: Omit<ToastItemData, "id">) => void } | null = null;

export function createToaster() {
	const [toasts, setToasts] = createSignal<ToastItemData[]>([]);

	const add = (item: Omit<ToastItemData, "id">) => {
		const id = Math.random().toString(36).slice(2, 11);
		const toast: ToastItemData = { ...item, id };
		setToasts((prev) => [...prev, toast]);

		setTimeout(
			() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			},
			item.type === "error" ? 5000 : 3000,
		);
	};

	const remove = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	toasterInstance = { add };

	return {
		toasts,
		add,
		remove,
		success: (title: string, description?: string) => add({ title, description, type: "success" }),
		error: (title: string, description?: string) => add({ title, description, type: "error" }),
		warning: (title: string, description?: string) => add({ title, description, type: "warning" }),
		info: (title: string, description?: string) => add({ title, description, type: "info" }),
	};
}

export function ToastRegion(props: { toaster: ReturnType<typeof createToaster> }) {
	return (
		<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
			<For each={props.toaster.toasts()}>{(toast) => <ToastItem toast={toast} onRemove={props.toaster.remove} />}</For>
		</div>
	);
}

export function getToaster() {
	if (!toasterInstance) {
		throw new Error("Toaster not initialized. Create one with createToaster()");
	}
	return toasterInstance;
}
