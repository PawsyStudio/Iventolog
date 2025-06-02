import { useState, useEffect } from 'react';
import styles from './MenuAndBudgetTab.module.css';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity_per_person: number;
}

export function MenuTab({ eventId }: { eventId: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    quantity_per_person: 1
  });
  const [error, setError] = useState<string | null>(null);

  // Загрузка меню
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/events/${eventId}/menu/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error('Ошибка загрузки меню');
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка сервера');
      }
    };

    fetchMenu();
  }, [eventId]);

  // Добавление нового пункта меню
  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:8000/api/events/${eventId}/menu/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItem)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка добавления пункта меню');
      }

      const createdItem = await response.json();
      setMenuItems([...menuItems, createdItem]);
      setIsAddingItem(false);
      setNewItem({ name: '', price: 0, quantity_per_person: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.header}>
        <h2>Меню мероприятия</h2>
        <button 
          onClick={() => setIsAddingItem(true)}
          className={styles.addButton}
        >
          Добавить пункт
        </button>
      </div>

      {isAddingItem && (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Название"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          />
          <input
            type="number"
            placeholder="Цена"
            value={newItem.price}
            onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
            min="0"
          />
          <input
            type="number"
            placeholder="Количество на человека"
            value={newItem.quantity_per_person}
            onChange={(e) => setNewItem({...newItem, quantity_per_person: Number(e.target.value)})}
            min="0.1"
            step="0.1"
          />
          <div className={styles.formButtons}>
            <button onClick={handleAddItem}>Сохранить</button>
            <button onClick={() => setIsAddingItem(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div className={styles.menuList}>
        {menuItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} ₽</td>
                  <td>{item.quantity_per_person}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Меню пока пустое</p>
        )}
      </div>
    </div>
  );
}