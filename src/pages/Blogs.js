// src/pages/Blogs.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BlogCard from '../components/BlogCard';
import FloatingButton from '../components/FloatingButton';
import BlogPagination from '../components/BlogPagination';

const Blogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs?page=${page}`);
        const data = await res.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, [page]);

  return (
    <div style={{ padding: '6rem 1.5rem 2rem' }}>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Blogs</h1>
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
      <BlogPagination page={page} setPage={setPage} totalPages={totalPages} />
      {user && <FloatingButton />}
    </div>
  );
};

export default Blogs;
