import { createFileRoute } from '@tanstack/react-router';
import { GuestRegistrationPage } from '@/components/guestPull/GuestRegistrationPage';

export const Route = createFileRoute('/event/$eventId/guest-register')({
  component: GuestRegistrationPage,
});