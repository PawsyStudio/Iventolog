import { routeTree } from '@/routeTree.gen';
import { useAuthStore } from '@/store/AuthStore';
import { createRouter, RouterProvider } from '@tanstack/react-router';

// Создаем роутер с начальным состоянием
const router = createRouter({
  routeTree,
  context: {
    isAuth: false, // Будет заполнено в AuthProvider
  },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <RouterProvider router={router} context={{ isAuth: isAuth }} />
  );
}

export default App;
