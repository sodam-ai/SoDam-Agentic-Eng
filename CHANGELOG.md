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
- `docs/사용가이드.md` — 상세 사용법·문제 대처
- `docs/왕초보-테스트-가이드.md` — 비개발자 골든패스
- `docs/USER-GUIDE.en.md` — 영문 사용 가이드

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

---

## 다음 예정 (Planned)

### [0.2.0] — Phase 2
- F6. 안전 기록 (차단·확인 이력 조회)
- F7. Codex 안전 패리티 (F4 동등 보호)
- F2/F3 PreToolUse hook 강제화 (스킬 경쟁 한계 근본 해결)
