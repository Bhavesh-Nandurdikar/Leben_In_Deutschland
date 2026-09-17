import { useState } from "react";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Progress from "./pages/Progress";

import { clearSavedAttempts, getSavedAttempts, saveAttempt } from "./services/history";
import type { UserAnswer } from "./types/UserAnswer";
import type { QuizMode } from "./types/QuizMode";
import type { QuizAttempt } from "./types/QuizAttempt";

function App() {
  const [page, setPage] = useState<"home" | "quiz" | "result" | "progress">("home");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [mode, setMode] = useState<QuizMode>("all");
  const [stateCode, setStateCode] = useState("BE");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getSavedAttempts());
  const [sessionStartedAt, setSessionStartedAt] = useState(() => new Date().toISOString());

  const goHome = () => {
    setScore(0);
    setAnswers([]);
    setTotalQuestions(0);
    setPage("home");
  };

  const startQuiz = (selectedMode: QuizMode, selectedStateCode = stateCode) => {
    setMode(selectedMode);
    setStateCode(selectedStateCode);
    setScore(0);
    setAnswers([]);
    setTotalQuestions(0);
    setSessionStartedAt(new Date().toISOString());
    setPage("quiz");
  };

  if (page === "home") {
    return <Home onStart={startQuiz} onProgress={() => setPage("progress")} />;
  }

  if (page === "progress") {
    return (
      <Progress
        attempts={attempts}
        onHome={goHome}
        onClear={() => {
          clearSavedAttempts();
          setAttempts([]);
        }}
      />
    );
  }

  if (page === "quiz") {
    return (
      <Quiz
        mode={mode}
        stateCode={stateCode}
        onExit={goHome}
        onComplete={(finalScore, finalAnswers, finalTotalQuestions, durationSeconds) => {
          const incorrect = finalAnswers.filter((answer) => answer.selectedAnswer && !answer.isCorrect).length;
          const unanswered = finalAnswers.filter((answer) => !answer.selectedAnswer).length;
          const attempt: QuizAttempt = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            mode,
            stateCode,
            score: finalScore,
            totalQuestions: finalTotalQuestions,
            incorrect,
            unanswered,
            startedAt: sessionStartedAt,
            completedAt: new Date().toISOString(),
            durationSeconds,
            answers: finalAnswers.map((answer) => ({
              questionId: answer.questionId,
              selectedAnswer: answer.selectedAnswer,
              isCorrect: answer.isCorrect,
            })),
          };

          saveAttempt(attempt);
          setAttempts(getSavedAttempts());
          setScore(finalScore);
          setAnswers(finalAnswers);
          setTotalQuestions(finalTotalQuestions);
          setPage("result");
        }}
      />
    );
  }

  return (
    <Result
      score={score}
      totalQuestions={totalQuestions}
      answers={answers}
      mode={mode}
      stateCode={stateCode}
      onRestart={goHome}
      onRetry={() => startQuiz(mode, stateCode)}
      onProgress={() => setPage("progress")}
    />
  );
}

export default App;
