import styles from './logoutButton.module.css';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Дополнительные действия при выходе (если нужны)
  };

  return (
    <button 
      className={styles.LogoutButton}
      onClick={handleLogout}
      aria-label="Выйти из аккаунта"
    >
      Выйти
    </button>
  );
}