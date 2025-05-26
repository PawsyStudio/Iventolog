import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import styles from './AuthForms.module.css';

interface AuthModalProps {
  initialTab: 'login' | 'register';
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AuthModal({ 
  initialTab = 'login',
  isOpen,
  onSuccess,
  onClose
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className={styles.authModalOverlay}>
      <div className={styles.authModal}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Войти
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Регистрация
          </button>
        </div>

        <div className={styles.formContainer}>
          {activeTab === 'login' ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <RegisterForm onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}