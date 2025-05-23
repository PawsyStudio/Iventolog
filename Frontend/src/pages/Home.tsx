import Header from '../components/headPack/homeHeader/HomeHeader'
import Footer from '../components/footer/Footer'
import LogoutButton from '../components/logoutButton/LogoutButton'
import DecorBlock from '@/components/decBlock/decorBlock';
import AboutBlock from '@/components/aboutBlock/aboutBlock';

export function Home() {
    return (
      <>
        <Header />
        <main>
        <DecorBlock />
        <LogoutButton />
        <AboutBlock />
        </main>
        <Footer />
      </>
    );
  }