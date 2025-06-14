// AuthModal.tsx
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

  const modalStyle = {
    height: activeTab === 'login' ? '559px' : '683px',
    width: '792px'
  };

  const switchButtonStyle = {
    width: activeTab === 'login' ? '170px' : '148px',
    height: '51px',
    backgroundColor: '#1e90ff',
    color: '#000000',
    borderRadius: '42px'
  };

  return (
    <div className={styles.authModalOverlay}>
      <div 
        className={styles.authModal} 
        style={modalStyle}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {activeTab === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          
          <div className={styles.headerActions}>
            <button
              className={styles.switchButton}
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              style={switchButtonStyle}
            >
              {activeTab === 'login' ? 'Регистрация' : 'Вход'}
            </button>
            
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              &times;
            </button>
          </div>
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