import styles from './CustomConfirm.module.css';

export default function CustomConfirm({ message, onConfirm, onCancel }: {
  message: string,
  onConfirm: () => void,
  onCancel: () => void
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.yes} onClick={onConfirm}>Выйти</button>
          <button className={styles.no} onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
}