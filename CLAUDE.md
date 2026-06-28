# SoDamAgentic — Claude Code 개발 지침

> AI 규칙 전문은 **[AGENTS.md](AGENTS.md)** 를 읽어주세요 (포인터 패턴 E1).

## 빠른 참조

| 항목 | 내용 |
|------|------|
| 구조 검증 | `node scripts/validate.mjs` (PASS 8/0 기대) |
| 안전 훅 자가 테스트 | `node hooks/_selftest.mjs` (22 PASS 기대) |
| Codex 설치 | `node codex/install.mjs` |

## 절대 원칙

- 비밀정보(API 키·토큰)를 코드·출력 어디에도 기록 금지
- `.PRD/` 폴더 GitHub 푸시 금지
- `master` 직접 commit/push 금지 → 작업 브랜치: `init-mvp`
- `bypassPermissions` 모드 권유 금지
