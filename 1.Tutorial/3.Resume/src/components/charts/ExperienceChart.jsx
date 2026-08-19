import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartTheme } from '../../lib/chartPalette.js';
import ChartLegend from './ChartLegend.jsx';

const SERIES = [
  { key: 'certifications', label: '자격증/교육이수', detail: 'certDetail' },
  { key: 'activities', label: '주요 활동', detail: 'actDetail' },
];

function ExperienceTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="max-w-xs rounded-2xl border border-line p-4 shadow-pop"
      style={{ backgroundColor: theme.card }}
    >
      <p className="mb-2.5 text-sm font-bold tracking-tight">{label}년</p>
      <div className="flex flex-col gap-3">
        {SERIES.map((series, index) => {
          // payload는 시리즈가 비어 있으면 항목이 빠지므로 인덱스 대신 dataKey로 찾는다
          const entry = payload.find((item) => item.dataKey === series.key);
          if (!entry) return null;

          return (
            <div key={series.key}>
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: theme.series[index] }}
                />
                {series.label}
                <span className="tabular-nums text-muted">{entry.value}개</span>
              </p>
              {entry.payload?.[series.detail] && (
                <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted">
                  {entry.payload[series.detail]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExperienceChart({ data, darkMode }) {
  const theme = chartTheme(darkMode);

  return (
    <div className="flex flex-col gap-5">
      <ChartLegend
        items={SERIES.map((series, index) => ({
          label: series.label,
          color: theme.series[index],
        }))}
      />
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          {/* 격자는 표면에서 한 단계 떨어진 회색 실선 1px — 후퇴시킨다 */}
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis
            dataKey="year"
            stroke={theme.grid}
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke={theme.grid}
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip
            cursor={{ stroke: theme.axis, strokeWidth: 1 }}
            content={<ExperienceTooltip theme={theme} />}
          />
          {SERIES.map((series, index) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={theme.series[index]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              // 테마를 바꾸면 진입 애니메이션이 다시 시작하면서 멈춰 버린다
              isAnimationActive={false}
              // 겹치는 마크를 분리하기 위해 표면색 2px 링을 두른다
              dot={{ r: 4, fill: theme.series[index], strokeWidth: 2, stroke: theme.surface }}
              activeDot={{ r: 6, fill: theme.series[index], strokeWidth: 2, stroke: theme.surface }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
