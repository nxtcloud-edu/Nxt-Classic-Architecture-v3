import { Briefcase, Code, Mail, Phone } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

// lucide-react 1.x는 브랜드 로고 아이콘을 제공하지 않아 일반 아이콘으로 대체한다
const ICONS = { mail: Mail, phone: Phone, github: Code, linkedin: Briefcase };

function ContactItem({ icon, label, href }) {
  const Icon = ICONS[icon] ?? Mail;
  const inner = (
    <>
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      {label}
    </>
  );

  if (!href) {
    return <span className="flex items-center gap-2 text-muted">{inner}</span>;
  }

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
    >
      {inner}
    </a>
  );
}

export default function Hero({ profile, contacts, darkMode, onToggleTheme }) {
  return (
    <header className="pt-14 pb-12 border-b border-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-sm text-accent tracking-widest uppercase mb-3">Resume</p>
          <h1 className="font-heading text-5xl font-bold tracking-tight leading-tight mb-4">
            {profile.name}
          </h1>
          <p className="font-body text-lg text-muted leading-relaxed max-w-xl">
            {profile.tagline}
          </p>
        </div>
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      </div>

      {profile.summary && (
        <p className="font-body text-base text-muted leading-relaxed max-w-xl mt-6">
          {profile.summary}
        </p>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 font-body text-sm">
        {contacts.map((contact) => (
          <ContactItem key={contact.label} {...contact} />
        ))}
      </div>
    </header>
  );
}
