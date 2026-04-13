/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

render(() => <App />, document.querySelector("body") as HTMLBodyElement);
