// 요약 페이지 (/). 계산은 utils 함수를 부르기만 한다.
// 매체 필터 값은 주소(?media=)가 보관한다 (PRD ADR-3).
import { useSearchParams } from 'react-router'
import { DataDateBar } from '../components/DataDateBar.jsx'
import { FunnelCompare } from '../components/FunnelCompare.jsx'
import { FunnelFlow } from '../components/FunnelFlow.jsx'
import { MediaFilter } from '../components/MediaFilter.jsx'
import { PeriodBars } from '../components/PeriodBars.jsx'
import { CARD_GRID, SummaryCard } from '../components/SummaryCard.jsx'
import {
  formatMonthRange,
  getDownloadRange,
  getLatestDate,
  getMonthToDateRanges,
  getTodayKst,
  getUploadDelayDays,
} from '../utils/dates.js'
import {
  buildDownloadFileName,
  buildReportsCsv,
  selectDownloadRows,
} from '../utils/csv.js'
import { downloadText } from '../utils/download.js'
import { filterByMedia, parseMedia } from '../utils/media.js'
import {
  compareFunnelByMedia,
  summarizeCards,
  summarizeFunnel,
  summarizeMom,
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
  const momItems = summarizeMom(mediaRows, latestDate)
  const momRanges = getMonthToDateRanges(latestDate)
  const delayDays = getUploadDelayDays(latestDate, getTodayKst())
  const downloadRows = selectDownloadRows(rows, media, latestDate)
  const scopeLabel = media ?? '전체'

  // 보고 있는 매체의 최근 98일 원본 줄 (spec 결정 7)
  function handleDownload() {
    const fileName = buildDownloadFileName(media, getDownloadRange(latestDate))
    downloadText(fileName, buildReportsCsv(downloadRows))
  }

  return (
    <>
      <MediaFilter media={media} onChange={handleMediaChange} />
      <DataDateBar
        latestDate={latestDate}
        delayDays={delayDays}
        action={
          downloadRows.length > 0 && (
            <button
              type="button"
              onClick={handleDownload}
              className="h-11 whitespace-nowrap rounded border border-hairline bg-surface px-4 text-sm font-semibold text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong active:bg-primary-tint"
            >
              {scopeLabel} · 최근 98일 내려받기
            </button>
          )
        }
      />
      <section aria-label="최근 7일 합계" className={`mt-3 ${CARD_GRID}`}>
        {cards.map((card) => (
          <SummaryCard key={card.key} card={card} />
        ))}
      </section>
      <section aria-labelledby="wow-title" className="mt-6 md:mt-8">
        <h2 id="wow-title" className="font-display text-lg font-bold">
          전주 대비 (WoW)
        </h2>
        <p className="mt-1 text-xs text-muted">
          {media ?? '전체'} · 최근 7일 vs 그 전 7일
        </p>
        <PeriodBars
          items={cards}
          previousLabel="지난주"
          currentLabel="이번 주"
          emptyMessage="비교할 지난주 데이터 없음"
        />
      </section>
      <section aria-labelledby="mom-title" className="mt-6 md:mt-8">
        <h2 id="mom-title" className="font-display text-lg font-bold">
          전월 대비 (MoM)
        </h2>
        <p className="mt-1 text-xs text-muted">
          {media ?? '전체'} · 이번 달과 지난달의 같은 기간
        </p>
        <PeriodBars
          items={momItems}
          previousLabel={formatMonthRange(momRanges.previous)}
          currentLabel={formatMonthRange(momRanges.current)}
          emptyMessage="비교할 지난달 데이터 없음"
        />
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
