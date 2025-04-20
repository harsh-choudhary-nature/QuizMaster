// src/components/BlogPagination.js
import React from 'react';

const BlogPagination = ({ page, setPage, totalPages }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
      <button 
        disabled={page <= 1} 
        onClick={() => setPage(p => p - 1)} 
        className="navbarButton"
      >
        Prev
      </button>
      <span style={{ color: 'white' }}>Page {page} of {totalPages}</span>
      <button 
        disabled={page >= totalPages} 
        onClick={() => setPage(p => p + 1)} 
        className="navbarButton"
      >
        Next
      </button>
    </div>
  );
};

export default BlogPagination;
