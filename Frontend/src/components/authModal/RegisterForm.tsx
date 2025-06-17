import { useState } from 'react';
import styles from './AuthForms.module.css';
import { useAuthStore } from '@/store/AuthStore';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          telegram_id: telegramId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      const loginSuccess = await login(email, password);
      if (!loginSuccess) {
        throw new Error('Авторизация после регистрации не удалась');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка соединения');
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
          placeholder="Введите ваш email"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Telegram ID</label>
        <input
          type="text"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          placeholder="@username"
          pattern="@[a-zA-Z0-9_]{5,32}"
          title="Введите корректный Telegram ID (начинается с @)"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Создайте пароль"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Подтвердите пароль</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Повторите пароль"
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Зарегистрироваться
      </button>
    </form>
  );
}