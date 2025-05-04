import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { AuthProvider } from '../contexts/AuthContext';

interface RouterContext {
  auth: {
    isAuth: boolean;
    token: string | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
});