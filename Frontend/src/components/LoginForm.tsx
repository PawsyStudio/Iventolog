import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import styles from './AuthForms.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Заглушка (замените на реальный запрос)
      const isSuccess = await login(email, password);
      
      if (isSuccess) {
        navigate({ to: '/' });
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