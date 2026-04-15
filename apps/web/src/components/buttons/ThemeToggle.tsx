import { useTheme } from "../../libs/theme/ThemeProvider";
import { Button } from "./Button";

export function ThemeToggle() {
	const { theme, switchTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="md"
			onClick={(e: MouseEvent) => {
				const newTheme = theme() === "light" ? "dark" : "light";
				switchTheme(newTheme, e.currentTarget as HTMLElement);
			}}
			aria-label={`Switch to ${theme() === "light" ? "dark" : "light"} mode`}
		>
			{theme() === "light" ? "🌙" : "☀️"}
		</Button>
	);
}
