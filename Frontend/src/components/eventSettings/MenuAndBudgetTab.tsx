import { useState, useEffect } from 'react';
import styles from './MenuAndBudgetTab.module.css';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity_per_person: number;
}

interface BudgetData {
  total_per_person: number;
  total_overall: number;
  purchases_per_person: number;
  purchases_overall: number;
  venue_per_person: number;
  venue_overall: number;
}

export function MenuAndBudgetTab({ eventId }: { eventId: string }) {
  // Состояния для меню
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    quantity_per_person: 1
  });
  const [error, setError] = useState<string | null>(null);

  // Состояния для бюджета
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  // Загрузка данных меню
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

      if (!response.ok) throw new Error('Ошибка загрузки меню');
      
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Загрузка данных бюджета
  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/budget/`, {
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

  // Первоначальная загрузка данных
  useEffect(() => {
    fetchMenu();
    fetchBudget();
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

      if (!response.ok) throw new Error('Ошибка добавления пункта меню');

      const createdItem = await response.json();
      setMenuItems([...menuItems, createdItem]);
      setIsAddingItem(false);
      setNewItem({ name: '', price: 0, quantity_per_person: 1 });
      await fetchBudget(); // Обновляем данные бюджета после изменения меню
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  return (
    <div className={styles.container}>
      {/* Блок ошибок */}
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Блок управления меню */}
      <div className={styles.menuBlock}>
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
                  <th>Цена за единицу</th>
                  <th>Количество на человека</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)} ₽</td>
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

      {/* Блок с бюджетом */}
      <div className={styles.budgetBlock}>
        <h2>Бюджет мероприятия</h2>
        
        {budgetData ? (
          <table className={styles.budgetTable}>
            <thead>
              <tr>
                <th>Категория</th>
                <th>С человека</th>
                <th>Общая сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Общая сумма</td>
                <td>{budgetData.total_per_person.toFixed(2)} ₽</td>
                <td>{budgetData.total_overall.toFixed(2)} ₽</td>
              </tr>
              <tr>
                <td>За покупки</td>
                <td>{budgetData.purchases_per_person.toFixed(2)} ₽</td>
                <td>{budgetData.purchases_overall.toFixed(2)} ₽</td>
              </tr>
              <tr>
                <td>За помещение</td>
                <td>{budgetData.venue_per_person.toFixed(2)} ₽</td>
                <td>{budgetData.venue_overall.toFixed(2)} ₽</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Загрузка данных бюджета...</p>
        )}
      </div>
    </div>
  );
}