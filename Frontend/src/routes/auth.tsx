import { createFileRoute, redirect } from '@tanstack/react-router';
import { Auth } from '../pages/Auth';

export const Route = createFileRoute('/auth')({
  component: Auth,
  beforeLoad: ({ context }) => {

    console.log('Баба Яга 1', context.isAuth);
    if (context.isAuth) {
      throw redirect({ to: '/' });
    }
  },
});