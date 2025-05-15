import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

interface RouterContext {
  isAuth: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  
  return (
      <Outlet />
  );
}