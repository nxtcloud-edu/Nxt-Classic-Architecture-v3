import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();

  return (
    <article className="rounded-lg border border-line bg-card">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:text-accent transition-colors"
        >
          <span>
            <span className="block font-heading text-lg font-semibold leading-snug">
              {item.title}
            </span>
            {item.description && (
              <span className="block font-body text-sm text-muted mt-1">{item.description}</span>
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 text-muted transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <ul className="px-5 pb-5 flex flex-col gap-2 font-body text-sm text-muted list-disc list-inside">
          {item.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
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
        columns === 2
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
          : 'flex flex-col gap-4'
      }
    >
      {items.map((item) => (
        <AccordionItem key={item.title} item={item} />
      ))}
    </div>
  );
}
