import React, { useState, useRef } from 'react';
import styles from '../styles/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Create refs for each OTP input
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = form.otp.split('');
    newOtp[index] = value;
    setForm({ ...form, otp: newOtp.join('') });

    // Move to the next OTP input if the current input has a value
    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const sendOtp = async () => {
    if (!form.email.trim()) {
      setMessage('Email is required');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/send-otp`, {
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      alert('Registration successful! Please log in.');
      navigate('/auth/login'); // Redirect to login page after successful registration
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <label>Email<span className={styles.redChar}>*</span>: </label>
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
          {loading ? 'Sending OTP...' : 'Get OTP'}
        </button>
      ) : (
        <>
          <label>OTP<span className={styles.redChar}>*</span>: </label>
          <div className={styles.otpContainer}>
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                name={`otp${index}`}
                maxLength="1"
                value={form.otp[index] || ''}
                onChange={(e) => handleOtpChange(e, index)}
                ref={otpRefs[index]} // Assign the ref to each input
                required
              />
            ))}
          </div>
          <label>Username<span className={styles.redChar}>*</span>: </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
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
