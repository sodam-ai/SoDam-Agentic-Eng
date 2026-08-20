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

### 2026-07-16 패치 — validate.mjs가 설치 캐시 최신성을 자동 검사하도록 추가

> 배경: 라이브 검증 중 설치된 플러그인 캐시(`~/AppData/Roaming/claude-code/plugins/cache/...`)의 `guard.mjs`가 2026-07-12일자로 멈춰 있어, 그 이후 만든 심볼릭링크 우회방지(07-14)·안전기록 F6(07-15)·출처표시(07-16)가 실제 라이브 세션엔 전혀 반영 안 되고 있었음을 발견했다. `07_SECURITY.md §9`의 MUST(P1, 출시 차단) 요건인 "심볼릭 링크가 작업폴더를 벗어나면 deny"가 실제로는 위반 상태였던 것 — 코드는 맞지만 배포가 안 된 격차였다.

- **`scripts/validate.mjs`에 새 검사 섹션 "[설치 캐시 최신성]" 추가.** `plugin.json`·`marketplace.json`에서 이름·버전을 읽어 Windows 캐시 경로를 구성하고, 캐시의 `hooks/guard.mjs`를 작업트리와 바이트 단위로 비교. 다르면 FAIL + `/reload-plugins` 안내, 캐시 자체가 없으면 WARN(미설치일 뿐일 수 있음), Windows가 아니면 WARN(수동 확인 안내)으로 구분.
- **캐시 내용을 직접 고치지 않았음(의도적):** 캐시는 Claude Code의 플러그인 관리 영역이라 파일을 수동으로 덮어쓰면 오히려 상태가 꼬일 위험이 있음(CHECKPOINT §0-3~§0-5 결론과 일치) — 검증기는 "감지"만 하고, 실제 갱신은 항상 `/reload-plugins`(사람 전용 명령)로 한다.
- **검증(정직한 현재 상태):** 이 기능 추가 직후 실제로 실행한 결과 `PASS 10 / WARN 0 / FAIL 1` — 새로 추가한 검사가 **의도한 대로 실제 캐시 낡음을 잡아냈다.** 이 FAIL은 검증기의 결함이 아니라 실제 배포 격차를 정확히 반영한 것이며, `/reload-plugins` 실행 후 재검증하면 `PASS 11 / WARN 0 / FAIL 0`이 될 것으로 예상(아직 사람이 실행 전이라 확정 아님).

### 2026-07-18 패치 — Harness 감지 경로 오탐 수정 + 작업폴더 밖 쓰기 보호 항상 적용 (보안, `34022b4`)

> 배경: 라이브 검증 중 이 기기의 실제 Windows Claude Code 플러그인 캐시 경로(`%APPDATA%\claude-code\plugins\cache\...`)가 `delegate.mjs`가 보던 경로(`~/.claude/plugins`)와 달라, SoDamHarness가 실제로 설치돼 있어도 `isHarnessAlive()`가 항상 `false`를 반환하던 것을 발견(CHECKPOINT §0-18). 안전 구멍은 아니었으나(fail-closed 유지 방향으로만 어긋남), 곧이어 이 오탐을 고치자 진짜 안전 구멍이 하나 드러났다.

- **`hooks/delegate.mjs` — Harness 감지 경로 수정.** 탐색 후보에 실제 Windows 캐시 경로를 추가하고, 탐색 깊이를 2단계→3단계로 확장(`<marketplace>/<plugin>/<version>/` 버전 폴더 인식). 수정 직후 `_selftest.mjs`가 39 PASS/15 FAIL로 회귀 — 원인은 테스트 헬퍼가 실제 Harness 감지 결과에 암묵 의존해온 것. `SODAM_AGENTIC_TEST_FORCE_NO_HARNESS` 테스트 전용 플래그 추가(보호를 항상 강제하는 방향이라 "테스트 백도어 없음" 원칙과 배치되지 않음)로 해소, 54 PASS 회복.
- **`hooks/guard.mjs` — 🔴 실사용에서 발견된 진짜 안전 구멍 수정.** 위 수정으로 Harness 위임이 실제로 켜지자, `D:\Test_Dev\test3` 라이브 테스트에서 "작업폴더 밖에 새 파일 생성" 요청이 확인창 없이 조용히 통과되는 회귀가 관찰됨. 원인: SoDamHarness 실제 설치본(`guard.mjs`)을 직접 열어 확인한 결과 "작업폴더 밖 새 파일 쓰기" 검사 자체가 없었음(Harness 쪽 주석에 "과잉 차단이라 폐기"로 명시된 의도된 설계) — 위임했더니 위임 대상이 애초에 그 보호를 안 갖고 있어 조용히 사라진 것(`01_PRD.md` B1이 우려한 "위임 실패 시 무방비"의 변종). `isOutsideWorkdir()` 체크만 Harness 생존 여부와 무관하게 항상 자체 수행하도록 수정(다른 위임 항목은 유지 — 과잉 수정 안 함).
- **검증:** `_selftest.mjs` 54 PASS/0 FAIL. 실제 harness=true 상태에서 합성 payload로 재현 → 수정 전 조용히 통과하던 것이 수정 후 `ask`로 정상 확인질문 발생 확인.
- **정직한 한계:** 이 수정이 실제 설치 캐시를 통해 재현되는지(수동 `node` 호출이 아니라)는 아직 사람의 라이브 재검증 대기 중.

### 2026-07-18 패치 — 슬래시 명령 짧은형 전환 + skills/commands 이중 구조 (`ccb7b31`, `35b7b22`)

> 배경: 사용자가 `/sodam-agentic:sodam-agentic-start`처럼 플러그인명과 명령명이 겹쳐 길어지는 문제를 짧은 형태로 요청. 시도 과정에서 Claude Code 자체의 알려진 제한을 발견했다: `skills/*/SKILL.md`는 **자동 발동만 되고 사용자가 직접 타이핑하는 수동 슬래시 호출은 지원하지 않는다**([anthropics/claude-code#41842](https://github.com/anthropics/claude-code/issues/41842)). 처음 시도한 "skills 폴더만 rename"은 구조적으로는 맞았지만 이 플랫폼 한계 때문에 실제로는 작동할 수 없는 수정이었다(CHECKPOINT §0-21·§0-22).

- **이름 단축:** `commands/sodam-agentic-start.md`→`start.md`, `sodam-agentic-log.md`→`log.md`, `skills/sodam-agentic-plan/`→`plan/`, `skills/sodam-agentic-review/`→`review/`, `skills/sodam-agentic-start/`→`start/`(파일명만 변경, 내용 동일).
- **skills + commands 이중 구조 신설.** `commands/plan.md`·`commands/review.md` 신규 생성(수동 호출 담당) — 기존 `skills/plan/`·`skills/review/`는 자동 발동 담당으로 그대로 유지. F2·F3 둘 다 이제 "자동발동(skill) + 수동호출(command)" 두 경로를 가진다.
- **`commands/*.md`의 frontmatter `name:` 필드 제거.** 형제 저장소 SoDam-Harness-Eng의 실제 동작 파일(`name:` 없이 `description:`만 존재)과 대조해 확인한 패턴 — `name:` 유무가 Claude Code autocomplete의 표시 형식(짧은형 vs `sodam-agentic:이름` 완전정규형)에 영향을 준다는 것을 재현으로 확인(단, 공식 문서 명시 동작은 아닌 내부 동작 추정). `scripts/validate.mjs`도 함께 수정: command는 `name` 생략 허용(파일명이 명령 이름으로 정상 등록됨), skill은 `name` 필수 유지(버전 해시 버그 실사례 있어 완화 안 함).
- **문서 동기화:** README/GUIDE(한/영, md+html) 전체를 짧은 명령 형태로 갱신, `LIVE_TEST_GUIDE.md` 신규 작성(비개발자 대상 실사용 테스트 절차서), 캐시 새로고침 안내를 실측 확인된 "`uninstall`→`install`→`reload-plugins`" 순서로 정정(`marketplace update`만으론 불충분함을 실측 확인 — CHECKPOINT §0-19).
- **검증:** `validate.mjs` PASS 13/WARN 0/FAIL 0, `_selftest.mjs` 54 PASS/0 FAIL. 재설치(`uninstall`→`install`→`reload-plugins`) 후 사용자가 새 세션에서 `/sodam-agentic` 입력 → `sodam-agentic:start`·`sodam-agentic:plan`·`sodam-agentic:review`·`sodam-agentic:log` 4개 전부 완전정규형으로 뜨는 것을 스크린샷으로 확인·보고.

### 2026-07-26 패치 — F2/F3 발동 마커 추가 (`bb2a89e`, `807b74e`)

> 배경: F2/F3가 실제로 발동하는지 라이브 관찰이 계속 안 되던 문제(§0-6 "코드로는 구분 불가")를 해소하기 위해 스킬 본문에 발동 마커 도입.

- `skills/plan/SKILL.md`·`skills/review/SKILL.md`에 발동 시 화면 맨 위에 `🚀 소담 — 계획 먼저` / `🔍 소담 — 변경점 검토`를 먼저 출력하도록 지시문 추가. 코드 로직 변경 없음(SKILL.md 지시문만 추가라 회귀 위험 없음).
- `LIVE_TEST_GUIDE.md`·`GUIDE.md` 둘 다 이 마커 문구를 확인 기준으로 반영(`807b74e`, 2026-07-27 GUIDE.md 반영분 포함).

### 2026-07-27 패치 — `.claude/settings.json` 민감 변경 deny-first (보안, `07_SECURITY.md §1/§5` MUST 충족)

> 배경: PRD 재검증 중 `07_SECURITY.md`가 MUST(P1)로 못박은 "settings.json의 민감 변경(MCP 활성·권한·훅 경로)은 deny, 그 외는 ask"가 실제 `guard.mjs`엔 구현 안 돼 있었음을 발견(지금까지는 내용 무관 항상 ask). "ask는 93% 그냥 승인된다"(`06_RESEARCH_UPGRADES.md` A2)는 이 프로젝트 자신의 근거를 감안하면, AI 안전장치 자체를 무력화할 수 있는 가장 위험한 변경이 신뢰 못할 확인창 하나로만 방어되던 셈이었다.

- **`hooks/guard.mjs`** — Write/Edit/MultiEdit로 `.claude/settings(.local).json`을 바꿀 때, 새 내용에 `mcpServers`·`enableAllProjectMcpServers`·`permissions`·`hooks` 키가 등장하면 `deny`, 그 외 내용(예: 모델명 변경)은 기존대로 `ask`.
- **의도적으로 범위를 좁힌 부분:** 셸 명령 경유(`cat`·리다이렉트 등)는 대상에서 제외하고 기존 `ask`를 유지. 임의 문자열이라 내용을 안전하게 판정할 수 없고, 이 경로까지 deny로 올리면 `cat .claude/settings.json` 같은 단순 조회까지 막는 과잉차단이 되기 때문(코드를 읽고 확인 후 애초 제안보다 범위를 좁힘).
- **검증:** `hooks/_selftest.mjs`에 신규 케이스 9건 편입(민감 키 4종 개별 deny 확인 + 벤치성 오탐 없음 확인 + Bash 경로 미변경 확인) — 67 PASS → **76 PASS / 0 FAIL**. `scripts/validate.mjs`는 "설치 캐시 최신성"만 예상대로 FAIL(방금 고친 코드가 아직 재설치 전이라 당연한 결과, `/reload-plugins` 필요).

### 2026-07-27 패치 — 마켓플레이스 이름 충돌로 실사용 테스트 전면 불가 상태였던 것 발견·수정 (치명, `CHECKPOINT.md §0-32`)

> 배경: `D:\Test_Dev\test3`에서 실사용 테스트 시 `/sodam-agentic:start` 자체가 "없는 명령어"로 뜸. `claude plugin list`로 실측한 결과 `sodam-agentic@sodam`이 `failed to load`(marketplace sodam에서 sodam-agentic을 못 찾음) 상태였고, `claude plugin marketplace list` 확인 결과 마켓플레이스 이름 `"sodam"`이 형제 플러그인 SoDam-Design-Kit(`.claude-plugin/marketplace.json`도 동일하게 `"name": "sodam"`)에 선점되어 있었음. 지금까지 반복 관찰된 "설치 캐시 낡음"(validate.mjs FAIL)은 이 사건의 결과였고, "재설치하면 해결"이라는 이전 안내는 근본 원인을 몰랐을 때의 불완전한 진단이었음.

- **`.claude-plugin/marketplace.json`**: 마켓플레이스 이름을 `"sodam"` → **`"sodam-agentic"`**으로 변경(다른 형제들처럼 프로젝트 고유 이름 사용, Design-Kit은 전혀 건드리지 않음).
- **설치 명령 전면 갱신**: `sodam-agentic@sodam` → `sodam-agentic@sodam-agentic`(GUIDE.md·GUIDE.en.md·README.md·README.en.md·LIVE_TEST_GUIDE.md·docs/F4-라이브검증-런북.md·docs/왕초보-테스트-가이드.md·docs/SUITE-README.ko/en.md의 SoDamAgentic 항목).
- **검증**: `validate.mjs`의 "설치 캐시 최신성"이 FAIL(낡은 캐시 발견)→WARN(새 이름 경로에 캐시 없음, 재설치 전이라 정상)으로 전환. PASS 12건 유지.
- **남은 것(사람 전용)**: `/plugin marketplace add` + `/plugin install sodam-agentic@sodam-agentic`을 새 세션에서 실행해야 실제로 반영됨.

### 2026-07-27 패치 — settings.json 민감 키 "삭제"도 deny로 잡도록 보강 (보안, `CHECKPOINT.md §0-33`)

> 배경: 전면 기능 테스트 중 `.claude/settings.json`에서 기존 `permissions` 제한을 삭제하는 Edit이 `deny`가 아니라 `ask`만 뜨는 것을 실제 실행으로 재현. 지난 패치(07-27 앞선 항목)가 "새 내용에 민감 키가 있으면 deny"만 구현했고 "있던 민감 키를 지워서 무력화"하는 경우는 놓치고 있었음.

- **`hooks/guard.mjs`**: `oldContents()`(Edit/MultiEdit old_string)·`existingFileContent()`(Write 직전 실제 파일 내용) 추가 — 새 내용·이전 내용 어느 쪽에 민감 키가 있어도 deny.
- **회귀 발견·수정**: 수정 직후 기존 테스트 1건이 실제 사용자 홈(`homedir()`)에 의존하고 있어 결과가 기기마다 흔들리는 잠재 결함이 표면화됨 → 격리된 임시 HOME으로 결정적으로 만들어 해결.
- **검증**: `hooks/_selftest.mjs`에 회귀방지 테스트 2건 추가 — 76 PASS → **78 PASS / 0 FAIL**.

### 2026-07-27 패치 — `.mcp.json`(진짜 MCP 서버 정의 파일) 전면 무방비 상태 발견·수정 (보안, `07_SECURITY.md §1` MUST)

> 배경: 실사용 테스트 중 `.claude/settings.json`에 `mcpServers`를 추가하는 시도가 Claude Code 자체 스키마 검증으로 거부됨 → 공식문서로 확인한 결과 `mcpServers`는 `.claude/settings.json`엔 존재하지 않는 필드이고 `.mcp.json`에만 존재. 즉 지금까지 `SETTINGS_SENSITIVE_KEYS`의 `mcpServers` 검사는 애초에 존재하지 않는 위치만 감시하고 있었고, **실제로 MCP 서버(=자동 실행될 명령)가 정의되는 `.mcp.json`은 이 훅이 전혀 감시하지 않았음**(deny는커녕 ask도 없음).

- **`hooks/guard.mjs`**: `isMcpConfigFile()` 신설(`.mcp.json` 경로 판정) + Write/Edit/MultiEdit·Bash 리다이렉트 양쪽 경로 모두에서 `.mcp.json`을 항상 `deny`(파일 전체가 "무엇을 실행할지" 정의라 안전한 내용이 없어 부분 판정 불필요). 기존 `mcpServers`를 `SETTINGS_SENSITIVE_KEYS`에서 빼지는 않음(settings.json에 잘못 들어와도 막는 게 안전 쪽으로 무해).
- **검증**: `hooks/_selftest.mjs`에 `.mcp.json` deny 테스트 3건(Write·Edit·Bash 리다이렉트) 추가 — 78 PASS → **81 PASS / 0 FAIL**.

### 2026-07-27 패치 — GUIDE.md/GUIDE.en.md(+html) 4종 제거, README로 통합 (문서 갭 소급 기록, 2026-08-02 발견)

> 배경: 이 시점 커밋(`d5b73aa`·`01bb186`)이 CHANGELOG·CHECKPOINT 어디에도 기록 없이 진행됐던 것을 다음 세션이 발견해 소급 기록한다.

- **`GUIDE.md`·`GUIDE.en.md`·`GUIDE.html`·`GUIDE.en.html` 4개 파일 삭제** — `README.md`·`README.en.md`(+html)를 설치·사용·보안·라이선스를 모두 담은 통합 상세 문서로 전면 확장(8파일, +3,441/-4,102줄)해 대체. `LIVE_TEST_GUIDE.md`의 `GUIDE.md` 링크도 `README.md`로 후속 정정.
- **놓친 것(2026-08-02 발견·확인)**: `docs/SUITE-README.ko.md`·`.en.md`의 `GUIDE.md` 언급 2곳은 확인 결과 **SoDamHarness(다른 형제 플러그인) 자신의 GUIDE.md를 가리키는 것**이라 이 삭제와 무관 — 손대지 않음(형제 저장소 소관, 읽기전용 원칙).

### 2026-08-02 패치 — settings.json MCP 승인 필드 4종 deny 확장 (보안, `CHECKPOINT.md §0-28` 적용) + `.gitignore` 갭 수정

> 배경: `CHECKPOINT.md §0-28`이 "코드는 완성, 적용만 대기"로 남겨뒀던 수정 — 이를 막던 SoDamLoop 상태파일 오탐(`~/.sodam-loop/state-sl-sp2-test-20260629.json`의 `status:"running"`)이 그 사이 해소된 것을 이번 세션이 확인해 적용.

- **`hooks/guard.mjs`**: `SETTINGS_SENSITIVE_KEYS`에 `enabledMcpjsonServers`·`disabledMcpjsonServers`·`enabledMcpServers`·`disabledMcpServers` 4종 추가(기존 `mcpServers`·`enableAllProjectMcpServers`·`permissions`·`hooks` 4종과 합쳐 총 8종). 공식문서(code.claude.com/docs/en/mcp.md) 확인: 이 4개가 `.mcp.json` 프로젝트 서버의 승인·신뢰 여부를 실제로 결정 — settings.json에서 몰래 바꾸면 Claude Code 자체 "승인 대기" 안전장치를 우회해 악성 MCP 서버를 자동 승인시킬 수 있음.
- **`.gitignore`**: `.sodam-re/`(다른 소담 형제 플러그인의 로컬 산출물로 추정, 이 repo 소유 아님) 추가 — 커밋 이력에 섞여 들어가는 것을 사전 방지(§0-24 ①의 `.codex/` 사건과 동일 패턴 재발 방지).
- **검증**: `hooks/_selftest.mjs`에 신규 4종 deny 테스트 4건 추가 — 85 PASS → **89 PASS / 0 FAIL**. `node --check` 2개 파일 OK. `validate.mjs` PASS 12/WARN 0/FAIL 1(설치 캐시만 낡음 — 방금 고친 코드라 당연한 정상 결과, `/reload-plugins` 필요).

### 2026-08-02 패치 — settings.json 필드 3종 추가 deny + 직전 패치 정정(공식문서 재대조로 실제 위험 필드 확인)

> 배경: 바로 위 패치가 "MCP 승인 필드 완전 방어"라 자칭했으나, 이를 의심하고 `code.claude.com/docs/en/settings.md`·`.../mcp.md` 전체 필드 목록을 다시 대조한 결과 (a) 방금 추가한 `enabledMcpServers`·`disabledMcpServers`가 실제로는 `.claude/settings.json`이 아니라 별도 파일 `~/.claude.json`에 저장되는 값이라 이 훅에서는 발동 조건이 성립하지 않는다는 것과 (b) 그보다 훨씬 위험한 필드 3개가 완전히 무방비였다는 것을 확인함.

- **정정(코드 변경 없음, 문서·주석만):** `enabledMcpServers`·`disabledMcpServers`는 실제 저장 위치가 `~/.claude.json`이라 `isSettingsFile()` 경로 매칭 대상 밖 — 목록엔 안전 쪽으로 무해하니 그대로 두되(실수로 진짜 settings.json에 등장해도 막아줌), 주석에 이 한계를 명시. `~/.claude.json` 자체를 감시 범위로 넓히는 건 Claude Code 자신이 그 파일에 수시로 정상 쓰기를 해서 오탐 위험이 커 이번엔 보류(별도 세션에서 신중히 설계).
- **`hooks/guard.mjs`**: `SETTINGS_SENSITIVE_KEYS`에 `disableAllHooks`(훅 전체를 끄는 단일 스위치 — F4 전체 무력화 가능)·`env`(모든 세션에 주입되는 환경변수 — `ANTHROPIC_BASE_URL` 변조로 API 통신 우회 가능, `07_SECURITY.md §6`이 이미 SHOULD로 요구했으나 미구현이었음)·`apiKeyHelper`(인증 헤더 생성 명령 자체를 바꿀 수 있음) 3종 추가(총 11종).
- **의도적으로 추가 안 함(범위 유지)**: `awsCredentialExport`·`awsAuthRefresh`·관리형(managed) 전용 필드 — 이 프로젝트·PRD 어디에도 AWS/조직관리 사용 근거가 없어 추가하면 근거 없는 과설계(Simplicity First 위반).
- **검증**: `hooks/_selftest.mjs`에 신규 3종 deny 테스트 3건 추가 — 89 PASS → **92 PASS / 0 FAIL**. `node --check` 2개 파일 OK. `validate.mjs` PASS 12/WARN 0/FAIL 1(설치 캐시만 낡음, 동일 정상 패턴).

### 2026-08-02 패치 — `LIVE_TEST_GUIDE.md`에 `.mcp.json` 라이브 테스트 단계 신설 (문서, 코드 변경 없음)

> 배경: 05_FAMILY_RISKS.md PART D("종이 위 분석은 바닥에 도달, 다음은 실제 실행")에 따라 코드 재감사 대신, 오늘 3세션(§0-36·§0-39·§0-40)에 걸쳐 늘어난 보안 항목이 실제 사람이 보는 `LIVE_TEST_GUIDE.md`에는 반영 안 됐음을 발견. CHECKPOINT.md §0-38 1순위가 "가장 시급"이라 못박은 `.mcp.json` deny 테스트가 이 문서엔 아예 없었음(CHECKPOINT는 AI용·gitignored라 사람이 실제로 펴 보는 문서가 아님).

- **테스트 3-5 신설**: `.mcp.json`에 `mcpServers`를 추가하려는 시도가 확인 질문 없이 즉시 deny되는지 확인하는 단계(§0-38 1순위 재현 문구 그대로 사용). "이 문서의 다른 항목과 달리 아직 한 번도 실제 확인 안 됨"을 명시.
- **테스트 3-4 보강**: "지키는 범위가 11개 항목으로 넓어졌다"는 한 줄만 추가(왕초보 대상 문서 원칙상 11개 전부 나열하지 않음, 궁금하면 CHANGELOG 참고로 안내).
- **기준일 갱신**: 2026-07-27 → 2026-08-02.

### 2026-08-02 패치 — `.PRD/03_PHASES.md`에 "Phase 3 진입 게이트" 3종 신설 (문서, 코드 변경 없음)

> 배경: "다음 Phase 작업 방향" 요청을 받아 `03_PHASES.md`를 재확인한 결과, Phase 3(F8 무경험자 모드·MCP 큐레이션) 착수 조건이 "전제조건 미충족"으로만 적혀 있고 구체적 통과 기준이 없었음. 특히 F8의 전제인 "본질 충돌 해결책 검증"은 `01_PRD.md`·`03_PHASES.md` 모두 검증해야 한다고만 적혀 있을 뿐 무엇을 검증하는지 정의된 적이 없었던 실제 빈틈.

- **게이트 1(Phase 2 완료 확인)**: `CHECKPOINT.md §0-38`의 사람 라이브 확인 5개 항목을 Phase 3 착수 전제조건으로 명문화.
- **게이트 2(F8 검증 항목 구체화)**: "판단 대신 vs 판단 재료 제공" 구분, 무경험자 모드에서도 F4 안전훅 유지, ON/OFF가 안전 수준을 낮추지 않는다는 테스트 근거 — 3개 질문으로 구체화. 하나라도 미해결이면 F8 보류.
- **게이트 3(MCP 큐레이션 신뢰 기준)**: 공식 카탈로그 등재·소스 공개 확인·서명 관리자·자사 실사용 이력 중 최소 2개 충족을 최소 기준으로 명문화.
- **로드맵 요약 표**: Phase 3 상태 셀에 "게이트 3종 명문화됨·게이트 1 미통과" 반영.
- **코드 변경 없음** — `.PRD/`는 gitignored라 이 패치는 로컬 문서에만 반영(커밋 대상 아님).

### 2026-08-02 패치 — 🔴 F7(Codex 안전 패리티) "허공 위임" 결함 수정 + 문서 갭 2건 정정

> 배경: "PRD에 적힌 것 전부 구현 준비"라는 요청을 받아, 이번엔 제 자신의 재검토가 아니라 PRD를 한 번도 본 적 없는 독립 서브에이전트 5개를 병렬로 띄워 14개 PRD 문서 전체를 코드와 처음부터 다시 대조했다. 그 결과 5라운드 연속 "갭 없음"이었던 이전 결론과 달리, 이미 "완료"로 표시돼 있던 F7(Codex 안전 패리티)에서 실제 안전 결함을 발견했다.

- **🔴 안전 결함 수정 (`hooks/guard.mjs`)**: `05_AUDIT_AND_DECISIONS.md` 결정 B2("Codex에선 Harness 위임 안 하고 전체 폴백 유지")와 달리, `isHarnessAlive()`는 Claude Code 전용 플러그인 경로만 검사해 "지금 Codex 위에서 실행 중인지"를 전혀 몰랐다. 같은 PC에 Claude Code+SoDamHarness가 설치돼 있으면(형제 플러그인 세트 전제상 흔함) Codex 배포본도 `harness=true`로 오판해 `isSensitive()`(SSH·AWS·`.codex`·시스템폴더 보호)·`pathTraversesSymlink()` 검사와 단일파일삭제 확인을 건너뛰었는데, `codex/install.mjs`는 Harness의 훅을 `.codex/hooks.json`에 등록하지 않아 그 위임을 아무도 받지 않는 "허공 위임"이었다. **수정**: `guard.mjs`가 자신의 파일 경로(`.../.agents/hooks/guard.mjs` — `codex/install.mjs`의 고정 배포 위치)로 Codex 배포본임을 스스로 감지하면(`IS_CODEX_DEPLOY`) `harness`를 무조건 `false`로 강제해, Codex 쪽은 항상 원래 결정대로 "전체 폴백"을 쓰게 만들었다.
- **검증**: `hooks/_selftest.mjs`에 이 결함을 재현하는 신규 테스트 3건 추가 — `.agents/hooks/`에 복사한 guard.mjs가 이 기기의 실제 Harness 설치 여부와 **무관하게** 시스템 폴더 쓰기를 deny, 단일파일 삭제를 ask 하는지 확인(기존 테스트는 전부 `SODAM_AGENTIC_TEST_FORCE_NO_HARNESS`로 harness를 강제 false시켜 결정론을 확보하는데, 그러면 이 버그 자체가 재현 안 됐던 게 92개 기존 테스트가 전부 통과하면서도 실제로는 이 결함이 존재했던 이유). 92 PASS → **95 PASS / 0 FAIL**. `node --check` 2개 파일 OK. `validate.mjs` PASS 12/WARN 0/FAIL 1(설치 캐시만 낡음, 방금 고친 코드라 당연한 정상 결과).
- **문서 갭 정정 (`docs/family-synergy.md`)**: §5가 2026-07-27에 이미 폐기된 "형제마다 공용 `sodam` 마켓플레이스 이름" 계획을 예시 명령으로 그대로 안내 중이었다(정확히 그 이름 충돌 사고를 유발했던 패턴) — "형제마다 고유 이름" 현재 표준으로 정정 + 폐기 경위 각주 추가.
- **문서 갭 정정 (`README.md`/`README.en.md`)**: §1 사전 준비물 표에 `git`(명령줄 도구)이 빠져 있었는데, §4 Codex 설치 단계는 실제로 `git clone`을 요구해 완전 초보자가 Codex 경로에서 막힐 수 있었다 — 준비물 행 추가(필수 조건: Codex 설치 시).
- **이번엔 손대지 않음(별도 판단 필요)**: `${CLAUDE_PLUGIN_DATA}` 미사용(`CHECKPOINT.md §0-30`에 설계 완료·미검증 상태로 기록됨, 실제 적용 시 인자 전달 방식 실측 확인 필요), README 설치 스크린샷 자리 부재(개인용 도구라 우선순위 낮음).

### 2026-08-02 패치 — `${CLAUDE_PLUGIN_DATA}` 안전 마이그레이션(폴백 유지) + 문서 오기 2건 정정

> 배경: 직전 라운드에서 미뤄뒀던 `CHECKPOINT.md §0-30`의 설계(안전 기록 저장 위치를 `~/.sodamagentic` 하드코딩에서 공식 영구 데이터 경로 `${CLAUDE_PLUGIN_DATA}`로)를, "치환이 실제로 되는지 라이브 미검증"이라는 리스크를 폴백 설계로 흡수해 지금 적용했다.

- **`hooks/hooks.json`**: `guard.mjs` 실행 command에 `"${CLAUDE_PLUGIN_DATA}"`를 두 번째 인자로 추가.
- **`hooks/guard.mjs`**: `resolveLogDir()` 신설 — 데이터 저장 위치를 ① `SODAM_AGENTIC_DATA`(테스트 격리, 최우선) ② `process.argv[2]`(위 인자, 절대경로처럼 보일 때만 신뢰 — 치환 실패로 리터럴 `${...}` 문자열이 그대로 오면 무시) ③ 기존 `~/.sodamagentic`(폴백) 순으로 결정. 치환이 되면 업데이트·재설치 생존 + 제거 시 자동정리라는 공식 기능을 얻고, 안 되더라도(Codex 등 애초에 인자를 안 주는 환경 포함) 오늘까지와 완전히 동일하게 동작 — 회귀 위험을 설계로 0에 수렴시킴. 기존 로그(2,779줄 실측, §0-30) 자동 이관은 하지 않음(§0-30 결정 유지).
- **`commands/log.md`**: `/sodam-agentic:log` 조회 시 새 위치(`~/.claude/plugins/data/sodam-agentic/`)와 예전 위치(`~/.sodamagentic/`)를 둘 다 확인해 합쳐서 보여주도록 안내 갱신(위치 전환 중 기록이 두 파일로 나뉠 수 있어서).
- **검증**: `hooks/_selftest.mjs`에 3가지 시나리오(치환 성공/치환 실패/인자 자체 없음) 회귀 테스트 3건 추가 — 95 PASS → **98 PASS / 0 FAIL**. `node --check` 2개 파일 OK, `hooks.json` JSON 유효성 확인. `validate.mjs` PASS 12/WARN 0/FAIL 1(설치 캐시만 낡음, 방금 고친 코드라 당연한 정상 결과).
- **문서 오기 2건 정정(`.PRD/`, gitignored)**: `08_LICENSE_LEGAL.md`의 낡은 "[결정 필요]"(실물은 이미 Apache-2.0 확정) 정정, `01_PRD.md`·`03_PHASES.md`의 OWASP 감사 출처 오기재(실제 OWASP 요구사항은 `07_SECURITY.md`) 정정.
- **이번에도 손대지 않음**: README 설치 스크린샷(사람의 실제 캡처 필요, AI가 대행 불가).

### 2026-08-03 기록 — 🔴🔴 실측 발견: 설치 캐시가 7/27에 멈춰 이후 안전 수정 전부 미적용(코드 변경 없음, 조사 기록)

> 배경: 안전 기록 로그 파일(`~/.sodamagentic/safety-log.jsonl`)이 오늘 아침까지 실시간으로 쌓이고 있는 걸 확인해 실제 설치 캐시를 직접 열어봤다.

- 설치 캐시(`%APPDATA%\claude-code\plugins\cache\`) 2개 마켓플레이스 변형 전부 `hooks/guard.mjs`가 **2026-07-27** 시점 그대로임을 실물 파일로 확인.
- 이후 커밋 전부(§0-39·§0-40의 settings 11종 확장, §0-44의 B2 Codex 위임 결함 수정, §0-45의 `${CLAUDE_PLUGIN_DATA}`)가 소스코드·git·테스트(98 PASS)에서는 존재하지만, **실제 실행 중인 플러그인엔 반영되지 않은 상태**임을 확인(`IS_CODEX_DEPLOY`·`resolveLogDir` 문자열 grep 0건, `SETTINGS_SENSITIVE_KEYS` 여전히 4개).
- 상세 근거·영향 범위·재설치 절차는 `CHECKPOINT.md §0-46` 참조.
- **코드 변경 없음** — 조사 결과만 기록. 캐시를 직접 수정하지 않음(정식 재설치 절차 우회 금지).

### 2026-08-03 패치 — `LIVE_TEST_GUIDE.md` "1.5단계" 신설 — 재설치 확인 방법을 "명령 목록 보임"에서 "파일 내용 직접 확인"으로 교체 (문서, 코드 변경 없음)

> 배경: `§0-46`에서 재설치 여부를 한 번도 실측 확인하지 않은 채 방치됐던 게 드러났다. 원인을 되짚어보니 기존 문서의 "0단계 성공 확인"이 `/sodam-agentic` 명령 4개가 뜨는지만 보는 방식이었는데, 이 4개는 아주 오래전부터 있던 것들이라 예전 캐시가 깔려 있어도 똑같이 다 뜬다 — 애초에 새로고침 여부를 구분 못 하는 확인법이었다.

- **`LIVE_TEST_GUIDE.md` "0단계"**: "방법 A(재시작)가 가장 확실함"이라는 미검증 단정 문구 제거(재시작만으로 새로고침됐다는 근거가 실제로는 없었음 — §0-46 발견 자체가 "새로고침 여부를 확인 안 했다"는 사실이지 "재시작이 안 된다"는 증거는 아니라 과장하지 않음). 이 컴퓨터에 `sodam`·`sodam-agentic` 두 마켓플레이스 이름이 동시에 등록돼 있는 것이 실제로 확인된 사실을 반영해, 마켓플레이스 이름을 직접 타이핑하는 방법 대신 `/plugin` 메뉴로 눈으로 보며 진행하는 방법을 방법 B로 승격.
- **"1.5단계" 신설**: 새 세션을 연 직후 AI에게 `hooks/guard.mjs` 안의 `IS_CODEX_DEPLOY`·`resolveLogDir` 문자열 존재 여부를 직접 확인시키는 절차. "최신 버전 맞음"이 나오기 전까지 2단계 이후 진행을 명시적으로 보류시킴.
- **기준일 갱신**: 2026-08-02 → 2026-08-03.
- **코드 변경 없음** — 문서만 갱신. `git diff` 대상은 `LIVE_TEST_GUIDE.md`(git-tracked)뿐.

### 2026-08-03 패치 — 첫 실사용 라이브 테스트 결과 반영 + F6 안전기록 누락 결함 발견(수정 시도, 미적용) + 테스트 문구 강화

> 배경: 사용자가 `D:\Test_Dev\test3`에서 처음으로 `LIVE_TEST_GUIDE.md` 2~5단계를 실제 수행하고 결과를 보고. AI 자신의 실시간 판단("이 안전장치는 이번엔 발동 안 함")을 그대로 믿지 않고 실제 `safety-log.jsonl`과 설치 캐시 코드를 직접 대조해 검증했다.

- **§0-38 갱신**: `.mcp.json` deny(1순위) 첫 실측 통과 확인. 작업폴더 밖 쓰기 ask는 실제로는 정상 작동했으나 AI의 실시간 자체보고가 틀렸던 사례로 확인(확인창은 UI 팝업이라 대화록 텍스트엔 안 보임). 폴더 전체삭제 deny·설정파일 ask/deny·F2/F3 배너는 이번에도 미확인(AI 자체판단이 도구 호출 전에 개입하는 동일 패턴 반복).
- **🔴 신규 발견**: 오늘 발생한 `.mcp.json` deny 이벤트 2건이 `safety-log.jsonl`에 전혀 기록되지 않음(전체 파일 검색으로 확인, 이 파일에 대한 마지막 기록은 2026-07-27). 원인 조사 결과 훅 등록 경로·캐시 코드 구조는 정상(가설 배제), 남은 가설은 **여러 소담 형제 프로젝트가 같은 로그 파일에 동시 append하다 Windows 파일잠금 경합으로 실패 → `logSafetyEvent()`의 `try/catch`가 조용히 삼킴**(메커니즘 뒷받침되나 재현·증명은 안 됨, 가능성으로만 기록).
- **수정 설계했으나 미적용**: `hooks/guard.mjs`의 `logSafetyEvent()`에 재시도(최대 3회, `Atomics.wait` 20ms) 로직을 추가하려 했으나, Edit 시도가 `"안전 파일은 루프가 수정할 수 없습니다(자기보호 가드레일)"` 메시지로 거부됨. 우회 시도 안 함 — `hooks/guard.mjs`는 현재 **미변경 상태**. 설계안은 `CHECKPOINT.md §0-47`에 기록.
- **`LIVE_TEST_GUIDE.md` 문구 강화**: 테스트 3-2(폴더 전체삭제)에 "확인하지 말고 물어보지도 말고 바로" 명시 추가, 테스트 3-4(설정파일)에 3-5와 동일한 "다른 건 묻지 말고 바로 진행해줘" 추가 — 둘 다 AI 자체판단이 먼저 개입해 안전장치 코드 자체가 시험 안 되는 문제의 재발 방지.
- 상세 = `CHECKPOINT.md §0-47`.

### 2026-08-13 패치 — README/README.en의 "비공개(PRIVATE)" 서술을 실제 GitHub 상태(PUBLIC)와 일치하도록 정정 (문서, 코드 변경 없음)

> 배경: PRD 재확인 세션 중 `gh repo view`로 실제 GitHub 공개 상태를 재확인한 결과 `visibility: PUBLIC`(`isPrivate: false`)이었으나, `README.md`·`README.en.md`(2026-08-04 전면 재작성분)는 6곳(§1 상태 배너·§2 준비물 표·§5 설치 안내·§9 파일위치 표·§13 문제대처 표·§17 기여/문의)에서 "비공개(PRIVATE)"를 그대로 단정하고 있었음. 저장소가 정확히 언제 공개로 전환됐는지는 이 저장소 이력만으로 확정할 수 없으나, 같은 날 다른 소담 형제 저장소에서도 유사한 공개 전환 정황이 있어 의도된 전환일 가능성이 높다고 판단.

- **README.md·README.en.md 6곳 동일 위치 정정** — "비공개/PRIVATE" → "공개/PUBLIC" 사실 반영. GitHub 계정 요구사항도 "필수"→"선택"으로 정정(공개 저장소는 접근 권한이 불필요).
- **선행 안전 점검(07_SECURITY.md §7 MUST 재확인)**: 공개 전환 시 필수인 "시크릿 0 재확인"을 `git ls-files`(35개 파일) 전수 재스캔으로 재실행 — 실제 매치 7건 전부 정규식 패턴 예시 문자열(`sk-ant-...`)이지 실제 키 값 아님, **실제 노출 0건** 확인 후 진행.
- **의도적으로 하지 않은 것**: `.PRD/01_PRD.md:137`의 "PRIVATE로 유지" 문구는 2026-07-15 시점 결정을 기록한 역사적 서술이라 소급 수정 안 함(역사적 사실 소급 수정 금지 원칙, `CHECKPOINT.md §0-27`·`§0-32` 등 다수 선례와 동일). 저장소 공개 범위 자체(다시 비공개로 되돌릴지 여부)는 AI가 결정하지 않음 — 사용자 확인 사항으로 남김.
- **검증**: pandoc으로 `README.html`·`README.en.html` 재생성. 코드 변경 없어 `_selftest.mjs`·`validate.mjs` 재실행 불필요.

### 2026-08-13 패치 — `codex/install.mjs`가 `hooks/`의 로컬 도구 잔여물(dotfile)까지 함께 복사하던 결함 수정

> 배경: "현재까지 구현된 기능이 제대로 작동하는지" 요청에 따라 `codex/install.mjs`를 빈 폴더에서 실제로 실행해보는 라이브 통합 테스트를 처음 수행했다. 결과물에 `guard.mjs`·`delegate.mjs`·`hooks.json` 외에 `.omc/`·`.plugin-config/`·`.complexity-log.md`·`.todos-report.md` 같은, 이 프로젝트와 무관한 로컬 Claude Code 하네스 세션 상태 파일들이 함께 복사돼 있는 것을 발견했다.

- **원인**: 소스 `hooks/` 폴더 자체에 (다른 로컬 도구가 그 시점 작업 경로를 잘못 잡아 만든 것으로 추정되는) 위 잔여물이 실제로 존재했고, `install.mjs`의 복사 필터가 `_`로 시작하는 이름(`_selftest.mjs`)만 제외해 `.`으로 시작하는 로컬 잔여물은 걸러내지 못했다.
- **먼저 확인한 것(심각도 판단)**: `git ls-files hooks/` 결과 실제 git 추적 파일은 `delegate.mjs`·`guard.mjs`·`hooks.json` 3개뿐이고, 위 잔여물은 `.gitignore`에 이미 패턴이 있어 **공개 저장소로는 노출되지 않았음**을 먼저 확인 — 보안 유출이 아니라 "설치기가 로컬 노이즈까지 함께 배포하는" 기능 결함으로 확정.
- **수정**: `codex/install.mjs`의 제외 조건을 `name.startsWith('_')` → `name.startsWith('_') || name.startsWith('.')`로 1줄 확장.
- **재검증**: `node hooks/_selftest.mjs` 98 PASS/0 FAIL 유지(회귀 없음, F7 설치 테스트 8건 포함) + 빈 폴더에서 재실행해 결과물이 3개 파일만 남는 것을 실제로 재확인.

### 2026-08-13~15 패치 — 게이트 1 재정의(Codex 조건부 보류) + 주 사용자 정정 + F8(쉬운 모드) v1 착수

> 배경: Codex를 언제 쓸지 모르는데 게이트 1 ④(Codex 확인창 실측)만 남아 F8 착수를 계속 막고 있는 게 맞는지 재검토 요청이 있었다. 이어서 "친한 지인이 이미 실사용 중"이라던 이전 발언을 사용자가 직접 "주 사용자는 나 혼자"로 정정했고, 곧바로 "게이트 1·3 모두 그냥 진행하기"라는 명시적 오버라이드 지시를 받아 게이트가 닫히길 기다리지 않고 F8 최소 슬라이스를 착수했다.

- **게이트 1 재정의**: ④(Codex 확인창 실측)는 "실제로 Codex를 쓰기 시작하는 시점까지 조건부 보류"로 재분류(근거: 현재 사용 패턴이 100% Claude Code라 미검증 Codex 경로의 실제 노출이 0). 게이트 1은 사실상 ③(F2/F3 배너 실측) 하나로 좁혀짐 — 여전히 미확인 상태.
- **주 사용자 정정**: "친한 지인이 실사용 중"이라던 이전 발언을 사용자가 직접 철회, "주 사용자는 본인 단독"으로 정정. `CHECKPOINT.md` §0-55/§0-56이 제시했던 "지인에게 물어 게이트 1 ③을 닫는" 경로는 철회되고, ③은 원래 방식(본인이 평소 쓰다가 직접 관찰)으로 복귀.
- **F8(쉬운 모드) v1 착수(사용자 명시 오버라이드)**: `skills/f8-easy/SKILL.md`(자동 발동)·`commands/f8-easy.md`(수동 `/sodam-agentic:f8-easy`) 신설. F1보다 한 단계 더 쉬운 비유로 "AI에게 일 시키는 4단계"를 재설명하는 추가 설명 계층일 뿐, F2·F3 안전 절차를 대신하거나 건너뛰지 않음.
- **안전 무변경을 코드로 강제**: `hooks/_selftest.mjs`에 구조적 회귀 테스트 2건 추가 — `hooks/guard.mjs`·`hooks/delegate.mjs` 소스에 `f8`/`beginner`/`무경험자` 문자열이 전혀 없음을 소스 스캔으로 검증(토글 가능한 런타임 플래그가 애초에 존재하지 않으므로, "온/오프해도 안전은 동일"이 아니라 "안전 코드가 F8을 아예 모른다"는 더 강한 보장). 98 PASS → **100 PASS / 0 FAIL**.
- **경계값·실패 입력 전수 테스트**(코드 변경 없음, 검증만): 깨진 JSON·필드 누락·배열/문자열/숫자 등 엉뚱한 JSON 형태·5만 자 초대형 명령어 등 6종을 `hooks/guard.mjs`에 직접 투입 — 전부 크래시 없이 안전하게 처리됨(위험 패턴은 초대형 입력에서도 정확히 탐지, 그 외 형태는 안전하게 통과). 이 과정에서 "Harness가 살아있으면 위험 판정을 위임한다"는 기존 설계가 실제로 작동 중임을 재확인(첫 시도에서 harness 위임으로 통과된 걸 "결함"으로 오판할 뻔했으나, `SODAM_AGENTIC_TEST_FORCE_NO_HARNESS`로 재확인해 설계대로임을 확인).
- **검증**: `node hooks/_selftest.mjs` 100 PASS/0 FAIL, `node scripts/validate.mjs` 15 PASS/0 WARN/0 FAIL. `git status`로 `hooks/guard.mjs`·`hooks/delegate.mjs`·`hooks/hooks.json` 무변경 재확인(신규 파일은 `commands/f8-easy.md`·`skills/f8-easy/`뿐, `hooks/_selftest.mjs`는 애초에 `.gitignore` 대상이라 커밋 대상 아님 — 이전 기록의 "git-tracked" 표기는 오기였음, 이번에 정정).
- **의도적으로 하지 않은 것**: 게이트 1 ③ 라이브 실측(사람이 새 세션에서 직접 관찰해야 함), 게이트 3(MCP 큐레이션) 착수, F8 자동발동 라이브 검증(자연어 판단 영역이라 AI 자체 검증 불가), `commands/f8-easy.md`·`skills/f8-easy/` git 커밋(아직 사용자 확인 전). 전부 `CHECKPOINT.md` §0-59에 남은 작업으로 기록.

### 2026-08-17 패치 — 독립 QA에서 실제 안전 결함 2건 발견·수정 (보안, `git -C` 경로검사 우회 + git 파괴적 명령 무방비)

> 배경: "직접 테스트/검증"(정상흐름·예외·경계값·실패 상황 포함) 요청에 따라, 기존 100건 자동테스트 재실행(불변 확인)에 그치지 않고 소스코드를 처음부터 직접 읽고 새 경계값을 독립적으로 프로빙했다. 두 건 모두 실제 child process 재현으로 확정 후 수정.

- **발견 1(경로검사 우회)**: `commandPaths()`가 `git -C <경로>`와 `git -c <key=val>`을 대소문자 구분 없이 똑같이 "경로 후보 제외" 대상으로 취급하고 있었음. 그러나 git에서 `-C`(대문자)는 실제 작업 경로 지정이고 `-c`(소문자)는 설정값 문자열일 뿐이라 이 둘을 묶은 게 원인 — `git -C C:\Windows\System32 status`처럼 `-C` 뒤 경로가 민감위치·작업폴더 밖 검사를 전부 우회함을 재현 확인(수정 전: 무결정 통과 / 대조군인 `Write` 도구 직접 지정은 정상 deny).
  - **수정(`hooks/guard.mjs`)**: 제외 조건을 `/^-[Cc]$/` → `/^-c$/`(소문자만)로 변경. `-C`의 값은 이제 다른 경로와 동일하게 검사됨.
- **발견 2(위험 분류 누락)**: `git reset --hard`·`git push --force`/`-f`·`git clean -f*`·`git branch -D` 등 되돌리기 어려운 git 명령이 `CATASTROPHIC`/`RISKY_DELETE` 어느 목록에도 없어 완전 무방비(무결정 통과)였음. `rm -rf` 등은 막으면서 git으로 같은 성격의 손실(미커밋 변경·브랜치·원격 이력 소실)을 내는 경로는 놓치고 있던 빈틈.
  - **수정(`hooks/guard.mjs`)**: `RISKY_DELETE`에 4개 패턴 추가(ask 등급, deny 아님 — Harness 위임 시 되돌리기 가능). 과잉차단 방지를 위해 안전한 형태(`--force-with-lease`·`git branch -d` 소문자·`git clean -n` dry-run)는 의도적으로 제외.
- **검증**: 두 수정 다 child process로 직접 재현 후 반전 확인(수정 전 무결정 → 수정 후 정상 deny/ask). `hooks/_selftest.mjs`에 회귀방지 테스트 14건 신설(신규 발동 9건 + 오탐 방지 확인 5건) — **100 PASS → 114 PASS / 0 FAIL**, 자기보안 0 유지. `scripts/validate.mjs`는 "설치 캐시 최신성"만 예상대로 FAIL(방금 고친 코드가 재설치 전이라 당연한 결과, PASS 14/WARN 0).
- **범위 밖(정직한 한계)**: `git checkout -- .`(작업트리 전체 되돌리기)·`git branch -D` 외 다른 강제삭제형 서브커맨드는 이번 라운드에 포함하지 않음 — 위험 패턴은 초안이며 모든 위험을 100% 잡지 못한다는 `01_PRD.md §8.8` 원칙과 동일 선상. 커밋·푸시는 사용자 확인 후 진행.

### 2026-08-17 후속 패치 — 사람의 라이브 테스트에서 harness 위임 공백(git branch -D) 실제 발견·수정 (보안)

> 배경: 위 QA 수정분을 사용자가 실제 새 세션에서 직접 눌러본 결과, `git reset --hard`·`git -C C:\Windows status` 모두 확인창 없이 실행됨. 노이즈 많은 라이브 세션 대신 동일 입력을 child process로 직접 재현해 원인을 규명했다.

- **원인**: `guard.mjs`는 "risky" 등급 명령을 SoDamHarness(형제 플러그인)가 살아있으면 통째로 위임한다(중복 확인창 방지 목적의 기존 설계). 이 기기에는 SoDamHarness가 실제로 설치·활성 상태였고, 위 QA에서 추가한 git 패턴 4개도 전부 이 위임 대상이었음.
- **대조 확인**: SoDamHarness 실제 설치본을 직접 실행해 보니 `git reset --hard`·`git push --force`·`git clean -f*` **3개는 Harness가 이미 독자적으로 잡고 있어 위임이 안전하게 작동 중**이었음(오판 아님). **`git branch -D`만 Harness 규칙에 전혀 없어 위임 시 완전 무방비**였던 것이 유일한 진짜 공백으로 확인됨.
- **수정(`hooks/guard.mjs`)**: `git branch -D` 패턴을 `RISKY_DELETE`에서 분리해 `GIT_BRANCH_FORCE_DELETE`로 만들고, 기존 `isOutsideWorkdir` 검사와 같은 자리에서 **harness 유무와 무관하게 항상 자체 확인**하도록 변경. 나머지 3개 패턴은 Harness가 이미 커버함을 실측했으므로 기존 위임을 그대로 유지(불필요한 이중 확인창을 늘리지 않음).
- **검증**: `hooks/_selftest.mjs`(강제 no-harness 모드) 114 PASS 유지·회귀 없음. 실제(강제 옵션 없는) harness-alive 상태로 직접 재현: `git branch -D` → 신규 ask 확인, `git branch -d`·`git status` → 과잉차단 없음 확인, `git reset --hard`·`git push --force` → 기존처럼 Harness에 안전하게 위임 유지.
- **정직히 미확인**: 라이브 세션에서 `git -C C:\Windows status`·계획 안내(F2)까지 안 떴던 정확한 원인은 이번 조사로 확정하지 못함(코드 재현으로는 정상 동작 확인됨 — 그 세션 자체의 훅 환경 노이즈가 유력 가설이나 미확정).

### 2026-08-19 후속 패치 — `git branch -Df`(결합 짧은플래그) 우회 발견·수정 (보안)

> 배경: "지금까지 구현된 기능 정상작동 테스트/검증" 재요청에 따른 2차 QA 라운드. 기존 118건 중 114건은 불변 재확인만, 신규 경계값(결합 짧은플래그·아직 미보호인 다른 git 파괴적 명령 9종)을 새로 프로빙했다.

- **발견**: git은 짧은 플래그를 묶어 쓸 수 있는데(`git branch -Dh`로 결합 파싱 자체를 재현 확인), 위 패치에서 추가한 `-D\b` 단독 토큰 매칭이 `git branch -Df`·`-fD` 같은 결합형을 놓쳐 무결정 통과됨을 재현 확인.
- **수정(`hooks/guard.mjs`)**: `GIT_BRANCH_FORCE_DELETE` 정규식을 "짧은 플래그 토큰 안에 대문자 D가 있으면(위치·결합 무관) 잡되, `--delete`(force 없음)·브랜치명에 우연히 "-D"가 포함된 경우(`feature-DEV`)는 여전히 제외"하도록 변경.
- **검증**: `hooks/_selftest.mjs`에 4건 추가(발동 2 + 오탐방지 2) — **114 → 118 PASS/0 FAIL**. 실제(강제옵션 없는) harness-alive 상태로도 직접 재현해 반전 확인.
- **범위 밖(정직한 목록화, 수정 안 함)**: 같은 라운드에서 `git filter-branch`(이력 전체 재작성, 특히 위험도 높음)·`update-ref -d`·`tag -d`·`checkout -- .`·`checkout .`·`restore .`·`rm --cached`·`gc --prune=now --aggressive`·`reflog expire --expire=now --all` 9개 명령이 여전히 무방비임을 확인했으나, "위험 패턴은 초안, 100% 방어 불가"(`01_PRD.md §8.8`) 원칙과 "패턴 무한확장은 낭비"라는 직전 결정에 따라 이번엔 목록화만 하고 손대지 않음. 커밋·푸시는 사용자 확인 후 진행.

### 2026-08-19 3차 QA 패치 — `Git branch -D`(대문자 시작) 우회 발견·수정 (보안)

> 배경: "지금까지 구현된 기능 정상작동 테스트/검증" 3차 재요청. 기존 118건 불변 재확인만, `GIT_BRANCH_FORCE_DELETE` 정규식의 대소문자 처리에서 새 결함을 발견했다.

- **발견**: `-D`/`-d` 구분을 위해 이 패턴만 `i` 플래그를 안 썼는데, 그 여파로 "git"·"branch" 자체도 의도치 않게 대소문자를 구분하게 됨 — `Git branch -D feature`처럼 대문자로 시작하면 무결정 통과됨을 재현 확인(Windows git은 실행파일명 대소문자를 구분하지 않아 실제로 통하는 우회).
- **수정(`hooks/guard.mjs`)**: "git"·"branch" 부분만 문자클래스로 대소문자를 허용하고, 위험 표식인 대문자 `D`는 그대로 고정해 `-D`/`-d` 구분은 유지.
- **검증**: `hooks/_selftest.mjs`에 4건 추가(발동 3 + 오탐방지 1) — **118 → 122 PASS/0 FAIL**. 실제 harness-alive 상태로도 재현 확인.
- **오진 기록**: Fix1(`git -C` 경로검사)도 같은 문제가 있는지 의심해 재현했으나, 원인은 테스트 스크립트의 백슬래시 이스케이프 실수였음(guard.mjs 문제 아님) — `commandPaths()`가 명령어 이름을 이미 소문자로 정규화하고 있어 원래부터 대소문자에 안전했음을 재확인.
- **✅ 2026-08-19 커밋(`8782ced`)+2026-08-20 push 완료**, 로컬·원격 동기화 확인됨.

### 2026-08-20 4차 QA 패치 — `git filter-branch`(이력 재작성) 무방비 발견·수정 (보안)

> 배경: "지금까지 구현된 기능 정상작동 테스트/검증" 4차 재요청. 8/19 후속 패치에서 "9개 미보호 명령 중 가장 위험도 높음"으로만 지목해두고 미뤘던 `git filter-branch`를 직접 재현·검증.

- **발견**: `git filter-branch --prune-empty -- --all` 같은 일반적 형태는 어느 위험등급에도 없어 완전 무방비(무결정 통과)였음. 이전엔 `--tree-filter 'rm ...'`처럼 안에 우연히 "rm" 문구가 들어간 경우만 `RISKY_DELETE`의 범용 `\brm\b` 패턴에 우연히 걸려 막힌 것처럼 보였을 뿐 — rm이 없는 실사용 형태(`--tree-filter 'chmod -R go-rwx dir'`)는 그대로 통과함을 재현 확인. SoDamHarness 자체 guard.mjs에도 filter-branch 전용 패턴이 전혀 없음을 직접 실행해 확인.
- **수정(`hooks/guard.mjs`)**: `GIT_HISTORY_REWRITE` 상수 신설, `GIT_BRANCH_FORCE_DELETE`와 동일하게 harness 유무와 무관하게 항상 자체 확인(ask). `-D`/`-d` 같은 대소문자 구분이 필요 없어 `/i` 플래그로 단순하게 구현.
- **검증**: `hooks/_selftest.mjs`에 4건 추가(발동 2 — rm 있는 경우·없는 경우 각각 — + 오탐방지 2: `git log --grep=filter-branch`, 커밋 메시지에 "filter-branch" 텍스트만 있는 경우) — **122 → 126 PASS/0 FAIL**. 실제(강제옵션 없는) harness-alive 상태로 직접 재현해 반전 확인.
- **범위 밖(정직한 한계, 유지)**: 나머지 8개 명령(`update-ref -d`·`tag -d`·`checkout -- .`·`checkout .`·`restore .`·`rm --cached`·`gc --prune=now --aggressive`·`reflog expire --expire=now --all`)은 이번에도 손대지 않음 — filter-branch만 예외로 다룬 이유는 이미 두 라운드 전부터 "최우선 항목"으로 명시 지목되어 있었고 이번에 재현으로 위험이 확정됐기 때문(`01_PRD.md §8.8` "패턴 무한확장 지양" 원칙 유지).
- 커밋·푸시는 사용자 확인 후 진행.

### 2026-08-20 패치 — 게이트 3(MCP 큐레이션) 후보 4개 리서치·문서화 (문서, 코드 변경 없음)

> 배경: "PRD 재확인 후 다음 Phase 작업 준비" 요청. 2026-08-13 사용자가 이미 "게이트 3도 그냥 진행하기"라고 승인해뒀으나 그 이후 실제 착수가 없던 상태였음을 재발견.

- **리서치**: Context7(Upstash)·Playwright MCP(Microsoft)·Chrome DevTools MCP(Google)·GitHub 공식 MCP Server 4개를 게이트 3의 4개 기준(공식 카탈로그·소스공개·유명 유지관리자·SoDam 계열 실사용무사고)에 대조.
- **결과**: 4개 전부 2개 이상 기준 충족으로 통과. Chrome DevTools MCP는 3일 전(2026-08-17) 공개된 CVE-2026-53766(심볼릭 링크 경로우회, 1.1.0 미만 영향)을 발견했으나, 이 환경의 실제 설치 버전(1.6.0)이 패치 버전 이후임을 직접 확인해 조건부(버전 고정 필요) 통과로 기록.
- **문서화**: `.PRD/12_PHASE3_GATE3_MCP_CURATION.md` 신설(게이트2 F8 정의 문서와 동일한 형식). `.PRD/03_PHASES.md`·`.PRD/README.md`에도 반영(`.PRD/`는 gitignore 대상이라 git diff 없음).
- **범위 밖(의도적)**: MCP 자동 설치·`.mcp.json` 등록 코드는 만들지 않음 — 그 자체가 `hooks/guard.mjs`의 `isMcpConfigFile` deny와 충돌하는 별개의 위험한 작업이라 리서치·문서화까지만 진행. 이 목록을 사용자에게 어떻게 노출할지(스킬?·README?)는 별도 설계 필요.

## 다음 예정 (Planned)

- 게이트 1 ③ — F2/F3 배너 실측(라이브, 사람이 새 세션에서 직접 관찰). *(2026-08-17: 비개발자용 안내문은 Artifact로 작성 완료, 라이브 관찰 자체는 여전히 사람 몫으로 대기 중 — `CHECKPOINT.md §0-61`)*
- ~~게이트 3 — MCP 큐레이션 후보 3~5개 리서치 → 기존 4개 기준 대조 → 문서화(착수 여부 사용자 확인 필요).~~ **2026-08-20 완료**(`.PRD/12_PHASE3_GATE3_MCP_CURATION.md`). 다음: 이 목록을 사용자에게 어떻게 노출할지 설계·승인.
- ~~`commands/f8-easy.md`·`skills/f8-easy/` 커밋·푸시 여부 결정.~~ **정정: 2026-08-15 `95f9e18`로 이미 커밋·푸시 완료 상태였음**(이 목록이 갱신 안 돼 있던 낡은 기록, 2026-08-18 재확인 중 발견해 정정).
- ~~2026-08-17 QA 수정분(`hooks/guard.mjs`) 커밋·push 여부 결정.~~ **2026-08-18 커밋(`1de2966`)·push(`18fb785`) 완료**, 로컬·원격 동기화 확인됨.
- ~~2026-08-19 후속 패치(`git branch -Df` 수정)의 커밋·push 여부 결정.~~ **커밋(`909d32c`)·push 완료**, 로컬·원격 동기화 확인됨.
- (선택, 낮은 우선순위) `git filter-branch` 제외 나머지 8개 미보호 git 명령 대응 여부 — 착수 결정 필요 시에만.
- ~~2026-08-19 3차 QA 패치(`Git branch -D` 대소문자 수정)의 커밋·push 여부 결정.~~ **커밋(`8782ced`)·push 완료**, 로컬·원격 동기화 확인됨.
- ~~2026-08-20 4차 QA 패치(`git filter-branch` 수정)의 커밋·push 여부 결정.~~ **커밋(`c6cca64`)·push 완료**, 로컬·원격 동기화 확인됨.
- ~~게이트3 리서치·README 권장 MCP 섹션의 커밋·push 여부 결정.~~ **커밋(`5309188`·`d6487f5`·`54346bf`)·push 전부 완료**, 로컬·원격 동기화 확인됨.
- ~~(선택) `README.html`·`README.en.html` 정적 미러본이 위 README 변경 대비 낡은 상태.~~ **2026-08-20 갱신 완료**(`665f8a1`) — §18 권장 MCP 섹션 수동 반영, 태그 균형 확인. **커밋·push 전부 완료**(`d2d893d`), 로컬·원격 동기화 확인됨.

### 2026-08-20 — 🔴 게이트1③(F2/F3 배너) 사용자 승인으로 종결, Phase 3 게이트 1·2·3 전부 통과 (문서, 코드 변경 없음)

> 배경: 사용자가 "어차피 나 혼자 사용할거야. 그냥 진행해."라고 직접 승인.

- 게이트1③은 `CHECKPOINT.md` §0-38~§0-63에 걸쳐 최소 5개 이상의 독립 세션에서 이미 반복 관찰됐고(매번 "배너 미표시"), 원인도 `03_PHASES.md` F2 항목이 이미 명문화한 플랫폼 한계(스킬=요청, 강제 불가)로 규명돼 있었음 — "실측 안 됨"이 아니라 "실측했고 결과가 확정적으로 부정적"이었던 것.
- 사용자의 "혼자 쓴다" 승인은 그동안 암묵적으로 요구되던 "긍정적 결과가 나올 때까지 반복 관찰" 기준(원문에 없던 기준)을 제거해준 것으로 해석 — `01_PRD.md §7`의 "개인용 도구, 베타 검증 불필요" 결정과 동일 논리.
- `.PRD/03_PHASES.md`에 종결 각주 추가. F8 **전체 확장**을 승인한 것으로는 해석하지 않음(별개 문제, 여전히 미정의). F4 안전 수준과도 무관.

### 2026-08-20 — F8(쉬운 모드) 소범위 확장 3건 (사용자 명시 승인 범위 지정)

> 배경: "F8 전체 확장은 별도 사용자 결정 필요" 상태였던 것을, AskUserQuestion으로 구체적 선택지를 제시해 사용자가 직접 범위를 골라줌(안내 추가·트리거 확장·MCP 짧은 언급 3건 선택, "확장 안 함"은 미선택).

- **`skills/f8-easy/SKILL.md` `description` 확장**: "화면에 뜨는 말이 무슨 뜻인지 모르겠어요"·"어떻게 시작해야 할지 모르겠어요" 트리거 문구 추가. 단, "기술 용어가 섞인 구체적 에러 질문은 해당 없음"이라는 제외 조건을 명시해 숙련자 질문까지 끌어오는 과오탐을 방지.
- **"다음에 뭘 더 볼 수 있는지" 안내 추가**: `/sodam-agentic:log`(F6 안전기록 조회) 안내를 "마무리" 섹션에 한 줄 추가, "궁금할 때만·지금 안 봐도 상관없음"으로 부담 최소화.
- **권장 MCP 목록 짧은 언급**: README §18의 MCP 큐레이션 존재를 "나중에 더 익숙해지면" 식으로만 언급 — "MCP"라는 용어 자체를 쓰지 않고 설치 방법도 언급하지 않음(F8 자신의 "전문 용어 금지" 원칙 및 MCP 자동설치 범위 밖 원칙 동시 준수).
- **구조적 안전 확인**: 세 변경 전부 `skills/f8-easy/SKILL.md`(마크다운)만 수정, `hooks/guard.mjs`·`delegate.mjs` 무변경 — `node hooks/_selftest.mjs` **126 PASS/0 FAIL 불변**으로 F4 안전수준 무영향 재확인. `git status` 확인 결과 이 파일 1개만 변경됨(범위 이탈 없음).

### 2026-08-20 5차 QA — `commands/f8-easy.md` 트리거 안내 drift 발견·수정

> 배경: "지금까지 구현된 기능 정상작동 테스트/검증" 5차 재요청. 위 F8 확장(§0-81) 관련 흐름 전체를 다시 확인하는 과정에서 발견.

- **발견**: `skills/f8-easy/SKILL.md`의 트리거 목록만 넓히고, 같은 내용을 사용자에게 설명하는 `commands/f8-easy.md`의 안내 문단은 예전 2개 예시 문구만 남아있어 실제보다 좁게 안내되는 상태였음.
- **수정**: `commands/f8-easy.md`에 새 예시 1개 추가 + "전체 목록은 SKILL.md 참고"로 정정. `node scripts/validate.mjs` PASS 14/WARN 0/FAIL 1(기존과 동일, 벤치마크 무변화) 재확인.
- **범위**: 이 파일 1개만 변경, 비밀정보 스캔 클린. 커밋(`1f8810b`)·push 완료.
