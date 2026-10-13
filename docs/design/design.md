# 디자인 규칙 (Adporter)

화면을 만들거나 고칠 때 **이 문서 하나만 기준**으로 삼는다. 색·간격은 아래에 적힌 Tailwind 클래스만 쓴다.

- 출처: Stitch 프로젝트 "Tomato Naver Portal" (ID `336980486658861133`)의 디자인 규칙을 대시보드에 맞게 옮김
- 바꾼 점: 전주 대비 색은 spec 결정을 따름 (주식식 빨강/파랑 → **개선 초록 / 악화 빨강**), 한글 글꼴 Pretendard 추가
- 토큰 정의 위치: `src/index.css` 의 `@theme` (새 색이 필요하면 **여기에 먼저 추가**하고 이 문서 표도 고친다)

## 1. 원칙

1. **숫자가 주인공.** 장식보다 숫자가 먼저 보여야 한다 (10초 판단, spec 목표).
2. **단색 바탕 + 흰 카드 + 1px 선.** 그림자·흐림으로 층을 나누지 않는다. 유리 효과는 고정 머리글 한 곳만.
3. **색은 뜻이 있을 때만.** 토마토 = 행동·선택, 초록 = 개선, 빨강(bad) = 악화·오류, 나머지는 먹색·회색.
4. **모바일 먼저.** 기본 클래스는 휴대폰, `md:` (768px 이상)부터 데스크톱.

## 2. 색

| 클래스 이름          | 값                    | 쓰는 곳                                                                       | 쓰지 않는 곳                                     |
| -------------------- | --------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| `primary`            | `#E23E28`             | 그래프 선, 카드의 ROAS·CPA **큰 숫자**(24px 이상)                             | 24px 미만 글자, 흰 글자를 올리는 배경, 악화·오류 |
| `primary-strong`     | `#C52E1A`             | 주요 버튼 배경, 선택된 필터 글자, "최저" 배지 배경 등 **작은 글자와 닿는 곳** |                                                  |
| `primary-hover`      | `#A82312`             | 주요 버튼 마우스 올림                                                         |                                                  |
| `primary-tint`       | `#FAECEB`             | 선택된 필터 알약 배경, 눌림                                                   |                                                  |
| `ink`                | `#1B1D1F`             | 제목, 큰 숫자, 표 본문                                                        |                                                  |
| `muted`              | `#6C727A`             | 보조 글, 날짜, 표 머리글, 단위                                                | 12px 미만 글자                                   |
| `canvas`             | `#F6F7F9`             | 페이지 바탕, 표 머리글 줄, 마우스 올림 바탕                                   | 카드 바탕                                        |
| `surface`            | `#FFFFFF`             | 카드, 버튼(보조), 입력칸                                                      |                                                  |
| `hairline`           | `#EAECEF`             | 1px 테두리, 표 줄 구분선, 그래프 격자                                         | 글자                                             |
| `good` / `good-tint` | `#167A3B` / `#E8F5EC` | 전주 대비 **개선**                                                            |                                                  |
| `bad` / `bad-tint`   | `#B42318` / `#FDECEA` | 전주 대비 **악화**, 오류, 업로드 지연 경고                                    | 브랜드 강조                                      |

- 흰 글자는 `text-white` (진한 토마토 버튼·배지 위에서만). `transparent`, `current` 도 허용.
- **글자 대비 4.5:1 이상** (24px 이상 굵은 글자는 3:1). 계산해서 확인한 조합:

  | 글자 / 바탕                          | 대비        |
  | ------------------------------------ | ----------- |
  | `muted` / `surface` · `canvas`       | 4.85 · 4.53 |
  | `good` / `good-tint`                 | 4.82        |
  | `bad` / `bad-tint`                   | 5.75        |
  | `white` / `primary-strong`           | 5.56        |
  | `primary-strong` / `primary-tint`    | 4.83        |
  | `primary` / `surface` (큰 숫자 전용) | 4.24        |
  - `muted` 는 `surface`·`canvas` 위에서만 쓴다 (더 진한 바탕 위에선 기준 미달).

- 그래프(Recharts) 처럼 클래스를 못 쓰는 곳은 `var(--color-primary)` 처럼 **CSS 변수**로 쓴다.

## 3. 글꼴과 글자 크기

| 이름                          | 글꼴                                            | 클래스                       |
| ----------------------------- | ----------------------------------------------- | ---------------------------- |
| 기본 (`font-sans`)            | 영문 DM Sans → 한글 Pretendard                  | body 기본값이라 따로 안 붙임 |
| 제목·큰 숫자 (`font-display`) | 영문·숫자 Bricolage Grotesque → 한글 Pretendard | `font-display`               |

| 용도                       | 클래스                                                            |
| -------------------------- | ----------------------------------------------------------------- |
| 페이지 제목 (Adporter)     | `font-display text-2xl md:text-3xl font-extrabold tracking-tight` |
| 구역 제목 (퍼널 분석 등)   | `font-display text-lg font-bold`                                  |
| 카드 큰 숫자               | `font-display text-xl md:text-3xl font-extrabold tabular-nums`    |
| 카드 이름 (총 광고비 등)   | `text-sm font-semibold text-muted`                                |
| 본문 · 표 숫자             | `text-sm`                                                         |
| 보조 글 (기간, 설명, 단위) | `text-xs text-muted`                                              |

- **숫자에는 항상 `tabular-nums`** (자리마다 폭이 같아 표·카드 숫자가 줄 맞춰진다).
- 12px(`text-xs`)보다 작은 글자는 쓰지 않는다.

## 4. 간격 · 모서리 · 층

| 항목                    | 클래스              |
| ----------------------- | ------------------- |
| 페이지 좌우 여백        | `px-3.5 md:px-6`    |
| 페이지 최대 너비        | `mx-auto max-w-6xl` |
| 구역 사이               | `mt-6 md:mt-8`      |
| 카드끼리 간격           | `gap-3 md:gap-4`    |
| 카드 안쪽 여백          | `p-4 md:p-5`        |
| 작은 배지·이미지 모서리 | `rounded` (4px)     |
| 카드·표 상자 모서리     | `rounded-lg` (8px)  |
| 필터 알약               | `rounded-full`      |

- 간격은 Tailwind 기본 눈금(4px 단위)만 쓴다.
- 층: 바탕 `bg-canvas` → 카드 `bg-surface border border-hairline` → 고정 머리글(유리). **카드에 `shadow-*` 를 쓰지 않는다.**

## 5. 부품

### 5-1. 고정 머리글 (유일한 유리 효과)

```
sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur-sm
```

- 왼쪽: 페이지 제목 + 보조 글 / 오른쪽: [양식 내려받기] [CSV 업로드]

### 5-2. 카드 (합계 카드, 퍼널, 그래프 상자 공통)

```
rounded-lg border border-hairline bg-surface p-4 md:p-5
```

- 합계 카드만 예외: 모바일에서 2×2 로 좁아서 `p-3 md:p-5` (360px 에서 9자리 금액이 카드 안에 들어가게).

### 5-3. 버튼

| 상태        | 주요 버튼 (CSV 업로드, 다시 시도)                                                             | 보조 버튼 (양식 내려받기)                                                            |
| ----------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 기본        | `h-11 rounded px-4 bg-primary-strong text-sm font-semibold text-white`                        | `h-11 rounded px-4 border border-hairline bg-surface text-sm font-semibold text-ink` |
| 마우스 올림 | `hover:bg-primary-hover`                                                                      | `hover:bg-canvas`                                                                    |
| 눌림        | `active:translate-y-px`                                                                       | `active:bg-primary-tint`                                                             |
| 키보드 선택 | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong` | 같음                                                                                 |
| 비활성      | `disabled:cursor-not-allowed disabled:opacity-40`                                             | 같음                                                                                 |
| 처리 중     | 글자를 "올리는 중…" 으로 바꾸고 `disabled`                                                    |                                                                                      |

- 높이 44px(`h-11`) = 손가락으로 누르기 좋은 최소 크기.

### 5-4. 매체 필터 알약 (전체 / NAVER / META / GOOGLE)

| 상태                | 클래스                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 기본                | `h-9 rounded-full border border-hairline bg-surface px-3 md:px-4 text-sm text-muted`                                        |
| 마우스 올림         | `hover:bg-canvas hover:text-ink`                                                                                            |
| 선택됨              | `aria-pressed:border-primary-tint aria-pressed:bg-primary-tint aria-pressed:font-semibold aria-pressed:text-primary-strong` |
| 키보드 선택         | 버튼과 같은 `focus-visible:` 클래스                                                                                         |
| 비활성 (데이터 0건) | `disabled:cursor-not-allowed disabled:opacity-40`                                                                           |

- 선택 여부는 `aria-pressed="true"` 로 표시한다 (화면 읽기 프로그램도 알 수 있게).
- 모바일에서도 한 줄 유지: 감싸는 상자에 `flex gap-2`, 알약은 `px-3`.

### 5-5. 전주 대비 배지 (spec 결정 2)

공통: `inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums`

| 뜻            | 추가 클래스              | 예                                     |
| ------------- | ------------------------ | -------------------------------------- |
| 개선          | `bg-good-tint text-good` | `▲ 4%p 개선` (ROAS), `▼ 3% 개선` (CPA) |
| 악화          | `bg-bad-tint text-bad`   | `▼ 4%p 악화` (ROAS), `▲ 3% 악화` (CPA) |
| 변화 (광고비) | `bg-canvas text-muted`   | `▼ 3% 변화`                            |
| 비교 불가     | `text-muted` (배경 없음) | `- 비교할 지난주 데이터 없음`          |

- 화살표 = 값의 방향, 색 = 좋고 나쁨. **색만으로 뜻을 전하지 않고 글자를 꼭 붙인다.**

### 5-6. 작은 표시

| 표시             | 클래스                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------- |
| 데이터 기준일    | `text-xs text-muted` → "데이터 기준일 10/7"                                            |
| 업로드 지연 경고 | `rounded bg-bad-tint px-2 py-1 text-xs font-semibold text-bad` → "⚠ 3일간 업로드 없음" |
| 퍼널 "최저"      | `rounded bg-primary-strong px-1.5 py-0.5 text-xs font-bold text-white`                 |

### 5-7. 표 (월 누적, 일자별)

| 부분           | 클래스                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------- |
| 감싸는 상자    | `overflow-x-auto rounded-lg border border-hairline bg-surface` (**가로 스크롤은 여기서만**) |
| 표             | `w-full text-sm`                                                                            |
| 머리글 칸      | `whitespace-nowrap bg-canvas px-3 py-2 text-left text-xs font-semibold text-muted`          |
| 본문 칸        | `whitespace-nowrap border-t border-hairline px-3 py-2`                                      |
| 숫자 칸        | 위 + `text-right tabular-nums`                                                              |
| 줄 마우스 올림 | `hover:bg-canvas`                                                                           |
| 값이 없음      | `-` 를 `text-muted` 로                                                                      |

### 5-8. 그래프 (Recharts)

- 지표 1개당 그래프 1개, 이중 축 금지 (metrics.md).
- 선 `var(--color-primary)` 2px, 점 지름 4px / 격자 `var(--color-hairline)` 가로선만 / 축 글자 `var(--color-muted)` 12px.
- 데이터 없는 날은 0 이 아니라 빈칸 (`connectNulls={false}`).
- 마지막 점 옆에 값 표시 (test1007 과 같음).

## 6. 화면 상태 (spec 결정 4)

| 상태        | 모양                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 불러오는 중 | 카드 자리에 회색 막대 `animate-pulse rounded bg-hairline` + 문구 `text-sm text-muted` "서버를 깨우는 중이에요. 최대 1분 걸릴 수 있어요" |
| 서버 오류   | 카드(5-2) + `border-bad` + 문구 `text-sm text-bad` + [다시 시도] 주요 버튼                                                              |
| 데이터 0건  | 카드(5-2) 가운데 정렬 `py-12 text-center` + 문구 `text-ink` + 주요·보조 버튼                                                            |
| 7일 미만    | 카드 이름 옆 `text-xs text-muted` "최근 3일 기준", 배지는 "비교 불가"                                                                   |

## 7. 모바일 배치 (spec 결정 5)

| 부분          | 클래스                                                           |
| ------------- | ---------------------------------------------------------------- |
| 합계 카드 4개 | `grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4`                 |
| 퍼널 단계     | `flex flex-col md:flex-row`                                      |
| 그래프 2개    | `grid gap-3 md:grid-cols-2 md:gap-4`                             |
| 머리글 버튼   | 모바일에서도 머리글에 유지, 글자 줄바꿈 금지 `whitespace-nowrap` |
| 페이지 전체   | 가로 스크롤 금지. 넘치는 건 표 상자(5-7) 안에서만                |

- 기준 화면: 360px ~ 390px 너비에서 카드 4개가 첫 화면에 다 보여야 한다.

## 8. 금지 (훅이 자동으로 검사)

| 금지                            | 예                                                 | 대신                               |
| ------------------------------- | -------------------------------------------------- | ---------------------------------- |
| 임의 색 값                      | `bg-[#ff0000]`, `text-[rgb(0,0,0)]`                | 2절의 색 이름                      |
| Tailwind 기본 팔레트 색         | `bg-red-500`, `text-gray-600`, `border-slate-200`  | 2절의 색 이름                      |
| `.jsx` 안의 직접 색 코드        | `style={{ color: '#E23E28' }}`, `stroke="#e23e28"` | 클래스 또는 `var(--color-primary)` |
| `src/index.css` 밖의 새 색 정의 | 다른 CSS 파일에 `#xxxxxx`                          | `@theme` 에 토큰 추가              |
| 카드 그림자                     | `shadow-md`, `shadow-lg`                           | `border border-hairline`           |
