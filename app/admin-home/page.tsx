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

  return (
    <div className="admin-home-container">
      <div className="admin-home-wrapper">
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
    </div>
  );
}
