import React, { useState } from 'react';
import styles from '../styles/RegisterPage.module.css';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      {!otpSent ? (
        <button onClick={sendOtp}>Verify Email</button>
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
          <button onClick={handleRegister}>Register</button>
        </>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default RegisterPage;
