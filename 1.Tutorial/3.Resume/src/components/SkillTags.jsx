export default function SkillTags({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <li key={skill}>
          <span className="chip font-medium">{skill}</span>
        </li>
      ))}
    </ul>
  );
}
