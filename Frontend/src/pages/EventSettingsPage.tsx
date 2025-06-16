// EventSettingsPage.tsx
import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useEvent } from '@/hooks/useEvent';
import Footer from '@/components/footer/Footer';
import { OverviewTab } from '@/components/eventSettings/OverviewTab';
import { MenuAndBudgetTab } from '@/components/eventSettings/MenuAndBudgetTab';
import { PollAndGuestsTab } from '@/components/eventSettings/PollAndGuestsTab';
import { EventSettingsSidebar } from '@/components/eventSettings/EventSettingsSidebar';

export function EventSettingsPage() {
  const { eventId } = useParams({ from: '/event/$eventId' });
  const { event, isLoading, error } = useEvent(eventId);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'poll'>('overview');

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!event) return <div>Мероприятие не найдено</div>;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#0d1822',
    }}>
      <div style={{ 
        display: 'flex', 
        flex: 1,
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          width: '418px', 
          flexShrink: 0,
          backgroundColor: '#102131',
        }}>
          <EventSettingsSidebar 
            eventTitle={event.title}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        <div style={{ 
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
          backgroundColor: '#0d1822',
        }}>
          {activeTab === 'overview' && <OverviewTab event={event} />}
          {activeTab === 'menu' && <MenuAndBudgetTab eventId={event.id} />}
          {activeTab === 'poll' && <PollAndGuestsTab eventId={event.id} />}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}