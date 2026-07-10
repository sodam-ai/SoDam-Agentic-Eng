# Changelog

모든 중요한 변경 사항을 이 파일에 기록합니다.
형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)
버전: [Semantic Versioning](https://semver.org/)

---

## [0.1.0] - 2026-06-28

### 추가 (Added)

#### 기능 (F1~F5 Phase 1 MVP)
- **F1** `commands/sodam-agentic-start.md` + `skills/sodam-agentic-start/SKILL.md` — 한국어 온보딩 (계획→실행→검토→안전 4단계). Codex 공유 포함.
- **F2** `skills/sodam-agentic-plan/SKILL.md` — 계획 먼저 스킬 (코드 전 무엇을·왜·완성기준 명시적 승인)
- **F3** `skills/sodam-agentic-review/SKILL.md` + `agents/easy-reviewer.md` — 변경점 쉬운 말 검토 스킬 + 위임 에이전트
- **F4** `hooks/guard.mjs` + `hooks/delegate.mjs` + `hooks/hooks.json` — 안전 훅 (최소 폴백 4종 차단, Harness 위임, fail-closed)
- **F5** `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` + `codex/install.mjs` — 두 도구 설치 지원

#### 런타임 데이터
- `data/agentic-rules.json` — 계획·검토·폴백 규칙 데이터 파일 (코드 없이 조정 가능)

#### 문서
- `README.md` / `README.en.md` — 한영 설치 가이드
- `docs/사용가이드.md` — 상세 사용법·문제 대처 *(2026-07-07 → 루트 `GUIDE.md`로 이동·개명, 아래 패치 참조)*
- `docs/왕초보-테스트-가이드.md` — 비개발자 골든패스
- `docs/USER-GUIDE.en.md` — 영문 사용 가이드 *(2026-07-07 → 루트 `GUIDE.en.md`로 이동·개명, 아래 패치 참조)*

#### 6형제 시너지
- `docs/family-synergy.md` — 6형제 공통 헌법·훅 충돌 방지 규약
- `docs/api-contracts/harness-backup-api.md` — Harness backup API 공유 계약서
- `AGENTS.md` — Claude Code·Codex 공유 지침 파일
- `CLAUDE.md` — AGENTS.md 포인터 패턴

#### 스크립트·검증
- `scripts/validate.mjs` — 구조 검증 (설치 전 깨짐 선제거)
- `scripts/family-health.mjs` — 6형제 헬스체크
- `hooks/_selftest.mjs` — 훅 자가검증 (selftest)

#### 라이선스
- `LICENSE` (Apache-2.0)
- `NOTICE` (저작권 고지)

### 알려진 한계 (Known Limitations)
- F2/F3 스킬은 "부탁" (강제 불가) — Phase 2에서 PreToolUse hook으로 강화 예정
- F4 훅은 Codex에서 Claude Code만큼 강하게 작동하지 않음 (Codex 안전 패리티 = Phase 2)
- F4 라이브 세션 검증: 자가검증(selftest) PASS, 실제 Claude Code 세션 라이브 검증 대기 중

### 2026-07-07 패치 (0.1.0 내 — 같은 버전)

- **매니페스트 스키마 대응 (CC 2.1.201):** `plugin.json` 경로 필드 `./` 접두사 필수화, `agents`는 디렉터리 불가·개별 `.md` 파일(`./agents/easy-reviewer.md`). `marketplace.json` top-level `description` 추가. (`claude plugin validate --strict` 통과)
- **R2 해소 — F4 항상 활성:** F4 폴백을 조용히 무력화하던 `isAgenticActive()` 세션 게이트 제거. guard는 설치 시 항상 평가하고, 공존(이중 차단 방지)은 `isHarnessAlive()` 위임이 담당.
- **적대적 안전 재감사:** ⓐ 자동승인(bypass) 모드 미경고 → `sodam-agentic-start` 온보딩에 경고 추가(훅은 그 모드 감지 불가, 사람 확인 안내). ⓓ 치명(catastrophic) 명령은 Harness 유무와 무관하게 항상 deny(방어심층).
- **문서 전면 개정:** `docs/사용가이드.md`·`docs/USER-GUIDE.en.md` → 루트 `GUIDE.md`·`GUIDE.en.md` 이동·개명. README(ko/en) lean화 + GUIDE 링크. staleness 수정(LICENSE 확정, AGENTS.md 구현 반영), 제거방법 절 추가. pandoc으로 `.html` 4종 기계 재생성.
- **6형제 시너지 P0/P1:** `docs/family-synergy.md`(공통 헌법), `docs/api-contracts/harness-backup-api.md`, `scripts/family-health.mjs` 추가.

---

## 다음 예정 (Planned)

### [0.2.0] — Phase 2
- F6. 안전 기록 (차단·확인 이력 조회)
- F7. Codex 안전 패리티 (F4 동등 보호)
- F2/F3 PreToolUse hook 강제화 (스킬 경쟁 한계 근본 해결)
