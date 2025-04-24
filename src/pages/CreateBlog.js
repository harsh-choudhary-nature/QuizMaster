// src/pages/CreateBlog.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/CreateBlog.module.css';
import Select from 'react-select';
import keywordsOptions from '../data/keywordsOptions';
import remarkGfm from 'remark-gfm';

const CreateBlog = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [markdown, setMarkdown] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [title, setTitle] = useState('');

    if (!user) {
        return <div className={styles.authWarning}>Please log in to create a blog.</div>;
    }

    const handleCreate = async () => {
        if (!title || !markdown || keywords.length === 0) {
            setErrorMsg('Please fill in all fields');
            return;
        }
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },            
                body: JSON.stringify({
                    content: markdown,
                    username: user.username,
                    email: user.email,
                    title,
                    keywords: keywords.map((keyword) => keyword.value),
                }),
            });

            if (res.ok) {
                navigate('/blogs');
            } else {
                const data = await res.json();
                setErrorMsg(data.message || 'Failed to create blog.');
            }
        } catch (err) {
            setErrorMsg('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#1f1f1f',
            borderColor: state.isFocused ? '#ffd700' : '#ccc',
            color: 'white',
            boxShadow: state.isFocused ? '0 0 0 1px #ffd700' : 'none',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#2a2a2a',
            color: 'white',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#ffd700',
            color: 'black',
            fontWeight: 'bold',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'black',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'black',
            ':hover': {
                backgroundColor: 'black',
                color: '#ffd700',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#aaa',
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#333' : '#2a2a2a',
            color: state.isFocused ? '#ffd700' : 'white',
            cursor: 'pointer',
        }),

    };


    return (
        <div className={styles.container}>
            <h2>Create a Blog</h2>

            {/* Title Input */}
            <div className={styles.inputField}>
                {/* <label htmlFor="title">Title</label> */}
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the blog title"
                />
            </div>
            <div className={styles.keywordsSelectContainer}>
                <Select
                    options={keywordsOptions}
                    isMulti
                    value={keywords}
                    onChange={setKeywords}
                    className={styles.keywordsSelect}
                    classNamePrefix="select"
                    placeholder="Select keywords..."
                    styles={customSelectStyles}
                />
            </div>

            <div className={styles.editorContainer}>
                <div className={styles.editorPane}>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Write your markdown content here..."
                    />
                </div>
                <div className={styles.divider}></div>
                <div className={styles.previewPane}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                </div>
            </div>

            <button className={styles.createBtn} onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Blog'}
            </button>
            {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        </div>
    );
};

export default CreateBlog;
