import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { initializeAuth } from "./api/client";
import AuthStatus from "./components/ui/AuthStatus";
import "./styles.css";
 
const root = createRoot(document.getElementById("root")!);
root.render(<AuthStatus state="connecting" />);
 
initializeAuth()
  .then(() => root.render(<StrictMode><App /></StrictMode>))
  .catch((error: unknown) => {
    console.error("Unable to initialize Eriez SSO", error);
    root.render(<AuthStatus state="error" />);
  });