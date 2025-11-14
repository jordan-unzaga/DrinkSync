import React from "react";
import { createRoot } from "react-dom/client";
import { DrinkPage } from "./pages/DrinkPage";
import "./styles/DrinkCard.css";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
    <React.StrictMode>
        <DrinkPage />
    </React.StrictMode>
);
