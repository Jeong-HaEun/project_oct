// 화면 표시용 함수 모음. null 이면 '-' 를 돌려준다.

export function formatWon(value) {
  if (value === null) return '-'
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

export function formatPercent(value) {
  if (value === null) return '-'
  return `${Math.round(value)}%`
}

// 단계 비율 (소수 둘째 자리)
export function formatRate(value) {
  if (value === null) return '-'
  return `${value.toFixed(2)}%`
}

// 단계 숫자 (쉼표, 단위 없음)
export function formatCount(value) {
  return value.toLocaleString('ko-KR')
}
