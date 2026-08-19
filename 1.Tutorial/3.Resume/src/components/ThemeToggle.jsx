import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={darkMode}
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
