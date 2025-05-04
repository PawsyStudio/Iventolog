import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Определяем тип контекста роутера
interface RouterContext {
  auth: {
    isAuth: boolean;
    token: string | null;
  };
}

// Создаем роутер с типизированным контекстом
const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuth: localStorage.getItem('token') !== null,
      token: localStorage.getItem('token'),
    },
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Регистрируем типы для TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    routerContext: RouterContext;
  }
}

// Рендерим приложение
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

reportWebVitals();