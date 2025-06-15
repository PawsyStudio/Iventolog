// CreateEventForm.tsx
import { useState } from 'react';
import styles from './CreateEventForm.module.css';

interface CreateEventFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export function CreateEventForm({ onSuccess, onError, onCancel }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    venue_type: 'OWN' as 'OWN' | 'RENTED',
    venue_cost: '' as string | null,
    event_date: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Необходима авторизация');

      if (formData.venue_type === 'RENTED' && !formData.venue_cost) {
        throw new Error('Укажите стоимость аренды');
      }

      const payload = {
        title: formData.title,
        venue_type: formData.venue_type,
        venue_cost: formData.venue_type === 'RENTED' ? Number(formData.venue_cost) : null,
        event_date: formData.event_date,
      };

      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка создания мероприятия');
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка соединения';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.createForm}>
      <h2 className={styles.title}>Создать мероприятие</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>Название мероприятия *</label>
        <input
          type="text"
          className={styles.input}
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          maxLength={100}
          placeholder="Введите название"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Тип места проведения *</label>
        <select
          className={styles.select}
          value={formData.venue_type}
          onChange={(e) => handleChange('venue_type', e.target.value as 'OWN' | 'RENTED')}
          required
        >
          <option value="OWN">Своё помещение</option>
          <option value="RENTED">Аренда</option>
        </select>
      </div>

      {formData.venue_type === 'RENTED' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Стоимость аренды *</label>
          <input
            type="number"
            className={styles.input}
            min="0"
            step="100"
            value={formData.venue_cost || ''}
            onChange={(e) => handleChange('venue_cost', e.target.value)}
            required
            placeholder="Укажите стоимость"
          />
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Дата и время проведения *</label>
        <input
          type="datetime-local"
          className={styles.input}
          value={formData.event_date}
          onChange={(e) => handleChange('event_date', e.target.value)}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </button>
        )}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Создание...' : 'Создать мероприятие'}
        </button>
      </div>
    </form>
  );
}