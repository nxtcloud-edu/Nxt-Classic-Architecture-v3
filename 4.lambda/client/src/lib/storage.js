// 테마 선택은 이 브라우저에만 남는다. 프레젠테이션 티어의 저장소이며
// 데이터 티어(RDS)와는 무관하다. 시크릿 모드에서는 예외가 나므로 전부 try/catch 로 감싼다.

// 3.AiNoteApp 도 개발 서버가 localhost:3000 이라 같은 origin 을 쓴다.
// 키가 겹치면 두 앱의 테마가 서로 덮이므로 앱마다 다른 이름을 쓴다.
const THEME_KEY = 'lambdaNote.theme';

export function loadTheme() {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'light' || theme === 'dark' ? theme : 'system';
  } catch {
    return 'system';
  }
}

export function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // 저장 실패해도 화면 동작은 막지 않는다
  }
}
