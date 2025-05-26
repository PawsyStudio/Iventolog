import { create } from 'zustand';

// Типы для состояния модалки
interface AuthModalState {
  isOpen: boolean;
  tab: 'login' | 'register';
}

// Основной интерфейс хранилища
interface AuthStore {
  // Состояние авторизации
  isAuth: boolean;
  token: string | null;
  authError: string | null;
  isLoading: boolean;
  
  // Состояние модалки
  authModal: AuthModalState;

  // Методы авторизации
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Управление модалкой
  showAuthModal: (tab?: 'login' | 'register') => void;
  hideAuthModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Инициализация состояния
  isAuth: localStorage.getItem('token') !== null,
  token: localStorage.getItem('token'),
  authError: null,
  isLoading: false,
  authModal: {
    isOpen: false,
    tab: 'login'
  },

  // Логин пользователя
  login: async (email, password) => {
    set({ isLoading: true, authError: null });
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка авторизации');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access);

      set({
        isAuth: true,
        token: data.access,
        authError: null,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
      set({
        authError: errorMessage,
        isLoading: false
      });
      return false;
    }
  },

  // Выход пользователя
  logout: async () => {
    localStorage.removeItem('token');
    set({
      isAuth: false,
      token: null,
      authError: null,
      isLoading: false
    });
  },

  // Открытие модалки
  showAuthModal: (tab = 'login') => 
    set({ authModal: { isOpen: true, tab } }),
    
  // Закрытие модалки
  hideAuthModal: () => 
    set({ authModal: { isOpen: false, tab: 'login' } }),
}));