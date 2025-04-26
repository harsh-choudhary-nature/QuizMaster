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

    const [searchInput, setSearchInput] = useState(''); // raw input from the user
    const [search, setSearch] = useState(''); // debounced search term

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPage(1);        // Reset to page 1
            setSearch(searchInput);
        }, 500); // 500ms after the last keystroke

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs?page=${page}&search=${encodeURIComponent(search)}`);
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
    }, [page, search]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Blogs</h1>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={styles.searchInput}
                />
                {loading && <div className={styles.spinner}></div>}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {/* Add a wrapper div for blogs with conditional class */}
            <div className={loading ? styles.blogsLoading : styles.blogs}>
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
            </div>
            {user && <FloatingButton />}
        </div>
    );
};

export default Blogs;
