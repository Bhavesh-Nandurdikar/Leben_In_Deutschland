import { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Header from "../components/Header";
import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface HomeProps {
  onStart: (mode: QuizMode, stateCode: string) => void;
  onProgress: () => void;
  saveProgress: boolean;
  onSaveProgressChange: (enabled: boolean) => void;
}

function Home({
  onStart,
  onProgress,
  saveProgress,
  onSaveProgressChange,
}: HomeProps) {
  const [stateCode, setStateCode] = useState("BE");

  const selectedState =
    BUNDESLAENDER.find((state) => state.code === stateCode)?.name ??
    "Berlin";

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header onProgress={onProgress} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

        {/* TOP SECTION */}
        <section className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* HERO */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Mit offiziellen BAMF-Fragen üben
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Sicher vorbereitet für den Leben-in-Deutschland-Test
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Wähle dein Bundesland, lerne den vollständigen Fragenkatalog
              oder starte eine realistische Prüfungssimulation.
            </p>
          </div>

          {/* SETTINGS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <label
              htmlFor="bundesland"
              className="flex items-center gap-2 text-sm font-bold text-slate-800"
            >
              <MapPin className="h-4 w-4 text-blue-600" />
              Dein Bundesland
            </label>

            <select
              id="bundesland"
              value={stateCode}
              onChange={(event) => setStateCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {BUNDESLAENDER.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              10 Landesfragen für {selectedState}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Fortschritt speichern
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Testergebnisse nur lokal in diesem Browser speichern.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label="Fortschritt auf diesem Gerät speichern"
                  aria-checked={saveProgress}
                  onClick={() => onSaveProgressChange(!saveProgress)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    saveProgress ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      saveProgress ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MODE CARDS */}
        <section className="mt-7 grid gap-5 lg:grid-cols-2">

          {/* LEARNING MODE */}
          <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-blue-50" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
                    <BookOpenCheck className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Lernmodus
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Alle 310 Fragen
                  </h2>
                </div>

                <div className="hidden gap-2 sm:flex">
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                    <strong className="block text-base">300</strong>
                    <span className="text-[11px] text-slate-500">
                      allgemein
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                    <strong className="block text-base">10</strong>
                    <span className="text-[11px] text-slate-500">
                      Landesfragen
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Arbeite den kompletten für {selectedState} relevanten
                Fragenkatalog ohne Zeitdruck durch.
              </p>

              <button
                type="button"
                onClick={() => onStart("all", stateCode)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                Lernmodus starten
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>

          {/* EXAM MODE */}
          <article className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-emerald-100/70" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Prüfungssimulation
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    33 zufällige Fragen
                  </h2>
                </div>

                <div className="hidden gap-2 sm:flex">
                  <div className="rounded-xl bg-white/80 px-3 py-2 text-center">
                    <strong className="block text-base">60 Min.</strong>
                    <span className="text-[11px] text-slate-500">
                      Zeitlimit
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/80 px-3 py-2 text-center">
                    <strong className="block text-base">17 / 33</strong>
                    <span className="text-[11px] text-slate-500">
                      Ziel
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                30 allgemeine Fragen und 3 Landesfragen werden bei jedem
                Versuch neu zusammengestellt.
              </p>

              <button
                type="button"
                onClick={() => onStart("exam", stateCode)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                Prüfung starten
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </section>

        {/* COMPACT INFO STRIP */}
        <section className="mt-5 grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-3">
          <div className="flex items-center gap-3 p-4 sm:border-r sm:border-slate-200">
            <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-bold">BAMF-Grundlage</p>
              <p className="text-xs text-slate-500">
                Fragen aus dem offiziellen Katalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-200 p-4 sm:border-r sm:border-t-0">
            <BookOpenCheck className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-bold">
                {saveProgress ? "Fortschritt gespeichert" : "Lokale Speicherung"}
              </p>
              <p className="text-xs text-slate-500">
                {saveProgress
                  ? "Nur auf diesem Gerät"
                  : "Optional aktivierbar"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-200 p-4 sm:border-t-0">
            <Clock3 className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-bold">Monatlich aktualisiert</p>
              <p className="text-xs text-slate-500">
                Automatische Prüfung des Katalogs
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500">
        Unabhängige Lernhilfe – keine offizielle BAMF-Webseite.
      </footer>
    </div>
  );
}

export default Home;