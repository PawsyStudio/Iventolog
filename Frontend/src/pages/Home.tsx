import { useEffect } from 'react';
import Header from '../components/headPack/homeHeader/HomeHeader';
import Footer from '../components/footer/Footer';
import LogoutButton from '../components/logoutButton/LogoutButton';
import DecorBlock from '@/components/decBlock/decorBlock';
import AboutBlock from '@/components/aboutBlock/aboutBlock';
import { AuthModal } from '@/components/authModal/AuthModal';
import { useAuthStore } from '@/store/AuthStore';
import { useNavigate } from '@tanstack/react-router';

export function Home() {
  const navigate = useNavigate();
  const { 
    authModal,
    hideAuthModal
  } = useAuthStore();

  // Обработка редиректа после перезагрузки страницы
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('auth_redirect');
    if (redirectPath) {
      sessionStorage.removeItem('auth_redirect');
      useAuthStore.getState().showAuthModal('login');
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <DecorBlock />
        <LogoutButton />
        <AboutBlock />

        {/* Модальное окно авторизации */}
        <AuthModal
          initialTab={authModal.tab}
          isOpen={authModal.isOpen}
          onSuccess={() => {
            navigate({ to: '/create' });
            hideAuthModal();
          }}
          onClose={() => {
            hideAuthModal();
            navigate({ to: '/' });
          }}
        />
      </main>
      <Footer />
    </>
  );
}