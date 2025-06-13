import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/AuthStore';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import InfoBlock from '@/components/home/infoBlock/infoBlock';
import Header from '@/components/home/headPackHome/homeHeader/HomeHeader';
import Footer from '@/components/footer/Footer';
import LogoutButton from '@/components/logoutButton/LogoutButton';
import DecorBlock from '@/components/home/decBlock/decorBlock';
import AboutBlock from '@/components/home/aboutBlock/aboutBlock';
import { AuthModal } from '@/components/authModal/AuthModal';

export function Home() {
  const navigate = useNavigate();
  const { authModal, hideAuthModal } = useAuthStore();

  useAuthRedirect();

  const scrollToInfo = () => {
    const el = document.getElementById('infoBlock');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('aboutBlock');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header onScrollToInfo={scrollToInfo} onScrollToAbout={scrollToAbout} />
      <main>
        <DecorBlock />

        <section id="infoBlock" style={{ scrollMarginTop: '80px' }}>
          <InfoBlock />
        </section>

        <section id="aboutBlock" style={{ scrollMarginTop: '80px' }}>
          <AboutBlock />
        </section>
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
      <LogoutButton />
    </>
  );
}