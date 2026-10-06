// Deterministic daily challenge generator
import type { QuizQuestion } from './types';
import { starterQuestions } from './starter-pool';

export function getDailyChallengeNumber(date = new Date()): number {
  const startEpoch = new Date('2026-01-01T00:00:00Z').getTime();
  const todayEpoch = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
  const diffDays = Math.max(1, Math.floor((todayEpoch - startEpoch) / (1000 * 60 * 60 * 24)));
  return diffDays;
}

export function getDailyChallenge(pool: QuizQuestion[], date = new Date()): { question: QuizQuestion; challengeNumber: number; dateStr: string } {
  const challengeNumber = getDailyChallengeNumber(date);
  const dateStr = date.toISOString().slice(0, 10);
  
  // Hash the dateStr to deterministically pick a question
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return {
    question: pool[index],
    challengeNumber,
    dateStr
  };
}
