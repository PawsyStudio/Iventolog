import styles from './footer.module.css';
import MainLogo from '../../assets/images/logos/iventologFooter.svg';
import LogoTelegram from '../../assets/images/social/logoTelegram.svg';
import LogoWhatsApp from '../../assets/images/social/logoWhatsApp.svg';
import LogoVK from '../../assets/images/social/logoVK.svg';

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* 1. Логотип */}
      <div className={styles.logoBlock}>
        <img src={MainLogo} alt="Ивентолог" className={styles.mainLogo} />
      </div>

      {/* 2. Социальные иконки в одну строку */}
      <div className={styles.socialIconsBlock}>
        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
          <img src={LogoTelegram} alt="Telegram" className={styles.socialIcon} />
        </a>
        <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
          <img src={LogoWhatsApp} alt="WhatsApp" className={styles.socialIcon} />
        </a>
        <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
          <img src={LogoVK} alt="VK" className={styles.socialIcon} />
        </a>
      </div>

      {/* 3. Ссылки в столбец */}
      <div className={styles.linksBlock}>
        <a href="#" className={styles.link}>ДОКУМЕНТЫ</a>
        <a href="#" className={styles.link}>КАК ИСПОЛЬЗОВАТЬ</a>
      </div>

      {/* 4. Контакты */}
      <div className={styles.contactsBlock}>
        <h3 className={styles.contactTitle}>КОНТАКТЫ</h3>
        <a href="mailto:noname@noname.ru" className={styles.email}>noname@noname.ru</a>
      </div>

    </footer>
  );
}