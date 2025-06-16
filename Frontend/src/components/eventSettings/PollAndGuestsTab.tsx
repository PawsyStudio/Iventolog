import { useState, useEffect } from 'react';
import styles from './PollAndGuestsTab.module.css';
import Bg1 from '@/assets/images/decoration/1.svg';
import Bg2 from '@/assets/images/decoration/2.svg';
import Bg3 from '@/assets/images/decoration/3.svg';
import Bg4 from '@/assets/images/decoration/4.svg';

interface Guest {
  id: string;
  full_name: string;
  telegram_id: string | null;
}

interface PollSettings {
  poll_deadline: string;
}

export function PollAndGuestsTab({ eventId }: { eventId: string }) {
  const [pollSettings, setPollSettings] = useState<PollSettings>({
    poll_deadline: '',
  });
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<PollSettings>({...pollSettings});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const convertUTCToLocal = (utcDate: string) => {
    if (!utcDate) return '';
    const date = new Date(utcDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const convertLocalToUTC = (localDate: string) => {
    if (!localDate) return '';
    const date = new Date(localDate);
    return date.toISOString();
  };

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
      const { guests_count, ...settings } = data;
      setPollSettings(settings);
      setTempSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

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

  useEffect(() => {
    fetchPollSettings();
    fetchGuests();
  }, [eventId]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      setIsLoading(true);
      
      const originalLocal = convertUTCToLocal(pollSettings.poll_deadline);
      const hasChanged = originalLocal !== tempSettings.poll_deadline;
      
      if (!hasChanged) {
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const utcDeadline = convertLocalToUTC(tempSettings.poll_deadline);
      
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/poll/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          poll_deadline: utcDeadline
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка сохранения настроек');
      }

      const updatedSettings = await response.json();
      const { guests_count, ...settings } = updatedSettings;
      setPollSettings(settings);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempSettings({...pollSettings});
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({
      ...pollSettings,
      poll_deadline: convertUTCToLocal(pollSettings.poll_deadline)
    });
  };

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
      
      fetchGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  const registrationLink = `${window.location.origin}/public/event/${eventId}/guest-register`;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Загрузка данных...</div>
      </div>
    );
  }

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

      <div className={styles.container}>
        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className={styles.columnsContainer}>
          <div className={styles.pollBlock}>
            <h2>Опрос</h2>
            
            <div className={styles.settingRow}>
              <label>Зарегистрировано гостей:</label>
              <span>{guests.length}</span>
            </div>
            
            <div className={styles.settingRow}>
              <label>Дата окончания опроса:</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={tempSettings.poll_deadline}
                  onChange={(e) => setTempSettings({...tempSettings, poll_deadline: e.target.value})}
                  className={styles.dateInput}
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
                  onClick={handleEdit}
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
              <p className={styles.emptyMessage}>Пока никто не зарегистрировался</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}