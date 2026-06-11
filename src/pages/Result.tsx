import { useState } from "react";

import Header from "../components/Header";

import type { UserAnswer } from "../types/UserAnswer";

interface ResultProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  onRestart: () => void;
}

function Result({
  score,
  totalQuestions,
  answers,
  onRestart,
}: ResultProps) {
  const [showReview, setShowReview] =
    useState(false);

  const passed = score >= 17;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-100 py-10 px-4">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

            <h1 className="text-4xl font-bold text-center mb-6">
              Test Complete
            </h1>

            <div className="flex justify-center mb-6">

              <div className="h-40 w-40 rounded-full bg-blue-50 flex items-center justify-center text-5xl font-bold text-blue-600">
                {score}
              </div>

            </div>

            <div
              className={`text-center text-2xl font-semibold mb-8 ${
                passed
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passed
                ? "Passed ✅"
                : "Failed ❌"}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">

              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {score}
                </div>

                <div className="text-sm text-slate-500">
                  Correct
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {totalQuestions - score}
                </div>

                <div className="text-sm text-slate-500">
                  Incorrect
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {Math.round(
                    (score /
                      totalQuestions) *
                      100
                  )}
                  %
                </div>

                <div className="text-sm text-slate-500">
                  Accuracy
                </div>
              </div>

            </div>

            <div className="flex gap-4">

              <button
                onClick={onRestart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
                Take Another Test
              </button>

              <button
                onClick={() =>
                  setShowReview(
                    !showReview
                  )
                }
                className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-xl hover:bg-slate-300"
              >
                {showReview
                  ? "Hide Review"
                  : "Review Answers"}
              </button>

            </div>

          </div>

          {showReview && (
            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h2 className="text-2xl font-bold mb-6">
                Answer Review
              </h2>

              <div className="space-y-6">

                {answers.map(
                  (answer, index) => (
                    <div
                      key={
                        answer.questionId
                      }
                      className={`border rounded-2xl p-6 ${
                        answer.isCorrect
                          ? "border-green-300 bg-green-50"
                          : "border-red-300 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">

                        <span className="font-bold">
                          Question{" "}
                          {index + 1}
                        </span>

                        <span>
                          {answer.isCorrect
                            ? "✅"
                            : "❌"}
                        </span>

                      </div>

                      <p className="font-semibold mb-6">
                        {answer.question}
                      </p>

                      {answer.imageUrl && (
  <div className="mb-6 flex justify-center">
    <img
      src={answer.imageUrl}
      alt={`Question ${answer.questionId}`}
      className="max-h-72 w-auto rounded-xl border border-slate-200 shadow-sm"
    />
  </div>
)}

                      <div className="space-y-3">

                        {answer.options.map(
                          (option) => {
                            const isCorrectOption =
                              option ===
                              answer.correctAnswer;

                            const isSelectedOption =
                              option ===
                              answer.selectedAnswer;

                            let style =
                              "bg-white border-slate-200";

                            if (
                              isCorrectOption
                            ) {
                              style =
                                "bg-green-100 border-green-500";
                            }

                            if (
                              isSelectedOption &&
                              !isCorrectOption
                            ) {
                              style =
                                "bg-red-100 border-red-500";
                            }

                            return (
                              <div
                                key={
                                  option
                                }
                                className={`border rounded-xl p-3 ${style}`}
                              >
                                <div className="flex justify-between items-center">

                                  <span>
                                    {option}
                                  </span>

                                  <div className="flex gap-2">

                                    {isSelectedOption && (
                                      <span className="text-red-600 text-sm font-medium">
                                        Your Answer
                                      </span>
                                    )}

                                    {isCorrectOption && (
                                      <span className="text-green-700 text-sm font-medium">
                                        Correct
                                      </span>
                                    )}

                                  </div>

                                </div>
                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default Result;