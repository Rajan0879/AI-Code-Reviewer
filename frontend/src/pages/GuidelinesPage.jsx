import React, { useState } from 'react';
import { 
  BookIcon, 
  CodeIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  AlertIcon,
  ShieldIcon,
  ZapIcon
} from '../components/Icons';
import { GUIDELINES } from '../data/guidelines';

export default function GuidelinesPage({ onLoadSnippet, onNavigateToStudio }) {
  const [activeCategory, setActiveCategory] = useState(GUIDELINES[0].category);

  const selectedCategoryData = GUIDELINES.find(g => g.category === activeCategory) || GUIDELINES[0];

  const handleTestInStudio = (badCode) => {
    onLoadSnippet(badCode, 'javascript');
  };

  const getImpactBadgeClass = (impact) => {
    switch (impact) {
      case 'Critical': return 'impact-critical';
      case 'High': return 'impact-high';
      default: return 'impact-medium';
    }
  };

  return (
    <div className="guidelines-page">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-badge">
            <BookIcon size={16} />
            <span>Developer Handbook</span>
          </div>
          <h1 className="page-title">Best Practices & Guidelines</h1>
          <p className="page-subtitle">
            Curated industry standards for clean code, OWASP security defenses, and high-performance algorithms.
          </p>
        </div>

        <button className="primary-header-btn" onClick={onNavigateToStudio}>
          <CodeIcon size={16} />
          <span>Open Review Studio</span>
          <ArrowRightIcon size={15} />
        </button>
      </div>

      {/* Category Navigation Tabs */}
      <div className="guideline-category-tabs">
        {GUIDELINES.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`cat-tab ${activeCategory === cat.category ? 'active' : ''}`}
          >
            <span>{cat.category}</span>
            <span className="cat-count">{cat.rules.length}</span>
          </button>
        ))}
      </div>

      {/* Guidelines Rules List */}
      <div className="rules-list">
        {selectedCategoryData.rules.map((rule) => (
          <div key={rule.id} className="rule-card">
            <div className="rule-card-header">
              <div className="rule-title-group">
                <span className={`impact-badge ${getImpactBadgeClass(rule.impact)}`}>
                  {rule.impact} Priority
                </span>
                <h3 className="rule-title">{rule.title}</h3>
              </div>
              <button 
                className="test-rule-btn" 
                onClick={() => handleTestInStudio(rule.badCode)}
                title="Load the bad code pattern into Review Studio to see AI feedback"
              >
                <CodeIcon size={14} />
                <span>Test in Reviewer</span>
              </button>
            </div>

            <p className="rule-summary">{rule.summary}</p>

            {/* Side-by-side code comparison */}
            <div className="rule-code-comparison">
              <div className="code-box code-bad">
                <div className="code-box-header">
                  <div className="header-label text-red">
                    <AlertIcon size={14} />
                    <span>❌ Anti-Pattern (Bad Code)</span>
                  </div>
                </div>
                <pre>
                  <code>{rule.badCode}</code>
                </pre>
              </div>

              <div className="code-box code-good">
                <div className="code-box-header">
                  <div className="header-label text-green">
                    <CheckIcon size={14} />
                    <span>✅ Recommended Solution</span>
                  </div>
                </div>
                <pre>
                  <code>{rule.goodCode}</code>
                </pre>
              </div>
            </div>

            <div className="rule-rationale">
              <strong>💡 Why it matters: </strong>
              <span>{rule.rationale}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
