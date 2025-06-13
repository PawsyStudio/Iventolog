import styles from './aboutButton.module.css';

interface AboutScrollProps {
  onClick: () => void;
}

export default function AboutScroll({ onClick }: AboutScrollProps) {
  return (
    <button className={styles.AboutButton} onClick={onClick}>
      about Us
    </button>
  );
}