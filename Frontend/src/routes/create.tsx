import { createFileRoute, redirect } from '@tanstack/react-router';
import { Create } from '../pages/Create';

export const Route = createFileRoute('/create')({
  component: Create,
  beforeLoad: ({ context }) => {
    if (!context.isAuth) {
      throw redirect({
        to: '/',
        search: { showAuth: true, tab: 'login' }
      });
    }
  },
});