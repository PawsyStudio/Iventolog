import type { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
}

export function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) return <div>Загрузка...</div>;
  if (events.length === 0) return <div>У вас пока нет мероприятий</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          {event.event_date && (
            <p>Дата: {new Date(event.event_date).toLocaleDateString()}</p>
          )}
          {event.description && <p>{event.description}</p>}
        </div>
      ))}
    </div>
  );
}