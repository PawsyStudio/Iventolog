import styles from './infoScroll.module.css';

interface InfoScrollProps {
  onClick: () => void;
}

export default function InfoScroll({ onClick }: InfoScrollProps) {
  return (
    <button className={styles.InfoScroll} onClick={onClick}>
      information
    </button>
  );
}