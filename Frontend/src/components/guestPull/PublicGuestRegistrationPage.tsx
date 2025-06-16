import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import styles from './GuestRegistrationPage.module.css';
import Footer from '@/components/footer/Footer';
import HomeLogo from '../../assets/images/logos/iventologHeader.svg';

function RegistrationHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={HomeLogo} alt="Iventolog Logo" className={styles.logo} />
      </div>
      <div className={styles.welcomeContainer}>
        <span className={styles.welcomeText}>WELCOME</span>
      </div>
    </header>
  );
}

export default function PublicGuestRegistrationPage() {
  const { eventId } = useParams({ from: '/public/event/$eventId/guest-register' });
  const [telegramId, setTelegramId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [pollDeadline, setPollDeadline] = useState<string | null>(null);
  const [isPollClosed, setIsPollClosed] = useState(false);

  useEffect(() => {
    let isMounted = true;

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
        if (isMounted) setEventTitle(data.title);
      } catch (err) {
        if (isMounted) setError('Сервер недоступен');
      }
    };

    const fetchPollDeadline = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${eventId}/poll/`
        );
        
        if (response.status === 404) {
          return;
        }
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки настроек опроса');
        }
        
        const data = await response.json();
        if (isMounted) setPollDeadline(data.poll_deadline);
      } catch (err) {
        console.error('Ошибка загрузки дедлайна:', err);
      }
    };

    const loadData = async () => {
      setIsEventLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchEventTitle(), fetchPollDeadline()]);
      } finally {
        if (isMounted) setIsEventLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (!pollDeadline) return;
    
    const now = new Date();
    const deadline = new Date(pollDeadline);
    
    if (now > deadline) {
      setIsPollClosed(true);
    }
  }, [pollDeadline]);

  const checkExistingRegistration = async (tgId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/${eventId}/guests/exists?telegram_id=${encodeURIComponent(tgId)}`
      );
      
      if (response.status === 200) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || isPollClosed) return;
    
    const cleanTelegramId = telegramId.trim().replace('@', '');
    const cleanFullName = fullName.trim();
    
    if (!cleanTelegramId || !cleanFullName) {
      setError('Заполните все обязательные поля');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(cleanTelegramId)) {
      setError('Telegram ID должен содержать 5-32 символа (латиница, цифры, подчеркивания)');
      return;
    }
    
    if (!/^[а-яА-ЯёЁa-zA-Z\s\-.]{2,100}$/.test(cleanFullName)) {
      setError('ФИО должно содержать 2-100 символов (буквы, пробелы, дефисы)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const alreadyRegistered = await checkExistingRegistration(cleanTelegramId);
      if (alreadyRegistered) {
        setError('Этот Telegram ID уже зарегистрирован на мероприятие');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/events/${eventId}/guests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: cleanTelegramId,
          full_name: cleanFullName
        })
      });

      if (response.status === 409) {
        setError('Пользователь с таким Telegram ID уже зарегистрирован');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Ошибка регистрации');
      }

      setSuccess(true);
      
      setTimeout(() => {
        setTelegramId('');
        setFullName('');
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <RegistrationHeader />
      
      <div className={styles.container}>
        {isEventLoading ? (
          <div className={styles.loadingMessage}>Загрузка мероприятия...</div>
        ) : error && !eventTitle ? (
          <div className={styles.errorMessage}>
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button 
              className={styles.homeButton}
              onClick={() => window.location.href = '/'}
            >
              На главную
            </button>
          </div>
        ) : isPollClosed ? (
          <div className={styles.closedMessage}>
            <h2>Регистрация закрыта</h2>
            <p>К сожалению, срок регистрации на мероприятие истек.</p>
            <button 
              className={styles.homeButton}
              onClick={() => window.location.href = '/'}
            >
              На главную
            </button>
          </div>
        ) : success ? (
          <div className={styles.successMessage}>
            <h2>Регистрация успешна!</h2>
            <p>Вы зарегистрированы на мероприятие: {eventTitle}</p>
            <button 
              className={styles.homeButton}
              onClick={() => window.location.href = '/'}
            >
              Вернуться на главную
            </button>
          </div>
        ) : (
          <div className={styles.formWrapper}>
            <h2 className={styles.pollTitle}>Опрос на: 1 мероприятие</h2>
            
            {error ? (
              <div className={styles.error}>
                {error}
                <button onClick={() => setError(null)} className={styles.retryButton}>
                  Попробовать снова
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="telegramId">Telegram ID *</label>
                  <input
                    type="text"
                    id="telegramId"
                    value={telegramId}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value.length === 1 && !value.startsWith('@')) {
                        value = '@' + value;
                      }
                      setTelegramId(value);
                    }}
                    required
                    placeholder="@username"
                    pattern="^@[a-zA-Z0-9_]{5,32}$"
                    title="Формат: @username (5-32 символов, латиница, цифры, подчеркивание)"
                  />
                  <small>Пример: @my_telegram123</small>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">ФИО *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Иванов Иван Иванович"
                    pattern="^[а-яА-ЯёЁa-zA-Z\s\-.]{2,100}$"
                    title="Только буквы, пробелы и дефисы (2-100 символов)"
                  />
                  <small>Пример: Иванов Иван Иванович</small>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}