import { useState, useEffect } from 'react';
import type { MenuItem } from '@/types/menu';
import styles from './MenuAndBudgetTab.module.css';

export function MenuAndBudgetTab({ eventId }: { eventId: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isDeletingItems, setIsDeletingItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    quantity_per_person: 1
  });

  // Загрузка меню
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${eventId}/menu/`);
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Ошибка загрузки меню:', error);
      }
    };

    fetchMenu();
  }, [eventId]);

  // Добавление нового товара
  const handleAddItem = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/menu/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
      });

      const createdItem = await response.json();
      setMenuItems([...menuItems, createdItem]);
      setIsAddingItem(false);
      setNewItem({ name: '', price: 0, quantity_per_person: 1 });
    } catch (error) {
      console.error('Ошибка добавления товара:', error);
    }
  };

  // Удаление товаров
  const handleDeleteItems = async () => {
    try {
      await Promise.all(
        selectedItems.map(id => 
          fetch(`http://localhost:8000/api/events/${eventId}/menu/${id}/`, {
            method: 'DELETE'
          })
        )
      );
      
      setMenuItems(menuItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setIsDeletingItems(false);
    } catch (error) {
      console.error('Ошибка удаления товаров:', error);
    }
  };

  // Выбор товара для удаления
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className={styles.container}>
      {/* Основная таблица с меню (3/4 ширины) */}
      <div className={styles.menuTable}>
        <div className={styles.tableHeader}>
          <div className={styles.fullWidth}>Меню</div>
        </div>
        
        <div className={styles.tableHeader}>
          <div>Название товара</div>
          <div>Цена товара</div>
          <div>Количество на человека</div>
        </div>

        {menuItems.map(item => (
          <div 
            key={item.id} 
            className={`${styles.tableRow} ${isDeletingItems && selectedItems.includes(item.id) ? styles.selected : ''}`}
            onClick={() => isDeletingItems && toggleItemSelection(item.id)}
          >
            <div>{item.name}</div>
            <div>{item.price} RUB</div>
            <div>{item.quantity_per_person}</div>
          </div>
        ))}

        {isAddingItem && (
          <div className={styles.addItemForm}>
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
              step="0.01"
            />
            <input
              type="number"
              placeholder="Количество"
              value={newItem.quantity_per_person}
              onChange={(e) => setNewItem({...newItem, quantity_per_person: Number(e.target.value)})}
              min="0.1"
              step="0.1"
            />
            <button onClick={handleAddItem}>Создать</button>
            <button onClick={() => setIsAddingItem(false)}>Отмена</button>
          </div>
        )}

        <div className={styles.actions}>
          {!isDeletingItems ? (
            <>
              <button 
                onClick={() => setIsAddingItem(true)}
                className={styles.addButton}
              >
                Добавить товар
              </button>
              <button 
                onClick={() => setIsDeletingItems(true)}
                className={styles.deleteButton}
              >
                Удалить товары
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleDeleteItems}
                className={styles.confirmButton}
                disabled={selectedItems.length === 0}
              >
                Подтвердить ({selectedItems.length})
              </button>
              <button 
                onClick={() => {
                  setIsDeletingItems(false);
                  setSelectedItems([]);
                }}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </>
          )}
        </div>
      </div>

      {/* Блок справа (1/4 ширины) */}
      <div className={styles.budgetSummary}>
        <h3>Бюджет</h3>
        <p>Здесь будет сводка по бюджету</p>
      </div>
    </div>
  );
}