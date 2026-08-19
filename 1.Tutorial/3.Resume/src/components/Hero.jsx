import { Briefcase, Code, Mail, Phone } from 'lucide-react';

// lucide-react 1.x는 브랜드 로고 아이콘을 제공하지 않아 일반 아이콘으로 대체한다
const ICONS = { mail: Mail, phone: Phone, github: Code, linkedin: Briefcase };

function ContactChip({ icon, label, href }) {
  const Icon = ICONS[icon] ?? Mail;
  const isExternal = href?.startsWith('http');
  const inner = (
    <>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      {label}
    </>
  );

  if (!href) {
    return <span className="chip">{inner}</span>;
  }

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="chip"
    >
      {inner}
    </a>
  );
}

export default function Hero({ profile, contacts }) {
  return (
    <div id="top" className="anchor-offset relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-x-0 -top-24 h-72" aria-hidden="true" />

      <div className="relative pb-10 pt-12">
        <div className="flex items-center gap-4">
          <span
            className="gradient-accent flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-pop"
            aria-hidden="true"
          >
            {profile.name.slice(0, 1)}
          </span>
          {profile.status && (
            <span className="chip chip--accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {profile.status}
            </span>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {profile.name}
          <span className="gradient-text">.</span>
        </h1>

        <p className="mt-3 max-w-xl text-lg font-semibold text-muted sm:text-xl">
          {profile.tagline}
        </p>

        {profile.summary && (
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{profile.summary}</p>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          {contacts.map((contact) => (
            <ContactChip key={contact.label} {...contact} />
          ))}
        </div>
      </div>
    </div>
  );
}
