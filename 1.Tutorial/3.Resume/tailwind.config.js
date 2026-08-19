/** @type {import('tailwindcss').Config} */
export default {
  // 다크 모드는 <html>의 .dark 클래스로 켠다 (App의 darkMode state가 붙인다)
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 한국어 본문까지 커버하는 산세리프 한 벌로 통일한다
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      // 시맨틱 토큰. 실제 값은 index.css의 :root / .dark 에서 정의한다.
      colors: {
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        sunk: 'var(--color-sunk)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        line: 'var(--color-line)',
        accent: 'var(--color-accent)',
        'accent-ink': 'var(--color-accent-ink)',
        'accent-soft': 'var(--color-accent-soft)',
        glass: 'var(--color-glass)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
