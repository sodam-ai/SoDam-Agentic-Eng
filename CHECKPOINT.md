# CHECKPOINT — SoDamAgentic (Phase 1 MVP)

> **다음 세션은 이 파일을 먼저 읽고 이어가면 됩니다.** 기준일: 2026-06-28 (갱신).
> 정본 기획서는 `.PRD/`(로컬·GitHub 푸시 금지)에 있습니다.

## 1. 지금까지 된 것 (빌드·검증 완료)
- **F4 안전 훅**: `hooks/guard.mjs`·`delegate.mjs`·`hooks.json` + `data/agentic-rules.json`. (`node hooks/_selftest.mjs` → 22 PASS)
- **게이트0**: `.claude-plugin/plugin.json`·`marketplace.json`.
- **F2·F3 척추**: `skills/sodam-agentic-plan/`·`skills/sodam-agentic-review/` + `agents/easy-reviewer.md`.
- **검증기**: `scripts/validate.mjs` (PASS 8/0).
- **문서**: `README.md`·`README.en.md`, `docs/사용가이드.md`·`USER-GUIDE.en.md`(+PDF 로컬), `docs/왕초보-테스트-가이드.md`.
- **GitHub**: 비공개 `sodam-ai/SoDam-Agentic-Eng`, 브랜치 **`init-mvp`** 에 push. (master 원격에 없음 — 의도)
- **라이브 검증됨**: 설치 · 한글 렌더링 · 명령 일관성(`/sodam-agentic-*`) · **F1 온보딩 실제 실행**.
- **AGENTS.md**: 루트 생성 (49줄, 2026-06-28). `validate.mjs` PASS 8/0 유지 확인.
- **`codex/install.mjs`**: 생성·실행 검증 완료 (2개 스킬 설치, 2026-06-28). `.agents/` → `.gitignore` 추가.
- **CLAUDE.md**: 루트 생성 완료 (포인터 패턴, AGENTS.md 링크).
- **LICENSE**: Apache-2.0 전문 + `Copyright 2026 SoDam AI Studio` 생성 완료.

## 2. 다음 작업 (우선순위 — 강력 추천 순)
1. ⬜ **F2/F3 자동발동 + F4 차단 라이브 검증** — 테스트 창(`D:\Dev-Test_Made`)에서 "메모장 만들어줘".
   - **done-when:** 코드 전 계획 자동 표시(F2) + 작업 후 검토 요약(F3) + 위험명령 차단(F4) 확인.
   - 안 뜨면 → 스킬 `description` 강화(pushy 트리거). **이게 최대 미검증 = 1순위.**
   - ↳ F4 세션 내 확인(2026-06-28): `Remove-Item -Recurse -Force` → guard.mjs 차단 정상 작동.
   - ↳ N2 동시 확인 필요: `/plugin marketplace` UI 한글 렌더링 깨짐 여부.
2. ⬜ **init-mvp 커밋 + 푸시** — 신규/변경: `AGENTS.md`·`codex/`·`.gitignore`·`CHECKPOINT.md`·`CLAUDE.md`·`LICENSE`.
3. ⬜ **master/main 정식 브랜치 정리** (현재 원격은 init-mvp만).
4. ⬜ 비개발자 베타 · 법무 확인 (F2/F3/F4 라이브 검증 완료 후).

## 3. 검증 커맨드
```
node scripts/validate.mjs        # 구조 PASS 8/0 기대
node hooks/_selftest.mjs         # 안전훅 22 PASS 기대(_selftest는 .gitignore, 로컬만)
# 설치 테스트(새 Claude Code, D:\Dev-Test_Made):
/plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam
/sodam-agentic-start
```

## 4. 불변 원칙·주의 (절대 깨지 말 것)
- **안전 = SoDamHarness 위임 + 최소 폴백.** Agentic이 일반안전 중복 신규구현 금지.
- **척추(F2 계획먼저·F3 검토)는 정체성 — 절대 제거 금지.** workflow에 머묾(autonomous 금지).
- **F2/F3는 스킬이라 강제 아님** — 정직히 인정, UX·description으로 유도.
- **master 직접 commit/push 금지** → 작업은 `init-mvp`. PR/merge/release 자동 금지.
- 명령 이름은 `sodam-agentic-*` (다른 플러그인 `sodam-agent`와 혼동 주의).
- 비밀정보 0 · PDF는 `.gitignore`(MD에서 재생성) · `.PRD/`는 푸시 금지.
