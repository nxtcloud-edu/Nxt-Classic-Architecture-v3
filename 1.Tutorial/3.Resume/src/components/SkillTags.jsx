export default function SkillTags({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <li
          key={skill}
          className="px-3 py-1.5 rounded-full border border-line font-body text-sm text-muted"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
