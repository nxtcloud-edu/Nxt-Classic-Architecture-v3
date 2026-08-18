import { useCallback, useEffect, useState } from 'react';
import { LAMBDA_URL } from '../config.js';

const isConfigured = LAMBDA_URL.trim().length > 0;

async function getJson(path, options) {
  const response = await fetch(`${LAMBDA_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`${path} 요청 실패 (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * 방문자수·좋아요 카운터.
 * LAMBDA_URL이 비어 있으면 네트워크 요청을 아예 보내지 않는다.
 */
export function useCounters() {
  const [visitCount, setVisitCount] = useState(null);
  const [likeCount, setLikeCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured) return undefined;

    let cancelled = false;
    const apply = (setter) => (data) => {
      if (!cancelled) setter(data);
    };
    const fail = (err) => {
      if (!cancelled) setError(err.message);
    };

    getJson('/visit').then(apply((data) => setVisitCount(data.visits ?? 0))).catch(fail);
    getJson('/likes').then(apply((data) => setLikeCount(data.likes ?? 0))).catch(fail);

    return () => {
      cancelled = true;
    };
  }, []);

  const like = useCallback(() => {
    if (!isConfigured) return;
    setError(null);
    getJson('/like', { method: 'POST' })
      .then((data) => setLikeCount(data.likes ?? 0))
      .catch((err) => setError(err.message));
  }, []);

  return { visitCount, likeCount, like, isConfigured, error };
}
