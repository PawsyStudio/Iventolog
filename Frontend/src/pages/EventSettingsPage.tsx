import { useParams } from '@tanstack/react-router';
import { useEvent } from '@/hooks/useEvent';
import { EventSettingsTabs } from '@/components/eventSettings/EventSettingsTabs';
import Header from '@/components/headPack/appHeader/AppHeader';
import Footer from '@/components/footer/Footer';

export function EventSettingsPage() {
  const { eventId } = useParams({ from: '/event/$eventId' });
  const { event, isLoading, error } = useEvent(eventId);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!event) return <div>Мероприятие не найдено</div>; // Добавили проверку на null

  return (
    <>
      <Header />
      <main className="event-settings">
        <h1>Настройки мероприятия: {event.title}</h1>
        <EventSettingsTabs event={event} />
      </main>
      <Footer />
    </>
  );
}