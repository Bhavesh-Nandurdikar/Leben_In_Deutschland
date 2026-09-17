import { useEffect, useRef, useState } from "react";
import { getQuestions } from "../services/api";

import type { Question } from "../types/Question";
import type { UserAnswer } from "../types/UserAnswer";
import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface QuizProps {
  mode: QuizMode;
  stateCode: string;
  onComplete: (score: number, answers: UserAnswer[], totalQuestions: number) => void;
}

const EXAM_TIME_SECONDS = 60 * 60;

function Quiz({ mode, stateCode, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scoreRef = useRef(score);
  const answersRef = useRef(answers);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    let active = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getQuestions(stateCode, mode);
        if (active) setQuestions(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Fragen konnten nicht geladen werden.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      active = false;
    };
  }, [mode, stateCode]);

  useEffect(() => {
    if (mode !== "exam" || loading || isSubmitted || questions.length === 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setIsSubmitted(true);
          onComplete(scoreRef.current, answersRef.current, questions.length);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, loading, isSubmitted, questions.length, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-600">Fragen werden geladen ...</div>;
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg bg-white rounded-2xl p-8 shadow-lg text-center">
          <h1 className="text-xl font-bold mb-3">Fragen konnten nicht geladen werden</h1>
          <p className="text-slate-600">{error || "Bitte versuche es erneut."}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedState = BUNDESLAENDER.find((state) => state.code === stateCode)?.name;

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      imageUrls: currentQuestion.imageUrls,
    };

    const updatedAnswers = [...answers, newAnswer];
    const updatedScore = isCorrect ? score + 1 : score;

    setAnswers(updatedAnswers);
    setScore(updatedScore);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
    } else {
      setIsSubmitted(true);
      onComplete(updatedScore, updatedAnswers, questions.length);
    }
  };

  const isStateQuestion = currentQuestion.scope === "state";

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-wrap justify-between gap-3 items-center text-sm text-slate-600 mb-2">
            <span>
              Frage {currentQuestionIndex + 1} von {questions.length}
            </span>

            <div className="flex items-center gap-3">
              {isStateQuestion && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 font-medium">
                  {selectedState}
                </span>
              )}

              {mode === "exam" ? (
                <span className={`font-semibold ${timeLeft <= 300 ? "text-red-600" : "text-slate-700"}`}>
                  ⏱ {formatTime(timeLeft)}
                </span>
              ) : (
                <span className="font-semibold text-blue-600">Alle Fragen</span>
              )}
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <h3 className="text-lg font-medium mb-8">{currentQuestion.question}</h3>

          {currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0 && (
            <div className={`mb-8 grid gap-4 ${currentQuestion.imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {currentQuestion.imageUrls.map((imageUrl, index) => (
                <div key={imageUrl} className="flex flex-col items-center gap-2">
                  <img
                    src={imageUrl}
                    alt={`Bild ${index + 1} zu Frage ${currentQuestion.id}`}
                    className="max-h-72 w-auto rounded-xl border border-slate-200 shadow-sm bg-white"
                  />
                  {currentQuestion.imageUrls!.length > 1 && (
                    <span className="text-sm font-medium text-slate-500">Bild {index + 1}</span>
                  )}
                </div>
              ))}
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
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedAnswer}
            onClick={handleSubmit}
            className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700"
          >
            Antwort bestätigen
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
