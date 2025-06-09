import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import styles from './GuestRegistrationPage.module.css';

export function PublicGuestRegistrationPage() {
  const { eventId } = useParams({ from: '/public/event/$eventId/guest-register' });
  const [telegramId, setTelegramId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [isEventLoading, setIsEventLoading] = useState(true);

  // Загрузка названия мероприятия
  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${eventId}/title/`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Мероприятие не найдено');
          } else {
            setError('Ошибка загрузки мероприятия');
          }
          return;
        }
        
        const data = await response.json();
        setEventTitle(data.title);
      } catch (err) {
        setError('Сервер недоступен');
      } finally {
        setIsEventLoading(false);
      }
    };

    fetchEventTitle();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Базовая валидация
    if (!telegramId.trim() || !fullName.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }
    
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

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(
          responseData.detail || 
          responseData.message || 
          `Ошибка ${response.status}: ${response.statusText}`
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEventLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Загрузка мероприятия...</div>
      </div>
    );
  }

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
        <h2>Регистрация на мероприятие: {eventTitle}</h2>
        
        {error ? (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)} className={styles.retryButton}>
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            <p>Пожалуйста, введите ваши данные:</p>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="telegramId">Telegram ID *</label>
                <input
                  type="text"
                  id="telegramId"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  required
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
          </>
        )}
      </div>
    </div>
  );
}