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
