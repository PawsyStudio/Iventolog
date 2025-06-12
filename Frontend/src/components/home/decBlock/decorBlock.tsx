import styles from './decorBlock.module.css';
import decorImage from '../../../assets/images/decoration/decor1.png';

export default function DecorBlock() {
  return (
    <div className={styles.decorBlock}>
      {/* Группа текстов с декоративными полосами */}
      <div className={styles.textGroup}>
        <div className={styles.lineContainer}>
          <div className={styles.rectangle1}></div>
          <span className={styles.text}>Создавай</span>
        </div>
        
        <div className={styles.lineContainer}>
          <div className={styles.rectangle2}></div>
          <span className={styles.text}>Управляй</span>
        </div>
        
        <div className={styles.lineContainer}>
          <div className={styles.rectangle3}></div>
          <span className={styles.text}>Креативь</span>
        </div>
      </div>

      {/* Декоративное изображение */}
      <img src={decorImage} alt="" className={styles.decorImage} />
    </div>
  );
}