'use client';

import Image from 'next/image';
import '../styles/general-setup.css';

export default function GeneralSetup() {
  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
    // Redirect to login
    window.location.href = '/';
  };

  const handleBackToAdmin = () => {
    window.location.href = '/admin-home';
  };

  const handleSectionClick = (section: string) => {
    if (section === 'targeting') {
      window.location.href = '/targeting-setup';
    } else {
      // Do nothing for other sections for now
      console.log(`Clicked on ${section} section`);
    }
  };

  return (
    <div className="general-setup-container">
      <div className="general-setup-header">
        <Image
          src="/greenleaf.png"
          alt="Green Leaf Logo"
          width={80}
          height={80}
          className="general-setup-logo"
          priority
        />
        <h1 className="general-setup-title">
          General Setup
        </h1>
        <h2 className="general-setup-subtitle">
          Configure system settings and preferences
        </h2>
        <div>
          <button
            onClick={handleBackToAdmin}
            className="general-setup-back-button"
          >
            ← Back to Admin
          </button>
          <button
            onClick={handleLogout}
            className="general-setup-logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="general-setup-content">
        <div className="general-setup-sections">
          <div 
            className="general-setup-section"
            onClick={() => handleSectionClick('targeting')}
          >
            <div className="general-setup-section-icon">
              🎯
            </div>
            <h3 className="general-setup-section-title">Targeting</h3>
            <p className="general-setup-section-description">
              Configure targeting parameters and criteria for participant selection.
            </p>
          </div>

          <div 
            className="general-setup-section"
            onClick={() => handleSectionClick('viewing')}
          >
            <div className="general-setup-section-icon">
              👁️
            </div>
            <h3 className="general-setup-section-title">Viewing</h3>
            <p className="general-setup-section-description">
              Set up viewing preferences and display configuration options.
            </p>
          </div>

          <div 
            className="general-setup-section"
            onClick={() => handleSectionClick('judging')}
          >
            <div className="general-setup-section-icon">
              ⚖️
            </div>
            <h3 className="general-setup-section-title">Judging</h3>
            <p className="general-setup-section-description">
              Configure judging criteria and evaluation parameters.
            </p>
          </div>

          <div 
            className="general-setup-section"
            onClick={() => handleSectionClick('data')}
          >
            <div className="general-setup-section-icon">
              📊
            </div>
            <h3 className="general-setup-section-title">Data</h3>
            <p className="general-setup-section-description">
              Manage data collection settings and storage preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
