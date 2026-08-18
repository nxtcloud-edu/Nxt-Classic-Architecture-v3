/**
 * 범례는 차트 밖에 직접 그린다.
 * 색은 스와치만 담당하고, 이름과 값은 잉크 토큰으로 쓴다.
 */
export default function ChartLegend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-body text-sm text-muted">{item.label}</span>
          {item.value != null && (
            <span className="font-body text-sm text-ink tabular-nums">{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
