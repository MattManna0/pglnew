'use client';

import Image from 'next/image';
import '../styles/admin-home.css';

export default function AdminHome() {
  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
    // Redirect to login
    window.location.href = '/';
  };

  const handleSectionClick = (section: string) => {
    if (section === 'general-setup') {
      window.location.href = '/general-setup';
    } else {
      // Do nothing for other sections for now
      console.log(`Clicked on ${section} section`);
    }
  };

  return (
    <div className="admin-home-container">
      <div className="admin-home-header">
        <Image
          src="/greenleaf.png"
          alt="Green Leaf Logo"
          width={80}
          height={80}
          className="admin-home-logo"
          priority
        />
        <h1 className="admin-home-title">
          Admin Home
        </h1>
        <h2 className="admin-home-subtitle">
          Welcome to Project Green Leaf Admin Panel
        </h2>
        <button
          onClick={handleLogout}
          className="admin-home-logout-button"
        >
          Logout
        </button>
      </div>

      <div className="admin-home-content">
        <div className="admin-home-sections">
          <div 
            className="admin-home-section"
            onClick={() => handleSectionClick('general-setup')}
          >
            <div className="admin-home-section-icon">
              ⚙️
            </div>
            <h3 className="admin-home-section-title">General Setup</h3>
            <p className="admin-home-section-description">
              Configure system settings, application preferences, and basic configuration options.
            </p>
          </div>

          <div 
            className="admin-home-section"
            onClick={() => handleSectionClick('manage-participants')}
          >
            <div className="admin-home-section-icon">
              👥
            </div>
            <h3 className="admin-home-section-title">Manage Participants</h3>
            <p className="admin-home-section-description">
              View, edit, and manage participant applications and user accounts.
            </p>
          </div>

          <div 
            className="admin-home-section"
            onClick={() => handleSectionClick('security')}
          >
            <div className="admin-home-section-icon">
              🔒
            </div>
            <h3 className="admin-home-section-title">Security</h3>
            <p className="admin-home-section-description">
              Manage security settings, access controls, and authentication options.
            </p>
          </div>

          <div 
            className="admin-home-section"
            onClick={() => handleSectionClick('data')}
          >
            <div className="admin-home-section-icon">
              📊
            </div>
            <h3 className="admin-home-section-title">Data</h3>
            <p className="admin-home-section-description">
              Access data analytics, export information, and manage database operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
