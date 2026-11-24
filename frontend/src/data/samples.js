export const SAMPLE_SNIPPETS = [
  {
    id: 'async-race',
    title: 'Async Race Condition & Missing Error Handling',
    language: 'javascript',
    badge: 'Bug / Async',
    description: 'A data fetching function with unhandled promise rejections and potential state desync.',
    code: `// Fetch user profile and update UI
function loadUserData(userId) {
  let profile = fetch('/api/users/' + userId)
    .then(res => res.json());

  // Problem: profile is a Promise, not actual data!
  document.getElementById('username').innerText = profile.name;
  document.getElementById('email').innerText = profile.email;

  // No error handling if network fails or 404
  return profile;
}`
  },
  {
    id: 'sql-injection',
    title: 'SQL Injection Vulnerability',
    language: 'python',
    badge: 'Security Flaw',
    description: 'Dynamic SQL query built with direct string formatting instead of parameterized inputs.',
    code: `# User authentication handler
import sqlite3

def authenticate_user(username, password):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()

    # VULNERABILITY: Raw string interpolation allows SQL injection
    query = f"SELECT id, username, role FROM users WHERE username = '{username}' AND password = '{password}'"
    print("Executing:", query)
    
    cursor.execute(query)
    user = cursor.fetchone()
    
    # Insecure plaintext password check
    if user:
        return {"authenticated": True, "user": user}
    return {"authenticated": False}
`
  },
  {
    id: 'nested-loops',
    title: 'O(N²) Quadratic Performance Bottleneck',
    language: 'javascript',
    badge: 'Performance',
    description: 'Inefficient nested search loop that drastically slows down as list size increases.',
    code: `// Find intersection of items across two large datasets
function findCommonOrders(customerOrders, archivedOrders) {
  const common = [];
  
  // O(N * M) nested iteration bottleneck
  for (let i = 0; i < customerOrders.length; i++) {
    for (let j = 0; j < archivedOrders.length; j++) {
      if (customerOrders[i].orderId === archivedOrders[j].orderId) {
        if (!common.some(item => item.orderId === customerOrders[i].orderId)) {
          common.push(customerOrders[i]);
        }
      }
    }
  }
  
  return common;
}`
  },
  {
    id: 'react-leak',
    title: 'React Memory Leak & Infinite Re-render',
    language: 'javascript',
    badge: 'React / State',
    description: 'Missing cleanup on subscription and missing dependency array in useEffect.',
    code: `import React, { useState, useEffect } from 'react';

function LiveStockTracker({ symbol }) {
  const [price, setPrice] = useState(0);
  const [history, setHistory] = useState([]);

  // BUG 1: Missing dependency array causes re-subscribing on EVERY render
  // BUG 2: No cleanup function causing memory leak & duplicate listeners
  useEffect(() => {
    const socket = new WebSocket(\`wss://stocks.example.com/\${symbol}\`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.price);
      // Mutating state directly or missing functional updater:
      history.push(data.price);
      setHistory(history);
    };
  });

  return (
    <div>
      <h3>{symbol} Price: \${price}</h3>
      <p>Data points: {history.length}</p>
    </div>
  );
}`
  },
  {
    id: 'memory-leak-timer',
    title: 'Node.js Event Listener & Timer Leak',
    language: 'javascript',
    badge: 'Memory Leak',
    description: 'Global event listeners and setInterval without unregistering.',
    code: `const EventEmitter = require('events');
const eventBus = new EventEmitter();

class UserSession {
  constructor(userId) {
    this.userId = userId;
    this.buffer = [];

    // Problem: listener keeps strong reference to 'this' forever
    eventBus.on('message', (msg) => {
      this.buffer.push(msg);
    });

    // Unstopped interval
    setInterval(() => {
      console.log('Active session for', this.userId);
    }, 1000);
  }
}`
  }
];
