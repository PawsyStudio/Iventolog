import { useState, useEffect } from 'react';
import type { Event } from '@/types/event';
import styles from './OverviewTab.module.css';

import Bg1 from '@/assets/images/decoration/1.svg';
import Bg2 from '@/assets/images/decoration/2.svg';
import Bg3 from '@/assets/images/decoration/3.svg';
import Bg4 from '@/assets/images/decoration/4.svg';
import BackOver from '@/assets/images/decoration/backOver.svg';

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
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  
  const [formParams, setFormParams] = useState({
    title: initialEvent.title,
    venue_type: initialEvent.venue_type,
    venue_cost: initialEvent.venue_cost || '',
    event_date: initialEvent.event_date ? 
      new Date(initialEvent.event_date).toISOString().slice(0, 16) : ''
  });

  const guestsCount = currentEvent.guests_count || 0;

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

  const handleParamChange = (field: string, value: string | number) => {
    setFormParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    <div style={{ 
      position: 'relative', 
      width: '100%',
      minHeight: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed',
        top: '0px',
        right: '0px',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <img src={Bg1} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '-90px',
        right: '0px',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <img src={Bg2} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
      
      <div style={{
        position: 'fixed',
        top: '318px',
        right: '0px',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <img src={Bg3} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '0px',
        right: '513px',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <img src={Bg4} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
      
      <div style={{
        position: 'fixed',
        top: '94px',
        right: '15px',
        zIndex: 0.5,
        pointerEvents: 'none',
      }}>
        <img src={BackOver} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>

      <div className={styles.overview} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.summary}>
          <h2>Сводка по мероприятию:</h2>
          <ul className={styles.list}>
            <li>
              <div className={styles.summaryContainer}>
                <span className={styles.summaryLabel}>Количество гостей:</span>
                <span className={styles.summaryValue}>{guestsCount}</span>
              </div>
              <div className={styles.line}></div>
            </li>
            <li>
              <div className={styles.summaryContainer}>
                <span className={styles.summaryLabel}>Сумма с человека:</span>
                <span className={styles.summaryValue}>
                  {budgetData ? `${budgetData.total_per_person.toFixed(2)} RUB` : 'Загрузка...'}
                </span>
              </div>
              <div className={styles.line}></div>
            </li>
            <li>
              <div className={styles.summaryContainer}>
                <span className={styles.summaryLabel}>Итоговая сумма:</span>
                <span className={styles.summaryValue}>
                  {budgetData ? `${budgetData.total_overall.toFixed(2)} RUB` : 'Загрузка...'}
                </span>
              </div>
              <div className={styles.line}></div>
            </li>
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
              <span className={styles.paramLabel}>Название мероприятия:</span>
              {isEditingParams ? (
                <input
                  type="text"
                  className={styles.paramInput}
                  value={formParams.title}
                  onChange={(e) => handleParamChange('title', e.target.value)}
                  maxLength={100}
                />
              ) : (
                <span className={styles.paramValue}>{currentEvent.title}</span>
              )}
            </li>
            
            <li>
              <span className={styles.paramLabel}>Тип места проведения:</span>
              {isEditingParams ? (
                <select
                  className={styles.paramInput}
                  value={formParams.venue_type}
                  onChange={(e) => handleParamChange('venue_type', e.target.value)}
                >
                  <option value="OWN">Своё</option>
                  <option value="RENTED">Съёмное</option>
                </select>
              ) : (
                <span className={styles.paramValue}>
                  {currentEvent.venue_type === 'OWN' ? 'Своё' : 'Съёмное'}
                </span>
              )}
            </li>
            
            {currentEvent.venue_type === 'RENTED' && !isEditingParams && (
              <li>
                <span className={styles.paramLabel}>Цена за аренду:</span>
                <span className={styles.paramValue}>
                  {Number(currentEvent.venue_cost).toLocaleString('ru-RU')} RUB
                </span>
              </li>
            )}
            
            {formParams.venue_type === 'RENTED' && isEditingParams && (
              <li>
                <span className={styles.paramLabel}>Цена за аренду:</span>
                <input
                  type="number"
                  className={styles.paramInput}
                  min="0"
                  step="100"
                  value={formParams.venue_cost}
                  onChange={(e) => handleParamChange('venue_cost', e.target.value)}
                />
              </li>
            )}
            
            <li>
              <span className={styles.paramLabel}>Дата проведения:</span>
              {isEditingParams ? (
                <input
                  type="datetime-local"
                  className={styles.paramInput}
                  value={formParams.event_date}
                  onChange={(e) => handleParamChange('event_date', e.target.value)}
                />
              ) : (
                <span className={styles.paramValue}>
                  {currentEvent.event_date ? 
                    new Date(currentEvent.event_date).toLocaleString('ru-RU', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) 
                    : 'Не указана'}
                </span>
              )}
            </li>
          </ul>

          {isEditingParams && (
            <div className={styles.paramControls}>
              <button 
                className={styles.submitButton}
                onClick={updateEventParams}
              >
                Подтвердить
              </button>
              <button 
                className={styles.cancelButton}
                onClick={cancelParamsEdit}
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}