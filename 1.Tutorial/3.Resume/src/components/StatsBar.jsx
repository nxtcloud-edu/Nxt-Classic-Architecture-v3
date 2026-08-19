import { ThumbsUp, Users } from 'lucide-react';

const SETUP_HINT = 'Lambda URL 미설정';

function StatCard({ icon: Icon, label, value, isConfigured }) {
  const display = !isConfigured ? SETUP_HINT : value === null ? '···' : value.toLocaleString('ko-KR');

  return (
    <div className="card flex flex-1 items-center gap-3 p-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-faint">{label}</p>
        <p
          className={
            isConfigured
              ? 'text-xl font-bold tabular-nums tracking-tight'
              : 'truncate text-sm font-medium text-faint'
          }
        >
          {display}
        </p>
      </div>
    </div>
  );
}

export default function StatsBar({ visitCount, likeCount, onLike, isConfigured, error }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <StatCard icon={Users} label="방문자수" value={visitCount} isConfigured={isConfigured} />
        <StatCard icon={ThumbsUp} label="좋아요" value={likeCount} isConfigured={isConfigured} />

        <div className="card flex items-center justify-center p-4">
          <button type="button" onClick={onLike} disabled={!isConfigured} className="btn btn--primary">
            <ThumbsUp className="h-4 w-4" aria-hidden="true" />
            좋아요
          </button>
        </div>
      </div>

      {!isConfigured && (
        <p className="text-xs text-faint">
          <code className="rounded bg-sunk px-1.5 py-0.5 font-mono">src/config.js</code>의{' '}
          <code className="rounded bg-sunk px-1.5 py-0.5 font-mono">LAMBDA_URL</code>에 Lambda 함수
          URL을 넣으면 실제 카운터가 동작한다.
        </p>
      )}

      {error && (
        <p role="status" className="text-xs text-faint">
          카운터를 불러오지 못했다: {error}
        </p>
      )}
    </div>
  );
}
