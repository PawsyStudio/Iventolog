import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from './AuthForms.module.css';
import { useAuthStore } from '@/store/AuthStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const isSuccess = await login(email, password);
      
      if (isSuccess) {
        navigate({ to: '/create' });
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка сервера');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h2>Вход в аккаунт</h2>
      
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Войти
      </button>
    </form>
  );
}