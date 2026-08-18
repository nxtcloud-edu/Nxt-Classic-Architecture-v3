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
      className="p-4 rounded-lg border border-line shadow-lg max-w-xs"
      style={{ backgroundColor: theme.card }}
    >
      <p className="font-heading text-base font-semibold mb-2">{label}년</p>
      <div className="flex flex-col gap-3">
        {SERIES.map((series, index) => {
          // payload는 시리즈가 비어 있으면 항목이 빠지므로 인덱스 대신 dataKey로 찾는다
          const entry = payload.find((item) => item.dataKey === series.key);
          if (!entry) return null;

          return (
            <div key={series.key}>
              <p className="flex items-center gap-2 font-body text-sm text-ink">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: theme.series[index] }}
                />
                {series.label} ({entry.value}개)
              </p>
              {entry.payload?.[series.detail] && (
                <p className="font-body text-xs text-muted whitespace-pre-line mt-1">
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
    <div className="flex flex-col gap-4">
      <ChartLegend
        items={SERIES.map((series, index) => ({
          label: series.label,
          color: theme.series[index],
        }))}
      />
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            stroke={theme.grid}
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            stroke={theme.grid}
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickLine={false}
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
