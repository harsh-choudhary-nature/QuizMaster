// src/pages/Blogs.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BlogCard from '../components/BlogCard';
import FloatingButton from '../components/FloatingButton';
import BlogPagination from '../components/BlogPagination';
import styles from '../styles/Blogs.module.css';

const Blogs = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs?page=${page}`);
                if (!res.ok) {
                    throw new Error('Unable to fetch blogs');
                }
                const data = await res.json();
                setBlogs(data.blogs);
                setTotalPages(data.totalPages);
                setError(null);
            } catch (err) {
                setError('Unable to fetch blogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Blogs</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {loading ? (
                <p className={styles.loadingMessage}>Loading Blogs ...</p>
            ) : (
                <>
                    {blogs.length > 0 ? (
                        <>
                            {blogs.map(blog => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                            <BlogPagination page={page} setPage={setPage} totalPages={totalPages} />
                        </>
                    ) : (
                        !error && <p className={styles.loadingMessage}>No blogs available</p>
                    )}
                </>
            )}
            {user && <FloatingButton />}
        </div>
    );
};

export default Blogs;
