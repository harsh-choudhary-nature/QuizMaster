import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account?");
        if (!confirm) return;

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to delete account');

            deleteAccount();
            navigate('/auth/register');
        } catch (err) {
            alert(err.message);
        }
    };


    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarBrand}>WittyWhiz</div>
                <ul className={styles.navbarLinks}>
                    <li key='Games'><Link to='/' className={styles.navbarLink}>Games</Link></li>
                    <li key='Blogs'><Link to='/blogs' className={styles.navbarLink}>Blogs</Link></li>
                    {user ? (
                        <>
                            <li key='Logout'><button onClick={handleLogout} className={styles.navbarButton}>Logout</button></li>
                            <li key='Delete'><button onClick={handleDelete} className={styles.navbarButton}>Delete Account</button></li>
                            <li key='Profile'><Link to='/profile' className={styles.navbarLink}><div className={styles.profileIcon}>{user.username[0].toUpperCase()}</div></Link></li>
                        </>
                    ) : (
                        <>
                            <li key='Login'><Link to='/auth/login' className={styles.navbarLink}>Login</Link></li>
                            <li key='Register'><Link to='/auth/register' className={styles.navbarLink}>Register</Link></li>
                        </>
                    )}
                </ul>
                <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                    &#9776;
                </button>
            </nav>

            {isOpen && (
                <>
                    <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                            <span>Menu</span>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
                        <ul className={styles.sidebarLinks}>
                            <li key='Games'><Link to='/' className={styles.navbarLink}>Games</Link></li>
                            <li key='Blogs'><Link to='/blogs' className={styles.navbarLink}>Blogs</Link></li>
                            {user ? (
                                <>
                                    <li key='Logout'><button onClick={handleLogout} className={styles.navbarButton}>Logout</button></li>
                                    <li key='Delete'><button onClick={handleDelete} className={styles.navbarButton}>Delete Account</button></li>
                                    <li key='Profile'><Link to='/profile' className={styles.navbarLink}><div className={styles.profileIcon}>{user.username[0].toUpperCase()}</div></Link></li>
                                </>
                            ) : (
                                <>
                                    <li key='Login'><Link to='/auth/login' className={styles.navbarLink}>Login</Link></li>
                                    <li key='Register'><Link to='/auth/register' className={styles.navbarLink}>Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </>
    );
}
