import React from 'react';
import styles from './styles.module.css';

const Checkbox = React.forwardRef((props, ref) => {
  return (
    <div className={styles.checkboxContiner}>
      <input
        type="checkbox"
        id={props.id}
        className={styles['inp-cbx']}
        style={{ display: 'none' }}
        ref={ref}
        {...props}
      />
      <label htmlFor={props.id} className={styles.cbx}>
        <span>
          <svg width='12px' height='10px' viewBox='0 0 12 10'>
            <polyline points='1.5 6 4.5 9 10.5 1' />
          </svg>
        </span>
        <span>{props.label}</span>
      </label>
    </div>
  );
});

export default Checkbox;
