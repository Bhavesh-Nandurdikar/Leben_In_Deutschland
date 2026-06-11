import { useState } from "react";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

import type { UserAnswer } from "./types/UserAnswer";
import type { QuizMode } from "./types/QuizMode";

function App() {
  const [page, setPage] = useState<"home" | "quiz" | "result">("home");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [mode, setMode] = useState<QuizMode>("practice");

  if (page === "home") {
    return (
      <Home
        onStart={(selectedMode: QuizMode) => {
          setMode(selectedMode);
          setPage("quiz");
        }}
      />
    );
  }

  if (page === "quiz") {
    return (
      <Quiz
        mode={mode}
        onComplete={(finalScore: number, finalAnswers: UserAnswer[]) => {
          setScore(finalScore);
          setAnswers(finalAnswers);
          setPage("result");
        }}
      />
    );
  }

  return (
    <Result
      score={score}
      totalQuestions={33}
      answers={answers}
      onRestart={() => {
        setScore(0);
        setAnswers([]);
        setPage("home");
      }}
    />
  );
}

export default App;