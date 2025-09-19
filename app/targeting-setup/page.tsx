'use client';

import Image from 'next/image';
import { useState } from 'react';
import '../styles/targeting-setup.css';

export default function TargetingSetup() {
  const [selectedUploader, setSelectedUploader] = useState<'me' | 'participants' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customGuidelines, setCustomGuidelines] = useState<string[]>(['']);

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
    // Redirect to login
    window.location.href = '/';
  };

  const handleBackToGeneralSetup = () => {
    window.location.href = '/general-setup';
  };

  const handleUploaderSelection = (uploader: 'me' | 'participants') => {
    setSelectedUploader(uploader);
  };

  const handleCategorySelection = (category: string) => {
    if (category === 'custom guideline') {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    } else {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const handleCustomGuidelineChange = (index: number, value: string) => {
    setCustomGuidelines(prev => 
      prev.map((guideline, i) => i === index ? value : guideline)
    );
  };

  const addCustomGuideline = () => {
    if (customGuidelines.length < 30) {
      setCustomGuidelines(prev => [...prev, '']);
    }
  };

  const removeCustomGuideline = (index: number) => {
    if (customGuidelines.length > 1) {
      setCustomGuidelines(prev => prev.filter((_, i) => i !== index));
    }
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
        <div className="targeting-setup-question">
          <h3 className="targeting-setup-question-title">
            Are you or separate participants uploading targets?
          </h3>
          
          <div className="targeting-setup-options">
            <div 
              className={`targeting-setup-option ${selectedUploader === 'me' ? 'active' : ''}`}
              onClick={() => handleUploaderSelection('me')}
            >
              <div className="targeting-setup-option-text">Me</div>
            </div>
            
            <div 
              className={`targeting-setup-option ${selectedUploader === 'participants' ? 'active' : ''}`}
              onClick={() => handleUploaderSelection('participants')}
            >
              <div className="targeting-setup-option-text">Participants</div>
            </div>
          </div>
        </div>

        <div className="targeting-setup-auxiliary-section">
          <h3 className="targeting-setup-question-title">
            Which of the following auxiliary data categories will you require?
          </h3>
          
          <div className="targeting-setup-auxiliary-options">
            {['general category', 'salience rating', 'copyright status', 'file type', 'target description', 'custom guideline'].map((category) => (
              <div 
                key={category}
                className={`targeting-setup-auxiliary-option ${selectedCategories.includes(category) ? 'selected' : ''}`}
                onClick={() => handleCategorySelection(category)}
              >
                <div className="targeting-setup-auxiliary-checkbox">
                  {selectedCategories.includes(category) && '✓'}
                </div>
                <div className="targeting-setup-auxiliary-text">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
              </div>
            ))}
          </div>

          {selectedCategories.includes('custom guideline') && (
            <div className="targeting-setup-custom-guidelines">
              {customGuidelines.map((guideline, index) => (
                <div key={index} className="targeting-setup-custom-guideline">
                  <input
                    type="text"
                    value={guideline}
                    onChange={(e) => handleCustomGuidelineChange(index, e.target.value)}
                    placeholder={`Example: The image should not contain any faces or readable text.`}
                    className="targeting-setup-custom-input"
                    maxLength={200}
                  />
                  {customGuidelines.length > 1 && (
                    <button
                      onClick={() => removeCustomGuideline(index)}
                      className="targeting-setup-remove-button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addCustomGuideline}
                disabled={customGuidelines.length >= 30}
                className="targeting-setup-add-guideline"
              >
                Add Guideline ({customGuidelines.length}/30)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
