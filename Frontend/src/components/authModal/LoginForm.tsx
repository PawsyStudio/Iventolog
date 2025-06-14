import { useState } from 'react';
import styles from './AuthForms.module.css';
import { useAuthStore } from '@/store/AuthStore';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const isSuccess = await login(email, password);
      
      if (isSuccess) {
        onSuccess();
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка сервера');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Введите email"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Введите пароль"
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Войти
      </button>
    </form>
  );
}