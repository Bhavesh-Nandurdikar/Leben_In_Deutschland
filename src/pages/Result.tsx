import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleX, Home, RotateCcw, Search, Trophy } from "lucide-react";

import Header from "../components/Header";
import type { UserAnswer } from "../types/UserAnswer";
import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface ResultProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  mode: QuizMode;
  stateCode: string;
  onRestart: () => void;
  onRetry: () => void;
  onProgress: () => void;
}

function Result({ score, totalQuestions, answers, mode, stateCode, onRestart, onRetry, onProgress }: ResultProps) {
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "unanswered">("wrong");
  const passed = mode === "exam" && score >= 17;
  const unanswered = answers.filter((answer) => !answer.selectedAnswer).length;
  const incorrect = answers.filter((answer) => answer.selectedAnswer && !answer.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const stateName = BUNDESLAENDER.find((state) => state.code === stateCode)?.name ?? stateCode;

  const filteredAnswers = useMemo(() => {
    if (reviewFilter === "wrong") return answers.filter((answer) => answer.selectedAnswer && !answer.isCorrect);
    if (reviewFilter === "unanswered") return answers.filter((answer) => !answer.selectedAnswer);
    return answers;
  }, [answers, reviewFilter]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header onHome={onRestart} onProgress={onProgress} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className={`px-6 py-10 text-center sm:px-10 ${mode === "exam" && passed ? "bg-gradient-to-b from-emerald-50 to-white" : "bg-gradient-to-b from-blue-50 to-white"}`}>
            <div className={`mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl ${mode === "exam" && passed ? "bg-emerald-600 text-white" : "bg-slate-950 text-white"}`}>
              {mode === "exam" && passed ? <Trophy className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{mode === "exam" ? "Prüfungssimulation" : "Lernmodus"} · {stateName}</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{mode === "exam" ? "Test beendet" : "Übung abgeschlossen"}</h1>
            {mode === "exam" && (
              <p className={`mt-3 text-xl font-black ${passed ? "text-emerald-700" : "text-red-700"}`}>{passed ? "Bestanden ✓" : "Noch nicht bestanden"}</p>
            )}

            <div className="mx-auto mt-7 grid h-44 w-44 place-items-center rounded-full border-[10px] border-blue-100 bg-white shadow-inner">
              <div>
                <div className="text-5xl font-black text-slate-950">{score}</div>
                <div className="mt-1 text-sm font-semibold text-slate-500">von {totalQuestions}</div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-emerald-50 p-4 text-center"><div className="text-2xl font-black text-emerald-700">{score}</div><div className="mt-1 text-xs font-bold text-emerald-700/70">Richtig</div></div>
              <div className="rounded-2xl bg-red-50 p-4 text-center"><div className="text-2xl font-black text-red-700">{incorrect}</div><div className="mt-1 text-xs font-bold text-red-700/70">Falsch</div></div>
              <div className="rounded-2xl bg-amber-50 p-4 text-center"><div className="text-2xl font-black text-amber-700">{unanswered}</div><div className="mt-1 text-xs font-bold text-amber-700/70">Offen</div></div>
              <div className="rounded-2xl bg-blue-50 p-4 text-center"><div className="text-2xl font-black text-blue-700">{accuracy}%</div><div className="mt-1 text-xs font-bold text-blue-700/70">Punkte</div></div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={onRestart} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 hover:bg-slate-50"><Home className="h-4 w-4" /> Startseite</button>
              <button type="button" onClick={onRetry} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Neuer Versuch</button>
              <button type="button" onClick={() => setShowReview((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 font-bold text-white hover:bg-slate-800"><Search className="h-4 w-4" /> {showReview ? "Auswertung schließen" : "Antworten prüfen"}</button>
            </div>

            <button type="button" onClick={onProgress} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3.5 font-bold text-blue-700 hover:bg-blue-100">Gespeicherten Fortschritt ansehen <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>

        {showReview && (
          <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Antwortauswertung</h2>
                <p className="mt-1 text-sm text-slate-500">Prüfe falsche oder unbeantwortete Fragen gezielt.</p>
              </div>
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold sm:text-sm">
                {(["wrong", "unanswered", "all"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setReviewFilter(filter)}
                    className={`rounded-lg px-3 py-2 transition ${reviewFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    {filter === "wrong" ? `Falsch (${incorrect})` : filter === "unanswered" ? `Offen (${unanswered})` : `Alle (${answers.length})`}
                  </button>
                ))}
              </div>
            </div>

            {filteredAnswers.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-emerald-50 p-8 text-center">
                <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />
                <p className="mt-3 font-bold text-emerald-800">Hier gibt es nichts zu prüfen.</p>
              </div>
            ) : (
              <div className="mt-7 space-y-5">
                {filteredAnswers.map((answer) => {
                  const originalIndex = answers.findIndex((item) => item.questionId === answer.questionId);
                  const unansweredAnswer = !answer.selectedAnswer;
                  return (
                    <article key={answer.questionId} className={`rounded-2xl border p-5 sm:p-6 ${answer.isCorrect ? "border-emerald-200 bg-emerald-50/40" : unansweredAnswer ? "border-amber-200 bg-amber-50/40" : "border-red-200 bg-red-50/40"}`}>
                      <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                        {answer.isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <CircleX className={`h-5 w-5 ${unansweredAnswer ? "text-amber-600" : "text-red-600"}`} />}
                        Frage {originalIndex + 1}
                        {unansweredAnswer && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Nicht beantwortet</span>}
                      </div>
                      <p className="font-bold leading-7 text-slate-900">{answer.question}</p>

                      {answer.imageUrls && answer.imageUrls.length > 0 && (
                        <div className={`mt-5 grid gap-3 ${answer.imageUrls.length > 1 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
                          {answer.imageUrls.map((imageUrl, imageIndex) => (
                            <img key={imageUrl} src={imageUrl} alt={`Bild ${imageIndex + 1}`} className="max-h-56 w-auto rounded-xl border border-slate-200 bg-white object-contain" />
                          ))}
                        </div>
                      )}

                      <div className="mt-5 grid gap-2">
                        {answer.options.map((option, index) => {
                          const isCorrectOption = option === answer.correctAnswer;
                          const isSelectedOption = option === answer.selectedAnswer;
                          let style = "border-slate-200 bg-white";
                          if (isCorrectOption) style = "border-emerald-400 bg-emerald-50";
                          if (isSelectedOption && !isCorrectOption) style = "border-red-400 bg-red-50";

                          return (
                            <div key={`${answer.questionId}-${index}`} className={`flex items-start gap-3 rounded-xl border p-3 ${style}`}>
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">{String.fromCharCode(65 + index)}</span>
                              <span className="flex-1 pt-0.5 text-sm leading-6 text-slate-700">{option}</span>
                              {isCorrectOption && <span className="pt-0.5 text-xs font-black text-emerald-700">RICHTIG</span>}
                              {isSelectedOption && !isCorrectOption && <span className="pt-0.5 text-xs font-black text-red-700">DEINE ANTWORT</span>}
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Result;
