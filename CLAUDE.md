# try-30 — 4주 다이어트 기록 앱

「4주 5kg 실천 가이드북」 기반의 개인용 다이어트 앱. hoho-crm과는 별도 프로젝트.

**작업을 시작하기 전에 `docs/HANDOFF.md`를 먼저 읽을 것.** 지금까지의 결정, 데이터 규칙, 기능 설계, 다음 할 일이 정리되어 있다.

## 스택
Vite + React + TypeScript + Tailwind v4 + Recharts, pnpm, localStorage만 사용 (서버 없음)

## 구조
- `data/foods.json`: 식품 87개. 영양값은 100g당. `data/build_foods.py`로 생성하므로 JSON을 직접 고치지 않는다.
- `data/guide.json`: 목표 공식, 갈래, 주차별 미션, 금지·대체 식품, 추천용 메뉴·조합
- `docs/`: 원본 PDF, 추출 텍스트, 분석 메모, 인계 문서

## 규칙
- UI 문구는 한국어
- 영양 합계는 항상 식품·끼니별 값을 더해서 계산한다. 가이드북에 적힌 합계는 틀린 곳이 있다.
- `src: "est"` 값은 추정치다. 가이드북 수치(`pdf`)와 구분한다.
