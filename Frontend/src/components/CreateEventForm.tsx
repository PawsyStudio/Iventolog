import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from './CreateEventForm.module.css';

interface CreateEventFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CreateEventForm({ onSuccess, onError }: CreateEventFormProps) {
  const [eventName, setEventName] = useState('');
  const [budgetType, setBudgetType] = useState<'solo' | 'group'>('solo');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }

      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: eventName,
          budget_type: budgetType 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка создания мероприятия');
      }

      // Вызываем колбэк при успехе, если он передан
      if (onSuccess) {
        onSuccess();
      } else {
        // Иначе делаем стандартный редирект
        navigate({ to: '/' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка соединения';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.createForm}>
      <h2>Создать мероприятие</h2>
      
      <div className={styles.formGroup}>
        <label>Название мероприятия</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Тип бюджета</label>
        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value as 'solo' | 'group')}
          required
        >
          <option value="solo">Соло</option>
          <option value="group">Групповой</option>
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Создание...' : 'Создать мероприятие'}
      </button>
    </form>
  );
}