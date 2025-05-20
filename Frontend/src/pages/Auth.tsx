import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import Header from '../components/headPack/appHeader/AppHeader'
import Footer from '../components/footer/Footer'
import styles from '../components/AuthForms.module.css';

export function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <>
      <Header />
      <div className={styles.authPage}>
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
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
      <Footer />
    </>
  );
}