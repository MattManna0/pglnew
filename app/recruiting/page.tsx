'use client';

import Image from 'next/image';
import { useState } from 'react';
import '../styles/recruiting.css';

export default function Recruiting() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Invalid email format';
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Invalid phone number format';
    }
    
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
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Application submitted successfully!');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to submit application');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recruiting-container">
      <div className="recruiting-form-wrapper">
        <div className="recruiting-header">
          <Image
            src="/greenleaf.png"
            alt="Green Leaf Logo"
            width={80}
            height={80}
            className="recruiting-logo"
            priority
          />
          <h1 className="recruiting-title">
            Project Green Leaf
          </h1>
          <h2 className="recruiting-subtitle">
          Your information will only be used to contact you about Project Green Leaf recruitment and will never be shared
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="recruiting-form">
          <div className="recruiting-field-group">
            <label htmlFor="name" className="recruiting-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="recruiting-input"
              placeholder="Enter your full name"
              maxLength={100}
              required
            />
          </div>

          <div className="recruiting-field-group">
            <label htmlFor="email" className="recruiting-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="recruiting-input"
              placeholder="Enter your email address"
              maxLength={100}
              required
            />
          </div>

          <div className="recruiting-field-group">
            <label htmlFor="phone" className="recruiting-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="recruiting-input"
              placeholder="Enter your phone number"
              maxLength={20}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="recruiting-submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <div className="recruiting-privacy-link-wrapper">
          <a
            href="/privacy"
            className="recruiting-privacy-link"
          >
            Privacy Policy
          </a>
        </div>

        {message && (
          <div className={`recruiting-message ${
            message.includes('successfully') 
              ? 'recruiting-message-success' 
              : 'recruiting-message-error'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
