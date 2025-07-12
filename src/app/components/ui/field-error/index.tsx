import { JSX } from 'react';
import styles from './field-error.module.css';

type FieldErrorProps = JSX.IntrinsicElements['div'] & {
  status: boolean;
  text: string;
}

export default function FieldError(props: FieldErrorProps) {
  return (
    !props.status && <div className={styles['field-error']}>{props.text}</div>
  );
}