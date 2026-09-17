export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrls?: string[];
  scope: "general" | "state";
  stateCode?: string;
}
