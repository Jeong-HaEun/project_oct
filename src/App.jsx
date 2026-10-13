// 최상위 컴포넌트: 처음 열릴 때 전체 데이터를 한 번 불러온다 (PRD ADR-2).
import { useEffect, useState } from 'react'
import { fetchReports } from './api/reports.js'
import { SummaryPage } from './pages/SummaryPage.jsx'

export function App() {
  const [rows, setRows] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  function loadReports() {
    fetchReports()
      .then(setRows)
      .catch((error) => setErrorMessage(error.message))
  }

  useEffect(() => {
    loadReports()
  }, [])

  function handleRetry() {
    setErrorMessage(null)
    setRows(null)
    loadReports()
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-3.5 py-3 md:px-6">
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            Adporter
          </h1>
          <p className="text-xs text-muted">광고 성과 보고서</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3.5 pb-12 md:px-6">
        {errorMessage !== null ? (
          <ErrorState message={errorMessage} onRetry={handleRetry} />
        ) : rows === null ? (
          <LoadingState />
        ) : (
          <SummaryPage rows={rows} />
        )}
      </main>
    </>
  )
}

// 불러오는 중 (design.md 6절): 카드 자리에 회색 막대 + 안내 문구
function LoadingState() {
  return (
    <div className="mt-6 md:mt-8">
      <p role="status" className="text-sm text-muted">
        서버를 깨우는 중이에요. 최대 1분 걸릴 수 있어요
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded bg-hairline" />
        ))}
      </div>
    </div>
  )
}

// 서버 오류 (design.md 6절): 카드 + 빨간 테두리 + [다시 시도] 주요 버튼(5-3)
function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-lg border border-bad bg-surface p-4 md:mt-8 md:p-5"
    >
      <p className="text-sm text-bad">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 h-11 rounded bg-primary-strong px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
      >
        다시 시도
      </button>
    </div>
  )
}
