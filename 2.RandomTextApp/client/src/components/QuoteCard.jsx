import { useEffect, useState } from 'react';

// EC2 를 http://아이피 로 접속하면 보안 컨텍스트가 아니라서 navigator.clipboard 가 없다.
// 그래서 옛날 방식(execCommand)을 폴백으로 남겨둔다.
async function copyText(value) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // 폴백으로 넘어간다
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function QuoteCard({ quote, isLoading, error }) {
  const [copyState, setCopyState] = useState('idle'); // idle | done | fail

  // 명언이 바뀌면 복사 피드백을 초기화한다
  useEffect(() => {
    setCopyState('idle');
  }, [quote]);

  useEffect(() => {
    if (copyState === 'idle') return undefined;
    const timer = setTimeout(() => setCopyState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    const ok = await copyText(`"${quote.text}" — ${quote.username}`);
    setCopyState(ok ? 'done' : 'fail');
  };

  return (
    <section className="card" aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <div className="skeleton">
          <div className="skeleton__line" />
          <div className="skeleton__line" />
          <div className="skeleton__line" />
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert--error">
          <span className="alert__dot" />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && !quote && (
        <p className="empty">아직 저장된 명언이 없거나 서버와 연결되지 않았습니다.</p>
      )}

      {!isLoading && !error && quote && (
        <figure className="quote">
          <blockquote className="quote__text">{quote.text}</blockquote>
          <figcaption className="quote__by">
            <cite className="quote__cite">{quote.username}</cite>
          </figcaption>

          <div className="quote__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleCopy}>
              {copyState === 'done' && '복사됨'}
              {copyState === 'fail' && '복사 실패'}
              {copyState === 'idle' && '명언 복사'}
            </button>
            {copyState === 'fail' && (
              <span className="hint">브라우저가 복사를 막았습니다. 직접 선택해 복사해주세요.</span>
            )}
          </div>
        </figure>
      )}
    </section>
  );
}
