import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";  // fonts.css уже импортирован здесь
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);