import React from 'react';
import { 
  HomeIcon, 
  CodeIcon, 
  HistoryIcon, 
  AnalyticsIcon, 
  BookIcon, 
  SettingsIcon, 
  TerminalIcon,
  CodeBracketIcon
} from './Icons';

export default function Navbar({ activePage, setActivePage, historyCount = 0 }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'studio', label: 'Review Studio', icon: CodeIcon, highlight: true },
    { id: 'history', label: 'History', icon: HistoryIcon, badge: historyCount > 0 ? historyCount : null },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'guidelines', label: 'Guidelines', icon: BookIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="app-navbar">
      <div className="nav-container">
        {/* Brand logo & title */}
        <div className="brand" onClick={() => setActivePage('home')}>
          <div className="brand-logo">
            <TerminalIcon size={18} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">CodeReviewer</span>
            <span className="brand-badge">DEVELOPER SUITE</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'studio-btn' : ''}`}
                title={item.label}
              >
                <Icon size={16} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right quick CTA */}
        <div className="nav-actions">
          <button 
            className="quick-review-btn" 
            onClick={() => setActivePage('studio')}
            title="Go to Code Review Studio"
          >
            <CodeBracketIcon size={15} />
            <span>Open Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
}
