import { useState } from "react";
import { MapPin } from "lucide-react";

import type { QuizMode } from "../types/QuizMode";
import { BUNDESLAENDER } from "../types/Bundesland";

interface HomeProps {
  onStart: (mode: QuizMode, stateCode: string) => void;
}

function Home({ onStart }: HomeProps) {
  const [stateCode, setStateCode] = useState("BE");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            🇩🇪 Leben in Deutschland
          </h1>
          <p className="text-lg text-slate-600">
            Übe den offiziellen Fragenkatalog oder simuliere einen Test mit 33 Fragen.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-100 mb-8">
          <label htmlFor="bundesland" className="flex items-center gap-2 text-lg font-semibold mb-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            Bundesland auswählen
          </label>
          <p className="text-sm text-slate-500 mb-4">
            Die Auswahl bestimmt, welche 10 landesspezifischen Fragen verwendet werden.
          </p>
          <select
            id="bundesland"
            value={stateCode}
            onChange={(event) => setStateCode(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {BUNDESLAENDER.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="text-4xl mb-4">📘</div>
            <h2 className="text-2xl font-bold mb-3">Alle Fragen</h2>
            <p className="text-slate-600 mb-6">
              Arbeite den gesamten für dein Bundesland relevanten Fragenkatalog durch.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 mb-8">
              <li>✓ 300 allgemeine Fragen</li>
              <li>✓ 10 Fragen aus deinem Bundesland</li>
              <li>✓ Kein Zeitlimit</li>
              <li>✓ Auswertung am Ende</li>
            </ul>
            <button
              onClick={() => onStart("all", stateCode)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
            >
              Alle 310 Fragen starten
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="text-4xl mb-4">⏱️</div>
            <h2 className="text-2xl font-bold mb-3">Prüfungssimulation</h2>
            <p className="text-slate-600 mb-6">
              Simuliere die echte Auswahl mit zufällig zusammengestellten Fragen.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 mb-8">
              <li>✓ 30 zufällige allgemeine Fragen</li>
              <li>✓ 3 zufällige Landesfragen</li>
              <li>✓ 60-Minuten-Timer</li>
              <li>✓ Bestehensgrenze: 17/33</li>
            </ul>
            <button
              onClick={() => onStart("exam", stateCode)}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium"
            >
              33-Fragen-Test starten
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Fragen basieren auf dem BAMF-Fragenkatalog. Bitte prüfe bei Änderungen immer die aktuelle BAMF-Version.
        </p>
      </div>
    </div>
  );
}

export default Home;
