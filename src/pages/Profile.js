import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className={styles.container}>
                <p className={styles.message}>Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>{user.username[0].toUpperCase()}</div>
            <h2 className={styles.username}>{user.username}</h2>
            <p className={styles.email}>{user.email}</p>
            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={() => navigate('/blogs/create')}>➕ Add Post</button>
            </div>
        </div>
    );
};

export default Profile;
