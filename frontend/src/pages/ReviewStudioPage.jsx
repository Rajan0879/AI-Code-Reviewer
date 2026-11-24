import React, { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import { 
  TerminalIcon,
  CodeBracketIcon,
  CopyIcon, 
  CheckIcon, 
  TrashIcon, 
  DownloadIcon, 
  ZapIcon, 
  ShieldIcon, 
  AlertIcon,
  PlayIcon,
  AnalyticsIcon
} from '../components/Icons';
import { SAMPLE_SNIPPETS } from '../data/samples';
import { saveHistoryItem, getSettings } from '../utils/storage';

const FOCUS_OPTIONS = [
  { id: 'senior', label: 'Senior Engineer', desc: 'Balanced: quality, security & performance' },
  { id: 'security', label: 'Security & Bug Hunter', desc: 'Focus on OWASP, vulnerabilities & sanitization' },
  { id: 'performance', label: 'Performance Optimizer', desc: 'Focus on Big-O, bottlenecks & memory' },
  { id: 'clean', label: 'Clean Code & Refactor', desc: 'Focus on SOLID, readability & DRY' },
  { id: 'beginner', label: 'Beginner Tutor', desc: 'Step-by-step simple explanations & concepts' },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'sql', label: 'SQL' },
  { id: 'html', label: 'HTML/CSS' },
];

export default function ReviewStudioPage({ 
  code, 
  setCode, 
  review, 
  setReview, 
  onReviewSaved,
  onNavigateToAnalytics 
}) {
  const [language, setLanguage] = useState('javascript');
  const [focus, setFocus] = useState('senior');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const settings = getSettings();

  useEffect(() => {
    prism.highlightAll();
  }, [code, review]);

  const lineCount = (code || '').split('\n').length;
  const charCount = (code || '').length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyReview = () => {
    navigator.clipboard.writeText(review);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const handleDownloadReview = () => {
    const blob = new Blob([review], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `code-review-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearCode = () => {
    if (code && window.confirm('Clear all code in editor?')) {
      setCode('');
      setErrorMsg('');
    }
  };

  const handleSelectSample = (sampleId) => {
    const found = SAMPLE_SNIPPETS.find(s => s.id === sampleId);
    if (found) {
      setCode(found.code);
      setLanguage(found.language);
      setErrorMsg('');
    }
  };

  async function reviewCode() {
    if (!code || !code.trim()) {
      setErrorMsg('Please paste or write some code first before requesting a review.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setReview('');

    setLoadingStep('Parsing syntax and code structures...');
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Evaluating security, performance, and best practices...');
    }, 1500);
    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Generating recommendations and refactored code...');
    }, 3000);

    try {
      const focusObj = FOCUS_OPTIONS.find(f => f.id === focus);
      const promptPayload = `[Language: ${language.toUpperCase()} | Review Focus: ${focusObj ? focusObj.label : 'Senior Code Review'}]\n\nPlease review the following code:\n\n${code}`;

      const endpoint = settings.apiUrl || 'https://ai-code-reviewer-vins.onrender.com/ai/get-review';
      
      const response = await axios.post(endpoint, {
        code: promptPayload
      });

      const reviewText = response.data;
      setReview(reviewText);

      // Auto-save review to history
      if (settings.autoSaveHistory) {
        saveHistoryItem({
          code,
          review: reviewText,
          language,
          focus
        });
        if (onReviewSaved) onReviewSaved();
      }
    } catch (err) {
      console.error('Code review failed:', err);
      let msg = 'Failed to generate review. Please check your network connection or try again.';
      if (err.response && err.response.data) {
        msg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      }
      setErrorMsg(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setLoadingStep('');
    }
  }

  // Generate line numbers column
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="review-studio-page">
      {/* 1. Top Controls Bar */}
      <div className="studio-topbar">
        <div className="topbar-left">
          {/* Language selector */}
          <div className="control-group">
            <label className="control-label">Language:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="studio-select"
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Focus persona selector */}
          <div className="control-group">
            <label className="control-label">Review Focus:</label>
            <select 
              value={focus} 
              onChange={(e) => setFocus(e.target.value)}
              className="studio-select focus-select"
            >
              {FOCUS_OPTIONS.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Sample loader */}
          <div className="control-group">
            <label className="control-label">Load Sample:</label>
            <select 
              onChange={(e) => handleSelectSample(e.target.value)}
              defaultValue=""
              className="studio-select sample-select"
            >
              <option value="" disabled>Select sample code...</option>
              {SAMPLE_SNIPPETS.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="topbar-right">
          {/* Code stats */}
          <div className="code-stats">
            <span>{lineCount} lines</span>
            <span className="stat-separator">•</span>
            <span>{charCount} chars</span>
          </div>

          <button 
            className="topbar-btn" 
            onClick={handleCopyCode} 
            title="Copy Code to Clipboard"
          >
            {copiedCode ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button 
            className="topbar-btn" 
            onClick={handleClearCode} 
            title="Clear Code Editor"
          >
            <TrashIcon size={14} />
            <span>Clear</span>
          </button>

          <button 
            className="topbar-btn highlight-btn"
            onClick={onNavigateToAnalytics}
            title="Inspect static code metrics & smells"
          >
            <AnalyticsIcon size={14} />
            <span>Analyze Metrics</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="studio-error-banner">
          <AlertIcon size={16} />
          <span>{errorMsg}</span>
          <button className="error-dismiss" onClick={() => setErrorMsg('')}>&times;</button>
        </div>
      )}

      {/* 2. Main Split Workspace */}
      <main className="studio-main">
        {/* Left Side: Code Editor with Line Numbers */}
        <div className="studio-pane studio-left">
          <div className="pane-header-bar">
            <div className="pane-title">
              <CodeBracketIcon size={16} />
              <span>Source Code Input</span>
            </div>
            <span className="pane-hint">Paste or write code</span>
          </div>

          <div className="code-workspace">
            <div className="line-numbers" aria-hidden="true">
              {lineNumbers.map(n => (
                <span key={n} className="line-no">{n}</span>
              ))}
            </div>

            <div className="code-editor-wrapper">
              <Editor
                value={code}
                onValueChange={newCode => setCode(newCode)}
                highlight={c => prism.highlight(c, prism.languages[language] || prism.languages.javascript, language)}
                padding={14}
                placeholder="// Paste or write your code here..."
                style={{
                  fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
                  fontSize: 15,
                  minHeight: "100%",
                  width: "100%",
                  lineHeight: "1.6",
                }}
              />
            </div>
          </div>

          {/* Floating Action Button */}
          <div className="editor-floating-actions">
            <button
              onClick={reviewCode}
              disabled={loading}
              className={`review-action-btn ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CodeBracketIcon size={16} />
                  <span>Review Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Review Output */}
        <div className="studio-pane studio-right">
          <div className="pane-header-bar">
            <div className="pane-title">
              <TerminalIcon size={16} />
              <span>Review Findings & Suggestions</span>
            </div>

            {review && !loading && (
              <div className="review-actions">
                <button 
                  className="review-btn" 
                  onClick={handleCopyReview} 
                  title="Copy review text"
                >
                  {copiedReview ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                  <span>{copiedReview ? 'Copied' : 'Copy'}</span>
                </button>
                <button 
                  className="review-btn" 
                  onClick={handleDownloadReview} 
                  title="Download review as Markdown (.md)"
                >
                  <DownloadIcon size={13} />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          <div className="review-scroll-container">
            {loading ? (
              <div className="review-loading-state">
                <div className="loading-card">
                  <div className="loading-spinner-ring"></div>
                  <h3 className="loading-title">Review in Progress</h3>
                  <p className="loading-step-text">{loadingStep || 'Connecting to review engine...'}</p>
                  
                  <div className="skeleton-container">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-line"></div>
                    <div className="skeleton skeleton-line-short"></div>
                    <div className="skeleton skeleton-block"></div>
                    <div className="skeleton skeleton-line"></div>
                  </div>
                </div>
              </div>
            ) : review ? (
              <div className="review-markdown-content">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>
              </div>
            ) : (
              <div className="review-empty-state">
                <div className="empty-icon-circle">
                  <TerminalIcon size={30} />
                </div>
                <h3>Ready for Review</h3>
                <p>
                  Paste your code in the left editor and click <strong>"Review Code"</strong> to run
                  diagnostics on bugs, vulnerabilities, and performance.
                </p>

                <div className="empty-quick-tips">
                  <div className="tip-item">
                    <ShieldIcon size={15} />
                    <span>Scans for injection, XSS, and insecure patterns</span>
                  </div>
                  <div className="tip-item">
                    <ZapIcon size={15} />
                    <span>Identifies bottlenecks, high complexity, and leaks</span>
                  </div>
                </div>

                <div className="empty-samples-prompt">
                  <span>Need a quick test?</span>
                  <button 
                    className="empty-sample-btn"
                    onClick={() => handleSelectSample('async-race')}
                  >
                    <PlayIcon size={12} />
                    <span>Load Demo Snippet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
