# CHECKPOINT — SoDamAgentic (Phase 1 MVP)

> **다음 세션은 이 파일을 먼저 읽고 이어가면 됩니다.** 기준일: 2026-06-29 (갱신).
> 정본 기획서는 `.PRD/`(로컬·GitHub 푸시 금지)에 있습니다.

## 0. 2026-07-07 갱신 (매니페스트 수정 + R2 발견)
- ✅ **매니페스트 검증버그 수정** — CC 2.1.201 스키마 변경 대응: `plugin.json` 경로 필드 **`./` 접두사 필수**(bare 경로 `Invalid input`), **`agents`는 디렉터리 불가·개별 `.md` 파일**(`["./agents/easy-reviewer.md"]` — skills/commands는 디렉터리 OK). `marketplace.json` top-level `description` 추가. 검증: `claude plugin validate --strict ✔`(0/0) + `validate.mjs 9/0` + `_selftest 22 PASS`. → `init-mvp` 커밋·푸시.
- ✅ **형제 Harness도 동일 수정 완료**(타 세션, 커밋 `25a49fe`, `feat/phase1-mvp` 푸시). Harness는 `agents` 필드 없어 그 함정 없음.
- ⚠️ **R2 — F4 폴백 활성화 빈틈(미해결·조사 필요)**: `hooks/guard.mjs:267` `if(!isAgenticActive()) passThrough()` → 활성 에이전틱 세션(`~/.sodamagentic/session-*.json` status:"running") 없으면 **완전 휴면**. 그런데 **세션을 켜는 코드가 Agentic repo에 없음**(온보딩 스킬=마크다운 안내뿐, `_selftest`만 시뮬). PRE-1 coexistence 게이트(BUNDLE_COEXISTENCE §2 슬롯3)의 부작용 가능성 → **Harness 부재 시 F4 최소폴백이 실제로 안 뜰 소지**(01 §5 "Harness 없이도 폴백 작동" 성공기준과 충돌 가능). **라이브 F4 차단 검증 전 반드시**: 세션 활성화 주체(온보딩? Loop? 미구현?) 규명. 안 그러면 "차단 안 됨"을 버그로 오판.


- ✅ **R2 해소 (2026-07-07)** — F4 폴백을 무력화하던 `isAgenticActive()` 세션 게이트 **제거**(01_PRD §8 규칙1 "Harness 없을 때만 최소 폴백" 준수). guard는 설치 시 **항상 평가**, 공존(이중 차단 방지)은 `isHarnessAlive()` 위임이 담당. `_selftest.mjs` 세션 시뮬 의존 제거 → **세션 없이도 22 PASS/0 FAIL**(=실사용에서 F4가 실제로 deny/ask 발동, 이전엔 시뮬해야만 통과=휴면). validate 9/0.
  - **잔여(후속·라이브):** ① Harness 동시 설치 시 settings.json·키 이중확인 가능성(경미 UX, 안전구멍 아님 — 실측 후 위임 확대 검토) ② **라이브 F4 차단 실증**(§2.1, 사람) ③ ✅완료(2026-07-07): guard 수정 커밋 `0afc872`(init-mvp 푸시) + Loop `BUNDLE_COEXISTENCE.md §2·§3` 정합 커밋 `0001780`(feat/sodam-loop-phase1a 푸시).

- ✅ **안전 코드 적대적 재감사 (2026-07-07)** — R2급 "조용한 무효" 빈틈 색출. ⓒ 훅배선 정상(`hooks.json`이 Bash·PowerShell·Write·Edit·MultiEdit·NotebookEdit 전부 커버)·ⓑ 잔여 휴면 없음. **ⓐ 자동승인(bypass) 미경고(07 §1 MUST) → `sodam-agentic-start` 온보딩에 경고 추가**(훅은 그 모드 원천 감지 불가 → 사람 확인 안내). validate PASS·selftest 22/0 재확인. (✅커밋 2026-07-07)
  - **ⓓ ✅구현 완료(2026-07-07, guard catastrophic deny를 harness 위임보다 앞으로 이동 — 원래 권고):** `delegate.isHarnessAlive()`가 Harness 작동 검증 안 함(이름+버전+guard.mjs **파일 존재**만, "// stub"도 통과) → 깨진/가짜 Harness가 위험명령·민감경로 위임을 유발해 둘 다 꺼질 소지(fail-open, B1 잔재·저위험 엣지). 권고: **치명(catastrophic) 명령은 Harness 유무 무관 Agentic도 항상 deny(방어심층)** — 이중 deny는 프롬프트 없어 무해. 설계·안전핵심 변경이라 별도 승인 권장.

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
✅ **F4 치명 버그 수정** — (2026-06-29). `isAgenticActive()` 게이트 항상 false → guard 전체 무력화 버그. 함수·상수·게이트 제거. selftest **22 PASS / 0 FAIL**. `2b57a36` push 완료.
✅ **PRE-1 isAgenticActive() 재구현** — (2026-06-29). BUNDLE_COEXISTENCE.md §2 슬롯 3 명세 준수. `~/.sodamagentic/session-*.json` 상태 확인으로 비에이전틱 세션 패시스루 구현. `SODAM_AGENTIC_DATA` env 오버라이드 지원. `_selftest.mjs`에 에이전틱 활성 시뮬레이션(agenticTmp) 추가. selftest **22 PASS / 0 FAIL** 재확인.

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
