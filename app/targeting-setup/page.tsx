'use client';

import Image from 'next/image';
import { useState } from 'react';
import '../styles/targeting-setup.css';

export default function TargetingSetup() {
  const [selectedUploader, setSelectedUploader] = useState<'me' | 'participants' | null>(null);
  const [twoStageTargeting, setTwoStageTargeting] = useState<'yes' | 'no' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customGuidelines, setCustomGuidelines] = useState<string[]>(['']);
  const [requiredCategories, setRequiredCategories] = useState<string[]>([]);
  const [requiredGuidelines, setRequiredGuidelines] = useState<boolean[]>([false]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startTimezone, setStartTimezone] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endTimezone, setEndTimezone] = useState('');

  // Get current date and time for minimum values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

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
    // Reset two-stage targeting when switching uploader
    if (uploader === 'me') {
      setTwoStageTargeting(null);
    }
  };

  const handleTwoStageSelection = (option: 'yes' | 'no') => {
    setTwoStageTargeting(option);
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

  const handleRequiredCategoryToggle = (category: string) => {
    setRequiredCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRequiredGuidelineToggle = (index: number) => {
    setRequiredGuidelines(prev => 
      prev.map((required, i) => i === index ? !required : required)
    );
  };

  const addCustomGuideline = () => {
    if (customGuidelines.length < 30) {
      setCustomGuidelines(prev => [...prev, '']);
      setRequiredGuidelines(prev => [...prev, false]);
    }
  };

  const removeCustomGuideline = (index: number) => {
    if (customGuidelines.length > 1) {
      setCustomGuidelines(prev => prev.filter((_, i) => i !== index));
      setRequiredGuidelines(prev => prev.filter((_, i) => i !== index));
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

        {selectedUploader === 'participants' && (
          <div className="targeting-setup-two-stage-section">
            <h3 className="targeting-setup-question-title">
              Do you require a two-stage targeting procedure, where a different set of targeting participants review the first set of targets?
            </h3>
            
            <div className="targeting-setup-two-stage-options">
              <div 
                className={`targeting-setup-two-stage-option ${twoStageTargeting === 'yes' ? 'active' : ''}`}
                onClick={() => handleTwoStageSelection('yes')}
              >
                <div className="targeting-setup-two-stage-text">Yes</div>
              </div>
              
              <div 
                className={`targeting-setup-two-stage-option ${twoStageTargeting === 'no' ? 'active' : ''}`}
                onClick={() => handleTwoStageSelection('no')}
              >
                <div className="targeting-setup-two-stage-text">No</div>
              </div>
            </div>
          </div>
        )}

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
                {selectedCategories.includes(category) && category !== 'custom guideline' && (
                  <div className="targeting-setup-required-section">
                    <span className="targeting-setup-required-text">Required</span>
                    <div 
                      className={`targeting-setup-required-checkbox ${requiredCategories.includes(category) ? 'checked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequiredCategoryToggle(category);
                      }}
                    >
                      {requiredCategories.includes(category) && '✓'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedCategories.includes('custom guideline') && (
            <div className="targeting-setup-custom-guidelines">
              {customGuidelines.map((guideline, index) => (
                <div key={index} className="targeting-setup-custom-guideline">
                  <div className="targeting-setup-custom-input-wrapper">
                    <input
                      type="text"
                      value={guideline}
                      onChange={(e) => handleCustomGuidelineChange(index, e.target.value)}
                      placeholder={`Example: The image should not contain any faces or readable text.`}
                      className="targeting-setup-custom-input"
                      maxLength={200}
                    />
                    <div className="targeting-setup-custom-required-section">
                      <span className="targeting-setup-custom-required-text">Required</span>
                      <div 
                        className={`targeting-setup-custom-required-checkbox ${requiredGuidelines[index] ? 'checked' : ''}`}
                        onClick={() => handleRequiredGuidelineToggle(index)}
                      >
                        {requiredGuidelines[index] && '✓'}
                      </div>
                    </div>
                  </div>
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

        <div className="targeting-setup-timing-section">
          <h3 className="targeting-setup-question-title">
            When will the targeting phase start and end?
          </h3>
          <p className="targeting-setup-timing-warning">
            Targets cannot be added before or after this timeframe.
          </p>
          
          <div className="targeting-setup-timing-container">
            <div className="targeting-setup-timing-group">
              <h4 className="targeting-setup-timing-title">Start</h4>
              <div className="targeting-setup-timing-inputs">
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={currentDate}
                    className="targeting-setup-timing-input"
                  />
                </div>
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={startDate === currentDate ? currentTime : undefined}
                    className="targeting-setup-timing-input"
                  />
                </div>
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Timezone</label>
                  <select
                    value={startTimezone}
                    onChange={(e) => setStartTimezone(e.target.value)}
                    className="targeting-setup-timing-input"
                  >
                    <option value="">Select timezone</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="Europe/Paris">CET (Paris)</option>
                    <option value="Asia/Tokyo">JST (Tokyo)</option>
                    <option value="Australia/Sydney">AEST (Sydney)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="targeting-setup-timing-group">
              <h4 className="targeting-setup-timing-title">End</h4>
              <div className="targeting-setup-timing-inputs">
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="targeting-setup-timing-input"
                  />
                </div>
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="targeting-setup-timing-input"
                  />
                </div>
                <div className="targeting-setup-timing-input-group">
                  <label className="targeting-setup-timing-label">Timezone</label>
                  <select
                    value={endTimezone}
                    onChange={(e) => setEndTimezone(e.target.value)}
                    className="targeting-setup-timing-input"
                  >
                    <option value="">Select timezone</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="Europe/Paris">CET (Paris)</option>
                    <option value="Asia/Tokyo">JST (Tokyo)</option>
                    <option value="Australia/Sydney">AEST (Sydney)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
