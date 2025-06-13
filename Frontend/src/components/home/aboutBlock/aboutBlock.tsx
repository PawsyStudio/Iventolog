import styles from './aboutBlock.module.css';
import eyeImage from '../../../assets/images/decoration/eye.png';
import frameImage from '../../../assets/images/decoration/frameAbout.png';

export default function AboutBlock() {
  return (
    <div className={styles.aboutBlock}>
      <h1 className={styles.aboutTitle}>о нас</h1>

      {/* Декоративный текст ABOUT US */}
      <span className={styles.decorativeAboutUs}>ABOUT US</span>

      <div className={styles.contentWrapper}>
        {/* Рамка (фон) */}
        <img 
          src={frameImage} 
          alt="Рамка" 
          className={styles.frameImage} 
        />

        {/* Изображение глаза */}
        <img 
          src={eyeImage} 
          alt="Глаз" 
          className={styles.eyeImage} 
        />

        {/* Текстовый блок */}
        <div className={styles.textContent}>
          <p className={styles.mainText}>
            Учится на первом курсе программирования в УрФУ,<br />
            но любит дизайн и рисует в свободное время. Он<br />
            хочет научиться создавать сайты и приложения,<br />
            чтобы совмещать код и красивый дизайн. Пока Саня<br />
            только начинает, но мечтает стать крутым веб-<br />
            разработчиком.
          </p>

          <div className={styles.nameBlock}>
            <p className={styles.name}>Терентьев Александр</p>
            <p className={styles.position}>Дизайнер</p>
          </div>
        </div>
      </div>
    </div>
  );
}