import type { QuizAttempt } from "../types/QuizAttempt";

const STORAGE_KEY = "lid-quiz-attempts-v1";
const STORAGE_PREF_KEY = "lid-save-progress";
const MAX_ATTEMPTS = 30;

export function isProgressSavingEnabled(): boolean {
  return localStorage.getItem(STORAGE_PREF_KEY) === "true";
}

export function setProgressSavingEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_PREF_KEY, String(enabled));

  if (!enabled) {
    clearSavedAttempts();
  }
}

export function getSavedAttempts(): QuizAttempt[] {
  if (!isProgressSavingEnabled()) return [];

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
  if (!isProgressSavingEnabled()) return;

  const attempts = [
    attempt,
    ...getSavedAttempts().filter((item) => item.id !== attempt.id),
  ].slice(0, MAX_ATTEMPTS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function clearSavedAttempts(): void {
  localStorage.removeItem(STORAGE_KEY);
}