import React, { useState } from 'react';
import { 
  TerminalIcon, 
  CodeBracketIcon,
  ArrowRightIcon, 
  ZapIcon, 
  ShieldIcon, 
  CodeIcon, 
  CheckIcon, 
  AlertIcon,
  PlayIcon,
  BookIcon,
  HistoryIcon
} from '../components/Icons';
import { SAMPLE_SNIPPETS } from '../data/samples';

export default function HomePage({ onNavigateToStudio, onSelectSample, setActivePage }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Where do I paste my code to get a review?",
      a: "Click on the 'Paste & Review Code' button or 'Review Studio' in the top navigation bar. You can paste any function or file, select your language, choose a review focus, and run the review immediately."
    },
    {
      q: "What programming languages are supported?",
      a: "All major languages including JavaScript, TypeScript, Python, Java, C++, Go, SQL, HTML/CSS, and modern framework code."
    },
    {
      q: "Can I adjust the focus of the review?",
      a: "Yes. In the Review Studio, you can switch between review personas: Senior Engineer (balanced), Security & Bug Hunter (OWASP), Performance Optimizer (Big-O and memory), Clean Code & Refactor (SOLID & readability), or Beginner Tutor."
    },
    {
      q: "Are my code reviews stored anywhere?",
      a: "Reviews are stored exclusively in your browser's local memory (History). You can search, export to JSON, or reload them anytime."
    }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section - Clean, Solid Developer Style */}
      <section className="hero-section">
        <div className="hero-badge">
          <TerminalIcon size={15} />
          <span>Automated Code Review Platform</span>
        </div>

        <h1 className="hero-title">
          Code Quality & Security Reviews <br />
          Built for Software Engineers
        </h1>

        <p className="hero-description">
          Analyze code snippets, uncover hidden bugs, patch vulnerabilities, and optimize execution
          speed with structured, senior-level code reviews.
        </p>

        {/* HERO CALL TO ACTIONS - Very clear where to paste code! */}
        <div className="hero-cta-group">
          <button 
            className="hero-primary-btn"
            onClick={onNavigateToStudio}
            title="Go to the review studio to paste your code"
          >
            <CodeBracketIcon size={18} />
            <span>Paste & Review Code</span>
            <ArrowRightIcon size={16} />
          </button>

          <button 
            className="hero-secondary-btn"
            onClick={() => onSelectSample(SAMPLE_SNIPPETS[0])}
            title="Load a pre-made buggy snippet into the studio"
          >
            <PlayIcon size={15} />
            <span>Test Demo Snippet</span>
          </button>

          <button 
            className="hero-tertiary-btn"
            onClick={() => setActivePage('guidelines')}
          >
            <BookIcon size={15} />
            <span>Best Practices</span>
          </button>
        </div>

        {/* Studio Preview Teaser Card */}
        <div className="hero-preview-wrapper" onClick={onNavigateToStudio}>
          <div className="preview-topbar">
            <div className="preview-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="preview-filename">review-studio.js — Split Workspace</span>
            <span className="preview-action-pill">Open in Studio</span>
          </div>

          <div className="preview-body">
            <div className="preview-pane preview-left">
              <div className="pane-header">
                <span className="pane-badge">Input Code</span>
                <span className="pane-lang">JavaScript</span>
              </div>
              <pre className="preview-code">
{`// ❌ Issues: Async race condition & missing error check
function loadUserData(userId) {
  let profile = fetch('/api/users/' + userId)
    .then(res => res.json());

  // Error: profile is a Promise object, not the resolved data!
  document.getElementById('username').innerText = profile.name;
  return profile;
}`}
              </pre>
            </div>

            <div className="preview-pane preview-right">
              <div className="pane-header">
                <span className="pane-badge badge-green">Senior Review</span>
                <span className="pane-score">Verified Solution</span>
              </div>
              <div className="preview-review-content">
                <div className="preview-issue-tag">
                  <AlertIcon size={14} />
                  <span>Promise not awaited + Unhandled rejection</span>
                </div>
                <pre className="preview-fix">
{`// ✅ Refactored: async/await with error boundary
async function loadUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error('User not found');
    const data = await res.json();
    document.getElementById('username').innerText = data.name;
    return data;
  } catch (err) {
    console.error('Failed to load profile:', err);
    return null;
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works (3 Steps) */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-eyebrow">WORKFLOW</span>
          <h2 className="section-title">How It Works in 3 Simple Steps</h2>
          <p className="section-subtitle">A straightforward workflow to analyze, diagnose, and refactor code.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card" onClick={onNavigateToStudio}>
            <div className="step-number">01</div>
            <div className="step-icon-box">
              <CodeIcon size={22} />
            </div>
            <h3>1. Paste Your Code</h3>
            <p>
              Navigate to the <strong>Review Studio</strong> and paste any function, script, or component. Or choose from our pre-built sample snippets.
            </p>
            <span className="step-link">Open Studio & Paste &rarr;</span>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-box">
              <ZapIcon size={22} />
            </div>
            <h3>2. Select Review Focus</h3>
            <p>
              Choose your review persona: general senior review, security audit (OWASP), performance optimization, or clean code refactoring.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-box">
              <CheckIcon size={22} />
            </div>
            <h3>3. Review Diagnosis & Fixes</h3>
            <p>
              Receive structured feedback detailing potential bugs, security risks, line-by-line recommendations, and ready-to-copy code blocks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Pre-made Buggy Samples (One-click launch into Studio) */}
      <section className="samples-section">
        <div className="section-header">
          <span className="section-eyebrow">DEMO SAMPLES</span>
          <h2 className="section-title">Test with Common Code Challenges</h2>
          <p className="section-subtitle">
            Click any sample below to load it directly into the Review Studio and test the reviewer.
          </p>
        </div>

        <div className="samples-grid">
          {SAMPLE_SNIPPETS.map((snippet) => (
            <div 
              key={snippet.id} 
              className="sample-card"
              onClick={() => onSelectSample(snippet)}
            >
              <div className="sample-card-header">
                <span className="sample-badge">{snippet.badge}</span>
                <span className="sample-lang">{snippet.language}</span>
              </div>
              <h4 className="sample-card-title">{snippet.title}</h4>
              <p className="sample-card-desc">{snippet.description}</p>
              <button className="sample-cta-btn">
                <span>Load in Review Studio</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Capabilities */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">CORE CAPABILITIES</span>
          <h2 className="section-title">Built for Real-World Codebases</h2>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon icon-shield">
              <ShieldIcon size={22} />
            </div>
            <h3>Security & Vulnerability Detection</h3>
            <p>
              Detect SQL injections, Cross-Site Scripting (XSS), unvalidated redirects, insecure deserialization, and exposed credentials.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon icon-zap">
              <ZapIcon size={22} />
            </div>
            <h3>Performance & Algorithmic Optimization</h3>
            <p>
              Identify quadratic O(N²) loops, redundant allocations, unmemoized component renders, and resource leaks.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon icon-code">
              <CodeBracketIcon size={22} />
            </div>
            <h3>Clean Architecture & SOLID</h3>
            <p>
              Refactor nested conditional logic with guard clauses, enforce DRY principles, and decouple monolithic routines.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon icon-history">
              <HistoryIcon size={22} />
            </div>
            <h3>Local Review History</h3>
            <p>
              Keep a local log of all review sessions right in your browser. Re-inspect, copy, or reload previous reviews at any time.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="faq-section">
        <div className="section-header">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${activeFaq === idx ? 'expanded' : ''}`}
              onClick={() => toggleFaq(idx)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
              </div>
              {activeFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bottom Call to Action Banner */}
      <section className="bottom-cta-banner">
        <div className="banner-content">
          <h2>Ready to audit your code?</h2>
          <p>Paste any snippet and get instant senior-level engineering feedback.</p>
          <button className="banner-btn" onClick={onNavigateToStudio}>
            <CodeBracketIcon size={18} />
            <span>Launch Review Studio</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
