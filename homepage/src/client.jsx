import React from "react";
import { hydrateRoot } from "react-dom/client";
import "@fontsource/plus-jakarta-sans/latin-300.css";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import App from "./App.jsx";
hydrateRoot(document.getElementById("root"), <App />);
