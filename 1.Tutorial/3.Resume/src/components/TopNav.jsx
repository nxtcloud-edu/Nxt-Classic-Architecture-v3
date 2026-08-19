import ThemeToggle from './ThemeToggle.jsx';

const LINKS = [
  { id: 'achievements', label: '성과' },
  { id: 'growth', label: '성장' },
  { id: 'education', label: '교육' },
  { id: 'projects', label: '프로젝트' },
  { id: 'skills', label: '기술' },
];

export default function TopNav({ name, darkMode, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-glass backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-3">
        <a
          href="#top"
          className="flex flex-shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <span className="gradient-accent flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white">
            {name.slice(0, 1)}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </a>

        {/* 좁은 화면에서는 네비가 자체적으로 가로 스크롤한다 */}
        <nav className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:bg-sunk hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
