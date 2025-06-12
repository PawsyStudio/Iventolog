import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/AuthStore';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

import Header from '@/components/home/headPackHome/homeHeader/HomeHeader';
import Footer from '@/components/footer/Footer';
import LogoutButton from '@/components/logoutButton/LogoutButton';
import DecorBlock from '@/components/home/decBlock/decorBlock';
import AboutBlock from '@/components/home/aboutBlock/aboutBlock';
import { AuthModal } from '@/components/authModal/AuthModal';

export function Home() {
  const navigate = useNavigate();
  const {
    authModal,
    hideAuthModal,
  } = useAuthStore();

  // Вызов кастомного хука для обработки редиректа авторизации
  useAuthRedirect();

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
            navigate({ to: '/events' });
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
