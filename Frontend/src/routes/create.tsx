import { createFileRoute, redirect } from '@tanstack/react-router';
import { Create } from '../pages/Create';

export const Route = createFileRoute('/create')({
  component: Create,
  beforeLoad: ({ context }) => {
    console.log('Дед 1', context.isAuth);
    
    if (!context.isAuth) {
      throw redirect({ to: '/auth' });
    }

    console.log('Дед 2', context.isAuth);
  },
});