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

### 2026-07-11 패치 (0.1.0 내 — 같은 버전)

- **F4 라이브 실증 완료:** `docs/F4-라이브검증-런북.md`를 실제 세션에서 실행. 차단 메시지 문구를 `guard.mjs` 소스와 전수 대조해 sodam-agentic 자체 훅이 실제로 자동로드·발동함을 확정.
- **실사용 전용 버그 발견·수정:** `hooks/guard.mjs`의 `commandPaths()`가 연쇄(`&&`) 명령에서 안전한 인자(예: `echo hi`)까지 경로 후보로 오인해 "민감 위치" 오탐(deny)되던 문제 수정. 경로를 다루는 명령(`rm`·`cd`·`cat` 등)의 인자·리다이렉트 대상만 후보로 인정하도록 최소 수정(`f66a445`). 회귀 테스트 3건 추가(로컬 전용 `_selftest.mjs`, 총 25 PASS).
- **`codex/install.mjs` 문구 모순 정정:** Codex F4 한계 설명이 두 곳에서 서로 다르게("작동 안 함" vs "강하게 작동 안 함") 적혀 있던 것을 통일(`b75665d`).

### 2026-07-12 패치 (0.1.0 내 — 같은 버전)

- **`plugin.json` 중복 `hooks` 선언 제거:** `hooks/hooks.json`은 Claude Code가 자동 로드하므로, `plugin.json`에 `"hooks": "./hooks/hooks.json"`을 중복 선언하면 "Duplicate hooks file detected"로 플러그인 로드 자체가 실패할 위험이 있음을 확인. 해당 줄 제거(`9ff0e0e`). `validate.mjs` 9/0, `_selftest.mjs` 25 PASS 재확인 후 반영.
- **실사용 검증 중 발견·수정 — 작업폴더 밖(비민감 경로) 쓰기 간극(D1):** `isSensitive()`가 홈·시스템 등 정해진 목록만 검사해, 그 외 작업폴더 밖 위치(예: 다른 프로젝트 폴더)로의 쓰기는 걸러지지 않던 간극을 라이브 검증에서 발견(07_SECURITY §1 "작업폴더 안만 쓰기 허용"과 실제 구현 간극). 치명 위치가 아니므로 deny 대신 `ask`로 한 단계 확인하도록 `isOutsideWorkdir()` 신설·연결(`34c26d3`). 회귀 테스트 2건 추가(로컬 전용 `_selftest.mjs`, 총 27 PASS) + 별도 독립 탐침 스크립트로 교차검증.
- **실사용 검증 2차 발견·부분 수정 — 심볼릭/junction 링크 경유 우회:** 작업폴더 안에 링크를 만들고 그걸 통해 쓰면, 경로 문자열만 비교하는 기존 검사(`isSensitive`·`isSymlink`·`isOutsideWorkdir`)를 우회할 수 있음을 발견(07_SECURITY §2 "심볼릭 링크가 작업폴더를 벗어나면 deny"와 간극). **1단계(링크 생성 자체)만 우선 차단**: `data/agentic-rules.json`의 `extra_denied`에 `mklink`·`New-Item -ItemType Junction/SymbolicLink/HardLink`·`ln -s` 패턴 추가(`6542728`, 코드 무변경·데이터만). 회귀 테스트 3건 추가(총 30 PASS). **잔여 위험(의도적 보류):** 세션 시작 전부터 이미 존재하던 링크를 통한 우회, 또는 실경로(realpath) 해석 자체는 기존 함수 3곳을 함께 고쳐야 해 범위가 커서 별도 확인 후 진행 예정 — 아직 미착수.
- **자체 테스트/검증 중 발견·수정 — 비객체 JSON stdin 크래시:** `guard.mjs`의 stdin 파싱이 문법 오류만 방어하고, 문법은 맞지만 객체가 아닌 값(리터럴 `null` 등)은 방어하지 않아 `input.tool_name` 접근에서 uncaught TypeError로 훅이 죽는(exit 1) 경로를 발견. Claude Code가 실제로 이런 값을 보낼 가능성은 낮지만, "판단 불가 시 조용히 통과"라는 기존 설계 의도와 어긋나는 간극이라 한 줄 방어 추가(`594570f`). 회귀 테스트 4건 추가(로컬 전용 `_selftest.mjs`, 총 34 PASS).
- **PRD 재확인 중 발견·수정(심각) — 원격 코드 다운로드 후 즉시실행 미탐지:** `07_SECURITY.md` §2가 명시한 수용기준(다운로드 도구를 셸 실행기로 바로 넘기는 공격 패턴 차단)이 지금까지 전혀 구현돼 있지 않았음. rm -rf만큼 되돌릴 수 없는 위험으로 판단해 치명(catastrophic) 등급으로 추가, Harness 유무 무관 항상 차단(`cfc4a42`). 순수 다운로드(실행 없음)는 오탐 없음 확인. 회귀 테스트 5건 추가(총 42 PASS).
- **실사용 검증 중 발견·수정(심각) — 셸 명령의 safe 등급이 경로검사를 우회:** `echo`·`Set-Content` 등 위험 명령 목록에 없는 셸 명령은 민감경로·작업폴더 밖 검사(③④)를 건너뛰고 통과했음(`Write` 도구로 같은 대상에 쓰면 정상 차단되는 것과 비대칭). 셸 리다이렉트로 시스템 폴더에도 무방비로 쓸 수 있었던, 이번 세션에서 발견된 것 중 가장 심각한 구멍. 경로검사 루프를 위험도 분류와 무관하게 항상 실행하도록 순서만 재배치해 수정(`842c09c`, 로직 변경 없음). 회귀 테스트 3건 추가(총 37 PASS).
- **실사용 검증 중 발견·수정 — F3(변경점 검토) 스킬 미발동:** `D:\Test_Dev\test3` 실사용에서 F2(계획먼저)는 실제로 발동했으나 F3(검토)는 발동하지 않는 사례 발견. F2 SKILL.md와 대조한 결과 F3에는 (1) 완료 보고보다 스킬 실행이 먼저라는 순서 지시, (2) 다른 동작보다 우선한다는 명시적 주장이 빠져있었음. F2의 검증된 패턴을 그대로 반영해 description 보강(`23e797b`). **미확인:** 실제로 발동률이 개선됐는지는 다음 라이브 재검증에서 확인 필요(구조 검증 9/0만 재확인).

### 2026-07-14 패치 (0.1.0 내 — 같은 버전)

- **잔여 위험 해소 — 심볼릭/junction 링크 경유 우회(2026-07-12 §0-5에서 "범위 커서 보류"로 남겼던 항목):** 기존 `isSymlink()`는 "쓰기 대상 파일 자체"만 lstat해서, 중간 폴더가 junction/심볼릭 링크면(예: 작업폴더\linkdir\file.txt, `linkdir`가 작업폴더 밖을 가리킴) 놓쳤음(`07_SECURITY.md` §2 "심볼릭 링크가 작업폴더를 벗어나면 deny" 수용기준과 실제 구현 간극). realpath 전체 정규화 대신, 작업폴더~대상 사이 경로의 모든 구성요소를 개별 lstat하는 `pathTraversesSymlink()`를 신설해 Write/Edit·셸 명령 양쪽의 경로검사에 연결(F4 안전-핵심 변경이라 사용자 승인 후 진행). realpath 방식을 피한 이유: cwd 자체가 심볼릭 경로인 환경(예: macOS `/tmp`)에서 정상적인 작업폴더 내 쓰기까지 전부 링크로 오탐할 위험이 있어, cwd 경로 형태를 건드리지 않는 컴포넌트별 lstat가 더 안전하다고 판단. 실제 junction을 만들어 경유 쓰기(Write)·경유 삭제(셸 `rm`) 둘 다 이제 `deny`되는 것을 라이브 재현으로 확인(이전엔 무방비로 통과). 회귀 테스트 2건 추가(로컬 전용 `_selftest.mjs`, 총 44 PASS, 기존 42건 회귀 없음 확인).

### 2026-07-15 패치 — Phase 2: F6 안전 기록 + F7 Codex 안전 패리티

> 전제조건 재정리: Phase 2 착수 조건이던 "비개발자 베타 1~3명"은 이 도구가 처음부터 사용자 본인 개인용으로
> 구현 중임이 확정되며 해당없음 처리됨(`01_PRD.md §7`). 단 마켓플레이스·플러그인 설치 방식(F5)은 그대로 유지되고
> PRIVATE 저장소를 유지하며 Phase는 끝까지 진행하는 것으로 확정.

- **F6. 안전 기록(SafetyLog) 구현.** `guard.mjs`의 `decide()`가 deny/ask를 결정할 때마다 `~/.sodamagentic/safety-log.jsonl`에 `{id, action, target, reason, created_at}` 형식으로 기록(JSONL, append-only — 가족 관례인 Reverse `.sodam-re/safety-log.jsonl`·Loop `runs/*.jsonl`과 일치). 안전한 통과(passThrough)는 기록 안 함(로그 비대화 방지). `target`은 저장 전 기존 `KEY_DENY`/`KEY_ASK` 패턴으로 마스킹해 비밀값이 로그에 남지 않게 함(`02_DATA_MODEL.md` "키 값 로그 저장 금지" 준수). 로그 쓰기 실패가 안전 판정 자체를 막지 않도록 try/catch로 best-effort 처리. 조회는 신규 `/sodam-agentic-log` 명령(`commands/sodam-agentic-log.md`)이 JSONL을 읽어 쉬운 한국어로 요약. 회귀 테스트 4건 추가(총 54 PASS).
- **F7. Codex 안전 패리티 구현.** WebFetch로 Codex CLI의 실제 훅 스키마를 확인한 결과 `PreToolUse` 이벤트·`tool_name`/`tool_input`/`cwd` 입력·`{hookSpecificOutput:{permissionDecision,permissionDecisionReason}}` 출력 형식이 Claude Code와 사실상 동일함을 확인 — 새 안전 로직을 만들지 않고 기존 `guard.mjs`(F4·F6 포함)를 그대로 재사용(`01_PRD §8` "안전 중복 신규구현 금지" 준수). `codex/install.mjs`가 `hooks/`+`data/`를 `.agents/` 아래로 복사하고 `.codex/hooks.json`에 `PreToolUse` 항목을 등록(기존 `.codex/hooks.json` 내용이 있으면 덮어쓰지 않고 병합, 재설치 시 중복 등록 방지). 회귀 테스트 6건 추가(설치·병합·중복방지 검증).
- **⚠️ 정직한 한계(구현 완료, 라이브 미검증):** Codex에서 `"permissionDecision": "ask"`가 실제로 대화형 확인창을 띄우는지, `.codex/hooks.json`을 Codex가 정확히 어느 경로에서 읽는지는 공식 문서로 100% 확정하지 못함 — Codex CLI로 직접 설치·테스트해 확인 필요(설치 후 안내 문구에 검증 방법 포함).

### 2026-07-16 패치 — 안전 메시지에 플러그인 출처 표시 추가 (소담 패밀리 충돌 대비)

> 배경: `CHECKPOINT.md §0-2`(2026-07-11)에서 사용자의 실제 `settings.json`에 SoDamHarness의 훅이 직접 등록돼 있어, sodam-agentic의 자동로드 훅과 **동시에** 발동한 라이브 사례가 있었다. 당시 AI조차 두 플러그인의 소스코드를 줄 단위로 대조해야만 어느 쪽이 차단한 건지 구분할 수 있었다 — 실제 사용자는 구분할 방법이 전혀 없었다는 뜻. `05_FAMILY_RISKS.md` PART A의 "여러 플러그인이 같이 있을 때 초보자 혼란"이 실측으로 재현된 사례.

- **`hooks/guard.mjs`의 `decide()` 함수 한 곳만 수정** — 모든 확인(ask)·차단(deny) 메시지 앞에 `[소담 에이전틱]` 접두사를 자동으로 붙임(13개 호출부 개별 수정 아님, 단일 지점 변경 — Simplicity First). 화면에 뜨는 메시지와 `/sodam-agentic-log` 조회 기록 양쪽에 동일하게 적용.
- **의도적으로 하지 않은 것(정직 고지):** 이 변경은 충돌 자체를 막지 않는다. 진짜 충돌 방지(안전 훅 무력화 자기감지·훅 병렬실행 순서)는 `docs/family-synergy.md`가 SoDamHarness 단독 소유로 명시한 영역이라, Agentic이 재구현하면 "안전 중복 신규구현 금지"(`01_PRD.md §8`) 원칙을 어기게 된다. 이번 변경은 딱 "충돌이 나도 어느 플러그인인지 바로 알 수 있게" 하는 범위로 한정했다.
- **문서 동기화:** `GUIDE.md`/`GUIDE.en.md` §10의 "실제 판정 3단계 예시" 표가 "실제 코드 문구를 그대로 옮긴 것"이라 명시하고 있어, 표의 예시 문구 4곳(ko·en 각각)에도 동일 접두사 반영 + HTML 재생성.
- **검증:** `validate.mjs` 10/0, `_selftest.mjs` 54 PASS(회귀 0 — 테스트가 `reason` 필드를 타입 체크만 하고 정확한 문자열 비교를 하지 않음을 사전 확인했기 때문에 예상된 결과).

### 2026-07-16 패치 — family-health.mjs가 낡은 메모를 실시간 사실처럼 보여주던 문제 수정

> 배경: 소담 패밀리 충돌 테스트/검증 세션에서 `scripts/family-health.mjs`를 실행해봤더니 "SoDamHarness Phase 1 완료 ✅ — selftest 75 PASS (2026-06-29)" 같은 문구가 나왔다. 이 스크립트의 최종수정일 자체가 2026-06-29라, 그 문구는 실시간 확인이 아니라 그날 박제된 하드코딩 메모였다 — 그런데도 파일존재 여부 같은 진짜 실시간 검사와 같은 줄에 섞여 나와 구분이 안 됐다.

- **`codeDone`/`prdDone` 하드코딩 불리언 제거.** "PRD 폴더"·"핵심 파일" 상태는 이제 100% 실시간 파일시스템 확인(`.PRD` 폴더 존재, criticalFiles 존재)에서만 나옴.
- **모든 `note`(서술형 메모)에 작성일 표시 추가** — "💡 메모(2026-06-29 작성, 라이브 재확인 아님): ..." 형식으로, 실시간 확인과 절대 혼동 안 되게 함.
- **형제별 `CHECKPOINT.md` 존재 여부를 새로 실시간 확인** — 있으면 "그쪽이 더 신뢰할 수 있는 최신 정보원"이라고 안내. 실행 결과 6형제 중 4개(Context·Agentic·Prompt·Reverse)는 있고, Harness·Loop는 없음(실측).
- **하단 "다음 세션 안내" 하드코딩 우선순위 목록 제거** — 특정 형제를 "최우선"이라 못박는 문구는 시간이 지나면 반드시 틀리게 됨. 대신 "CHECKPOINT.md 있는 형제는 그걸 열어 확인" 원칙으로 대체.
- **검증:** `node --check` 통과, 실제 실행해 출력 확인(Loop만 여전히 핵심 파일 2개 누락 — 이 사실 자체는 이전과 동일하게 실측됨). `validate.mjs` 10/0, `_selftest.mjs` 54 PASS(회귀 0, 이 스크립트는 애초에 두 검증기의 대상이 아님).

---

## 다음 예정 (Planned)

- F2/F3 PreToolUse hook 강제화 (스킬 경쟁 한계 근본 해결) — `03_PHASES.md` 공식 Phase 2 범위엔 없고 이전 세션 메모에만 있던 항목이라 착수 여부 별도 결정 필요.
