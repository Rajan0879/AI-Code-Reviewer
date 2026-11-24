import React, { useState } from 'react';
import { 
  AnalyticsIcon, 
  ShieldIcon, 
  ZapIcon, 
  AlertIcon, 
  CheckIcon, 
  CodeIcon, 
  ArrowRightIcon 
} from '../components/Icons';
import { analyzeCode } from '../utils/analytics';

export default function AnalyticsPage({ code, setCode, onNavigateToStudio }) {
  const [inspectCode, setInspectCode] = useState(code || `function calculateTotal(items, discountRate) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].price > 0) {
      if (items[i].inStock) {
        total += items[i].price * items[i].quantity;
      }
    }
  }
  if (discountRate) {
    total = total - (total * discountRate);
  }
  console.log("Calculated total:", total);
  return total;
}`);

  const analysis = analyzeCode(inspectCode);

  const handleSendToStudio = () => {
    setCode(inspectCode);
    onNavigateToStudio();
  };

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      default: return 'grade-d';
    }
  };

  const getComplexityClass = (complexity) => {
    switch (complexity) {
      case 'Low': return 'complexity-low';
      case 'Moderate': return 'complexity-moderate';
      default: return 'complexity-high';
    }
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-badge">
            <AnalyticsIcon size={16} />
            <span>Instant Static Analysis</span>
          </div>
          <h1 className="page-title">Code Health & Analytics</h1>
          <p className="page-subtitle">
            Client-side static metrics, complexity estimator, security smell detection, and maintainability grading.
          </p>
        </div>

        <button className="primary-header-btn" onClick={handleSendToStudio}>
          <CodeIcon size={16} />
          <span>Review This Code with AI</span>
          <ArrowRightIcon size={15} />
        </button>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="metrics-cards-grid">
        {/* Card 1: Maintainability Score */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Maintainability Index</span>
            <span className={`grade-pill ${getGradeClass(analysis.maintainabilityGrade)}`}>
              Grade {analysis.maintainabilityGrade}
            </span>
          </div>
          <div className="metric-big-number">
            <span>{analysis.maintainabilityScore}</span>
            <span className="metric-unit">/ 100</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${getGradeClass(analysis.maintainabilityGrade)}`} 
              style={{ width: `${analysis.maintainabilityScore}%` }}
            ></div>
          </div>
          <p className="metric-caption">
            {analysis.maintainabilityScore >= 80 
              ? 'Clean, modular and readable structure.'
              : analysis.maintainabilityScore >= 60 
              ? 'Moderate technical debt detected.'
              : 'High refactoring priority recommended.'}
          </p>
        </div>

        {/* Card 2: Cyclomatic Complexity */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Cyclomatic Complexity</span>
            <span className={`grade-pill ${getComplexityClass(analysis.complexity)}`}>
              {analysis.complexity} Risk
            </span>
          </div>
          <div className="metric-big-number">
            <span>{analysis.complexityScore}</span>
            <span className="metric-unit">branches</span>
          </div>
          <p className="metric-caption">
            Estimated number of linearly independent execution paths through the code snippet.
          </p>
        </div>

        {/* Card 3: Lines of Code */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Code Composition</span>
            <span className="info-pill">{analysis.totalLines} Total Lines</span>
          </div>
          <div className="loc-breakdown">
            <div className="loc-item">
              <span className="loc-val">{analysis.codeLines}</span>
              <span className="loc-lbl">Logical Code</span>
            </div>
            <div className="loc-item">
              <span className="loc-val">{analysis.commentLines}</span>
              <span className="loc-lbl">Comments</span>
            </div>
            <div className="loc-item">
              <span className="loc-val">{analysis.blankLines}</span>
              <span className="loc-lbl">Whitespace</span>
            </div>
          </div>
        </div>

        {/* Card 4: Potential Smells */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Smells & Security</span>
            <span className={`grade-pill ${analysis.securityRisks.length > 0 ? 'grade-d' : 'grade-a'}`}>
              {analysis.securityRisks.length} Vulnerabilities
            </span>
          </div>
          <div className="metric-big-number">
            <span>{analysis.securityRisks.length + analysis.smells.length}</span>
            <span className="metric-unit">total findings</span>
          </div>
          <p className="metric-caption">
            {analysis.securityRisks.length > 0 
              ? 'Contains critical security warning flags.'
              : 'No immediate critical exploits spotted in pattern scan.'}
          </p>
        </div>
      </div>

      {/* Code Inspector & Detailed Findings split */}
      <div className="analytics-body-split">
        {/* Left: Interactive code snippet input */}
        <div className="inspector-box">
          <div className="box-header">
            <h4>Code to Inspect</h4>
            <span className="box-hint">Edit code below to recalculate metrics live</span>
          </div>
          <textarea
            value={inspectCode}
            onChange={(e) => setInspectCode(e.target.value)}
            className="analytics-code-area"
            rows={14}
            placeholder="Type or paste code here to analyze..."
          />
        </div>

        {/* Right: Detailed Warnings & Findings */}
        <div className="findings-box">
          <div className="box-header">
            <h4>Audit Findings & Smells</h4>
            <span className="findings-count">{analysis.securityRisks.length + analysis.smells.length} Items</span>
          </div>

          <div className="findings-list">
            {analysis.securityRisks.length === 0 && analysis.smells.length === 0 ? (
              <div className="no-findings">
                <CheckIcon size={32} />
                <p>No critical smells or security patterns flagged by the static scanner!</p>
                <small>Run an in-depth AI Review for logical bugs and edge cases.</small>
              </div>
            ) : (
              <>
                {analysis.securityRisks.map((sec, idx) => (
                  <div key={`sec-${idx}`} className="finding-item finding-danger">
                    <div className="finding-icon">
                      <ShieldIcon size={18} />
                    </div>
                    <div className="finding-content">
                      <div className="finding-title-row">
                        <span className="finding-title">{sec.type}</span>
                        <span className="severity-badge badge-danger">Security Risk</span>
                      </div>
                      <p className="finding-desc">{sec.description}</p>
                    </div>
                  </div>
                ))}

                {analysis.smells.map((smell, idx) => (
                  <div key={`smell-${idx}`} className={`finding-item finding-${smell.severity}`}>
                    <div className="finding-icon">
                      <AlertIcon size={18} />
                    </div>
                    <div className="finding-content">
                      <div className="finding-title-row">
                        <span className="finding-title">{smell.type}</span>
                        <span className="severity-badge badge-warning">Code Smell</span>
                      </div>
                      <p className="finding-desc">{smell.description}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="findings-footer">
            <button className="full-ai-review-btn" onClick={handleSendToStudio}>
              <ZapIcon size={16} />
              <span>Send Code to Review Studio for AI Fix</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
