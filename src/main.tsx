import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
    createRoot(document.getElementById("root")!).render(<App />);
} catch (e) {
    console.error("Failed to render app:", e);
    document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
    <h1>Something went wrong</h1>
    <p>The application failed to start. Here is the error:</p>
    <pre style="background: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto;">${e instanceof Error ? e.message + "\\n" + e.stack : String(e)}</pre>
  </div>`;
}
