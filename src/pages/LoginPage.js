import React, { useState } from 'react';
import styles from '../styles/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        const { email, password } = form;

        if (!email.trim() || !password.trim()) {
            setMessage('Email and password are required');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            login({ email, username: data.username, token: data.token });
            setMessage('Login successful!');
            navigate('/blogs'); // Or wherever you want to go after login
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <h2>Login</h2>
            <label>Email<span className={styles.redChar}>*</span>: </label>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <label>Password<span className={styles.redChar}>*</span>: </label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {<p className={styles.message}>{message || '\u00A0'}</p>}
        </div>
    );
}

export default LoginPage;
