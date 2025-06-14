import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router'; // Используем навигацию из TanStack Router
import { useAuthStore } from '@/store/AuthStore';
import CustomConfirm from './CustomConfirm';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const navigate = useNavigate(); // Хук для навигации
  const logout = useAuthStore(state => state.logout);
  const isLoading = useAuthStore(state => state.isLoading);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = async () => {
    setShowConfirm(false);
    await logout();
    navigate({ to: '/' }); // Перенаправление на главную страницу
  };

  const cancelLogout = () => setShowConfirm(false);

  return (
    <>
      <button
        className={styles.LogoutButton}
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? 'Выход...' : 'Выйти'}
      </button>

      {showConfirm && (
        <CustomConfirm
          message="Вы действительно хотите выйти?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </>
  );
}