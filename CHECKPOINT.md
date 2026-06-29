# CHECKPOINT — SoDamAgentic (Phase 1 MVP)

> **다음 세션은 이 파일을 먼저 읽고 이어가면 됩니다.** 기준일: 2026-06-29 (갱신).
> 정본 기획서는 `.PRD/`(로컬·GitHub 푸시 금지)에 있습니다.

## 1. 지금까지 된 것 (빌드·검증 완료)
- **F4 안전 훅**: `hooks/guard.mjs`·`delegate.mjs`·`hooks.json` + `data/agentic-rules.json`. (`node hooks/_selftest.mjs` → 22 PASS, 2026-06-28 재확인)
- **게이트0**: `.claude-plugin/plugin.json`·`marketplace.json`.
- **F2·F3 척추**: `skills/sodam-agentic-plan/`·`skills/sodam-agentic-review/` + `agents/easy-reviewer.md`.
- **검증기**: `scripts/validate.mjs` (PASS 9/0, 2026-06-29 재확인).
- **문서**: `README.md`·`README.en.md`, `docs/사용가이드.md`·`USER-GUIDE.en.md`(+PDF 로컬), `docs/왕초보-테스트-가이드.md`.
- **GitHub**: 비공개 `sodam-ai/SoDam-Agentic-Eng`, 브랜치 **`init-mvp`** 에 push. (master 원격에 없음 — 의도)
- **라이브 검증됨**: 설치 · 한글 렌더링 · 명령 일관성(`/sodam-agentic-*`) · **F1 온보딩 실제 실행**.
- **AGENTS.md**: 루트 생성 (49줄, 2026-06-28). `validate.mjs` PASS 8/0 유지 확인.
- **`codex/install.mjs`**: 생성·실행 검증 완료 (2개 스킬 설치, 2026-06-28). `.agents/` → `.gitignore` 추가.
- **CLAUDE.md**: 루트 생성 완료 (포인터 패턴, AGENTS.md 링크).
- **LICENSE**: Apache-2.0 전문 + `Copyright 2026 SoDam AI Studio` 생성 완료.
- **README.md / README.en.md**: Codex 설치 섹션 추가 (`node codex/install.mjs` + F4 한계 안내, 2026-06-28).
- **init-mvp 원격 푸시 완료** (2026-06-28): 커밋 `14ac29f`(AGENTS·CLAUDE·LICENSE·codex) + `e7f6b17`(README Codex섹션) → `sodam-ai/SoDam-Agentic-Eng:init-mvp` 반영.
- **guard.mjs 심층 분석 완료** (2026-06-28): `isSensitive()` 동작 확인 — 홈 정확일치 + `.ssh/.aws/.codex/.claude/.gnupg/.config` + 시스템경로만 차단. AppData 경로 차단 아님(false positive 해당 없음). PostToolUse 훅 없음(Plan Mode 재발동은 Claude Code 네이티브 동작 — 플러그인 제어 불가).

## 2. 다음 작업 (우선순위 — 강력 추천 순)
1. ⬜ **F4 차단 라이브 검증 (사람 직접)** — 새 Claude Code 세션(D:\Dev-Test_Made)에서 AI에게 `Remove-Item -Recurse .` 실행 지시.
   - selftest "Remove-Item -Recurse → deny" PASS(2026-06-28) 확인됨. 라이브 세션에서 실제 메시지 확인 필요.
   - **주의**: persona-safety가 먼저 개입해 "진행할까요?" 물을 수 있음 → "예" 응답 후 guard.mjs 차단 확인.
   - **done-when**: guard.mjs 한국어 차단 메시지("폴더를 통째로 지우는 작업은 안전하게 막았어요") 표시.
2. ⬜ **F2/F3 스킬 경쟁 한계 수용** — 라이브 테스트 2회 결과:
   - 1차(2026-06-28): `feature-dev` 스킬이 sodam-agentic-plan 제압 → ❌
   - 2차(2026-06-28): `persona-format` 스킬이 sodam-agentic-plan 제압 → ❌
   - **근본 한계 확인됨**: PRD §05_FAMILY_RISKS "스킬 = 부탁, 강제 불가" 실측 입증.
   - Phase 1은 현 상태(soft guidance)로 배포. **Phase 2에서 PreToolUse hook 강제 추가 예정**.
3. ⬜ **비개발자 베타 1명** — 혼자 골든 패스(`/sodam-agentic-start` → 작업 → 검토 완주). Phase 1 졸업 전제조건.
4. ⬜ **법무 확인** — Apache-2.0 적용, "Claude/Codex" 상표 사용, GPL 체크.
5. ⬜ **master/main 정식 브랜치 정리** (현재 원격은 init-mvp만).

✅ **init-mvp 커밋 + 푸시** — 완료 (2026-06-28). 원격 `sodam-ai/SoDam-Agentic-Eng:init-mvp` 최신.
✅ **guard.mjs 심층 분석** — 완료 (2026-06-28). 22 PASS 재확인, AppData 오차단 없음 확인.
✅ **6형제 시너지 P0 완료** — (2026-06-29). `docs/family-synergy.md`(공통 헌법) 생성. PRD §05_FAMILY_RISKS C1·C6 훅 충돌 방지 규약 4개 명문화. `agentic-rules.json` family 섹션 추가(런타임 영향 없음). README·AGENTS.md 형제 협업 규약 반영.
✅ **시너지 P1 완료** — (2026-06-29). `docs/api-contracts/harness-backup-api.md`(Harness backup API 공유 계약서) 생성. `scripts/family-health.mjs`(6형제 헬스체크) 생성·실행 검증 (`node scripts/family-health.mjs` → 정상 출력). validate.mjs PASS 8/0 유지.
✅ **PRD 전수 구현 완료** — (2026-06-29). `skills/sodam-agentic-start/SKILL.md`(F1 Codex 공유 스킬), `CHANGELOG.md`, `NOTICE` 신규 생성. `codex/install.mjs` F1 스킬 안내 추가. `validate.mjs` PASS 9/0 확인.

## 3. 검증 커맨드
```
node scripts/validate.mjs        # 구조 PASS 9/0 기대
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
