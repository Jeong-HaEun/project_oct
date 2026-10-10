---
name: mermaid-diagram
description: 프로젝트 파일 구조를 Mermaid 다이어그램으로 그려 브라우저에서 보여준다
---

# 파일 구조도 그리기

1. 프로젝트 폴더 구조를 살펴본다. node_modules, dist, .git 은 제외한다.
2. 구조를 Mermaid `flowchart TD` 형식으로 바꾼다.
   - 폴더와 파일을 선으로 잇고, 각 파일 옆에 짧은 한국어 설명을 붙인다.
3. Mermaid 를 CDN(https://cdn.jsdelivr.net/npm/mermaid)으로 불러오는 HTML 을 만들어
   docs/file-structure.html 에 저장한다.
4. 브라우저로 그 파일을 연다. (Windows: start docs/file-structure.html)
5. 무엇을 만들었는지 한국어로 짧게 알려준다.
