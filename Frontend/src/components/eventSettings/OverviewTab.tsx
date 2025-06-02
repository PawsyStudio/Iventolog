import { useState, useEffect } from 'react';
import type { Event } from '@/types/event';
import styles from './OverviewTab.module.css';

export function OverviewTab({ event: initialEvent }: { event: Event }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(initialEvent);
  const [formData, setFormData] = useState({
    guests_count: initialEvent.guests_count || 0,
    description: initialEvent.description || ''
  });

  // Обновляем локальное состояние при изменении initialEvent
  useEffect(() => {
    setCurrentEvent(initialEvent);
    setFormData({
      guests_count: initialEvent.guests_count || 0,
      description: initialEvent.description || ''
    });
  }, [initialEvent]);

  const handleUpdateEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const dataToSend: { guests_count?: number; description?: string } = {};
      
      if (formData.guests_count !== undefined) {
        dataToSend.guests_count = formData.guests_count;
      }
      
      if (formData.description !== undefined) {
        dataToSend.description = formData.description;
      }

      const response = await fetch(`http://localhost:8000/api/events/${initialEvent.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) throw new Error('Ошибка обновления');
      
      const updatedEvent = await response.json();
      
      // Обновляем локальное состояние
      setCurrentEvent(updatedEvent);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests_count' ? Number(value) : value
    }));
  };

  return (
    <div className={styles.overview}>
      <div className={styles.summary}>
        <h2>Сводка по мероприятию:</h2>
        <ul className={styles.list}>
          {currentEvent.budget_type === 'GROUP' && (
            <li>Сумма с человека: 0 RUB</li>
          )}
          <li>Итоговая сумма: 0 RUB</li>
        </ul>
      </div>

      <div className={styles.params}>
        <h2>Основные параметры:</h2>
        <ul className={styles.list}>
          <li>Название мероприятия: {currentEvent.title}</li>
          <li>Тип Бюджета: {currentEvent.budget_type === 'SOLO' ? 'Соло' : 'Группа'}</li>
          <li>Тип места проведения: {currentEvent.venue_type === 'OWN' ? 'Своё' : 'Съёмное'}</li>
          <li>Дата проведения: {currentEvent.event_date ? new Date(currentEvent.event_date).toLocaleString() : 'Не указана'}</li>
          <li>Дата окончания опроса: (заглушка)</li>
          
          <li>
            Количество гостей: 
            {isEditing ? (
              <input 
                type="number" 
                name="guests_count"
                value={formData.guests_count}
                onChange={handleInputChange}
                className={styles.input}
                min="0"
              />
            ) : (
              currentEvent.guests_count || 0
            )}
          </li>
        </ul>

        <div className={styles.descriptionBlock}>
          <h3>Описание мероприятия</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              maxLength={2000}
            />
          ) : (
            <div className={styles.descriptionText}>
              {currentEvent.description || 'Описание отсутствует'}
            </div>
          )}
        </div>


        <div className={styles.controls}>
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className={styles.buttonCancel}>
                Отмена
              </button>
              <button onClick={handleUpdateEvent} className={styles.buttonSave}>
                Сохранить
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className={styles.buttonEdit}>
              Редактировать
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
