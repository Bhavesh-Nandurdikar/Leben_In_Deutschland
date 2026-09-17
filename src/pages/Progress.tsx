import { useMemo, useState } from "react";
import { BarChart3, BookOpenCheck, CalendarDays, Trash2, Trophy } from "lucide-react";

import Header from "../components/Header";
import { BUNDESLAENDER } from "../types/Bundesland";
import type { QuizAttempt } from "../types/QuizAttempt";

interface ProgressProps {
  attempts: QuizAttempt[];
  onHome: () => void;
  onClear: () => void;
}

function Progress({ attempts, onHome, onClear }: ProgressProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const examAttempts = attempts.filter((attempt) => attempt.mode === "exam");
  const bestScore = examAttempts.length ? Math.max(...examAttempts.map((attempt) => attempt.score)) : null;
  const averageScore = examAttempts.length ? Math.round(examAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / examAttempts.length) : null;

  const stateStats = useMemo(() => {
    const counts = new Map<string, number>();
    attempts.forEach((attempt) => counts.set(attempt.stateCode, (counts.get(attempt.stateCode) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header onHome={onHome} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Auf diesem Gerät</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Mein Fortschritt</h1>
            <p className="mt-2 text-slate-600">Deine letzten Ergebnisse werden aktuell lokal in diesem Browser gespeichert.</p>
          </div>
          {attempts.length > 0 && (
            <button type="button" onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Verlauf löschen</button>
          )}
        </div>

        {attempts.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><BarChart3 className="h-7 w-7" /></div>
            <h2 className="mt-5 text-2xl font-black">Noch keine Ergebnisse</h2>
            <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">Schließe eine Übung oder Prüfung ab. Danach siehst du hier deine Entwicklung.</p>
            <button type="button" onClick={onHome} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800">Jetzt üben</button>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-bold text-slate-500"><BookOpenCheck className="h-4 w-4 text-blue-600" /> Versuche</div><div className="mt-3 text-3xl font-black">{attempts.length}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Trophy className="h-4 w-4 text-amber-500" /> Bestes Prüfungsergebnis</div><div className="mt-3 text-3xl font-black">{bestScore === null ? "–" : `${bestScore}/33`}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-bold text-slate-500"><BarChart3 className="h-4 w-4 text-emerald-600" /> Ø Prüfung</div><div className="mt-3 text-3xl font-black">{averageScore === null ? "–" : `${averageScore}/33`}</div></div>
            </section>

            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-black">Letzte Versuche</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                {attempts.map((attempt, index) => {
                  const stateName = BUNDESLAENDER.find((state) => state.code === attempt.stateCode)?.name ?? attempt.stateCode;
                  const date = new Date(attempt.completedAt);
                  return (
                    <div key={attempt.id} className={`grid gap-3 px-4 py-4 sm:grid-cols-[1.3fr_1fr_0.7fr_0.7fr] sm:items-center ${index !== attempts.length - 1 ? "border-b border-slate-200" : ""}`}>
                      <div>
                        <div className="font-bold text-slate-900">{attempt.mode === "exam" ? "Prüfungssimulation" : "Lernmodus"}</div>
                        <div className="mt-1 text-xs text-slate-500">{stateName}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4" /> {date.toLocaleDateString("de-DE")}</div>
                      <div className="text-sm"><span className="font-black text-slate-900">{attempt.score}/{attempt.totalQuestions}</span><span className="ml-1 text-slate-500">richtig</span></div>
                      <div className="text-sm text-slate-500">{attempt.unanswered} offen</div>
                    </div>
                  );
                })}
              </div>

              {stateStats.length > 1 && (
                <p className="mt-4 text-xs text-slate-500">Geübt in {stateStats.length} Bundesländern.</p>
              )}
            </section>
          </>
        )}
      </main>

      {confirmClear && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
            <h3 className="text-2xl font-black">Verlauf löschen?</h3>
            <p className="mt-3 leading-6 text-slate-600">Alle lokal gespeicherten Ergebnisse auf diesem Gerät werden entfernt.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirmClear(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700">Abbrechen</button>
              <button type="button" onClick={() => { onClear(); setConfirmClear(false); }} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white">Löschen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;
