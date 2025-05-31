import { useState } from 'react';
import type { Event } from '@/types/event';

export function EventSettingsTabs({ event }: { event: Event }) {
  const [activeTab, setActiveTab] = useState<'settings' | 'stats'>('settings');

  return (
    <div className="event-tabs">
      <div className="tabs-header">
        <button 
          onClick={() => setActiveTab('settings')}
          className={activeTab === 'settings' ? 'active' : ''}
        >
          Настройки
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={activeTab === 'stats' ? 'active' : ''}
        >
          Статистика
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Основные настройки</h2>
            <p>ID мероприятия: {event.id}</p>
            <p>Тип бюджета: {event.budget_type}</p>
            {/* Здесь будет форма редактирования */}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab">
            <h2>Статистика</h2>
            <p>Здесь будет статистика по мероприятию</p>
          </div>
        )}
      </div>
    </div>
  );
}