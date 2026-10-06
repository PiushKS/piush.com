import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const allQuestionsPath = path.join(rootDir, 'public', 'data', 'quiz', 'all.json');

if (!fs.existsSync(allQuestionsPath)) {
  console.error(`❌ Error: ${allQuestionsPath} not found. Run "node scripts/build-quiz-database.mjs" first!`);
  process.exit(1);
}

const allQuestions = JSON.parse(fs.readFileSync(allQuestionsPath, 'utf-8'));
console.log(`\n🔍 Validating ${allQuestions.length} Quiz Questions...\n`);

const allowedLanguages = new Set([
  'javascript',
  'python',
  'java',
  'c',
  'cpp',
  'kotlin',
  'swift',
  'dart'
]);

const allowedDifficulties = new Set(['easy', 'medium', 'hard', 'expert']);

const seenIds = new Set();
const seenCodeSnippets = new Map(); // lang -> Set(normalizedCode)
let errorCount = 0;

if (allQuestions.length < 500) {
  console.error(`❌ REQUIREMENT FAILED: Dataset has ${allQuestions.length} questions, but at least 500 are required!`);
  errorCount++;
}

allQuestions.forEach((q, index) => {
  const prefix = `[Q #${index + 1} ID: ${q.id || 'MISSING'}]`;

  // 1. ID Check
  if (!q.id || typeof q.id !== 'string') {
    console.error(`${prefix} Missing or non-string ID`);
    errorCount++;
  } else if (seenIds.has(q.id)) {
    console.error(`${prefix} Duplicate ID detected: "${q.id}"`);
    errorCount++;
  } else {
    seenIds.add(q.id);
  }

  // 2. Language Check
  if (!allowedLanguages.has(q.language)) {
    console.error(`${prefix} Invalid language: "${q.language}". Allowed: ${Array.from(allowedLanguages).join(', ')}`);
    errorCount++;
  }

  // 3. Difficulty Check
  if (!allowedDifficulties.has(q.difficulty)) {
    console.error(`${prefix} Invalid difficulty: "${q.difficulty}". Allowed: ${Array.from(allowedDifficulties).join(', ')}`);
    errorCount++;
  }

  // 4. Code Check
  if (!q.code || typeof q.code !== 'string' || q.code.trim().length === 0) {
    console.error(`${prefix} Code snippet is empty or invalid`);
    errorCount++;
  } else {
    // Check duplicate code snippet within same language
    if (!seenCodeSnippets.has(q.language)) {
      seenCodeSnippets.set(q.language, new Set());
    }
    const normalizedCode = q.code.replace(/\s+/g, ' ').trim();
    const langSnippets = seenCodeSnippets.get(q.language);
    if (langSnippets.has(normalizedCode)) {
      console.warn(`⚠️ Warning: Duplicate code snippet detected in ${q.language} for question ${q.id}`);
    } else {
      langSnippets.add(normalizedCode);
    }
  }

  // 5. Options Check: Exactly 4 distinct items
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.error(`${prefix} Options array must have exactly 4 items. Found: ${Array.isArray(q.options) ? q.options.length : 'not an array'}`);
    errorCount++;
  } else {
    const uniqueOptions = new Set(q.options);
    if (uniqueOptions.size !== 4) {
      console.error(`${prefix} Options are not all distinct! Options: ${JSON.stringify(q.options)}`);
      errorCount++;
    }
  }

  // 6. Correct Answer Check: Must exist in options
  if (!q.correctAnswer || typeof q.correctAnswer !== 'string') {
    console.error(`${prefix} Missing or non-string correctAnswer`);
    errorCount++;
  } else if (!q.options.includes(q.correctAnswer)) {
    console.error(`${prefix} correctAnswer "${q.correctAnswer}" NOT found in options: ${JSON.stringify(q.options)}`);
    errorCount++;
  }

  // 7. Explanation Check
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 5) {
    console.error(`${prefix} Explanation is missing or too short`);
    errorCount++;
  }

  // 8. Concepts Check
  if (!Array.isArray(q.concepts) || q.concepts.length === 0) {
    console.error(`${prefix} Concepts array must have at least 1 tag`);
    errorCount++;
  }
});

// Difficulty distribution summary
const diffStats = {
  easy: allQuestions.filter(q => q.difficulty === 'easy').length,
  medium: allQuestions.filter(q => q.difficulty === 'medium').length,
  hard: allQuestions.filter(q => q.difficulty === 'hard').length,
  expert: allQuestions.filter(q => q.difficulty === 'expert').length
};

console.log(`\n📊 DIFFICULTY DISTRIBUTION:`);
console.log(`  - Easy   : ${diffStats.easy} (${((diffStats.easy / allQuestions.length) * 100).toFixed(1)}%) [Target ~30%]`);
console.log(`  - Medium : ${diffStats.medium} (${((diffStats.medium / allQuestions.length) * 100).toFixed(1)}%) [Target ~40%]`);
console.log(`  - Hard   : ${diffStats.hard} (${((diffStats.hard / allQuestions.length) * 100).toFixed(1)}%) [Target ~23%]`);
console.log(`  - Expert : ${diffStats.expert} (${((diffStats.expert / allQuestions.length) * 100).toFixed(1)}%) [Target ~7%]`);

if (errorCount === 0) {
  console.log(`\n🎉 SUCCESS! All ${allQuestions.length} questions passed strict validation! 0 errors detected.\n`);
  process.exit(0);
} else {
  console.error(`\n❌ VALIDATION FAILED with ${errorCount} errors. Please fix above issues.\n`);
  process.exit(1);
}
