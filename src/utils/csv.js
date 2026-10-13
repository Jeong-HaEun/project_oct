// CSV 양식 함수 모음. 제목 줄 이름은 test1007 샘플 CSV 와 같다.

// CSV 제목 ↔ JSON 필드 짝 (api.md 순서, id 제외). 파일에는 '전환', 화면에서만 "구매"
export const CSV_COLUMNS = [
  { header: '날짜', field: 'reportDate' },
  { header: '매체', field: 'media' },
  { header: '캠페인', field: 'campaignName' },
  { header: '광고그룹', field: 'adGroupName' },
  { header: '소재', field: 'creativeName' },
  { header: '광고비', field: 'cost' },
  { header: '노출', field: 'impressions' },
  { header: '클릭', field: 'clicks' },
  { header: '장바구니', field: 'carts' },
  { header: '전환', field: 'conversions' },
  { header: '매출', field: 'revenue' },
]

export const TEMPLATE_FILE_NAME = 'adporter_양식.csv'

// 엑셀이 UTF-8 한글로 읽게 하는 표시, CSV 표준 줄바꿈
const BOM = '﻿'
const LINE_BREAK = '\r\n'

// BOM + 제목 줄 1줄 (예시 줄 없음)
export function buildTemplateCsv() {
  const header = CSV_COLUMNS.map((column) => column.header).join(',')
  return `${BOM}${header}${LINE_BREAK}`
}

// ---- CSV 업로드 (이슈 #10) ----

// UTF-8 로 읽어 보고, 깨지면 EUC-KR(엑셀 기본)로 다시 읽는다
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function decodeCsv(buffer) {
  throw new Error('not implemented')
}

// '2026/10/1' · '2026. 10. 1.' → '2026-10-01'. 없는 날짜는 null
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function normalizeDate(value) {
  throw new Error('not implemented')
}

// '100,000' → 100000. 0 이상 정수가 아니면 null
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function normalizeNumber(value) {
  throw new Error('not implemented')
}

// CSV 글자 → { rows, errors }. errors 가 하나라도 있으면 서버로 보내지 않는다
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function parseReportCsv(text) {
  throw new Error('not implemented')
}

// { created, updated } → '새로 3줄 · 바뀐 2줄'
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function formatUploadResult(result) {
  throw new Error('not implemented')
}
