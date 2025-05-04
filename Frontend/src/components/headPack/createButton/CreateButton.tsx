import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import styles from './createButton.module.css';

export default function CreateButton() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuth) {
      navigate({ to: '/create' }); // Переход на страницу создания
    } else {
      navigate({ to: '/auth' }); // Переход на авторизацию
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