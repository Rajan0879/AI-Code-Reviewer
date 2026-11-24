// Lightweight static code analyzer for immediate client-side insights
export function analyzeCode(code = '') {
  if (!code || typeof code !== 'string') {
    return {
      totalLines: 0,
      codeLines: 0,
      blankLines: 0,
      commentLines: 0,
      complexity: 'Low',
      complexityScore: 1,
      maintainabilityScore: 100,
      maintainabilityGrade: 'A',
      smells: [],
      securityRisks: [],
    };
  }

  const lines = code.split('\n');
  const totalLines = lines.length;
  let blankLines = 0;
  let commentLines = 0;
  let codeLines = 0;

  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
      continue;
    }

    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }

    if (trimmed.startsWith('/*')) {
      commentLines++;
      if (!trimmed.includes('*/')) {
        inBlockComment = true;
      }
      continue;
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      commentLines++;
      continue;
    }

    codeLines++;
  }

  // Cyclomatic complexity estimation
  // Count branch keywords: if, else if, for, while, catch, switch, case, &&, ||, ?
  const branchKeywords = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcatch\b/g,
    /\bcase\b/g,
    /&&/g,
    /\|\|/g,
    /\?/g,
  ];

  let complexityScore = 1;
  for (const regex of branchKeywords) {
    const matches = code.match(regex);
    if (matches) {
      complexityScore += matches.length;
    }
  }

  let complexity = 'Low';
  if (complexityScore > 15) {
    complexity = 'High';
  } else if (complexityScore > 7) {
    complexity = 'Moderate';
  }

  // Smells detection
  const smells = [];
  const securityRisks = [];

  // Deep nesting check
  let maxIndentation = 0;
  for (const line of lines) {
    const indentMatch = line.match(/^(\s+)/);
    if (indentMatch) {
      const depth = indentMatch[1].replace(/\t/g, '  ').length / 2;
      if (depth > maxIndentation) maxIndentation = depth;
    }
  }
  if (maxIndentation >= 4) {
    smells.push({
      type: 'Deep Nesting',
      description: `Detected indentation depth of ${Math.round(maxIndentation)} levels. Consider refactoring with guard clauses or extracting subroutines.`,
      severity: 'warning'
    });
  }

  if (code.includes('console.log(') || code.includes('print(')) {
    smells.push({
      type: 'Debug Statements',
      description: 'Found raw console.log or print statements which should typically be removed or replaced with a logger before production.',
      severity: 'info'
    });
  }

  if (/TODO|FIXME|HACK/i.test(code)) {
    smells.push({
      type: 'Unfinished Work Tags',
      description: 'Found TODO / FIXME comments indicating pending work or debt.',
      severity: 'info'
    });
  }

  if (codeLines > 100) {
    smells.push({
      type: 'Long File/Method',
      description: `Snippet is ${codeLines} code lines. Large functions are harder to test and maintain.`,
      severity: 'warning'
    });
  }

  // Security risks
  if (/eval\(|new Function\(/i.test(code)) {
    securityRisks.push({
      type: 'Arbitrary Code Execution',
      description: 'Usage of eval() or dynamic Function constructor can lead to Remote Code Execution (RCE) vulnerabilities.',
      severity: 'danger'
    });
  }

  if (/innerHTML|dangerouslySetInnerHTML/i.test(code)) {
    securityRisks.push({
      type: 'Cross-Site Scripting (XSS)',
      description: 'Directly assigning to innerHTML allows untrusted HTML injection unless strictly sanitized with DOMPurify.',
      severity: 'danger'
    });
  }

  if (/SELECT.*FROM.*WHERE.*(\+|\$\{)/i.test(code) || /cursor\.execute\(['"].*%s/i.test(code)) {
    securityRisks.push({
      type: 'SQL Injection Risk',
      description: 'Dynamic string concatenation in SQL queries allows attackers to bypass authentication or extract sensitive data. Use parameterized queries.',
      severity: 'danger'
    });
  }

  if (/(password|secret|api[_-]?key|token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{8,}['"]/i.test(code)) {
    securityRisks.push({
      type: 'Hardcoded Secret',
      description: 'Potential API key, password or secret detected hardcoded in source. Use environment variables.',
      severity: 'danger'
    });
  }

  // Maintainability Score calculation (0 - 100)
  let maintainability = 100;
  maintainability -= Math.min(30, (complexityScore - 1) * 2.5);
  maintainability -= securityRisks.length * 15;
  maintainability -= smells.length * 5;
  if (totalLines > 80) maintainability -= 10;
  if (commentLines === 0 && codeLines > 15) maintainability -= 5;
  maintainability = Math.max(15, Math.min(100, Math.round(maintainability)));

  let maintainabilityGrade = 'A';
  if (maintainability < 50) maintainabilityGrade = 'D';
  else if (maintainability < 70) maintainabilityGrade = 'C';
  else if (maintainability < 85) maintainabilityGrade = 'B';

  return {
    totalLines,
    codeLines,
    blankLines,
    commentLines,
    complexity,
    complexityScore,
    maintainabilityScore: maintainability,
    maintainabilityGrade,
    smells,
    securityRisks,
  };
}
