import { Trophy } from 'lucide-react';

export default function Achievements({ items }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="card-interactive flex gap-3 p-5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Trophy className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug tracking-tight">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
