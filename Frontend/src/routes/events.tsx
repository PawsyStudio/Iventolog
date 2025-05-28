import { createFileRoute, redirect } from '@tanstack/react-router';
import { EventsPage } from '../pages/EventsPage';

export const Route = createFileRoute('/events')({
  component: EventsPage,
  beforeLoad: ({ context }) => {
    if (!context.isAuth) {
      throw redirect({
        to: '/',
        search: { showAuth: true, tab: 'login' }
      });
    }
  },
});