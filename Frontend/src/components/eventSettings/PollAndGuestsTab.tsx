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
  guests_count: number;
}

export function PollAndGuestsTab({ eventId }: { eventId: string }) {
  const [pollSettings, setPollSettings] = useState<PollSettings>({
    allow_menu_selection: false,
    poll_deadline: '',
    guests_count: 0
  });
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<PollSettings>({...pollSettings});
  const [error, setError] = useState<string | null>(null);

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

      if (!response.ok) throw new Error('Ошибка загрузки настроек опроса');
      
      const data = await response.json();
      setPollSettings(data);
      setTempSettings(data);
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

      if (!response.ok) throw new Error('Ошибка загрузки списка гостей');
      
      const data = await response.json();
      setGuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Первоначальная загрузка данных
  useEffect(() => {
    fetchPollSettings();
    fetchGuests();
  }, [eventId]);

  // Обработчик изменений настроек
  const handleSettingChange = (field: string, value: string | boolean) => {
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

      if (!response.ok) throw new Error('Ошибка сохранения настроек');

      const updatedSettings = await response.json();
      setPollSettings(updatedSettings);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setTempSettings({...pollSettings});
    setIsEditing(false);
  };

  // Удаление гостя
  const handleDeleteGuest = async (guestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка удаления гостя');
      
      // Обновляем список гостей
      fetchGuests();
      // Обновляем счетчик гостей
      fetchPollSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Ссылка для регистрации гостей
  const registrationLink = `${window.location.origin}/event/${eventId}/guest-register`;

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
          <label>Количество людей, прошедших опрос:</label>
          <span>{pollSettings.guests_count}</span>
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
            <span>{new Date(pollSettings.poll_deadline).toLocaleString()}</span>
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
            />
            <button 
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(registrationLink)}
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
            >
              Редактировать
            </button>
          ) : (
            <>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
              >
                Сохранить
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Отменить
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.guestsBlock}>
        <h2>Список гостей</h2>
        
        {guests.length > 0 ? (
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
                  <td>{guest.telegram_id || '-'}</td>
                  <td>{guest.full_name}</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteGuest(guest.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Пока никто не зарегистрировался</p>
        )}
      </div>
    </div>
  );
}