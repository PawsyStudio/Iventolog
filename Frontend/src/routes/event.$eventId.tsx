import { createFileRoute, redirect } from '@tanstack/react-router';
import { EventSettingsPage } from '../pages/EventSettingsPage';

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