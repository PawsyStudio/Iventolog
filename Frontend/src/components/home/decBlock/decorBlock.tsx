import styles from './decorBlock.module.css';
import trinagle1 from '../../../assets/images/decoration/triangle1.svg';
import trinagle2 from '../../../assets/images/decoration/triangle2.svg';
import tinagle3 from '../../../assets/images/decoration/triangle3.svg';
import trinagle4 from '../../../assets/images/decoration/triangle4.svg';
import down from '../../../assets/images/decoration/down.svg';
import Logo from '../../../assets/images/decoration/infoLogo.svg';
import CreateButton from '../headPackHome/createButton/CreateButton.tsx';

export default function DecorBlock() {
  return (
    <div className={styles.decorBlock}>
      <div className={styles.background}></div>
      <img src={trinagle1} alt="" className={styles.triangle1} draggable="false" />
      <img src={trinagle2} alt="" className={styles.triangle2} draggable="false" />
      <img src={tinagle3} alt="" className={styles.triangle3} draggable="false" />
      <img src={trinagle4} alt="" className={styles.triangle4} draggable="false" />
      <img src={down} alt="" className={styles.down} draggable="false" />
      <img src={Logo} alt="" className={styles.logo} draggable="false" />
      
      <div className={styles.content}>
        <div className={styles.heading}>
          «Организуйте идеальное мероприятие <span className={styles.accent}>без стресса</span>»
        </div>
        <div className={styles.subheading}>
          Упростите организацию, сосредоточьтесь на результате, а рутину доверьте умному планировщику.
        </div>
        <div className={styles.callToAction}>
          🚀 Начните сейчас – проведите мероприятие без хаоса!
        </div>
        <div className={styles.buttonWrapper}>
          <CreateButton variant="hero" />
        </div>
      </div>
    </div>
  );
}