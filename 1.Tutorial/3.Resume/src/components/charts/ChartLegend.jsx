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
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted">{item.label}</span>
          {item.value != null && (
            <span className="text-sm font-semibold tabular-nums text-ink">{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
