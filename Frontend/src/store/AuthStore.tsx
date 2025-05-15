import { create } from 'zustand';

interface AuthStore {
  isAuth: boolean;
  token: string | null;
  authError: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => { //Хранилище
  return {
    isAuth: localStorage.getItem('token') !== null, //Изначальные значения
    token: localStorage.getItem('token'),
    authError: null,
    isLoading: false,
    
    login: async (email: string, password: string) => {
      set({ isLoading: true, authError: null });
      
      try {
        const response = await fetch('http://localhost:8000/api/auth/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
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
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        set({
          authError: errorMessage,
          isLoading: false
        });
        return false;
      }
    },
    
    logout: async () => {
      localStorage.removeItem('token');
      set({
        isAuth: false,
        token: null,
        authError: null,
        isLoading: false
      });
    }
  };
});