import HomeLogo from '../../../../assets/images/logos/iventologHeader.svg';
import InfoScroll from '../infoButton/InfoButton.tsx';
import AboutScroll from '../aboutButton/AboutButton.tsx';
import CreateButton from '../createButton/CreateButton.tsx';
import styles from './homeheader.module.css';

interface HeaderProps {
  onScrollToInfo: () => void;
  onScrollToAbout: () => void;
}

export default function Header({ onScrollToInfo, onScrollToAbout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <img src={HomeLogo} alt="logo" className={styles.logo} />
      <div className={styles.buttonGroup}>
        <InfoScroll onClick={onScrollToInfo} />
        <AboutScroll onClick={onScrollToAbout} />
      </div>
      <CreateButton variant="default" />
    </header>
  );
}