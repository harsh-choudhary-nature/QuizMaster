// src/pages/BlogDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/BlogDetail.module.css';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);


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

    useEffect(() => {
        if (blog) {
            setLikes(blog.likes);
            setDislikes(blog.dislikes);
            setHasLiked(blog.hasLiked);
            setHasDisliked(blog.hasDisliked);
        }
    }, [blog, user]);

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
            logout();
            navigate('/auth/login');
        }
    };

    const handleEdit = () => {
        navigate(`/blogs/edit/${id}`);
    };

    const handleLike = async () => {
        if (!user) return alert("Please log in to like");
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${blog._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`); // Custom error handling for non-OK responses
            }
            const data = await res.json();
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setHasLiked(!hasLiked);
            if (hasDisliked) setHasDisliked(false);
        } catch (error) {
            console.error('❌ Error liking blog:', error);
            alert(`An error occurred while liking the blog: ${error.message}`);
            logout();
            navigate('/auth/login');
        }

    };

    const handleDislike = async () => {
        if (!user) return alert("Please log in to dislike");
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${blog._id}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`); // Custom error handling for non-OK responses
            }
            const data = await res.json();
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setHasDisliked(!hasDisliked);
            if (hasLiked) setHasLiked(false);
        } catch (error) {
            console.error('❌ Error disliking blog:', error);
            alert(`An error occurred while disliking the blog: ${error.message}`);
            logout();
            navigate('/auth/login');
        }
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
                <button className={`${styles.likeDislikeButton} ${hasLiked ? styles.liked : ''}`} onClick={handleLike}
                >👍 {likes}</button>
                <button className={`${styles.likeDislikeButton} ${hasDisliked ? styles.disliked : ''}`} onClick={handleDislike}
                >👎 {dislikes}</button>
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
