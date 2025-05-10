import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles.css";

interface RouterContext {
  auth: {
    isAuth: boolean;
    token: string | null;
  };
}

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuth: localStorage.getItem('token') !== null,
      token: localStorage.getItem('token')
    }
  },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    routerContext: RouterContext;
  }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  );
}