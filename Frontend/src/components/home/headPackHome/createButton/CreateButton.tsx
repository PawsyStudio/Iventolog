import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/store/AuthStore';
import styles from './CreateButton.module.css';
import clsx from 'clsx';

interface CreateButtonProps {
  variant?: 'default' | 'hero';
}

export default function CreateButton({ variant = 'default' }: CreateButtonProps) {
  const { isAuth, showAuthModal } = useAuthStore();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuth) {
      e.preventDefault();
      showAuthModal('login');
    }
  };

  return (
    <Link 
      to='/events'
      className={clsx(styles.CreateButton, {
        [styles.hero]: variant === 'hero',
      })}
      onClick={handleClick}
    >
      create
    </Link>
  );
}
