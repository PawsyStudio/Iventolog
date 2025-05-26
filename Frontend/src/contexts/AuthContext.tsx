import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState({
    isAuth: false,
    token: null as string | null,
    authError: null as string | null,
    isLoading: false
  });

  // Инициализация при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setState({
        isAuth: true,
        token,
        authError: null,
        isLoading: false
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, authError: null }));
    
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
      
      setState({
        isAuth: true,
        token: data.access,
        authError: null,
        isLoading: false
      });

      await router.navigate({ to: '/' });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        authError: errorMessage,
        isLoading: false
      }));
      return false;
    }
  };

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    setState({
      isAuth: false,
      token: null,
      authError: null,
      isLoading: false
    });
    await router.navigate({ to: '/' });
  }, [router]);

  return (
    <AuthContext.Provider value={{
      isAuth: state.isAuth,
      token: state.token,
      login,
      logout,
      authError: state.authError,
      isLoading: state.isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};