import { useState } from "react";

import Header from "../components/Header";

import type { UserAnswer } from "../types/UserAnswer";
import type { QuizMode } from "../types/QuizMode";

interface ResultProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  mode: QuizMode;
  onRestart: () => void;
}

function Result({ score, totalQuestions, answers, mode, onRestart }: ResultProps) {
  const [showReview, setShowReview] = useState(false);
  const passed = mode === "exam" && score >= 17;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-center mb-6">
              {mode === "exam" ? "Test beendet" : "Übung abgeschlossen"}
            </h1>

            <div className="flex justify-center mb-6">
              <div className="h-40 w-40 rounded-full bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-sm text-slate-500">von {totalQuestions}</span>
              </div>
            </div>

            {mode === "exam" && (
              <div className={`text-center text-2xl font-semibold mb-8 ${passed ? "text-green-600" : "text-red-600"}`}>
                {passed ? "Bestanden ✅" : "Nicht bestanden ❌"}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-slate-500">Richtig</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{totalQuestions - score}</div>
                <div className="text-sm text-slate-500">Falsch</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-500">Genauigkeit</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onRestart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
                Neu starten
              </button>

              <button
                onClick={() => setShowReview(!showReview)}
                className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-xl hover:bg-slate-300"
              >
                {showReview ? "Auswertung schließen" : "Antworten prüfen"}
              </button>
            </div>
          </div>

          {showReview && (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Antwortauswertung</h2>

              <div className="space-y-6">
                {answers.map((answer, index) => (
                  <div
                    key={answer.questionId}
                    className={`border rounded-2xl p-6 ${
                      answer.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-bold">Frage {index + 1}</span>
                      <span>{answer.isCorrect ? "✅" : "❌"}</span>
                    </div>

                    <p className="font-semibold mb-6">{answer.question}</p>

                    {answer.imageUrls && answer.imageUrls.length > 0 && (
                      <div className={`mb-6 grid gap-4 ${answer.imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {answer.imageUrls.map((imageUrl, imageIndex) => (
                          <div key={imageUrl} className="flex flex-col items-center gap-2">
                            <img
                              src={imageUrl}
                              alt={`Bild ${imageIndex + 1} zu Frage ${answer.questionId}`}
                              className="max-h-64 w-auto rounded-xl border border-slate-200 shadow-sm bg-white"
                            />
                            {answer.imageUrls!.length > 1 && (
                              <span className="text-sm text-slate-500">Bild {imageIndex + 1}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      {answer.options.map((option) => {
                        const isCorrectOption = option === answer.correctAnswer;
                        const isSelectedOption = option === answer.selectedAnswer;

                        let style = "bg-white border-slate-200";
                        if (isCorrectOption) style = "bg-green-100 border-green-500";
                        if (isSelectedOption && !isCorrectOption) style = "bg-red-100 border-red-500";

                        return (
                          <div key={option} className={`border rounded-xl p-3 ${style}`}>
                            <div className="flex justify-between items-center gap-3">
                              <span>{option}</span>
                              <div className="flex gap-2 text-sm font-medium">
                                {isSelectedOption && !isCorrectOption && (
                                  <span className="text-red-600">Deine Antwort</span>
                                )}
                                {isCorrectOption && <span className="text-green-700">Richtig</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Result;
