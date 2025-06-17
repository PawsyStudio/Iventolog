// EventsPage.tsx
import { useState } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { CreateEventForm } from '@/components/CreateEventForm';
import { EventList } from '@/components/eventList/EventList';
import { useEvents } from '@/hooks/useEvents';
import Footer from '@/components/footer/Footer';
import { Sidebar } from '@/components/sidebar/Sidebar';
import styles from '../components/CreateEventForm.module.css';

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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#0d1822',
      position: 'relative'
    }}>
      {/* Затемнение фона при открытой форме */}
      {showCreateForm && <div className={styles.modalOverlay}></div>}
      
      <div style={{ 
        display: 'flex', 
        flex: 1,
        height: '908px'
      }}>
        <div style={{ 
          width: '418px', 
          flexShrink: 0,
          backgroundColor: '#102131'
        }}>
          <Sidebar onCreateEvent={() => setShowCreateForm(true)} />
        </div>
        
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          overflowY: 'auto',
          backgroundColor: '#0d1822'
        }}>
          {/* Заголовок "Все проекты" */}
          <div style={{ 
            marginBottom: '0.5rem',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            <h1 style={{ 
              color: '#ffffff', 
              fontSize: '22px',
              fontWeight: 400,
              margin: 0,
              marginBottom: '6px'
            }}>
              Все проекты
            </h1>
            
            <div style={{
              height: '1px',
              backgroundColor: '#0081ff',
              width: '170px'
            }} />
          </div>
          
          {/* Форма создания мероприятия */}
          {showCreateForm && <CreateEventForm 
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />}

          <EventList events={events} isLoading={isLoading} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}