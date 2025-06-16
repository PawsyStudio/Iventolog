// MenuAndBudgetTab.tsx
import { useState, useEffect } from 'react';
import styles from './MenuAndBudgetTab.module.css';
import Bg1 from '@/assets/images/decoration/1.svg';
import Bg2 from '@/assets/images/decoration/2.svg';
import Bg3 from '@/assets/images/decoration/3.svg';
import Bg4 from '@/assets/images/decoration/4.svg';

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

interface EventData {
  guests_count: number;
}

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
  const [eventData, setEventData] = useState<EventData | null>(null);

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

  useEffect(() => {
    fetchMenu();
    fetchBudget();
    fetchEventData();
  }, [eventId]);

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
      await fetchBudget();
      await fetchEventData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сервера');
    }
  };

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

        <div className={styles.verticalColumn}>
          {/* Блок бюджета */}
          <div className={styles.budgetBlock}>
            <h2>Бюджет мероприятия</h2>
            
            {budgetData ? (
              <div className={styles.budgetTableContainer}>
                <table className={styles.budgetTable}>
                  <thead>
                    <tr>
                      <th>Категория</th>
                      <th>С чел.</th>
                      <th>Общая</th>
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
              </div>
            ) : (
              <p className={styles.emptyMessage}>Загрузка данных бюджета...</p>
            )}
          </div>

          {/* Блок продуктов */}
          <div className={styles.productsBlock}>
            <h2>Продукты для закупки</h2>
            
            {eventData ? (
              <div className={styles.productsTableContainer}>
                <table className={styles.productsTable}>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Общая цена</th>
                      <th>Кол-во</th>
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
              </div>
            ) : (
              <p>Загрузка данных о гостях...</p>
            )}
          </div>

          {/* Блок меню */}
          <div className={styles.menuBlock}>
            <div className={styles.header}>
              <h2>Меню мероприятия</h2>
              {!isAddingItem && (
                <button 
                  onClick={() => setIsAddingItem(true)}
                  className={styles.addButton}
                >
                  Добавить пункт
                </button>
              )}
            </div>

            <div className={styles.menuList}>
              {menuItems.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Цена за единицу</th>
                      <th>Кол-во на чел.</th>
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
                  placeholder="Кол-во на чел."
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
          </div>
        </div>
      </div>
    </div>
  );
}