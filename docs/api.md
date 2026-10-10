# API 규칙 (자세히)

백엔드 `/api/reports` 와 주고받는 규칙. 서버 호출 코드는 `src/api/reports.js` 에만 둔다.

## 서버 주소

- 환경변수 `VITE_API_BASE_URL` (예: 로컬 `http://localhost:8080`). 코드에 주소를 직접 쓰지 않는다.
- 백엔드 CORS 는 `http://localhost:5173` 을 기본 허용한다.

## 엔드포인트

| 메서드 | 경로                | 성공                       | 실패                                     |
| ------ | ------------------- | -------------------------- | ---------------------------------------- |
| GET    | `/api/reports`      | 200, 최신 날짜순 목록      |                                          |
| POST   | `/api/reports`      | 201 + 저장된 행            | 400 검증 실패, 409 중복                  |
| POST   | `/api/reports/bulk` | 200 + `{created, updated}` | 400 (한 줄이라도 틀리면 전부 저장 안 함) |
| PUT    | `/api/reports/{id}` | 200 + 수정된 행            | 400, 404, 409 중복                       |
| DELETE | `/api/reports/{id}` | 204                        | 404                                      |

- 중복 기준: **날짜 + 매체 + 캠페인 + 광고그룹 + 소재**.
  - `/bulk`(CSV 업로드)는 같은 줄을 덮어쓴다 (매일 누적 업로드용).
  - 한 줄 추가·수정(POST/PUT)은 중복이면 409 로 거부한다.

## JSON 형식 (필드 이름은 camelCase)

```json
{
  "id": 1,
  "reportDate": "2026-10-01",
  "media": "NAVER",
  "campaignName": "가을 세일",
  "adGroupName": "검색_브랜드",
  "creativeName": "소재A",
  "cost": 100000,
  "impressions": 25000,
  "clicks": 600,
  "carts": 80,
  "conversions": 20,
  "revenue": 350000
}
```

- `media`: `NAVER` / `META` / `GOOGLE` 중 하나.
- 이름 필드(캠페인·광고그룹·소재): 필수, 100자 이하.
- 숫자 필드: 0 이상의 정수. 음수는 400.
- 날짜: `"YYYY-MM-DD"` 문자열.
- `id` 는 서버가 만든다 (POST 때 보내지 않음).
