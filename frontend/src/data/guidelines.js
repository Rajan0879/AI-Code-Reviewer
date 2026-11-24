export const GUIDELINES = [
  {
    category: 'Clean Code & Architecture',
    rules: [
      {
        id: 'clean-1',
        title: 'Favor Guard Clauses over Deeply Nested If-Else',
        impact: 'High',
        summary: 'Return early when conditions fail instead of wrapping happy paths in nested blocks.',
        badCode: `function processPayment(user, order) {
  if (user) {
    if (user.isActive) {
      if (order && order.items.length > 0) {
        if (user.balance >= order.total) {
          // charge
          return executeTransaction(user, order);
        } else {
          throw new Error('Insufficient funds');
        }
      } else {
        throw new Error('Order is empty');
      }
    } else {
      throw new Error('User inactive');
    }
  } else {
    throw new Error('User not found');
  }
}`,
        goodCode: `function processPayment(user, order) {
  if (!user) throw new Error('User not found');
  if (!user.isActive) throw new Error('User inactive');
  if (!order || order.items.length === 0) throw new Error('Order is empty');
  if (user.balance < order.total) throw new Error('Insufficient funds');

  return executeTransaction(user, order);
}`,
        rationale: 'Guard clauses reduce cognitive load, decrease nesting depth, and keep the primary business logic prominent.'
      },
      {
        id: 'clean-2',
        title: 'Single Responsibility Principle (SRP)',
        impact: 'High',
        summary: 'A function or class should have one, and only one, reason to change.',
        badCode: `async function registerUser(userData) {
  // 1. Validate fields
  if (!userData.email.includes('@')) throw new Error('Bad email');
  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);
  // 3. Save to database
  const user = await db.insert({ ...userData, password: hash });
  // 4. Send welcome email
  await nodemailer.sendMail({ to: user.email, subject: 'Welcome!' });
  return user;
}`,
        goodCode: `async function registerUser(userData) {
  validateUserPayload(userData);
  const hashedPassword = await hashPassword(userData.password);
  const user = await userRepository.create({ ...userData, password: hashedPassword });
  await emailNotificationService.sendWelcome(user.email);
  return user;
}`,
        rationale: 'Decoupling validation, hashing, storage, and mailing makes testing each unit trivial and prevents cascading bugs.'
      }
    ]
  },
  {
    category: 'Security & OWASP',
    rules: [
      {
        id: 'sec-1',
        title: 'Prevent SQL Injection with Parameterized Queries',
        impact: 'Critical',
        summary: 'Never concatenate user input directly into SQL strings. Always utilize query placeholders or ORM parameter binding.',
        badCode: `// Highly vulnerable to SQL Injection
const query = \`SELECT * FROM accounts WHERE username = '\${username}' AND pin = \${pin}\`;
const result = await db.query(query);`,
        goodCode: `// Safe parameterized statement
const query = 'SELECT * FROM accounts WHERE username = $1 AND pin = $2';
const result = await db.query(query, [username, pin]);`,
        rationale: 'Parameterized queries ensure user input is treated strictly as data rather than executable SQL syntax, blocking SQLi exploits completely.'
      },
      {
        id: 'sec-2',
        title: 'Safeguard Against Cross-Site Scripting (XSS)',
        impact: 'Critical',
        summary: 'Do not inject raw HTML strings without sanitization. Use DOM textContent or robust sanitizers.',
        badCode: `// Dangerous: XSS vulnerability
const commentArea = document.getElementById('comments');
commentArea.innerHTML = \`<div class="comment">\${userInputComment}</div>\`;`,
        goodCode: `// Secure: Safe text node assignment or DOMPurify
const commentArea = document.getElementById('comments');
const commentEl = document.createElement('div');
commentEl.className = 'comment';
commentEl.textContent = userInputComment;
commentArea.appendChild(commentEl);`,
        rationale: 'Treating user inputs as raw HTML lets malicious users execute arbitrary JavaScript inside visitors’ browsers, stealing session cookies and tokens.'
      }
    ]
  },
  {
    category: 'Performance & Optimization',
    rules: [
      {
        id: 'perf-1',
        title: 'Replace O(N²) Lookups with O(1) Hash Sets or Maps',
        impact: 'High',
        summary: 'When checking existence across two collections, pre-index with a Set or Map instead of array.includes() inside a loop.',
        badCode: `// O(N * M) time complexity
const missingUsers = allUsers.filter(u => !activeUsers.some(a => a.id === u.id));`,
        goodCode: `// O(N + M) time complexity
const activeSet = new Set(activeUsers.map(a => a.id));
const missingUsers = allUsers.filter(u => !activeSet.has(u.id));`,
        rationale: 'Set lookups are average O(1). Switching from array.some/includes inside a loop transforms execution time from quadratic to linear.'
      },
      {
        id: 'perf-2',
        title: 'Debounce and Throttle High-Frequency Events',
        impact: 'Medium',
        summary: 'Delay or throttle search input, scroll, and resize handlers to prevent unnecessary rendering and API flooding.',
        badCode: `inputEl.addEventListener('input', (e) => {
  // Triggers an API request on EVERY keystroke!
  fetchSearchResults(e.target.value);
});`,
        goodCode: `const handleSearch = debounce((value) => {
  fetchSearchResults(value);
}, 300);

inputEl.addEventListener('input', (e) => handleSearch(e.target.value));`,
        rationale: 'Prevents server overload and UI freeze from firing heavy tasks 60+ times per second.'
      }
    ]
  }
];
