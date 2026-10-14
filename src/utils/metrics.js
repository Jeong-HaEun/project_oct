// 지표 계산 함수 모음. 계산할 수 없으면 null 을 돌려준다 ('-' 표시는 format.js).
import {
  countDays,
  filterByDateRange,
  getMonthToDateRanges,
  getRangeLength,
  getWeekRanges,
} from './dates.js'
import { filterByMedia, MEDIA_LIST } from './media.js'

const NUMBER_FIELDS = [
  'cost',
  'impressions',
  'clicks',
  'carts',
  'conversions',
  'revenue',
]

// 카드 순서와 "어느 쪽이 좋은지" (none = 판단하지 않음)
const CARDS = [
  { key: 'cost', title: '총 광고비', goodWhen: 'none' },
  { key: 'revenue', title: '총 매출', goodWhen: 'up' },
  { key: 'roas', title: '전체 ROAS', goodWhen: 'up' },
  { key: 'cpa', title: '전체 CPA', goodWhen: 'down' },
]

export function sumTotals(rows) {
  const totals = Object.fromEntries(NUMBER_FIELDS.map((field) => [field, 0]))
  for (const row of rows) {
    for (const field of NUMBER_FIELDS) totals[field] += row[field]
  }
  return totals
}

// 퍼센트 숫자로 돌려준다 (3.5 가 아니라 350)
export function calcRoas(revenue, cost) {
  if (cost === 0) return null
  return (revenue / cost) * 100
}

export function calcCpa(cost, conversions) {
  if (conversions === 0) return null
  return cost / conversions
}

export function compareChange(current, previous, goodWhen) {
  if (current === null || previous === null) return null
  if (current === previous) {
    return { direction: 'same', label: '변화 없음', tone: 'neutral' }
  }
  const direction = current > previous ? 'up' : 'down'
  if (goodWhen === 'none') return { direction, label: '변화', tone: 'neutral' }
  const isGood = direction === goodWhen
  return {
    direction,
    label: isGood ? '개선' : '악화',
    tone: isGood ? 'good' : 'bad',
  }
}

// 합계끼리 나눈다 (행별 지표의 평균 아님)
function cardValues(rows, range) {
  const totals = sumTotals(filterByDateRange(rows, range.start, range.end))
  return {
    cost: totals.cost,
    revenue: totals.revenue,
    roas: calcRoas(totals.revenue, totals.cost),
    cpa: calcCpa(totals.cost, totals.conversions),
  }
}

// 전주는 7일이 모두 있을 때만 비교한다
export function summarizeCards(rows, latestDate) {
  const { current, previous } = getWeekRanges(latestDate)
  const now = cardValues(rows, current)
  const hasFullPrevious = countDays(rows, previous.start, previous.end) === 7
  const before = hasFullPrevious ? cardValues(rows, previous) : null

  return CARDS.map(({ key, title, goodWhen }) => {
    const previousValue = before ? before[key] : null
    return {
      key,
      title,
      current: now[key],
      previous: previousValue,
      change: compareChange(now[key], previousValue, goodWhen),
    }
  })
}

// ---- 퍼널 (이슈 #3) ----

// 뒤 단계 ÷ 앞 단계 × 100. 앞 단계가 0 이면 null
// × 100 을 먼저 해서 소수 오차를 줄인다
export function calcRate(numerator, denominator) {
  if (denominator === 0) return null
  return (numerator * 100) / denominator
}

const FUNNEL_STAGES = [
  { key: 'impressions', label: '노출' },
  { key: 'clicks', label: '클릭' },
  { key: 'carts', label: '장바구니' },
  { key: 'conversions', label: '구매' },
]

// 비율 = 뒤 단계(to) ÷ 앞 단계(from) (metrics.md 퍼널 지표). 비교 표 열 순서·이름으로도 쓴다
export const FUNNEL_RATES = [
  { key: 'ctr', label: 'CTR', from: 'impressions', to: 'clicks' },
  { key: 'cartRate', label: '담기율', from: 'clicks', to: 'carts' },
  {
    key: 'purchaseRate',
    label: '장바구니→구매율',
    from: 'carts',
    to: 'conversions',
  },
]

// 최근 7일 합계
function sumCurrentWeek(rows, latestDate) {
  const { current } = getWeekRanges(latestDate)
  return sumTotals(filterByDateRange(rows, current.start, current.end))
}

// 최근 7일 단계 흐름 { stages, rates }. 매체 필터를 거친 줄을 받는다
export function summarizeFunnel(rows, latestDate) {
  const totals = sumCurrentWeek(rows, latestDate)
  return {
    stages: FUNNEL_STAGES.map(({ key, label }) => ({
      key,
      label,
      count: totals[key],
    })),
    rates: FUNNEL_RATES.map(({ key, label, from, to }) => ({
      key,
      label,
      value: calcRate(totals[to], totals[from]),
    })),
  }
}

// 값이 가장 낮은 매체들. 비교할 값이 2개 미만이거나 모두 같으면 [] (issue-3 결정 2~4)
function findLowest(byMedia, rateKey) {
  const compared = byMedia.filter((item) => item.rates[rateKey] !== null)
  if (compared.length < 2) return []
  const min = Math.min(...compared.map((item) => item.rates[rateKey]))
  const lowest = compared.filter((item) => item.rates[rateKey] === min)
  if (lowest.length === compared.length) return []
  return lowest.map((item) => item.media)
}

// 3개 매체 단계 비율과 단계별 최저 { byMedia, lowest }. 필터와 무관하게 전체 줄을 받는다
export function compareFunnelByMedia(rows, latestDate) {
  const byMedia = MEDIA_LIST.map((media) => {
    const { rates } = summarizeFunnel(filterByMedia(rows, media), latestDate)
    return {
      media,
      rates: Object.fromEntries(rates.map(({ key, value }) => [key, value])),
    }
  })
  const lowest = Object.fromEntries(
    FUNNEL_RATES.map(({ key }) => [key, findLowest(byMedia, key)]),
  )
  return { byMedia, lowest }
}

// ---- WoW 막대 (이슈 #20) ----

// 카드 하나 → 막대 2개 [지난주, 이번 주]. 지난주가 없으면 null (비교 불가)
export function buildWowBars(card) {
  return buildPeriodBars(card, '지난주', '이번 주')
}

// ---- MoM 막대 (이슈 #13) ----

// ROAS 는 차이(%p), 나머지는 증감률(%). 부호 있는 값, 반올림 안 함
export function calcMomDelta(key, current, previous) {
  if (current === null || previous === null) return null
  if (key === 'roas') return { value: current - previous, unit: '%p' }
  if (previous === 0) return null
  return { value: ((current - previous) * 100) / previous, unit: '%' }
}

// 이번 달 1일~기준일 vs 지난달 같은 기간, 카드처럼 4지표
// 지난달 같은 기간에 빠진 날이 있으면 비교하지 않는다 (issue-13-tests.md 결정 2)
export function summarizeMom(rows, latestDate) {
  const { current, previous } = getMonthToDateRanges(latestDate)
  const now = cardValues(rows, current)
  const hasFullPrevious =
    countDays(rows, previous.start, previous.end) === getRangeLength(previous)
  const before = hasFullPrevious ? cardValues(rows, previous) : null

  return CARDS.map(({ key, title, goodWhen }) => {
    const previousValue = before ? before[key] : null
    return {
      key,
      title,
      current: now[key],
      previous: previousValue,
      change: compareChange(now[key], previousValue, goodWhen),
      delta: calcMomDelta(key, now[key], previousValue),
    }
  })
}

// WoW · MoM 공통 막대 2개 [지난 기간, 이번 기간]. 지난 값이 없으면 null
export function buildPeriodBars(item, previousLabel, currentLabel) {
  if (item.previous === null) return null
  return [
    { key: 'previous', label: previousLabel, value: item.previous },
    { key: 'current', label: currentLabel, value: item.current },
  ]
}

// ---- 매체별 BEST 소재 5 (이슈 #22) ----

// 순위 조건 (metrics.md 인사이트 규칙: 작은 표본의 우연 배제)
const BEST_MIN_COST = 100000
const BEST_MIN_CONVERSIONS = 1
const BEST_LIMIT = 5

// 최근 7일을 소재별로 합친 뒤, 광고비 10만 원 이상 + 구매 1건 이상만 ROAS 높은 순 5개
export function rankBestCreatives(rows, latestDate) {
  if (latestDate === null) return []
  const { current } = getWeekRanges(latestDate)

  // 캠페인 + 광고그룹 + 소재 이름이 모두 같아야 같은 소재 (결정 1)
  const groups = new Map()
  for (const row of filterByDateRange(rows, current.start, current.end)) {
    const key = [row.campaignName, row.adGroupName, row.creativeName].join(
      '\u0000',
    )
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }

  // 합계끼리 나눈 뒤, 합계로 조건을 본다 (날짜별 ROAS 의 평균 아님)
  const creatives = []
  for (const group of groups.values()) {
    const totals = sumTotals(group)
    if (totals.cost < BEST_MIN_COST) continue
    if (totals.conversions < BEST_MIN_CONVERSIONS) continue
    const { campaignName, adGroupName, creativeName } = group[0]
    creatives.push({
      campaignName,
      adGroupName,
      creativeName,
      cost: totals.cost,
      revenue: totals.revenue,
      roas: calcRoas(totals.revenue, totals.cost),
      cpa: calcCpa(totals.cost, totals.conversions),
    })
  }

  // ROAS 같으면 매출 큰 쪽 먼저 (결정 2)
  return creatives
    .sort((a, b) => b.roas - a.roas || b.revenue - a.revenue)
    .slice(0, BEST_LIMIT)
}
