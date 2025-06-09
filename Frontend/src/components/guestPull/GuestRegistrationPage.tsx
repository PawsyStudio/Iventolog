import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import styles from './GuestRegistrationPage.module.css';

export function GuestRegistrationPage() {
  const { eventId } = useParams({ from: '/event/$eventId/guest-register' });
  const [telegramId, setTelegramId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/guests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramId,
          full_name: fullName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка регистрации');
      }

      setSuccess(true);
      setTelegramId('');
      setFullName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h2>Регистрация успешна!</h2>
          <p>Вы успешно зарегистрированы на мероприятие.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Регистрация на мероприятие</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="telegramId">Telegram ID</label>
            <input
              type="text"
              id="telegramId"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Ваш ID в Telegram"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="fullName">ФИО *</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Ваше полное имя"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}