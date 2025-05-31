import { useState } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { CreateEventForm } from '@/components/CreateEventForm';
import { EventList } from '@/components/eventList/EventList';
import { useEvents } from '@/hooks/useEvents';
import Header from '@/components/headPack/appHeader/AppHeader';
import Footer from '@/components/footer/Footer';

export function EventsPage() {
  const { isAuth } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { events, isLoading, refetch } = useEvents();

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  if (!isAuth) return null;

  return (
    <>
      <Header />
      <main>
        <div>
          <h1>Мои мероприятия</h1>
          <button onClick={() => setShowCreateForm(true)}>
            Создать новое
          </button>
        </div>

        {showCreateForm && (
          <div>
            <CreateEventForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <EventList events={events} isLoading={isLoading} />
      </main>
      <Footer />
    </>
  );
}