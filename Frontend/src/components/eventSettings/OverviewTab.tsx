import { useState, useEffect } from 'react';
import type { Event } from '@/types/event';
import styles from './OverviewTab.module.css';

interface BudgetData {
  total_per_person: number;
  total_overall: number;
  purchases_per_person: number;
  purchases_overall: number;
  venue_per_person: number;
  venue_overall: number;
}

export function OverviewTab({ event: initialEvent }: { event: Event }) {
  const [currentEvent, setCurrentEvent] = useState(initialEvent);
  const [isEditingParams, setIsEditingParams] = useState(false);
  const [guestsCount] = useState(initialEvent.guests_count || 0);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  
  // Форма для редактирования параметров
  const [formParams, setFormParams] = useState({
    title: initialEvent.title,
    venue_type: initialEvent.venue_type,
    venue_cost: initialEvent.venue_cost || '',
    event_date: initialEvent.event_date ? 
      new Date(initialEvent.event_date).toISOString().slice(0, 16) : ''
  });

  // Загрузка данных бюджета
  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${initialEvent.id}/budget/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка загрузки бюджета');
      
      const data = await response.json();
      setBudgetData(data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Обновление состояний при изменении initialEvent
  useEffect(() => {
    setCurrentEvent(initialEvent);
    setFormParams({
      title: initialEvent.title,
      venue_type: initialEvent.venue_type,
      venue_cost: initialEvent.venue_cost || '',
      event_date: initialEvent.event_date ? 
        new Date(initialEvent.event_date).toISOString().slice(0, 16) : ''
    });
    fetchBudget();
  }, [initialEvent]);

  // Обновление основных параметров
  const updateEventParams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Необходима авторизация');

      if (formParams.venue_type === 'RENTED' && !formParams.venue_cost) {
        throw new Error('Укажите стоимость аренды');
      }

      const payload: any = {
        title: formParams.title,
        venue_type: formParams.venue_type,
        event_date: formParams.event_date
      };

      if (formParams.venue_type === 'RENTED') {
        payload.venue_cost = Number(formParams.venue_cost);
      } else {
        payload.venue_cost = null;
      }

      const response = await fetch(`http://localhost:8000/api/events/${initialEvent.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка обновления');
      }
      
      const updatedEvent = await response.json();
      setCurrentEvent(updatedEvent);
      setIsEditingParams(false);
      fetchBudget();
      
    } catch (error) {
      console.error('Ошибка:', error);
      setFormParams({
        title: currentEvent.title,
        venue_type: currentEvent.venue_type,
        venue_cost: currentEvent.venue_cost || '',
        event_date: currentEvent.event_date ? 
          new Date(currentEvent.event_date).toISOString().slice(0, 16) : ''
      });
    }
  };

  // Обработчик изменений в форме параметров
  const handleParamChange = (field: string, value: string | number) => {
    setFormParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Отмена редактирования параметров
  const cancelParamsEdit = () => {
    setFormParams({
      title: currentEvent.title,
      venue_type: currentEvent.venue_type,
      venue_cost: currentEvent.venue_cost || '',
      event_date: currentEvent.event_date ? 
        new Date(currentEvent.event_date).toISOString().slice(0, 16) : ''
    });
    setIsEditingParams(false);
  };

  return (
    <div className={styles.overview}>
      <div className={styles.summary}>
        <h2>Сводка по мероприятию:</h2>
        <ul className={styles.list}>
          <li>Количество гостей: {guestsCount}</li>
          <li>Сумма с человека: {budgetData ? `${budgetData.total_per_person.toFixed(2)} RUB` : 'Загрузка...'}</li>
          <li>Итоговая сумма: {budgetData ? `${budgetData.total_overall.toFixed(2)} RUB` : 'Загрузка...'}</li>
        </ul>
      </div>

      <div className={styles.params}>
        <div className={styles.paramsHeader}>
          <h2>Основные параметры:</h2>
          {!isEditingParams && (
            <button 
              className={styles.editButton}
              onClick={() => setIsEditingParams(true)}
            >
              Редактировать
            </button>
          )}
        </div>
        
        <ul className={styles.list}>
          <li>
            Название мероприятия: 
            {isEditingParams ? (
              <input
                type="text"
                className={styles.input}
                value={formParams.title}
                onChange={(e) => handleParamChange('title', e.target.value)}
                maxLength={100}
              />
            ) : (
              currentEvent.title
            )}
          </li>
          
          <li>
            Тип места проведения: 
            {isEditingParams ? (
              <select
                className={styles.select}
                value={formParams.venue_type}
                onChange={(e) => handleParamChange('venue_type', e.target.value)}
              >
                <option value="OWN">Своё</option>
                <option value="RENTED">Съёмное</option>
              </select>
            ) : (
              currentEvent.venue_type === 'OWN' ? 'Своё' : 'Съёмное'
            )}
          </li>
          
          {/* Блок для отображения цены аренды в режиме просмотра */}
          {currentEvent.venue_type === 'RENTED' && !isEditingParams && (
            <li>
              Цена за аренду: {Number(currentEvent.venue_cost).toLocaleString('ru-RU')} RUB
            </li>
          )}
          
          {/* Блок для редактирования цены аренды */}
          {formParams.venue_type === 'RENTED' && isEditingParams && (
            <li>
              Цена за аренду: 
              <input
                type="number"
                className={styles.input}
                min="0"
                step="100"
                value={formParams.venue_cost}
                onChange={(e) => handleParamChange('venue_cost', e.target.value)}
              />
            </li>
          )}
          
          <li>
            Дата проведения: 
            {isEditingParams ? (
              <input
                type="datetime-local"
                className={styles.input}
                value={formParams.event_date}
                onChange={(e) => handleParamChange('event_date', e.target.value)}
              />
            ) : (
              currentEvent.event_date ? new Date(currentEvent.event_date).toLocaleString() : 'Не указана'
            )}
          </li>
        </ul>

        {isEditingParams && (
          <div className={styles.paramControls}>
            <button 
              className={styles.cancelButton}
              onClick={cancelParamsEdit}
            >
              Отмена
            </button>
            <button 
              className={styles.submitButton}
              onClick={updateEventParams}
            >
              Подтвердить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}