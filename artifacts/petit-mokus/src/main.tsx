import { createRoot } from "react-dom/client";
import App, { getLanguageFromPath } from "./App";
import { loadLanguage } from "./lib/i18n";
import "./index.css";

// The page's language is fetched before the first render, so no text flashes in English.
loadLanguage(getLanguageFromPath()).then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
