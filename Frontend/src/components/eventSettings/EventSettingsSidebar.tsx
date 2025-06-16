import { Link } from '@tanstack/react-router';
import IventologSidebar from '@/assets/images/logos/iventologSidebar.svg';
import EventTwoIcon from '@/assets/images/decoration/eventTwo.svg';
import EventNameIcon from '@/assets/images/decoration/eventName.svg';
import LogoutButton from '@/components/logoutButton/LogoutButton';
import styles from '@/components/eventSettings/Sidebar.module.css';

interface EventSettingsSidebarProps {
  eventTitle: string;
  activeTab: 'overview' | 'menu' | 'poll';
  onTabChange: (tab: 'overview' | 'menu' | 'poll') => void;
}

export function EventSettingsSidebar({ 
  eventTitle, 
  activeTab,
  onTabChange 
}: EventSettingsSidebarProps) {
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
          <li className={styles.navItem}>
            <Link 
              to="/events" 
              className={`${styles.navLink} ${styles.eventsLink}`}
            >
              <span className={styles.iconWrapper}>
                <img src={EventTwoIcon} alt="Events" className={styles.navIcon}/>
              </span>
              <span className={styles.text}>Мои мероприятия</span>
            </Link>
          </li>
          
          <li className={styles.navItem}>
            <div className={styles.navLink} style={{ 
              cursor: 'default',
              backgroundColor: '#0a3763',
              borderRadius: '31.5px'
            }}>
              <span className={styles.iconWrapper}>
                <img src={EventNameIcon} alt="Event" className={styles.navIcon}/>
              </span>
              <span className={styles.text}>{eventTitle}</span>
            </div>
          </li>
          
          <li className={styles.tabItem}>
            <button 
              className={styles.navButton}
              onClick={() => onTabChange('overview')}
              style={{ 
                color: activeTab === 'overview' ? '#0081ff' : '#ffffff',
              }}
            >
              <span className={styles.text}># Обзор</span>
            </button>
          </li>
          
          <li className={styles.tabItem}>
            <button 
              className={styles.navButton}
              onClick={() => onTabChange('menu')}
              style={{ 
                color: activeTab === 'menu' ? '#0081ff' : '#ffffff',
              }}
            >
              <span className={styles.text}># Меню и Бюджет</span>
            </button>
          </li>
          
          <li className={styles.tabItem}>
            <button 
              className={styles.navButton}
              onClick={() => onTabChange('poll')}
              style={{ 
                color: activeTab === 'poll' ? '#0081ff' : '#ffffff',
              }}
            >
              <span className={styles.text}># Опрос и Гости</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}