'use client';

import Image from 'next/image';
import '../styles/create-instance.css';

export default function CreateInstance() {
  const handleGenerateInstance = () => {
    // Do nothing for now as requested
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
          <button
            onClick={handleGenerateInstance}
            className="create-instance-button"
            type="button"
          >
            Generate Instance
          </button>
        </div>
      </div>
    </div>
  );
}
