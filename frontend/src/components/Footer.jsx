import React from 'react';
import { TerminalIcon, CodeIcon, ShieldIcon, ZapIcon } from './Icons';

export default function Footer({ setActivePage }) {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <TerminalIcon size={18} />
            <span>CodeReviewer</span>
          </div>
          <p className="footer-tagline">
            Automated code quality analysis, vulnerability detection, and refactoring insights for modern engineering teams.
          </p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Application</h4>
            <button onClick={() => setActivePage('home')}>Home</button>
            <button onClick={() => setActivePage('studio')}>Review Studio</button>
            <button onClick={() => setActivePage('history')}>History</button>
          </div>
          <div className="link-group">
            <h4>Tools</h4>
            <button onClick={() => setActivePage('analytics')}>Code Analytics</button>
            <button onClick={() => setActivePage('guidelines')}>Best Practices</button>
            <button onClick={() => setActivePage('settings')}>Settings</button>
          </div>
          <div className="link-group">
            <h4>Inspection</h4>
            <span><ZapIcon size={13} /> Performance Tuning</span>
            <span><ShieldIcon size={13} /> Security Vulnerabilities</span>
            <span><CodeIcon size={13} /> Clean Architecture</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CodeReviewer. Designed for clean code engineering.</p>
        <div className="footer-status">
          <span className="status-dot"></span>
          <span>Analysis Engine Online</span>
        </div>
      </div>
    </footer>
  );
}
