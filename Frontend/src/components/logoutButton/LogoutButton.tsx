import { useState } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import CustomConfirm from './CustomConfirm';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const logout = useAuthStore(state => state.logout);
  const isLoading = useAuthStore(state => state.isLoading);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setShowConfirm(true);
  };

  const confirmLogout = async () => {
    setShowConfirm(false);
    await logout();
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