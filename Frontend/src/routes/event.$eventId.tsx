import { createFileRoute, redirect } from '@tanstack/react-router';
import { EventSettingsPage } from '../pages/EventSettigsPage';

export const Route = createFileRoute('/event/$eventId')({
  component: EventSettingsPage,
  beforeLoad: ({ context }) => {
    if (!context.isAuth) {
      throw redirect({
        to: '/',
        search: { showAuth: true, tab: 'login' }
      });
    }
  },
});