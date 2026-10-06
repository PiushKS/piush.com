export type QuizLanguage =
  | 'javascript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'kotlin'
  | 'swift'
  | 'dart';

export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CodeWalkthroughStep {
  step: number;
  label: string;
  explanation: string;
  highlightLine?: number;
}

export interface QuizQuestion {
  id: string; // Permanent unique identifier, e.g. "js-001", "py-042"
  language: QuizLanguage;
  difficulty: QuizDifficulty;
  concepts: string[];
  code: string;
  question?: string; // Default: "What will be the output?"
  options: [string, string, string, string]; // Exactly 4 distinct choices
  correctAnswer: string;
  explanation: string;
  runtime?: string;
  hint?: string;
  walkthrough?: CodeWalkthroughStep[];
}

export interface LanguageMeta {
  id: QuizLanguage;
  name: string;
  extension: string;
  iconSvg: string;
  runtime: string;
}

export interface UserQuizStats {
  totalAttempted: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  byLanguage: Record<QuizLanguage, { attempted: number; correct: number }>;
  byDifficulty: Record<QuizDifficulty, { attempted: number; correct: number }>;
  completedQuestionIds: string[];
  dailyCompletedDates: string[];
  lastActiveDate: string;
}
