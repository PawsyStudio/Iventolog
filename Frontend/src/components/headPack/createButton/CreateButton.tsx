import { useRouter } from '@tanstack/react-router';
import styles from './CreateButton.module.css';
import { useAuth } from '../../../contexts/AuthContext';

export default function CreateButton() {
  const { isAuth } = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    try {
      await router.navigate({ 
        to: isAuth ? '/create' : '/auth'
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <button 
      className={styles.CreateButton}
      onClick={handleClick}
    >
      Создать мероприятие
    </button>
  );
}