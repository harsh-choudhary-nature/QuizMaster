// src/components/FloatingButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/FloatingButton.module.css';

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/blogs/create')}
      className={styles.floatingButton}
      aria-label="Create Blog"
    >
      +
    </button>
  );
};

export default FloatingButton;
