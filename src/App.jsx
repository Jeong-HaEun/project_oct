// 최상위 컴포넌트: 처음 열릴 때 전체 데이터를 한 번 불러온다 (PRD ADR-2).
import { useEffect, useState } from 'react'
import { fetchReports } from './api/reports.js'
import { ErrorState } from './components/ErrorState.jsx'
import { LoadingState } from './components/LoadingState.jsx'
import { SummaryPage } from './pages/SummaryPage.jsx'
import { buildTemplateCsv, TEMPLATE_FILE_NAME } from './utils/csv.js'
import { downloadText } from './utils/download.js'

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

  // 업로드용 빈 양식 (머리글은 데이터가 없거나 오류여도 항상 보인다)
  function handleTemplateDownload() {
    downloadText(TEMPLATE_FILE_NAME, buildTemplateCsv())
  }

  function handleRetry() {
    setErrorMessage(null)
    setRows(null)
    loadReports()
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3.5 py-3 md:px-6">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Adporter
            </h1>
            <p className="text-xs text-muted">광고 성과 보고서</p>
          </div>
          <button
            type="button"
            onClick={handleTemplateDownload}
            className="h-11 whitespace-nowrap rounded border border-hairline bg-surface px-4 text-sm font-semibold text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong active:bg-primary-tint"
          >
            양식 내려받기
          </button>
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
