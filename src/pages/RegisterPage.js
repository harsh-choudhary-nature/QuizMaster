import React, { useState } from 'react';
import styles from '../styles/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email.trim()) {
      setMessage('Email is required');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpSent(true);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { username, email, password, otp } = form;

    if (!username.trim() || !email.trim() || !password.trim() || !otp.trim()) {
      setMessage('All fields are required');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      {!otpSent ? (
        <button onClick={sendOtp} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Verify Email'}
        </button>
      ) : (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            maxLength={6}
            value={form.otp}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </>
      )}

      {<p className={styles.message}>{message || '\u00A0'}</p>}

    </div>
  );
}

export default RegisterPage;
