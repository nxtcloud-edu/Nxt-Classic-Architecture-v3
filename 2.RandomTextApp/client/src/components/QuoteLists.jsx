function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function QuoteLists({
  history,
  onPick,
  saved,
  justSavedId,
  onDelete,
  onClearAll,
}) {
  return (
    <>
      {/* 1) 이번 세션에서 본 명언 — 새로고침하면 사라지는 순수 메모리 상태 */}
      <section className="card panel">
        <div className="panel__head">
          <h2 className="panel__title">이번에 본 명언</h2>
          <span className="panel__count">{history.length}개</span>
        </div>
        <p className="panel__note">
          이 목록은 메모리에만 있습니다. 새로고침하면 비워집니다.
        </p>

        {history.length === 0 ? (
          <p className="hint">아직 불러온 명언이 없습니다.</p>
        ) : (
          <ul className="list">
            {history.map((item) => (
              <li className="list__item" key={`${item.text}|${item.username}`}>
                <button type="button" className="list__pick" onClick={() => onPick(item)}>
                  <span className="list__text">{item.text}</span>
                  <span className="list__meta">{item.username}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2) 내가 저장한 명언 — localStorage. 데이터 티어와 구분해서 가르치는 장치다 */}
      <section className="card panel">
        <div className="panel__head">
          <h2 className="panel__title">내가 저장한 명언</h2>
          {saved.length > 0 && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClearAll}>
              전체 지우기
            </button>
          )}
        </div>
        <p className="panel__note panel__note--warn">
          이 브라우저에만 저장된 기록입니다 — 실제 데이터는 데이터베이스에 있습니다.
          여기서 지워도 DB 의 명언은 그대로 남습니다.
        </p>

        {saved.length === 0 ? (
          <p className="hint">아직 저장한 명언이 없습니다.</p>
        ) : (
          <ul className="list">
            {saved.map((item) => (
              <li
                className={`list__item list__item--row${item.id === justSavedId ? ' is-new' : ''}`}
                key={item.id}
              >
                <div className="list__body">
                  <span className="list__text">{item.text}</span>
                  <span className="list__meta">
                    {item.username} · {formatTime(item.savedAt)}
                    {item.id === justSavedId && <em className="badge">방금 저장됨</em>}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onDelete(item.id)}
                  aria-label={`${item.text} 기록 지우기`}
                >
                  지우기
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
