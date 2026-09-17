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
  const [mode, setMode] = useState<QuizMode>("all");
  const [stateCode, setStateCode] = useState("BE");
  const [totalQuestions, setTotalQuestions] = useState(0);

  if (page === "home") {
    return (
      <Home
        onStart={(selectedMode, selectedStateCode) => {
          setMode(selectedMode);
          setStateCode(selectedStateCode);
          setPage("quiz");
        }}
      />
    );
  }

  if (page === "quiz") {
    return (
      <Quiz
        mode={mode}
        stateCode={stateCode}
        onComplete={(finalScore, finalAnswers, finalTotalQuestions) => {
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
      onRestart={() => {
        setScore(0);
        setAnswers([]);
        setTotalQuestions(0);
        setPage("home");
      }}
    />
  );
}

export default App;
