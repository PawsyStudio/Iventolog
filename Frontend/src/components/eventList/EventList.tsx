import { Link } from '@tanstack/react-router';
import type { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
}

export function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) return <div>Загрузка...</div>;
  if (events.length === 0) return <div>У вас пока нет мероприятий</div>;

  return (
    <div className="event-list">
      {events.map(event => (
        <Link 
          to="/event/$eventId"
          params={{ eventId: event.id }}
          key={event.id}
          className="event-card"
        >
          <h3>{event.title}</h3>
          {event.event_date && (
            <p>Дата: {new Date(event.event_date).toLocaleDateString()}</p>
          )}
        </Link>
      ))}
    </div>
  );
}