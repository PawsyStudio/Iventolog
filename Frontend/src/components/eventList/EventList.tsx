// EventList.tsx
import { Link } from '@tanstack/react-router';
import type { Event } from '@/types/event';
import meroBorder from '../../assets/images/decoration/meroBorder.svg';
import styles from './EventList.module.css';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
}

export function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) return <div>Загрузка...</div>;
  if (events.length === 0) return <div>У вас пока нет мероприятий</div>;

  return (
    <div className={styles.eventListContainer}> {/* Добавлен контейнер для рамки */}
      <div className={styles.eventList}>
        {events.map(event => (
          <Link 
            to="/event/$eventId"
            params={{ eventId: event.id }}
            key={event.id}
            className={styles.eventCard}
          >
            <img 
              src={meroBorder} 
              alt="Event background" 
              className={styles.eventSvg}
            />
            <div className={styles.eventContent}>
              <h3>{event.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}