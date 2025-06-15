import { Link } from '@tanstack/react-router';
import LogoutButton from '@/components/logoutButton/LogoutButton';
import IventologSidebar from '@/assets/images/logos/iventologSidebar.svg';
import CreateIcon from '@/assets/images/decoration/create.svg';
import HomeIcon from '@/assets/images/decoration/home.svg';
import EventsIcon from '@/assets/images/decoration/events.png';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onCreateEvent: () => void;
}

export function Sidebar({ onCreateEvent }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.topBar}>
        <img 
          src={IventologSidebar} 
          alt="Iventolog Logo" 
          className={styles.logo}
        />
        <div className={styles.logoutWrapper}>
          <LogoutButton />
        </div>
      </div>
      
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {/* Кнопка "Создать мероприятие" */}
          <li className={styles.navItem}>
            <button onClick={onCreateEvent} className={styles.navButton}>
              <span className={styles.iconWrapper}>
                <img src={CreateIcon} alt="Create" className={styles.navIcon}/>
              </span>
              <span className={styles.text}>Создать мероприятие</span>
            </button>
          </li>
          
          {/* Ссылка "Главная страница" */}
          <li className={styles.navItem}>
            <Link to="/" className={`${styles.navLink} ${styles.homeLink}`}>
              <span className={styles.iconWrapper}>
                <img src={HomeIcon} alt="Home" className={styles.navIcon}/>
              </span>
              <span className={styles.text}>Главная страница</span>
            </Link>
          </li>
          
          {/* Ссылка "Мои мероприятия" */}
          <li className={`${styles.navItem} ${styles.eventsItem}`}>
            <Link to="/events" className={styles.navLink}>
              <span className={styles.iconWrapper}>
                <img src={EventsIcon} alt="Events" className={styles.navIcon}/>
              </span>
              <span className={styles.text}>Мои мероприятия</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}