// components/StickyNote.js
import React from 'react';
import styles from './styles.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Use white or black based on brightness
  return brightness > 128 ? 'black' : 'white';
};

const StickyNote = ({ task, onEdit }) => {
  const { title, isCompleted, color } = task;

  
  const handleClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.stickyNote} ${isCompleted ? styles.completed : ''}`}
      style={{
        backgroundColor: color,
        color: getContrastColor(color),
      }}
    >
      <div
        className={`${styles.completedIndicator} ${
          isCompleted ? styles.checkmark : styles.cross
        }`}
      >
        {isCompleted ? <FaCheck /> : <FaTimes />}
      </div>
      <p className={styles.title}>{title}</p>
    </div>
  );
};

export default StickyNote;
