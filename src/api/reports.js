// 서버 호출은 이 파일에만 둔다. 실패하면 Error 를 던지고, 화면은 .catch 로 메시지를 보여준다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchReports() {
  let response
  try {
    response = await fetch(`${BASE_URL}/api/reports`)
  } catch {
    throw new Error('서버에 연결할 수 없어요. 잠시 뒤 다시 시도해 주세요.')
  }
  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했어요. (오류 ${response.status})`)
  }
  return response.json()
}
