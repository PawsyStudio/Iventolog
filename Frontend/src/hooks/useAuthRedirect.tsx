import { useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';

/**
 * Кастомный хук useAuthRedirect
 *
 * Проверяет наличие ключа 'auth_redirect' в sessionStorage
 * и вызывает отображение модального окна авторизации (вкладка login),
 * если такой ключ найден. Используется, например, для возврата
 * пользователя на авторизацию после попытки входа на защищённую страницу.
 */
export function useAuthRedirect() {
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('auth_redirect');

    if (redirectPath) {
      // Очистка ключа, чтобы не повторно не сработал
      sessionStorage.removeItem('auth_redirect');

      // Программное открытие модального окна авторизации с вкладкой "login"
      useAuthStore.getState().showAuthModal('login');
    }
  }, []);
}