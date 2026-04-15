/* @refresh reload */
import { render } from "solid-js/web";
import { ThemeProvider } from "./libs/theme/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import "./assets/styles/index.css";
import "virtual:uno.css";

render(
	() => (
		<ThemeProvider>
			<Dashboard />
		</ThemeProvider>
	),
	document.querySelector("body") as HTMLBodyElement,
);
