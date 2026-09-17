import { BarChart3, Home as HomeIcon } from "lucide-react";

interface HeaderProps {
  onHome?: () => void;
  onProgress?: () => void;
  compact?: boolean;
}

function Header({ onHome, onProgress, compact = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 ${compact ? "py-3" : "py-4"} sm:px-6`}>
        <button
          type="button"
          onClick={onHome}
          className="group flex items-center gap-3 text-left"
          aria-label="Zur Startseite"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-xl shadow-sm transition group-hover:-translate-y-0.5">
            🇩🇪
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none text-slate-900 sm:text-base">Leben in Deutschland</span>
            {!compact && <span className="mt-1 hidden text-xs text-slate-500 sm:block">Prüfungsvorbereitung</span>}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {onHome && (
            <button
              type="button"
              onClick={onHome}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:flex"
            >
              <HomeIcon className="h-4 w-4" />
              Start
            </button>
          )}
          {onProgress && (
            <button
              type="button"
              onClick={onProgress}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Mein Fortschritt</span>
              <span className="sm:hidden">Fortschritt</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
