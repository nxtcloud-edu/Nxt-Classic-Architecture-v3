import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { chartTheme } from '../../lib/chartPalette.js';
import ChartLegend from './ChartLegend.jsx';

function MixTooltip({ active, payload, theme }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div
      className="rounded-xl border border-line px-3.5 py-2 shadow-pop"
      style={{ backgroundColor: theme.card }}
    >
      <p className="text-sm font-medium text-ink">
        {entry.name} <span className="tabular-nums text-muted">{entry.value}%</span>
      </p>
    </div>
  );
}

export default function ProjectMixChart({ data, darkMode }) {
  const theme = chartTheme(darkMode);

  return (
    <div className="flex flex-col gap-5">
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={2}
            stroke={theme.surface}
            strokeWidth={2}
            // 테마를 바꾸면 진입 애니메이션이 다시 시작하면서 멈춰 버린다
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={theme.series[index % theme.series.length]} />
            ))}
          </Pie>
          <Tooltip content={<MixTooltip theme={theme} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* 라이트 모드에서 일부 슬라이스가 표면 대비 3:1 미만이라 값을 텍스트로 함께 표기한다 */}
      <ChartLegend
        items={data.map((entry, index) => ({
          label: entry.name,
          value: `${entry.value}%`,
          color: theme.series[index % theme.series.length],
        }))}
      />
    </div>
  );
}
