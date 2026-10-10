// 임시 화면: Tailwind 와 디자인 토큰이 적용되는지 확인용. 요약 페이지를 만들 때 바뀐다.
export function App() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="font-display text-3xl font-extrabold">Adporter</h1>
      <p className="text-sm text-muted">광고 성과 보고서 · 디자인 토큰 확인</p>
      <div className="mt-4 rounded-lg border border-hairline bg-surface p-4">
        <p className="text-sm text-muted">전체 ROAS</p>
        <p className="font-display text-3xl font-extrabold text-primary">
          433%
        </p>
        <p className="mt-1 text-sm">
          <span className="rounded bg-good-tint px-1.5 py-0.5 text-good">
            ▲ 4%p 개선
          </span>{' '}
          <span className="rounded bg-bad-tint px-1.5 py-0.5 text-bad">
            ▲ 3% 악화
          </span>
        </p>
      </div>
    </main>
  )
}
