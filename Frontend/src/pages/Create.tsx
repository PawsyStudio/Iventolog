import Footer from '../components/footer/Footer';
import { CreateEventForm } from '../components/CreateEventForm';
import Header from '../components/headPack/appHeader/AppHeader'
export function Create() {
  return (
    <>
      <Header />
      <main>
        <CreateEventForm />
      </main>
      <Footer />
    </>
  );
}