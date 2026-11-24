import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReviewStudioPage from './pages/ReviewStudioPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import GuidelinesPage from './pages/GuidelinesPage';
import SettingsPage from './pages/SettingsPage';
import { getHistory } from './utils/storage';
import './App.css';

const DEFAULT_SNIPPET = `function sum(a, b) {
  // Simple demonstration function
  return a + b;
}`;

function App() {
  // Sync page state with window.location.hash
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'studio', 'history', 'analytics', 'guidelines', 'settings'];
    return validPages.includes(hash) ? hash : 'home';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [review, setReview] = useState('');
  const [historyCount, setHistoryCount] = useState(0);

  // Update hash when page changes
  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    window.location.hash = newPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash changes (e.g. browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'studio', 'history', 'analytics', 'guidelines', 'settings'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update history count
  const refreshHistoryCount = () => {
    const items = getHistory();
    setHistoryCount(items.length);
  };

  useEffect(() => {
    refreshHistoryCount();
  }, []);

  // Navigation callbacks
  const handleNavigateToStudio = () => {
    handlePageChange('studio');
  };

  const handleSelectSample = (sample) => {
    if (sample && sample.code) {
      setCode(sample.code);
    }
    handlePageChange('studio');
  };

  const handleLoadReview = (historyItem) => {
    if (historyItem) {
      setCode(historyItem.code || '');
      setReview(historyItem.review || '');
    }
    handlePageChange('studio');
  };

  const handleLoadSnippet = (codeSnippet) => {
    setCode(codeSnippet);
    handlePageChange('studio');
  };

  return (
    <div className="app-container">
      {/* Universal Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        historyCount={historyCount} 
      />

      {/* Dynamic Page Views */}
      <div className="page-wrapper">
        {activePage === 'home' && (
          <HomePage 
            onNavigateToStudio={handleNavigateToStudio}
            onSelectSample={handleSelectSample}
            setActivePage={handlePageChange}
          />
        )}

        {activePage === 'studio' && (
          <ReviewStudioPage 
            code={code}
            setCode={setCode}
            review={review}
            setReview={setReview}
            onReviewSaved={refreshHistoryCount}
            onNavigateToAnalytics={() => handlePageChange('analytics')}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage 
            onLoadReview={handleLoadReview}
            onNavigateToStudio={handleNavigateToStudio}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage 
            code={code}
            setCode={setCode}
            onNavigateToStudio={handleNavigateToStudio}
          />
        )}

        {activePage === 'guidelines' && (
          <GuidelinesPage 
            onLoadSnippet={handleLoadSnippet}
            onNavigateToStudio={handleNavigateToStudio}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage 
            onSettingsUpdated={refreshHistoryCount}
          />
        )}
      </div>

      {/* Universal Footer */}
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}

export default App;
