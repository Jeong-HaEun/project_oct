import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rankBestCreatives } from './metrics.js'

const LATEST = '2026-10-07'

// 시나리오 문서의 기본값: 캠페인1 · 그룹1 · 10/07, 나머지 숫자는 0
function row(overrides) {
  return {
    reportDate: LATEST,
    media: 'META',
    campaignName: '캠페인1',
    adGroupName: '그룹1',
    creativeName: 'A',
    cost: 0,
    impressions: 0,
    clicks: 0,
    carts: 0,
    conversions: 0,
    revenue: 0,
    ...overrides,
  }
}

function names(result) {
  return result.map((item) => item.creativeName)
}

test('S1 [정상] ROAS 높은 순 → B, A, C', () => {
  const rows = [
    row({ creativeName: 'A', cost: 100000, revenue: 300000, conversions: 2 }),
    row({ creativeName: 'B', cost: 200000, revenue: 800000, conversions: 2 }),
    row({ creativeName: 'C', cost: 150000, revenue: 300000, conversions: 2 }),
  ]
  assert.deepEqual(names(rankBestCreatives(rows, LATEST)), ['B', 'A', 'C'])
})

test('S2 [정상] 돌려주는 값 모양 → 이름 3개 · 광고비 · 매출 · ROAS · CPA', () => {
  const rows = [
    row({ creativeName: 'B', cost: 200000, revenue: 800000, conversions: 4 }),
  ]
  assert.deepEqual(rankBestCreatives(rows, LATEST), [
    {
      campaignName: '캠페인1',
      adGroupName: '그룹1',
      creativeName: 'B',
      cost: 200000,
      revenue: 800000,
      roas: 400,
      cpa: 50000,
    },
  ])
})

test('S3 [정상] 여러 날 합치기 → 하루 6만 원씩 두 날이면 12만 원으로 들어감', () => {
  const day = { cost: 60000, revenue: 120000, conversions: 1 }
  const rows = [
    row({ ...day, reportDate: '2026-10-02' }),
    row({ ...day, reportDate: '2026-10-05' }),
  ]
  const [best] = rankBestCreatives(rows, LATEST)
  assert.equal(best.cost, 120000)
  assert.equal(best.revenue, 240000)
  assert.equal(best.roas, 200)
  assert.equal(best.cpa, 60000)
})

test('S4 [정상] 합계끼리 나누기 → ROAS 250 (날짜별 평균 200 아님)', () => {
  const rows = [
    row({
      reportDate: '2026-10-01',
      cost: 100000,
      revenue: 100000,
      conversions: 1,
    }),
    row({
      reportDate: '2026-10-02',
      cost: 300000,
      revenue: 900000,
      conversions: 1,
    }),
  ]
  const [best] = rankBestCreatives(rows, LATEST)
  assert.equal(best.roas, 250)
})

test('S5 [정상] 같은 소재 이름, 다른 광고그룹 → 따로 2개', () => {
  const rows = [
    row({
      adGroupName: 'X',
      creativeName: '봄세일',
      cost: 100000,
      revenue: 300000,
      conversions: 1,
    }),
    row({
      adGroupName: 'Y',
      creativeName: '봄세일',
      cost: 100000,
      revenue: 200000,
      conversions: 1,
    }),
  ]
  const result = rankBestCreatives(rows, LATEST)
  assert.deepEqual(
    result.map((item) => [item.adGroupName, item.creativeName, item.roas]),
    [
      ['X', '봄세일', 300],
      ['Y', '봄세일', 200],
    ],
  )
})

test('S6 [경계] 광고비 99,999원 → 빠짐', () => {
  const rows = [row({ cost: 99999, revenue: 300000, conversions: 1 })]
  assert.deepEqual(rankBestCreatives(rows, LATEST), [])
})

test('S7 [경계] 광고비 100,000원 → 들어감', () => {
  const rows = [row({ cost: 100000, revenue: 300000, conversions: 1 })]
  assert.equal(rankBestCreatives(rows, LATEST).length, 1)
})

test('S8 [경계] 광고비 100,001원 → 들어감', () => {
  const rows = [row({ cost: 100001, revenue: 300000, conversions: 1 })]
  assert.equal(rankBestCreatives(rows, LATEST).length, 1)
})

test('S9 [경계] 구매 0 / 1 / 2건 → 0건만 빠짐', () => {
  const base = { cost: 100000, revenue: 300000 }
  const rows = [
    row({ ...base, creativeName: 'Z', conversions: 0 }),
    row({ ...base, creativeName: 'O', conversions: 1 }),
    row({ ...base, creativeName: 'T', conversions: 2 }),
  ]
  assert.deepEqual(names(rankBestCreatives(rows, LATEST)).sort(), ['O', 'T'])
})

test('S10 [경계] 조건 맞는 소재 4 / 5 / 6개 → 4 / 5 / 5개', () => {
  const revenues = [600000, 500000, 400000, 300000, 200000, 150000]
  const all = revenues.map((revenue, index) =>
    row({
      creativeName: `소재${index + 1}`,
      cost: 100000,
      revenue,
      conversions: 1,
    }),
  )
  assert.equal(rankBestCreatives(all.slice(0, 4), LATEST).length, 4)
  assert.equal(rankBestCreatives(all.slice(0, 5), LATEST).length, 5)

  const six = rankBestCreatives(all, LATEST)
  assert.equal(six.length, 5)
  assert.ok(!names(six).includes('소재6'))
})

test('S11 [경계] 7일째(10/01)는 들어가고 8일째(09/30)는 합계에서 빠짐', () => {
  const rows = [
    row({
      reportDate: '2026-10-01',
      cost: 100000,
      revenue: 300000,
      conversions: 1,
    }),
    row({
      reportDate: '2026-09-30',
      cost: 100000,
      revenue: 900000,
      conversions: 1,
    }),
  ]
  const [best] = rankBestCreatives(rows, LATEST)
  assert.equal(best.cost, 100000)
  assert.equal(best.revenue, 300000)
  assert.equal(best.roas, 300)
})

test('S12 [경계] ROAS 동점 → 매출 큰 B 먼저', () => {
  const rows = [
    row({ creativeName: 'A', cost: 100000, revenue: 300000, conversions: 1 }),
    row({ creativeName: 'B', cost: 200000, revenue: 600000, conversions: 1 }),
  ]
  assert.deepEqual(names(rankBestCreatives(rows, LATEST)), ['B', 'A'])
})

test('S13 [예외] 조건 맞는 소재 없음 → []', () => {
  const rows = [
    row({ creativeName: 'A', cost: 50000, revenue: 300000, conversions: 1 }),
    row({ creativeName: 'B', cost: 50000, revenue: 300000, conversions: 1 }),
  ]
  assert.deepEqual(rankBestCreatives(rows, LATEST), [])
})

test('S14 [예외] 데이터 없음 (latestDate null) → [] (오류 없음)', () => {
  assert.deepEqual(rankBestCreatives([], null), [])
})
