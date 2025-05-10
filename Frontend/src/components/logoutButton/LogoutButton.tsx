import styles from './LogoutButton.module.css';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutButton() {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      await logout();
    }
  };

  return (
    <button
      className={styles.LogoutButton}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Выход...' : 'Выйти'}
    </button>
  );
}