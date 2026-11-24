// LocalStorage keys
const HISTORY_KEY = 'ai_code_reviewer_history';
const SETTINGS_KEY = 'ai_code_reviewer_settings';

// History retention policy: 4 days
export const HISTORY_RETENTION_DAYS = 4;
const RETENTION_MS = HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://ai-code-reviewer-vins.onrender.com/ai/get-review',
  defaultLanguage: 'javascript',
  defaultFocus: 'senior',
  fontSize: 15,
  tabSize: 2,
  apiKey: '',
  autoSaveHistory: true,
};

/**
 * Filters out items older than 4 days
 */
function filterRecentHistory(items = []) {
  const cutoff = Date.now() - RETENTION_MS;
  return items.filter(item => {
    if (!item || !item.timestamp) return false;
    const itemTime = new Date(item.timestamp).getTime();
    return !isNaN(itemTime) && itemTime >= cutoff;
  });
}

export function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    // Filter to last 4 days
    const recent = filterRecentHistory(parsed);

    // If stale items were pruned, update localStorage automatically
    if (recent.length !== parsed.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(recent));
    }

    return recent;
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
}

export function saveHistoryItem(item) {
  try {
    const history = getHistory();
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      language: item.language || 'javascript',
      focus: item.focus || 'senior',
      code: item.code || '',
      review: item.review || '',
      title: item.title || (item.code ? item.code.trim().split('\n')[0].slice(0, 45) : 'Code Review'),
    };
    
    // Prepend new item and enforce 4-day retention window
    const updated = filterRecentHistory([newItem, ...history]);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error('Failed to save history item:', e);
    return null;
  }
}

export function deleteHistoryItem(id) {
  try {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch (e) {
    console.error('Failed to clear history:', e);
    return [];
  }
}
