import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Flag, Grid3X3, Home, X } from "lucide-react";
import { getQuestions } from "../services/api";

import Header from "../components/Header";
import type { Question } from "../types/Question";
import type { UserAnswer } from "../types/UserAnswer";
import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface QuizProps {
  mode: QuizMode;
  stateCode: string;
  onExit: () => void;
  onComplete: (
    score: number,
    answers: UserAnswer[],
    totalQuestions: number,
    durationSeconds: number,
  ) => void;
}

const EXAM_TIME_SECONDS = 60 * 60;

function Quiz({ mode, stateCode, onExit, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerMap, setAnswerMap] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const startedAtRef = useRef(Date.now());
  const answerMapRef = useRef(answerMap);

  useEffect(() => {
    answerMapRef.current = answerMap;
  }, [answerMap]);

  useEffect(() => {
    let active = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getQuestions(stateCode, mode);
        if (active) {
          setQuestions(data);
          startedAtRef.current = Date.now();
        }
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

  const finishQuiz = useCallback((answersSnapshot = answerMapRef.current) => {
    if (isSubmitted || questions.length === 0) return;

    const finalAnswers: UserAnswer[] = questions.map((question) => {
      const selectedAnswer = answersSnapshot[question.id] ?? "";
      return {
        questionId: question.id,
        question: question.question,
        options: question.options,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: selectedAnswer !== "" && selectedAnswer === question.correctAnswer,
        imageUrls: question.imageUrls,
      };
    });

    const score = finalAnswers.filter((answer) => answer.isCorrect).length;
    const durationSeconds = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    setIsSubmitted(true);
    onComplete(score, finalAnswers, questions.length, durationSeconds);
  }, [isSubmitted, onComplete, questions]);

  useEffect(() => {
    if (mode !== "exam" || loading || isSubmitted || questions.length === 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          window.setTimeout(() => finishQuiz(answerMapRef.current), 0);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, loading, isSubmitted, questions.length, finishQuiz]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const answeredCount = useMemo(
    () => questions.filter((question) => Boolean(answerMap[question.id])).length,
    [answerMap, questions],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Header compact />
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6 text-center">
          <div>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="font-semibold text-slate-700">Fragen werden geladen …</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Header onHome={onExit} compact />
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h1 className="text-xl font-black text-slate-900">Fragen konnten nicht geladen werden</h1>
            <p className="mt-3 text-slate-600">{error || "Bitte versuche es erneut."}</p>
            <button type="button" onClick={onExit} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Zur Startseite</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answerMap[currentQuestion.id] ?? "";
  const selectedState = BUNDESLAENDER.find((state) => state.code === stateCode)?.name;
  const isStateQuestion = currentQuestion.scope === "state";
  const progressPercent = (answeredCount / questions.length) * 100;
  const unansweredCount = questions.length - answeredCount;

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowNavigator(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAnswer = (option: string) => {
    setAnswerMap((previous) => ({ ...previous, [currentQuestion.id]: option }));
  };

  const goNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowEndConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header compact />

      <div className="sticky top-[65px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-bold text-slate-900">{mode === "exam" ? "Prüfungssimulation" : "Lernmodus"}</span>
              <span>•</span>
              <span>{selectedState}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-600">{answeredCount}/{questions.length} beantwortet</span>
              {mode === "exam" && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold ${timeLeft <= 300 ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                  <Clock3 className="h-3.5 w-3.5" /> {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => answeredCount > 0 ? setShowExitConfirm(true) : onExit()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            <Home className="h-4 w-4" /> Zur Startseite
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNavigator(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Grid3X3 className="h-4 w-4" /> Fragenübersicht
            </button>
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"
            >
              <Flag className="h-4 w-4" /> Test beenden
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-bold text-slate-500">Frage {currentQuestionIndex + 1} von {questions.length}</span>
              {isStateQuestion ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Landesfrage · {selectedState}</span>
              ) : (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Allgemeine Frage</span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <h2 className="text-xl font-black leading-8 text-slate-950 sm:text-2xl sm:leading-9">{currentQuestion.question}</h2>

            {currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0 && (
              <div className={`mt-7 grid gap-4 ${currentQuestion.imageUrls.length > 1 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
                {currentQuestion.imageUrls.map((imageUrl, index) => (
                  <figure key={imageUrl} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <img src={imageUrl} alt={`Bild ${index + 1} zu Frage ${currentQuestion.id}`} className="max-h-72 w-auto rounded-xl object-contain" />
                    {currentQuestion.imageUrls!.length > 1 && <figcaption className="text-xs font-semibold text-slate-500">Bild {index + 1}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const active = selectedAnswer === option;
                return (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    onClick={() => selectAnswer(option)}
                    className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                      active
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`pt-1 leading-6 ${active ? "font-semibold text-blue-950" : "text-slate-700"}`}>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((previous) => Math.max(0, previous - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-bold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowLeft className="h-4 w-4" /> Zurück
            </button>

            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              {currentQuestionIndex === questions.length - 1 ? "Auswertung" : "Weiter"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      {showNavigator && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-black">Fragenübersicht</h3>
                <p className="mt-1 text-sm text-slate-500">{answeredCount} beantwortet · {unansweredCount} offen</p>
              </div>
              <button type="button" onClick={() => setShowNavigator(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[68vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                {questions.map((question, index) => {
                  const isAnswered = Boolean(answerMap[question.id]);
                  const isCurrent = index === currentQuestionIndex;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      title={question.scope === "state" ? `${selectedState} – Landesfrage` : "Allgemeine Frage"}
                      className={`aspect-square rounded-xl text-sm font-bold transition ${
                        isCurrent
                          ? "bg-slate-950 text-white ring-2 ring-slate-300 ring-offset-2"
                          : isAnswered
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : question.scope === "state"
                              ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-blue-600" /> Beantwortet</span>
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-slate-300 bg-white" /> Offen</span>
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-amber-300 bg-amber-50" /> Landesfrage</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Flag className="h-6 w-6" /></div>
            <h3 className="text-2xl font-black">Test wirklich beenden?</h3>
            <p className="mt-3 leading-6 text-slate-600">
              Du hast <strong>{answeredCount} von {questions.length}</strong> Fragen beantwortet. {unansweredCount > 0 && <><strong>{unansweredCount}</strong> Fragen bleiben unbeantwortet.</>}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowEndConfirm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Weiter üben</button>
              <button type="button" onClick={() => finishQuiz()} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700">Beenden</button>
            </div>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Home className="h-6 w-6" /></div>
            <h3 className="text-2xl font-black">Zur Startseite?</h3>
            <p className="mt-3 leading-6 text-slate-600">Deine Antworten aus diesem laufenden Versuch werden nicht gespeichert.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowExitConfirm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Abbrechen</button>
              <button type="button" onClick={onExit} className="flex-1 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800">Startseite</button>
            </div>
          </div>
        </div>
      )}

      {selectedAnswer && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg sm:flex">
          <CheckCircle2 className="h-4 w-4" /> Antwort gespeichert
        </div>
      )}
    </div>
  );
}

export default Quiz;
