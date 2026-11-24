import React, { useState, useEffect } from 'react';
import { 
  HistoryIcon, 
  TrashIcon, 
  CodeIcon, 
  CopyIcon, 
  CheckIcon, 
  SearchIcon, 
  ArrowRightIcon,
  DownloadIcon 
} from '../components/Icons';
import { getHistory, deleteHistoryItem, clearHistory } from '../utils/storage';

export default function HistoryPage({ onLoadReview, onNavigateToStudio }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved review?')) {
      const updated = deleteHistoryItem(id);
      setHistory(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL saved code review history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleCopy = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.review);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `code-review-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery === '' || 
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.review && item.review.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = selectedLang === 'all' || item.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  // Get unique languages from history
  const languages = Array.from(new Set(history.map(item => item.language).filter(Boolean)));

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-badge">
            <HistoryIcon size={16} />
            <span>Last 4 Days Archive</span>
          </div>
          <h1 className="page-title">Review History</h1>
          <p className="page-subtitle">
            Saved code reviews from the last 4 days stored locally in your browser.
          </p>
        </div>

        {history.length > 0 && (
          <div className="history-actions">
            <button className="secondary-action-btn" onClick={handleExportJson} title="Export all as JSON">
              <DownloadIcon size={15} />
              <span>Export History</span>
            </button>
            <button className="danger-action-btn" onClick={handleClearAll} title="Clear all history">
              <TrashIcon size={15} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {history.length > 0 ? (
        <>
          {/* Search & Filter Bar */}
          <div className="history-filters-bar">
            <div className="search-input-wrapper">
              <SearchIcon size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search history by code, snippet or feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>&times;</button>
              )}
            </div>

            <div className="filter-group">
              <label>Filter Language:</label>
              <select 
                value={selectedLang} 
                onChange={(e) => setSelectedLang(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Languages ({history.length})</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Review List */}
          {filteredHistory.length > 0 ? (
            <div className="history-grid">
              {filteredHistory.map((item) => {
                const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent';
                const snippet = (item.code || '').trim().split('\n').slice(0, 4).join('\n');

                return (
                  <div 
                    key={item.id} 
                    className="history-card"
                    onClick={() => onLoadReview(item)}
                  >
                    <div className="history-card-header">
                      <div className="card-tags">
                        <span className="lang-tag">{item.language || 'Code'}</span>
                        <span className="focus-tag">{item.focus || 'Senior'}</span>
                      </div>
                      <span className="history-date">{dateStr}</span>
                    </div>

                    <h3 className="history-card-title">{item.title || 'Code Snippet Review'}</h3>

                    <pre className="history-code-preview">
                      <code>{snippet}</code>
                    </pre>

                    <div className="history-card-footer">
                      <button 
                        className="card-open-btn" 
                        onClick={(e) => { e.stopPropagation(); onLoadReview(item); }}
                      >
                        <CodeIcon size={14} />
                        <span>Open in Studio</span>
                      </button>

                      <div className="card-right-btns">
                        <button 
                          className="icon-action-btn" 
                          onClick={(e) => handleCopy(item, e)}
                          title="Copy Review Text"
                        >
                          {copiedId === item.id ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                        </button>

                        <button 
                          className="icon-action-btn btn-danger" 
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Delete from history"
                        >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-matches-box">
              <SearchIcon size={32} />
              <h3>No reviews match your search</h3>
              <p>Try searching for different keywords or reset your language filter.</p>
              <button className="reset-filter-btn" onClick={() => { setSearchQuery(''); setSelectedLang('all'); }}>
                Reset Filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-history-box">
          <div className="empty-history-icon">
            <HistoryIcon size={42} />
          </div>
          <h2>No Saved Reviews Yet</h2>
          <p>
            When you analyze code in the <strong>Review Studio</strong>, your code reviews will automatically
            appear here so you can revisit, export, or reload them anytime.
          </p>
          <button className="empty-history-cta" onClick={onNavigateToStudio}>
            <CodeIcon size={18} />
            <span>Go to Review Studio</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
