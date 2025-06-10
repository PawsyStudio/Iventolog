import { createFileRoute } from '@tanstack/react-router';
import PublicGuestRegistrationPage from '@/components/guestPull/PublicGuestRegistrationPage';

export const Route = createFileRoute('/public/event/$eventId/guest-register')({
  component: PublicGuestRegistrationPage,
});