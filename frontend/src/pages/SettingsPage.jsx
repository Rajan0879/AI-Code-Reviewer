import React, { useState } from 'react';
import { 
  SettingsIcon, 
  CheckIcon, 
  TrashIcon, 
  CodeBracketIcon 
} from '../components/Icons';
import { getSettings, saveSettings, clearHistory } from '../utils/storage';

export default function SettingsPage({ onSettingsUpdated }) {
  const [settings, setLocalSettings] = useState(getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(settings);
    if (onSettingsUpdated) onSettingsUpdated(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved code review history? This cannot be undone.')) {
      clearHistory();
      if (onSettingsUpdated) onSettingsUpdated(settings);
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 2500);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      const defaults = {
        apiUrl: 'https://ai-code-reviewer-vins.onrender.com/ai/get-review',
        defaultLanguage: 'javascript',
        defaultFocus: 'senior',
        fontSize: 15,
        tabSize: 2,
        apiKey: '',
        autoSaveHistory: true,
      };
      saveSettings(defaults);
      setLocalSettings(defaults);
      if (onSettingsUpdated) onSettingsUpdated(defaults);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-badge">
            <SettingsIcon size={15} />
            <span>Preferences</span>
          </div>
          <h1 className="page-title">Settings & Preferences</h1>
          <p className="page-subtitle">
            Configure your code review preferences and manage stored data.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* Section 1: Review Defaults */}
        <div className="settings-section">
          <div className="section-title-row">
            <CodeBracketIcon size={18} />
            <h3>Review Configuration</h3>
          </div>
          <p className="section-desc">
            Customize the default reviewer persona and primary coding language for new reviews.
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label>Default Review Persona:</label>
              <select
                value={settings.defaultFocus}
                onChange={(e) => setLocalSettings({ ...settings, defaultFocus: e.target.value })}
                className="select-input"
              >
                <option value="senior">Senior Engineer (Balanced & Thorough)</option>
                <option value="security">Security & Vulnerability Hunter</option>
                <option value="performance">Performance & Big-O Optimizer</option>
                <option value="clean">Clean Code & Refactor (DRY / SOLID)</option>
                <option value="beginner">Beginner Friendly Tutor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Language:</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setLocalSettings({ ...settings, defaultLanguage: e.target.value })}
                className="select-input"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="sql">SQL</option>
              </select>
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={settings.autoSaveHistory}
                onChange={(e) => setLocalSettings({ ...settings, autoSaveHistory: e.target.checked })}
              />
              <span>Automatically archive reviews from the last 4 days into local History</span>
            </label>
          </div>
        </div>

        {/* Section 2: Data Management */}
        <div className="settings-section">
          <div className="section-title-row">
            <TrashIcon size={18} />
            <h3>Storage & Data Management</h3>
          </div>
          <p className="section-desc">
            Manage reviews stored in your browser's local memory.
          </p>

          <div className="data-management-actions">
            <button 
              type="button" 
              className="danger-btn"
              onClick={handleClearHistory}
            >
              <TrashIcon size={15} />
              <span>{clearedSuccess ? 'History Cleared!' : 'Clear All Review History'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Save button bar */}
        <div className="settings-footer-actions">
          <button type="submit" className="save-settings-btn">
            {savedSuccess ? <CheckIcon size={16} /> : <SettingsIcon size={16} />}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>

          <button 
            type="button" 
            className="reset-btn"
            onClick={handleResetDefaults}
          >
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
