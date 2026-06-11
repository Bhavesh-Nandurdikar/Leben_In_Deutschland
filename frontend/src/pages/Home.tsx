import type { QuizMode } from "../types/QuizMode";

interface HomeProps {
  onStart: (mode: QuizMode) => void;
}

function Home({ onStart }: HomeProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            🇩🇪 Leben in Deutschland
          </h1>

          <p className="text-lg text-slate-600">
            Practice the official German citizenship test with 33 random questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="text-4xl mb-4">📘</div>

            <h2 className="text-2xl font-bold mb-3">Practice Mode</h2>

            <p className="text-slate-600 mb-6">
              Learn at your own pace. There is no timer, so you can read carefully,
              think through each question, and review your answers at the end.
            </p>

            <ul className="text-sm text-slate-500 space-y-2 mb-8">
              <li>✓ No time limit</li>
              <li>✓ 33 random questions</li>
              <li>✓ Score shown at the end</li>
              <li>✓ Full answer review</li>
            </ul>

            <button
              onClick={() => onStart("practice")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
            >
              Start Practice
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="text-4xl mb-4">⏱️</div>

            <h2 className="text-2xl font-bold mb-3">Exam Mode</h2>

            <p className="text-slate-600 mb-6">
              Simulate the real exam experience. You get 60 minutes to answer
              33 questions. When time runs out, the test is submitted automatically.
            </p>

            <ul className="text-sm text-slate-500 space-y-2 mb-8">
              <li>✓ 60-minute timer</li>
              <li>✓ 33 random questions</li>
              <li>✓ Pass mark: 17/33</li>
              <li>✓ Auto-submit when time ends</li>
            </ul>

            <button
              onClick={() => onStart("exam")}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium"
            >
              Start Exam Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;