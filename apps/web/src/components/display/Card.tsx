import { type ParentProps, splitProps } from "solid-js";

export function Card(props: ParentProps & { class?: string }) {
	const [, rest] = splitProps(props, ["class", "children"]);
	return (
		<div class={`card p-6 ${props.class || ""}`} {...rest}>
			{props.children}
		</div>
	);
}

export function CardHeader(props: ParentProps & { class?: string }) {
	const [, rest] = splitProps(props, ["class", "children"]);
	return (
		<div class={`mb-4 ${props.class || ""}`} {...rest}>
			{props.children}
		</div>
	);
}

export function CardContent(props: ParentProps & { class?: string }) {
	const [, rest] = splitProps(props, ["class", "children"]);
	return (
		<div class={`mb-4 ${props.class || ""}`} {...rest}>
			{props.children}
		</div>
	);
}

export function CardFooter(props: ParentProps & { class?: string }) {
	const [, rest] = splitProps(props, ["class", "children"]);
	return (
		<div class={`mt-6 pt-6 border-t border-border flex gap-2 justify-end ${props.class || ""}`} {...rest}>
			{props.children}
		</div>
	);
}

// Compound component
Object.assign(Card, {
	Header: CardHeader,
	Content: CardContent,
	Footer: CardFooter,
});
