import { useState, useEffect } from 'react';
import styles from './PollAndGuestsTab.module.css';

interface Guest {
  id: string;
  full_name: string;
  telegram_id: string | null;
}

interface PollSettings {
  allow_menu_selection: boolean;
  poll_deadline: string;
}

export function PollAndGuestsTab({ eventId }: { eventId: string }) {
  const [pollSettings, setPollSettings] = useState<PollSettings>({
    allow_menu_selection: false,
    poll_deadline: '',
  });
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<PollSettings>({...pollSettings});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка настроек опроса
  const fetchPollSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/poll/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (response.status === 404) {
        setError('Мероприятие не найдено');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка загрузки настроек опроса');
      }
      
      const data = await response.json();
      
      // Убираем поле guests_count при сохранении в состояние
      const { guests_count, ...settings } = data;
      setPollSettings(settings);
      setTempSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Загрузка списка гостей
  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/guests/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Мероприятие не найдено');
        } else {
          throw new Error('Ошибка загрузки списка гостей');
        }
      }
      
      const data = await response.json();
      setGuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  // Первоначальная загрузка данных
  useEffect(() => {
    fetchPollSettings();
    fetchGuests();
  }, [eventId]);

  // Обработчик изменений настроек
  const handleSettingChange = (field: keyof PollSettings, value: string | boolean) => {
    setTempSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Сохранение настроек
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/poll/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          allow_menu_selection: tempSettings.allow_menu_selection,
          poll_deadline: tempSettings.poll_deadline
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка сохранения настроек');
      }

      const updatedSettings = await response.json();
      // Убираем guests_count из полученных данных
      const { guests_count, ...settings } = updatedSettings;
      setPollSettings(settings);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setTempSettings({...pollSettings});
    setIsEditing(false);
  };

  // Удаление гостя
  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Вы уверены, что хотите удалить гостя?')) return;
    
    try {
      const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/events/${eventId}/guests/${guestId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления гостя');
      }
      
      // Обновляем данные
      fetchGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Ссылка для регистрации гостей
  const registrationLink = `${window.location.origin}/public/event/${eventId}/guest-register`;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.pollBlock}>
        <h2>Опрос</h2>
        
        <div className={styles.settingRow}>
          <label>Право на выбор меню:</label>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={tempSettings.allow_menu_selection}
              onChange={(e) => handleSettingChange('allow_menu_selection', e.target.checked)}
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <label>Зарегистрировано гостей:</label>
          {/* Используем длину массива гостей вместо guests_count */}
          <span>{guests.length}</span>
        </div>
        
        <div className={styles.settingRow}>
          <label>Дата окончания опроса:</label>
          {isEditing ? (
            <input
              type="datetime-local"
              value={tempSettings.poll_deadline}
              onChange={(e) => handleSettingChange('poll_deadline', e.target.value)}
            />
          ) : (
            <span>{pollSettings.poll_deadline ? new Date(pollSettings.poll_deadline).toLocaleString() : 'Не установлена'}</span>
          )}
        </div>
        
        <div className={styles.settingRow}>
          <label>Ссылка для регистрации:</label>
          <div className={styles.linkContainer}>
            <input
              type="text"
              value={registrationLink}
              readOnly
              className={styles.linkInput}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button 
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(registrationLink);
                alert('Ссылка скопирована в буфер обмена');
              }}
            >
              Копировать
            </button>
          </div>
        </div>
        
        <div className={styles.controls}>
          {!isEditing ? (
            <button 
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Редактировать
            </button>
          ) : (
            <>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Отменить
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.guestsBlock}>
        {/* Используем длину массива гостей вместо guests_count */}
        <h2>Список гостей ({guests.length})</h2>
        
        {guests.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.guestsTable}>
              <thead>
                <tr>
                  <th>Telegram ID</th>
                  <th>ФИО</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.telegram_id ? `@${guest.telegram_id}` : '-'}</td>
                    <td>{guest.full_name}</td>
                    <td>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteGuest(guest.id)}
                        disabled={isLoading}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Пока никто не зарегистрировался</p>
        )}
      </div>
    </div>
  );
}