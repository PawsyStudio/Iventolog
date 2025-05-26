import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/store/AuthStore';
import styles from './CreateButton.module.css';

export default function CreateButton() {
  const { isAuth, showAuthModal } = useAuthStore();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuth) {
      e.preventDefault();
      showAuthModal('login');
    }
  };

  return (
    <Link 
      to='/create'
      className={styles.CreateButton}
      onClick={handleClick}
    >
      Создать мероприятие
    </Link>
  );
}