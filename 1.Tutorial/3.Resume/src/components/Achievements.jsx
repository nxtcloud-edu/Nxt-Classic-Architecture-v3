export default function Achievements({ items }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={item.title} className="border-l-2 border-accent pl-5">
          <h3 className="font-heading text-lg font-semibold leading-snug mb-1">{item.title}</h3>
          <p className="font-body text-sm text-muted leading-relaxed">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
