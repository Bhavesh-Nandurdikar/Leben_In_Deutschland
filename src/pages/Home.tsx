import { useState } from "react";
import { ArrowRight, BookOpenCheck, Clock3, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import Header from "../components/Header";
import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface HomeProps {
  onStart: (mode: QuizMode, stateCode: string) => void;
  onProgress: () => void;
}

function Home({ onStart, onProgress }: HomeProps) {
  const [stateCode, setStateCode] = useState("BE");
  const selectedState = BUNDESLAENDER.find((state) => state.code === stateCode)?.name;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header onProgress={onProgress} />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(245,158,11,0.10),transparent_25%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                <Sparkles className="h-4 w-4" />
                Mit offiziellen BAMF-Fragen üben
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Sicher vorbereitet für den<br className="hidden sm:block" /> Leben-in-Deutschland-Test
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Wähle dein Bundesland, lerne den kompletten Fragenkatalog oder starte eine realistische Prüfungssimulation mit 33 Fragen.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
              <label htmlFor="bundesland" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <MapPin className="h-4 w-4 text-blue-600" />
                Dein Bundesland
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <select
                  id="bundesland"
                  value={stateCode}
                  onChange={(event) => setStateCode(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {BUNDESLAENDER.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-center rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  10 Landesfragen für {selectedState}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-blue-50" />
              <div className="relative">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <BookOpenCheck className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Lernmodus</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Alle 310 Fragen</h2>
                <p className="mt-3 max-w-xl leading-7 text-slate-600">
                  Arbeite den kompletten für {selectedState} relevanten Fragenkatalog ohne Zeitdruck durch.
                </p>

                <div className="my-7 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-lg text-slate-900">300</strong><span className="text-slate-500">allgemeine Fragen</span></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-lg text-slate-900">10</strong><span className="text-slate-500">Landesfragen</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => onStart("all", stateCode)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-slate-800"
                >
                  Lernmodus starten <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-emerald-100/70" />
              <div className="relative">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                  <Clock3 className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Prüfungssimulation</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">33 zufällige Fragen</h2>
                <p className="mt-3 max-w-xl leading-7 text-slate-600">
                  30 allgemeine Fragen und 3 Landesfragen werden für jeden Versuch neu zusammengestellt.
                </p>

                <div className="my-7 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/80 p-4"><strong className="block text-lg text-slate-900">60 Min.</strong><span className="text-slate-500">Zeitlimit</span></div>
                  <div className="rounded-2xl bg-white/80 p-4"><strong className="block text-lg text-slate-900">17 / 33</strong><span className="text-slate-500">Bestehensgrenze</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => onStart("exam", stateCode)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-700"
                >
                  Prüfung starten <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"><ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600" /><div><p className="font-bold">Offizielle Grundlage</p><p className="mt-1 text-sm leading-6 text-slate-500">Fragen basieren auf dem BAMF-Katalog.</p></div></div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"><BookOpenCheck className="mt-0.5 h-5 w-5 text-blue-600" /><div><p className="font-bold">Fortschritt bleibt erhalten</p><p className="mt-1 text-sm leading-6 text-slate-500">Ergebnisse werden auf diesem Gerät gespeichert.</p></div></div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"><Clock3 className="mt-0.5 h-5 w-5 text-blue-600" /><div><p className="font-bold">Monatliche Aktualisierung</p><p className="mt-1 text-sm leading-6 text-slate-500">Der Fragenkatalog kann automatisiert geprüft werden.</p></div></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-7 text-center text-xs leading-5 text-slate-500">
        Unabhängige Lernhilfe, keine offizielle BAMF-Webseite. Für verbindliche Informationen gilt der aktuelle BAMF-Fragenkatalog.
      </footer>
    </div>
  );
}

export default Home;
