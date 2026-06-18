import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/annotation-prd.css";
import "./styles/first-open.css";
import "./styles/presentation.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
