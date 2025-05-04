import { createFileRoute, redirect } from '@tanstack/react-router';
import { Auth } from '../pages/Auth';

export const Route = createFileRoute('/auth')({
  component: Auth,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuth) {
      throw redirect({ to: '/' });
    }
  },
});