import { Logo } from '../logo/Logo';
import InfoScroll from '../infoButton/InfoButton.tsx';
import AboutScroll from '../aboutButton/AboutButton.tsx';
import CreateButton from '../createButton/CreateButton.tsx';
import styles from './header.module.css';
export default function Header() {

    return(
        <header className={styles.header}>
            <Logo variant="home" />
            <InfoScroll />
            <CreateButton />
            <AboutScroll />
        </header>
    )

}