export interface UserAnswer {
  questionId: string;
  question: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  imageUrls?: string[];
}
