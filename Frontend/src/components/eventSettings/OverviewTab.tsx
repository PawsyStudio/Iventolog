import { useState } from 'react';
import type { Event } from '@/types/event';
import styles from './OverviewTab.module.css';

export function OverviewTab({ event }: { event: Event }) {
  const [isEditingGuests, setIsEditingGuests] = useState(false);
  const [guestsCount, setGuestsCount] = useState(event.guests_count || 0);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(event.description || '');

  const handleUpdateEvent = async (data: { description?: string; guests_count?: number }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Ошибка обновления');
      // Можно добавить уведомление об успехе
    } catch (error) {
      console.error('Ошибка:', error);
      // Можно добавить уведомление об ошибке
    }
  };

  const handleSaveGuests = () => {
    setIsEditingGuests(false);
    handleUpdateEvent({ guests_count: guestsCount });
  };

  const handleSaveDescription = () => {
    setIsEditingDesc(false);
    handleUpdateEvent({ description });
  };

  return (
    <div className={styles.overview}>
      <div className={styles.summary}>
        <h2>Сводка по мероприятию:</h2>
        <ul className={styles.list}>
          <li>
            Количество гостей: 
            {isEditingGuests ? (
              <>
                <input 
                  type="number" 
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                />
                <button 
                  onClick={handleSaveGuests}
                  className={styles.button}
                >
                  ✓
                </button>
              </>
            ) : (
              <>
                {guestsCount}
                <button 
                  onClick={() => setIsEditingGuests(true)}
                  className={styles.button}
                >
                  Редактировать
                </button>
              </>
            )}
          </li>
          {event.budget_type === 'GROUP' && (
            <li>Сумма с человека: 0 RUB</li>
          )}
          <li>Итоговая сумма: 0 RUB</li>
        </ul>
      </div>

      <div className={styles.params}>
        <h2>Основные параметры:</h2>
        <ul className={styles.list}>
          <li>Название мероприятия: {event.title}</li>
          <li>Тип Бюджета: {event.budget_type === 'SOLO' ? 'Соло' : 'Группа'}</li>
          <li>Тип места проведения: {event.venue_type === 'OWN' ? 'Своё' : 'Съёмное'}</li>
          <li>Дата проведения: {event.event_date ? new Date(event.event_date).toLocaleString() : 'Не указана'}</li>
          <li>Дата окончания опроса: (заглушка)</li>
        </ul>

        <div className={styles.descriptionBlock}>
          <h3>Описание мероприятия</h3>
          {isEditingDesc ? (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                maxLength={2000}
              />
              <button 
                onClick={handleSaveDescription}
                className={styles.button}
              >
                ✓ Подтвердить
              </button>
            </>
          ) : (
            <>
              <div className={styles.descriptionText}>
                {description || 'Описание отсутствует'}
              </div>
              <button 
                onClick={() => setIsEditingDesc(true)}
                className={styles.button}
              >
                Редактировать
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}