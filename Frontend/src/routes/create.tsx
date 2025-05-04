import { createFileRoute, redirect } from '@tanstack/react-router';
import { Create } from '../pages/Create';

export const Route = createFileRoute('/create')({
  component: Create,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuth) {
      throw redirect({ to: '/auth' });
    }
  },
});