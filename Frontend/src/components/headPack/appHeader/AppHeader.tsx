import HomeLogo from '../../../assets/images/logos/app-logo.png';
import styles from './appheader.module.css';
export default function Header() {

    return(
        <header className={styles.header}>
            <img src={HomeLogo} alt="logo" className={styles.logo} />
        </header>
    )

}