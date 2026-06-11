export interface UserAnswer {
  questionId: number;
  question: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  imageUrl?: string;
}