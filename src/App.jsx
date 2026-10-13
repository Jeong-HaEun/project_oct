// 최상위 컴포넌트: 처음 열릴 때 전체 데이터를 한 번 불러온다 (PRD ADR-2).
import { useEffect, useState } from 'react'
import { fetchReports } from './api/reports.js'
import { ErrorState } from './components/ErrorState.jsx'
import { LoadingState } from './components/LoadingState.jsx'
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
