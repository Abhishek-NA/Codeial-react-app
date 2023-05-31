import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "react-toast-notifications";
import "./styles/index.css";
import { AuthProvider, PostsProvider } from "./providers";
import { App } from "./components";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-right">
      <AuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);
