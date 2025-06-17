import styles from './aboutBlock.module.css';
import teamLogo from '../../../assets/images/decoration/teamLogo.jpg';
import frameImage from '../../../assets/images/decoration/frameAbout.png';
import down from '../../../assets/images/decoration/down.svg';

export default function AboutBlock() {
  return (
    <div className={styles.aboutBlock}>
      <img src={down} alt="" className={styles.down} draggable="false" />
      {/* Декоративный текст ABOUT US */}
      <span className={styles.decorativeAboutUs}>ABOUT US</span>

      <div className={styles.contentWrapper}>
        {/* Рамка (фон) */}
        <img 
          src={frameImage} 
          alt="Рамка" 
          className={styles.frameImage} 
        />

        {/* Логотип команды */}
      <div className={styles.logoContainer}>
        <img 
          src={teamLogo} 
          alt="Логотип команды PawsyStudio" 
          className={styles.teamLogo} 
        />
      </div>

        {/* Текстовый блок */}
        <div className={styles.textContent}>
          <p className={styles.mainText}>
            Мы — PawsyStudio, студенты первого курса и авторы проекта веб-сервиса для организации мероприятий. 
            Этот проект мы создаём в рамках дисциплины «Проектный практикум», чтобы научиться превращать идеи 
            в настоящие цифровые продукты. Мы хотим, чтобы организация мероприятий стала проще, удобнее и доступнее. 
            И это только начало!
          </p>

          <div className={styles.nameBlock}>
            <p className={styles.name}>PawsyStudio</p>
            <p className={styles.position}>Команда разработчиков</p>
          </div>
        </div>
      </div>
    </div>
  );
}