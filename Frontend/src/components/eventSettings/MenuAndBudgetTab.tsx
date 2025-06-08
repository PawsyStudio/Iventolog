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

// Новый интерфейс для данных о событии
interface EventData {
  guests_count: number;
}

// Новый интерфейс для данных о продукте
interface ProductItem {
  name: string;
  totalPrice: number;
  totalQuantity: number;
}

export function MenuAndBudgetTab({ eventId }: { eventId: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    quantity_per_person: 1
  });
  const [error, setError] = useState<string | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  
  // Новое состояние для данных о событии
  const [eventData, setEventData] = useState<EventData | null>(null);

  // Загрузка данных о событии (количество гостей)
  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Ошибка загрузки данных о событии');
      
      const data = await response.json();
      setEventData({ guests_count: data.guests_count });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

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
    fetchEventData(); // Загружаем данные о событии
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
      await fetchBudget(); // Обновляем данные бюджета
      await fetchEventData(); // Обновляем данные о событии
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

  // Рассчитываем данные для таблицы продуктов
  const calculateProductsData = (): ProductItem[] => {
    if (!eventData) return [];
    
    return menuItems.map(item => ({
      name: item.name,
      totalPrice: item.price * item.quantity_per_person * eventData.guests_count,
      totalQuantity: item.quantity_per_person * eventData.guests_count
    }));
  };

  const productsData = calculateProductsData();

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

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

      {/* Новая таблица: Список продуктов для закупки */}
      <div className={styles.productsBlock}>
        <h2>Продукты для закупки</h2>
        
        {eventData ? (
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Общая цена</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {productsData.length > 0 ? (
                productsData.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.totalPrice.toFixed(2)} ₽</td>
                    <td>{product.totalQuantity.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Добавьте пункты в меню</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>Загрузка данных о гостях...</p>
        )}
      </div>

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