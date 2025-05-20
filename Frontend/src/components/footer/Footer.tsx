import styles from './footer.module.css';
import Logo1 from '../../assets/images/social/logoVK.svg'; // Путь к первому лого
import Logo2 from '../../assets/images/social/logoTelegram.svg'; // Путь ко второму лого
import Logo3 from '../../assets/images/social/logoWhatsApp.svg'; // Путь к третьему лого

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.socialBlock}>
                <h3 className={styles.socialTitle}>КОНТАКТЫ</h3>
                <a href="mailto:noname@noname.ru" className={styles.email}>noname@noname.ru</a>
                <div className={styles.brandWithLogos}>
                    <span className={styles.brandName}>Ивентолог</span>
                    <div className={styles.logos}>
                        <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
                         <img src={Logo1} alt="VK" className={styles.logo} />
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                         <img src={Logo2} alt="Telegram" className={styles.logo} />
                        </a>
                        <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                         <img src={Logo3} alt="WhatsApp" className={styles.logo} />
                        </a>
                    </div>
                </div>
            </div>

            <a href="#" className={styles.link}>КАК ИСПОЛЬЗОВАТЬ</a>
            <a href="#" className={styles.link}>ДОКУМЕНТЫ</a>
        </footer>
    )
}