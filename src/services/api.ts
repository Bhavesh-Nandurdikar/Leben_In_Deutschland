import type { Question } from "../types/Question";
import type { QuizMode } from "../types/QuizMode";

const DATASET_BASE_URL = "https://yehoraltshuler.github.io/bamf-lid-dataset";
const DATASET_URL = `${DATASET_BASE_URL}/questions.json`;

interface BamfImage {
  path: string;
}

interface BamfQuestion {
  id: string;
  scope: "general" | "state";
  stateCode: string | null;
  question: string;
  answers: Record<"a" | "b" | "c" | "d", string>;
  images: BamfImage[];
  solution: "a" | "b" | "c" | "d";
}

interface BamfDataset {
  questions: BamfQuestion[];
}

let cachedQuestions: Question[] | null = null;

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function normalizeQuestion(question: BamfQuestion): Question {
  const optionKeys: Array<keyof BamfQuestion["answers"]> = ["a", "b", "c", "d"];
  const options = optionKeys.map((key) => question.answers[key]);

  return {
    id: question.id,
    question: question.question,
    options,
    correctAnswer: question.answers[question.solution],
    imageUrls: question.images.map((image) => `${DATASET_BASE_URL}/${image.path}`),
    scope: question.scope,
    stateCode: question.stateCode ?? undefined,
  };
}

async function loadQuestionBank(): Promise<Question[]> {
  if (cachedQuestions) return cachedQuestions;

  const response = await fetch(DATASET_URL);

  if (!response.ok) {
    throw new Error(`Fragenkatalog konnte nicht geladen werden (${response.status}).`);
  }

  const dataset = (await response.json()) as BamfDataset;
  cachedQuestions = dataset.questions.map(normalizeQuestion);
  return cachedQuestions;
}

export async function getQuestions(
  stateCode: string,
  mode: QuizMode,
): Promise<Question[]> {
  const allQuestions = await loadQuestionBank();

  const generalQuestions = allQuestions.filter(
    (question) => question.scope === "general",
  );
  const stateQuestions = allQuestions.filter(
    (question) => question.scope === "state" && question.stateCode === stateCode,
  );

  if (generalQuestions.length !== 300) {
    throw new Error(`Erwartet wurden 300 allgemeine Fragen, gefunden wurden ${generalQuestions.length}.`);
  }

  if (stateQuestions.length !== 10) {
    throw new Error(
      `Für das gewählte Bundesland wurden ${stateQuestions.length} statt 10 Landesfragen gefunden.`,
    );
  }

  if (mode === "all") {
    return [...generalQuestions, ...stateQuestions];
  }

  const examGeneral = shuffle(generalQuestions).slice(0, 30);
  const examState = shuffle(stateQuestions).slice(0, 3);

  return shuffle([...examGeneral, ...examState]);
}
