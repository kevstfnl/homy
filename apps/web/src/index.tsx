/* @refresh reload */
import { render } from "solid-js/web";
import Dashboard from "./pages/Dashboard";

render(() => <Dashboard />, document.querySelector("body") as HTMLBodyElement);
