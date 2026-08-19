import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();

  return (
    <article className="card-interactive overflow-hidden">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors duration-200 hover:bg-sunk"
        >
          <span className="min-w-0">
            <span className="block font-semibold leading-snug tracking-tight">{item.title}</span>
            {item.description && (
              <span className="mt-1 block text-sm text-muted">{item.description}</span>
            )}
          </span>
          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <ul className="flex flex-col gap-2.5 border-t border-line px-5 py-4">
          {item.achievements.map((achievement) => (
            <li key={achievement} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <span
                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function AccordionList({ items, columns = 1 }) {
  return (
    <div
      className={
        columns === 2 ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : 'flex flex-col gap-4'
      }
    >
      {items.map((item) => (
        <AccordionItem key={item.title} item={item} />
      ))}
    </div>
  );
}
