import Header from '../components/headPack/header/Header'
import Footer from '../components/footer/Footer'
import LogoutButton from '../components/logoutButton/LogoutButton'

export function Home() {
    return (
      <>
        <Header />
        <main>
        <LogoutButton />
        </main>
        <Footer />
      </>
    );
  }