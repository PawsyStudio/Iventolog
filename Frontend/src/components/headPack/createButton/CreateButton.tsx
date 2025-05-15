import { Link } from '@tanstack/react-router';
import styles from './CreateButton.module.css';

export default function CreateButton() {
  return (
    <Link 
      to='/create'
      className={styles.CreateButton}
    >
      Создать мероприятие
    </Link>
  );
}