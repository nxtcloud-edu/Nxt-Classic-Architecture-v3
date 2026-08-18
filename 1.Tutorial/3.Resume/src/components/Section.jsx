export default function Section({ id, title, action, children }) {
  return (
    <section id={id} className="py-14 border-b border-line">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
