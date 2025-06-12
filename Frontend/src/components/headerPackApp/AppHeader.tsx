import HomeLogo from '../../assets/images/logos/iventolog.svg';
import styles from './appheader.module.css';
export default function Header() {

    return(
        <header className={styles.header}>
            <img src={HomeLogo} alt="logo" className={styles.logo} />
        </header>
    )

}