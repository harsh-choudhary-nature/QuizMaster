// src/components/BlogCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: '#2c2c2c',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        cursor: 'pointer',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}
      onClick={() => navigate(`/blogs/${blog._id}`)}
    >
      <h2>{blog.username}</h2>
      <p>{blog.content.slice(0, 100)}...</p>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        <span>👍 {blog.likes} </span>
        <span style={{ marginLeft: '1rem' }}>👎 {blog.dislikes}</span>
        <span style={{ marginLeft: '1rem' }}>📧 {blog.email}</span>
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ffd700' }}>
        {blog.keywords.map(k => `#${k}`).join(' ')}
      </div>
    </div>
  );
};

export default BlogCard;
