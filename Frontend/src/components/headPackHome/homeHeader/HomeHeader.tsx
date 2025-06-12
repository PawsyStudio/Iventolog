import HomeLogo from '../../../assets/images/logos/iventolog.svg';
import InfoScroll from '../infoButton/InfoButton.tsx';
import AboutScroll from '../aboutButton/AboutButton.tsx';
import CreateButton from '../createButton/CreateButton.tsx';
import styles from './homeheader.module.css';

export default function Header() {
    return(
        <header className={styles.header}>
            <img src={HomeLogo} alt="logo" className={styles.logo} />
            <div className={styles.buttonGroup}>
                <InfoScroll />
                <AboutScroll />
            </div>   
            <CreateButton />
        </header>
    )
}