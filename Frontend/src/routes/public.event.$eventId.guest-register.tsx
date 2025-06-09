import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/public/event/$eventId/guest-register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/public/event/$eventId/guest-register"!</div>
}
