/**
 * 차트 팔레트.
 *
 * 카테고리 색은 슬롯 순서대로 고정 배정한다(순환 금지). 라이트/다크는 같은 색상의
 * 서로 다른 단계이며, 차트를 감싼 카드 표면색 기준으로 검증된 값이다.
 * 텍스트(축·레이블·범례)는 시리즈 색이 아니라 잉크 토큰을 쓴다.
 */
const palette = {
  light: {
    series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
    surface: '#FFFFFF', // 차트를 담은 카드 배경 — 마크 사이 간격과 링에 쓴다
    card: '#FFFFFF', // 툴팁처럼 떠 있는 면
    grid: '#E7E9EF',
    axis: '#6B7280',
  },
  dark: {
    series: ['#3987e5', '#d95926', '#199e70', '#c98500'],
    surface: '#14161C',
    card: '#1C1F27',
    grid: '#24272F',
    axis: '#8B93A5',
  },
};

export function chartTheme(darkMode) {
  return darkMode ? palette.dark : palette.light;
}
