export default function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="anchor-offset py-10">
      <div className="mb-6">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
