'use client';

import Image from 'next/image';
import { useState } from 'react';
import '../styles/create-instance.css';
import Link from "next/link";

export default function CreateInstance() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [credentials, setCredentials] = useState<{username: string; password: string} | null>(null);
  const [error, setError] = useState('');

  const handleGenerateInstance = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/create-instance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCredentials(data.credentials);
      } else {
        setError(data.error || 'Failed to create instance');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="create-instance-container">
      <div className="create-instance-wrapper">
        <div className="create-instance-header">
          <Image
            src="/greenleaf.png"
            alt="Green Leaf Logo"
            width={80}
            height={80}
            className="create-instance-logo"
            priority
          />
          <h1 className="create-instance-title">
            Project Green Leaf
          </h1>
          <h2 className="create-instance-subtitle">
            Create a new instance to get started
          </h2>
        </div>

        <div className="create-instance-content">
          {!credentials ? (
            <button
              onClick={handleGenerateInstance}
              disabled={isGenerating}
              className="create-instance-button"
              type="button"
            >
              {isGenerating ? 'Generating...' : 'Generate Instance'}
            </button>
          ) : (
            <>
              <div className="create-instance-credentials">
                <div className="create-instance-warning">
                  This is important. Write this down.
                </div>
                
                <div className="create-instance-credential-item">
                  <div className="create-instance-credential-label">Username</div>
                  <div className="create-instance-credential-value">{credentials.username}</div>
                </div>
                
                <div className="create-instance-credential-item">
                  <div className="create-instance-credential-label">Password</div>
                  <div className="create-instance-credential-value">{credentials.password}</div>
                </div>
              </div>
              
              <div className="create-instance-back-link">
              <Link href="/">back to login</Link>
              </div>
            </>
          )}

          {error && (
            <div className="create-instance-message create-instance-message-error">
              {error}
            </div>
          )}

          <div className="create-instance-login-link">
            <a href="/">back to login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
