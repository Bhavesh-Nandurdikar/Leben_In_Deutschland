import type { Question } from "../types/Question";
import type { QuizMode } from "../types/QuizMode";

const LOCAL_DATASET_URL = "/data/bamf/questions.json";
const LOCAL_DATASET_BASE = "/data/bamf";
const FALLBACK_DATASET_BASE = "https://yehoraltshuler.github.io/bamf-lid-dataset";
const FALLBACK_DATASET_URL = `${FALLBACK_DATASET_BASE}/questions.json`;

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

function normalizeQuestion(question: BamfQuestion, baseUrl: string): Question {
  const optionKeys: Array<keyof BamfQuestion["answers"]> = ["a", "b", "c", "d"];
  const options = optionKeys.map((key) => question.answers[key]);

  return {
    id: question.id,
    question: question.question,
    options,
    correctAnswer: question.answers[question.solution],
    imageUrls: question.images.map((image) => `${baseUrl}/${image.path}`),
    scope: question.scope,
    stateCode: question.stateCode ?? undefined,
  };
}

async function fetchDataset(url: string): Promise<BamfDataset | null> {
  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) return null;
    return (await response.json()) as BamfDataset;
  } catch {
    return null;
  }
}

async function loadQuestionBank(): Promise<Question[]> {
  if (cachedQuestions) return cachedQuestions;

  const localDataset = await fetchDataset(LOCAL_DATASET_URL);
  if (localDataset?.questions?.length) {
    cachedQuestions = localDataset.questions.map((question) =>
      normalizeQuestion(question, LOCAL_DATASET_BASE),
    );
    return cachedQuestions;
  }

  const fallbackDataset = await fetchDataset(FALLBACK_DATASET_URL);
  if (!fallbackDataset?.questions?.length) {
    throw new Error("Fragenkatalog konnte nicht geladen werden.");
  }

  cachedQuestions = fallbackDataset.questions.map((question) =>
    normalizeQuestion(question, FALLBACK_DATASET_BASE),
  );
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
