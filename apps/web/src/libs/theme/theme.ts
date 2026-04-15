import { createEffect, createSignal } from "solid-js";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "homy-theme";

function getInitialTheme(): ThemeMode {
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}

	return "light";
}

function applyTheme(theme: ThemeMode) {
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function switchTheme(theme: ThemeMode) {
	// Enable smooth transitions
	document.documentElement.classList.add("theme-transition");

	// Apply the theme
	applyTheme(theme);

	// Remove transition class after animation completes
	setTimeout(() => {
		document.documentElement.classList.remove("theme-transition");
	}, 200);
}

export function createTheme() {
	const initialTheme = getInitialTheme();
	const [theme, setTheme] = createSignal<ThemeMode>(initialTheme);

	// Apply initial theme immediately
	applyTheme(initialTheme);

	createEffect(() => {
		applyTheme(theme());
	});

	return {
		theme,
		setTheme,
		switchTheme: (newTheme: ThemeMode) => {
			setTheme(newTheme);
			return switchTheme(newTheme);
		},
	};
}
