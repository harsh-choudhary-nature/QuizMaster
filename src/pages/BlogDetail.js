// src/pages/BlogDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/BlogDetail.module.css';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                    }
                });
                if (!res.ok) throw new Error('Unable to fetch blog');
                const data = await res.json();
                setBlog(data);
            } catch (err) {
                setError('Blog not found or error fetching blog');
            }
        };

        fetchBlog();
    }, [id, user]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to delete blog');

            navigate('/blogs');
        } catch (err) {
            alert('Error deleting blog.');
        }
    };

    const handleEdit = () => {
        navigate(`/blogs/edit/${id}`);
    };


    if (error) return <p className={styles.error}>{error}</p>;
    if (!blog) return <p className={styles.loading}>Loading blog...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{blog.title}</h1>
            <p className={styles.meta}>
                ✍️ {blog.username} | 🔑 {blog.keywords.map(k => `#${k}`).join(' ')}
            </p>
            <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
            </div>
            <div className={styles.actions}>
                <button className={styles.likeDislikeButton} title="Feature not implemented">👍 {blog.likes}</button>
                <button className={styles.likeDislikeButton} title="Feature not implemented">👎 {blog.dislikes}</button>
                {blog.creator && (
                    <>
                        <button className={styles.editButton} onClick={handleEdit}>✏️ Edit</button>
                        <button className={styles.deleteButton} onClick={handleDelete}>🗑️ Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;
