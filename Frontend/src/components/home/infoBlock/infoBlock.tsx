import styles from './infoBlock.module.css';
import ThisIsSVG from '../../../assets/images/decoration/thisis.svg';

export default function InfoBlock() {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.triangleBackground}></div>
      <img src={ThisIsSVG} alt="this is border" className={styles.svgFrame} />

      <div className={styles.textWrapper}>
        <p className={styles.textOne}>НА ЭТОМ САЙТЕ</p>
        <p className={styles.textTwo}>ВЫ МОЖЕТЕ!</p>
      </div>

      <span className={styles.decorativeLabel}>INFORMATION</span>
    </div>
  );
}
