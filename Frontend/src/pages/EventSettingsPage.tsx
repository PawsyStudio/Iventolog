import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useEvent } from '@/hooks/useEvent';
import Header from '@/components/headPack/appHeader/AppHeader';
import Footer from '@/components/footer/Footer';
import LogoutButton from '@/components/logoutButton/LogoutButton';
import { OverviewTab } from '@/components/eventSettings/OverviewTab';

export function EventSettingsPage() {
  const { eventId } = useParams({ from: '/event/$eventId' });
  const { event, isLoading, error } = useEvent(eventId);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'poll'>('overview');

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!event) return <div>Мероприятие не найдено</div>;

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        borderBottom: '1px solid #3498db',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            style={{
              padding: '1rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
              borderBottom: activeTab === 'overview' ? '3px solid #3498db' : 'none'
            }}
            onClick={() => setActiveTab('overview')}
          >
            Обзор
          </button>
          <button
            style={{
              padding: '1rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'menu' ? 'bold' : 'normal',
              borderBottom: activeTab === 'menu' ? '3px solid #3498db' : 'none'
            }}
            onClick={() => setActiveTab('menu')}
          >
            Меню и Бюджет
          </button>
          <button
            style={{
              padding: '1rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'poll' ? 'bold' : 'normal',
              borderBottom: activeTab === 'poll' ? '3px solid #3498db' : 'none'
            }}
            onClick={() => setActiveTab('poll')}
          >
            Опрос и Гости
          </button>
        </div>
        <LogoutButton />
      </div>

      <div style={{
        display: 'flex',
        padding: '2rem',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {activeTab === 'overview' && <OverviewTab event={event} />}
        {activeTab === 'menu' && <div>Меню и Бюджет (в разработке)</div>}
        {activeTab === 'poll' && <div>Опрос и Гости (в разработке)</div>}
      </div>
      <Footer />
    </>
  );
}