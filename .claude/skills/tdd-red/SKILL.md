---
name: tdd-red
description: TDD 2단계(Red). 승인된 시나리오 문서를 테스트 코드로 바꾸고 함수는 빈 껍데기(스텁)만 만들어, 모든 테스트가 "not implemented" 로 실패하는지 확인한다. "/tdd-red 1" 처럼 부른다.
---

# Red — 다 틀린 상태 만들기 (TDD 2단계)

인자: 이슈 번호 (예: `1`). 없으면 사용자에게 묻는다.

## 순서

1. **준비**
   - `docs/specs/summary-page/issues/issue-<번호>-tests.md` 를 읽는다. 없으면 멈추고 `/test-scenarios <번호>` 를 먼저 하라고 안내한다.
   - 작업 가지(브랜치)를 확인한다. `main` 이면 `feat/issue-<번호>-<짧은-영어-이름>` 을 만들자고 **묻고** 승인 후 만든다.
2. **만들 파일을 먼저 알려주고 승인받는다** (테스트 파일 · 스텁 파일 목록).
3. **테스트 코드**: `src/utils/<이름>.test.js`
   - `import { test } from 'node:test'` 와 `import assert from 'node:assert/strict'` 를 쓴다.
   - 테스트 이름에 시나리오 ID 와 분류를 넣는다: `test('S3 [경계] 분모가 0이면 null', …)`
   - 시나리오 하나 = 테스트 하나. 문서에 없는 테스트는 만들지 않는다.
   - "화면 확인" 시나리오는 테스트로 만들지 않는다.
4. **스텁(빈 껍데기)**: `src/utils/<이름>.js`
   - 함수 모양(이름·받는 값)은 문서 그대로, 본문은 `throw new Error('not implemented')` 한 줄.
   - named export 만 쓴다 (`export function …`). 코드 스타일은 CLAUDE.md 를 따른다.
5. **돌려 보기**: `node --test`
   - **"N개 실패, 성공 0개"** 를 사용자에게 보여준다.
   - 실패 이유를 하나씩 확인한다.
     - ✅ 좋은 실패: `not implemented`
     - ❌ 고장: `Cannot find module`, `SyntaxError`, `is not a function` 등. **먼저 고친 뒤 다시 돌린다.**
   - 성공한 테스트가 하나라도 있으면 그 테스트가 아무것도 검사하지 않는다는 뜻이다. 원인을 보고한다.
6. 끝나면 커밋할지 묻는다. 메시지 예: `test(metrics): 이슈 #<번호> 시나리오 테스트 추가`. 다음 단계는 `/tdd-green <번호>`.

## 지키는 것

- 이 단계에서는 **진짜 계산 코드를 쓰지 않는다.**
- 결과는 쉬운 한국어로 보고한다.
