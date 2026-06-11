import { useEffect, useState } from "react";
import { getQuestions } from "../services/api";

import type { Question } from "../types/Question";
import type { UserAnswer } from "../types/UserAnswer";
import type { QuizMode } from "../types/QuizMode";

interface QuizProps {
  mode: QuizMode;
  onComplete: (score: number, answers: UserAnswer[]) => void;
}

const EXAM_TIME_SECONDS = 60 * 60;

function Quiz({ mode, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getQuestions();
      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (mode !== "exam") return;
    if (loading) return;
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          onComplete(score, answers);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, loading, isSubmitted, score, answers, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="p-10">Loading Questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      imageUrl: currentQuestion.imageUrl,
    };

    const updatedAnswers = [...answers, newAnswer];
    const updatedScore = isCorrect ? score + 1 : score;

    setAnswers(updatedAnswers);
    setScore(updatedScore);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
      onComplete(updatedScore, updatedAnswers);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of 33
          </span>

          {mode === "exam" ? (
            <span
              className={`font-semibold ${
                timeLeft <= 300 ? "text-red-600" : "text-slate-700"
              }`}
            >
              ⏱ {formatTime(timeLeft)}
            </span>
          ) : (
            <span className="font-semibold text-blue-600">Practice Mode</span>
          )}
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / 33) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h3 className="text-lg font-medium mb-8">
          {currentQuestion.question}
        </h3>

        {currentQuestion.imageUrl && (
          <div className="mb-8 flex justify-center">
            <img
              src={currentQuestion.imageUrl}
              alt={`Question ${currentQuestion.id}`}
              className="max-h-80 w-auto rounded-xl border border-slate-200 shadow-sm"
            />
          </div>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedAnswer === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          disabled={!selectedAnswer}
          onClick={handleSubmit}
          className="
            mt-8
            bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
            disabled:bg-gray-300
            disabled:cursor-not-allowed
          "
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default Quiz;