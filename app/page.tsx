'use client';

import Image from 'next/image';
import { useState } from 'react';
import './styles/login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    role: 'admin',
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.password.trim()) return 'Password is required';
    if (formData.username.length < 3) return 'Username must be at least 3 characters';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        setAttemptCount(0);
        // Redirect based on role
        setTimeout(() => {
          if (formData.role === 'admin') {
            window.location.href = '/admin-home';
          } else {
            window.location.href = '/recruiting';
          }
        }, 1000);
      } else {
        setMessage(data.error || 'Login failed');
        setAttemptCount(prev => prev + 1);
      }
    } catch {
      setMessage('Network error. Please try again.');
      setAttemptCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <Image
            src="/greenleaf.png"
            alt="Green Leaf Logo"
            width={80}
            height={80}
            className="login-logo"
            priority
          />
          <h1 className="login-title">
            Project Green Leaf
          </h1>
          <h2 className="login-subtitle">
            Please sign in to continue
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label htmlFor="role" className="login-label">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="login-role-select"
              required
            >
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="login-field-group">
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Enter your username"
              maxLength={50}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Enter your password"
              maxLength={100}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || attemptCount >= 5}
            className="login-submit-button"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <a
            href="/create-instance"
            className="login-footer-link"
          >
            Create Instance
          </a>
        </div>

        {attemptCount >= 3 && attemptCount < 5 && (
          <div className="login-message login-attempts-warning">
            Warning: {5 - attemptCount} login attempts remaining
          </div>
        )}

        {attemptCount >= 5 && (
          <div className="login-message login-message-error">
            Too many failed attempts. Please try again later.
          </div>
        )}

        {message && (
          <div className={`login-message ${
            message.includes('successful') 
              ? 'login-message-success' 
              : 'login-message-error'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
