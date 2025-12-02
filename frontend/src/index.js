import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./theme.css";

function Root() {
    useEffect(() => {
        const saved = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", saved);
      }, []);

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
