import React from 'react'
import styles from './textInput.module.css'

const TextInput = React.forwardRef((props,ref)  => {
  
  let has_errors = false;
  let errors = [];

  if(props.errors) {
    const errors_objects = props.errors.filter(error => error.path === props.name);
    has_errors = errors_objects.length > 0;
    if(has_errors) {
      errors_objects.forEach(error => {
        errors.push(error.msg);
      });
    }
  }
  return (
    <div className={styles.container}>
      <label htmlFor={props.name} className={`${styles.label} ${has_errors ? styles.error : ''}`}>
          <input 
            ref={ref} 
            value={props.value}
            type={props.type} 
            id={props.name} 
            placeholder={props.title} 
            className={styles.input}
            {...(props.required && { required: 'required' })}  />
          <span className={styles.span}>{props.title}</span>
      </label>
      {has_errors && (
        <ul className={styles.errorList}>
          {errors.map((error, index) => (
            <li key={index} className={styles.errorListItem}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
});

export default TextInput