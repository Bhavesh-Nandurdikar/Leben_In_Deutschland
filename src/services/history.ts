import type { QuizAttempt } from "../types/QuizAttempt";

const STORAGE_KEY = "lid-quiz-attempts-v1";
const MAX_ATTEMPTS = 30;

export function getSavedAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as QuizAttempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: QuizAttempt): void {
  const attempts = [attempt, ...getSavedAttempts().filter((item) => item.id !== attempt.id)]
    .slice(0, MAX_ATTEMPTS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function clearSavedAttempts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
