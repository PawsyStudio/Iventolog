import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { CreateEventForm } from '@/components/CreateEventForm';
import Header from '@/components/headPack/appHeader/AppHeader';
import Footer from '@/components/footer/Footer';

interface Event {
  id: string;
  title: string;
  budget_type: 'SOLO' | 'GROUP';
  event_date?: string;
  description?: string;
}

export function EventsPage() {
  const { isAuth } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/events/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuth) fetchEvents();
  }, [isAuth]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetch('http://localhost:8000/api/events/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setEvents(data));
  };

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

        {isLoading ? (
          <div>Загрузка...</div>
        ) : events.length === 0 ? (
          <div>У вас пока нет мероприятий</div>
        ) : (
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
        )}
      </main>
      <Footer />
    </>
  );
}