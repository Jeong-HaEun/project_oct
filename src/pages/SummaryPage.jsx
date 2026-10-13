// 요약 페이지 (/). 계산은 utils 함수를 부르기만 한다.
// 매체 필터 값은 주소(?media=)가 보관한다 (PRD ADR-3).
import { useSearchParams } from 'react-router'
import { DataDateBar } from '../components/DataDateBar.jsx'
import { FunnelCompare } from '../components/FunnelCompare.jsx'
import { FunnelFlow } from '../components/FunnelFlow.jsx'
import { MediaFilter } from '../components/MediaFilter.jsx'
import { CARD_GRID, SummaryCard } from '../components/SummaryCard.jsx'
import {
  getLatestDate,
  getTodayKst,
  getUploadDelayDays,
} from '../utils/dates.js'
import { filterByMedia, parseMedia } from '../utils/media.js'
import {
  compareFunnelByMedia,
  summarizeCards,
  summarizeFunnel,
} from '../utils/metrics.js'

export function SummaryPage({ rows }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const media = parseMedia(searchParams.get('media'))

  // 전체를 고르면 주소에서 media 를 뺀다
  function handleMediaChange(nextMedia) {
    setSearchParams(nextMedia === null ? {} : { media: nextMedia })
  }

  // 기준일은 전체 데이터 기준 (issue-2-tests.md 결정 A)
  const latestDate = getLatestDate(rows)

  // 임시: 빈 데이터 화면(버튼 포함)은 "빈 데이터 화면" 이슈(#11)에서 만든다
  if (latestDate === null) {
    return <p className="mt-6 text-sm text-ink md:mt-8">아직 데이터가 없어요</p>
  }

  // 카드 · 단계 흐름은 필터를 따르고, 매체별 비교는 전체 줄을 쓴다 (spec 결정 6)
  const mediaRows = filterByMedia(rows, media)
  const cards = summarizeCards(mediaRows, latestDate)
  const funnel = summarizeFunnel(mediaRows, latestDate)
  const comparison = compareFunnelByMedia(rows, latestDate)
  const delayDays = getUploadDelayDays(latestDate, getTodayKst())

  return (
    <>
      <MediaFilter media={media} onChange={handleMediaChange} />
      <DataDateBar latestDate={latestDate} delayDays={delayDays} />
      <section aria-label="최근 7일 합계" className={`mt-3 ${CARD_GRID}`}>
        {cards.map((card) => (
          <SummaryCard key={card.key} card={card} />
        ))}
      </section>
      <section aria-labelledby="funnel-title" className="mt-6 md:mt-8">
        <h2 id="funnel-title" className="font-display text-lg font-bold">
          퍼널 분석
        </h2>
        <div className="mt-3">
          <FunnelFlow funnel={funnel} scopeLabel={media ?? '전체'} />
          <FunnelCompare comparison={comparison} />
        </div>
      </section>
    </>
  )
}
