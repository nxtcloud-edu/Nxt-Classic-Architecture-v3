import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={darkMode}
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="p-2 rounded-full border border-line text-muted hover:text-ink hover:border-ink transition-colors"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
