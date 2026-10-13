/* eslint-disable no-unused-vars -- 스텁: Green 단계에서 지운다 */
// 매체 필터 함수 모음. 매체 값은 대문자, "전체"는 null 이다.

// 필터 버튼 순서
export const MEDIA_LIST = ['NAVER', 'META', 'GOOGLE']

// 주소의 ?media= 값 → 'NAVER'·'META'·'GOOGLE' 또는 null(전체)
export function parseMedia(value) {
  throw new Error('not implemented')
}

export function filterByMedia(rows, media) {
  throw new Error('not implemented')
}
