import type { QuizMode } from "./QuizMode";

export interface StoredAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  mode: QuizMode;
  stateCode: string;
  score: number;
  totalQuestions: number;
  incorrect: number;
  unanswered: number;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  answers: StoredAnswer[];
}
