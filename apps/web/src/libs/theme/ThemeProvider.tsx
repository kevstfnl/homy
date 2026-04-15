import { createContext, type ParentProps, useContext } from "solid-js";
import { createTheme, type ThemeMode } from "./theme";

interface ThemeContextValue {
	theme: () => ThemeMode;
	setTheme: (theme: ThemeMode) => void;
	switchTheme: (theme: ThemeMode, element: HTMLElement) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>();

export function ThemeProvider(props: ParentProps) {
	const themeUtils = createTheme();

	return <ThemeContext.Provider value={themeUtils}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
