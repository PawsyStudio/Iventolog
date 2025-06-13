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

      <div className={styles.decorBlocksWrapper}>
        {/* Блок 1 */}
        <div className={`${styles.decorBlockItem} ${styles.gradientBlock}`}>
          <div className={styles.textTop}>СОЗДАВАЙ ПРАЗДНИКИ</div>
          <div className={styles.divider}></div>
          <div className={styles.textBottom}>
            Создавай свои уникальные мероприятия
          </div>
        </div>

        {/* Блок 2 */}
        <div className={`${styles.decorBlockItem} ${styles.whiteBlockFirst}`}>
          <div className={styles.textTopBlue1}>УПРАВЛЯЙ ПРОЦЕССОМ</div>
          <div className={styles.dividerBlue}></div>
          <div className={styles.textBottomBlue}>
            Управляй своими мероприятиями вместе с друзьями и коллегами
          </div>
        </div>

        {/* Блок 3 */}
        <div className={`${styles.decorBlockItem} ${styles.whiteBlockSecond}`}>
          <div className={styles.textTopBlue2}>КРЕАТИВЬ НАСТОЯЩИЕ ПРАЗДНИКИ</div>
          <div className={styles.dividerBlue}></div>
          <div className={styles.textBottomBlue}>
            Креативь и придумывай свои идеи и мысли благодаря нам
          </div>
        </div>
      </div>
    </div>
  );
}