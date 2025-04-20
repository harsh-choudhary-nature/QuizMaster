import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BlogCard.module.css';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/blogs/${blog._id}`)}>
      <h2 className={styles.title}>{blog.username}</h2>
      <p className={styles.snippet}>{blog.content.slice(0, 100)}...</p>
      <div className={styles.meta}>
        <span>👍 {blog.likes}</span>
        <span style={{ marginLeft: '1rem' }}>👎 {blog.dislikes}</span>
        {/* <span style={{ marginLeft: '1rem' }}>📧 {blog.email}</span> */}
      </div>
      <div className={styles.keywords}>
        {blog.keywords.map(k => `#${k}`).join(' ')}
      </div>
    </div>
  );
};

export default BlogCard;
