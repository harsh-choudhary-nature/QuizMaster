import React from 'react';
import styles from '../styles/BlogPagination.module.css';

const BlogPagination = ({ page, setPage, totalPages }) => {
  return (
    <div className={styles.paginationContainer}>
      <button 
        disabled={page <= 1} 
        onClick={() => setPage(p => p - 1)} 
        className={styles.paginationButton}
      >
        Prev
      </button>
      <span className={styles.pageText}>Page {page} of {totalPages}</span>
      <button 
        disabled={page >= totalPages} 
        onClick={() => setPage(p => p + 1)} 
        className={styles.paginationButton}
      >
        Next
      </button>
    </div>
  );
};

export default BlogPagination;
