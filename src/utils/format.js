// 화면 표시용 함수 모음. null 이면 '-' 를 돌려준다.

export function formatWon(value) {
  if (value === null) return '-'
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

export function formatPercent(value) {
  if (value === null) return '-'
  return `${Math.round(value)}%`
}
