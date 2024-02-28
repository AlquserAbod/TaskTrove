import React from 'react';
import styles from './SubmitButton.module.css';

function SubmitButton({ text = "Submit", handleSubmit, disabled = false }) {
  return (
    <button
      className={styles.submitButton}
      type='submit'
      onClick={handleSubmit}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default SubmitButton;