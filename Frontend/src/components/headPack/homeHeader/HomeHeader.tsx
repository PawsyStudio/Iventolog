import HomeLogo from '../../../assets/images/logos/home-logo.png';
import InfoScroll from '../infoButton/InfoButton.tsx';
import AboutScroll from '../aboutButton/AboutButton.tsx';
import CreateButton from '../createButton/CreateButton.tsx';
import styles from './homeheader.module.css';
export default function Header() {

    return(
        <header className={styles.header}>
            <img src={HomeLogo} alt="logo" className={styles.logo} />
            <InfoScroll />
            <CreateButton />
            <AboutScroll />
        </header>
    )

}