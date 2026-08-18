import { ThumbsUp, Users } from 'lucide-react';

const SETUP_HINT = 'Lambda URL을 설정하세요';

function formatCount(value, isConfigured) {
  if (!isConfigured) return SETUP_HINT;
  if (value === null) return '불러오는 중…';
  return value.toLocaleString('ko-KR');
}

function Stat({ icon: Icon, label, value, isConfigured }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted flex-shrink-0" aria-hidden="true" />
      <span className="font-body text-sm text-muted">{label}</span>
      <span
        className={
          isConfigured
            ? 'font-heading text-lg font-semibold tabular-nums'
            : 'font-body text-sm text-faint'
        }
      >
        {formatCount(value, isConfigured)}
      </span>
    </div>
  );
}

export default function StatsBar({ visitCount, likeCount, onLike, isConfigured, error }) {
  return (
    <div className="p-4 rounded-lg border border-line bg-card flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat icon={Users} label="방문자수" value={visitCount} isConfigured={isConfigured} />
          <Stat icon={ThumbsUp} label="좋아요" value={likeCount} isConfigured={isConfigured} />
        </div>
        <button
          type="button"
          onClick={onLike}
          disabled={!isConfigured}
          className="px-4 py-2 rounded bg-ink text-surface font-body text-sm flex items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ThumbsUp className="w-4 h-4" aria-hidden="true" />
          좋아요
        </button>
      </div>

      {!isConfigured && (
        <p className="font-body text-xs text-faint">
          <code className="font-mono">src/config.js</code>의 <code className="font-mono">LAMBDA_URL</code>에
          Lambda 함수 URL을 넣으면 실제 카운터가 동작한다.
        </p>
      )}

      {error && (
        <p role="status" className="font-body text-xs text-faint">
          카운터를 불러오지 못했다: {error}
        </p>
      )}
    </div>
  );
}
