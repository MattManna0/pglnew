'use client';

import Image from 'next/image';
import '../styles/targeting-setup.css';

export default function TargetingSetup() {
  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
    // Redirect to login
    window.location.href = '/';
  };

  const handleBackToGeneralSetup = () => {
    window.location.href = '/general-setup';
  };

  return (
    <div className="targeting-setup-container">
      <div className="targeting-setup-header">
        <Image
          src="/greenleaf.png"
          alt="Green Leaf Logo"
          width={80}
          height={80}
          className="targeting-setup-logo"
          priority
        />
        <h1 className="targeting-setup-title">
          Targeting Setup
        </h1>
        <h2 className="targeting-setup-subtitle">
          Configure targeting parameters and criteria
        </h2>
        <div>
          <button
            onClick={handleBackToGeneralSetup}
            className="targeting-setup-back-button"
          >
            ← Back to General Setup
          </button>
          <button
            onClick={handleLogout}
            className="targeting-setup-logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="targeting-setup-content">
        <p className="targeting-setup-placeholder">
          Targeting setup content will be implemented here.
        </p>
      </div>
    </div>
  );
}
