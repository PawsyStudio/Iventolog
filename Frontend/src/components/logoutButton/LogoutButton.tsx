import { useAuthStore } from '@/store/AuthStore';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const logout = useAuthStore(state=>state.logout);
  const isLoading = useAuthStore(state=>state.isLoading);

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