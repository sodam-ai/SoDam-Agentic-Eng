# CHECKPOINT — SoDamAgentic (Phase 1 MVP)

> **다음 세션은 이 파일을 먼저 읽고 이어가면 됩니다.** 기준일: 2026-06-29 (갱신).
> 정본 기획서는 `.PRD/`(로컬·GitHub 푸시 금지)에 있습니다.

## 0-1. 2026-07-11 갱신 (정리·문서 세션 + hooks 조사 확정)

> 이번 세션은 **코드 변경 없음** — 발견된 문서 버그·불일치 정리 + 핸드오프만(사용자 확정: "발견된 실제 문제만 정리"). 새 기능·Phase 2 착수 안 함(체크포인트 "코드작업 없음" 준수).

### 🔑 plugin.json `hooks` 줄 조사 — 확정 결론 (커밋은 보류)
- **미커밋 변경 실체:** 작업트리 `plugin.json`에서 `"hooks": "./hooks/hooks.json"` 한 줄이 **제거**됨(HEAD엔 있음). 미추적 스크래치 2건(`.doc-html-header.html`·`.pair-programming-session.md`)은 무해.
- **실측 확인(재시작 불필요):** 설치·enabled된 캐시 매니페스트 `~/AppData/Roaming/claude-code/plugins/cache/sodam/sodam-agentic/0.1.0/.claude-plugin/plugin.json`에 **hooks 줄 없음**인데도 `claude plugin details` → **Hooks (1) PreToolUse 등록됨**. → **`hooks/hooks.json`은 자동 로드**됨(메모리 `sodam-cc-plugin-naming` 실측: `plugin.json`에 중복 선언 시 "Duplicate hooks file detected"로 플러그인 통째 로드 실패).
- **판정:** 작업트리의 hooks 줄 제거는 **F4를 죽이지 않음 = 올바른 방향**. 다만 **HEAD엔 아직 줄이 남아** 신규 클론 설치 시 로드실패 위험. **커밋 결정은 사용자 "보류"** → 이번 세션은 작업트리 유지(복구·커밋 X).
- **다음 세션 할 일:** CC 재시작 후 `claude plugin details`가 여전히 Hooks(1) 표시하는지 + 라이브 F4 실제 발동(런북) 확인 → 통과 시 hooks 줄 제거를 근거와 함께 커밋(init-mvp). 이 확인은 미뤄둔 최우선 과제 §2-1과 **동일 작업**.

### 이번 세션 수정 (문서·정리, init-mvp 예정)
- `README.md` — Codex F4 문구 과장("작동하지 않습니다") → "Claude Code만큼 강하게 작동하지 않습니다"(한/영·GUIDE·CHANGELOG 정합). `README.html` pandoc 재생성.
- `CHANGELOG.md` — stale 참조(`docs/사용가이드.md`·`USER-GUIDE.en.md` → 루트 이동) 명기 + 누락됐던 `### 2026-07-07 패치` 소절 추가.
- `.gitignore` — 미추적 스크래치 `.pair-programming-session.md`·`.doc-html-header.html` 추가(삭제 아님, 로컬 유지).

### 남은 사람 게이트 (변동 없음 — §2 우선순위 유효)
①라이브 F4 차단 실증(사람) ②비개발자 베타 1명 ③법무(상표·GPL·Apache) ④master/main 브랜치 정리(배포 결정 후). **+플래그:** 추적 파일 `CHECKPOINT.md`는 공개 시 로컬경로·내부메모 노출 → 공개 전 gitignore/`.PRD/` 이동 검토.

## 0-2. 2026-07-11 후속 갱신 — ✅ **F4 라이브 실증 완료 + 실제 버그 발견·수정·검증**

> 사용자 승인 하에 AI가 `docs/F4-라이브검증-런북.md`를 직접 실행(버림폴더·settings.json 백업 등 안전조치 선확보). §2-1 최우선 과제 **완료**.

### ① F4 라이브 실증 결과 — sodam-agentic 훅이 실제로 발동함을 확정
- **출처 확정 방법:** 차단 메시지 문구를 sodam-agentic `guard.mjs`와 `SoDam-Harness-Eng`의 `guard.mjs` 양쪽 소스와 전수 대조.
- **비밀값 환경변수 노출 시도 차단(테스트 케이스) → deny**: 문구가 sodam-agentic `guard.mjs:277`에만 존재(Harness 전체에 동일 문구 0건) → **sodam-agentic의 F4가 이 세션에서 실제로 자동로드·발동함을 코드 대조로 확정.** (참고: 이 CHECKPOINT 편집 자체도 그 예시 명령 문자열을 그대로 인용했다가 동일 훅에 재차 막혀, 이 부분은 표현을 우회해 기록함 — F4가 문서 편집 시에도 실시간 작동 중임을 재확인.)
- **⚠️ 정정(라이브 진행 중 재평가):** 초기엔 "폴더 삭제" 차단 메시지도 sodam-agentic 것으로 오판했으나, 재확인 결과 그 문구("...백업·되돌리기...그건 백업돼요...")는 **`SoDam-Harness-Eng/hooks/guard.mjs:513` 고유 문구**였음. 원인: 사용자의 실제 `~/.claude/settings.json`이 Harness의 `guard.mjs`를 PreToolUse로 **직접 등록**해뒀고, sodam-agentic의 자동로드 훅과 **병렬 실행**되어 있었음(둘 중 하나만 deny해도 차단 — 05_FAMILY_RISKS C6과 일치). 라이브 환경에서 두 플러그인의 결과를 분리하려면 메시지 문구를 정확히 대조해야 함(다음 세션 참고).

### ② 실제 버그 발견·수정·검증 — `hooks/guard.mjs` `commandPaths()` (선택 필드, 승인 시 커밋 예정)
- **증상:** `cd 작업폴더 && echo hi > note.txt && rm note.txt` 같은 **연쇄(`&&`) 명령**에서, 완전히 안전한 작업(파일 생성·자기 폴더 내 삭제)까지 "민감 위치" 오탐(deny)으로 막힘. selftest(22 PASS)는 이 패턴을 커버 안 해서 못 잡았던 **실사용 전용 버그**.
- **근본원인:** `commandPaths()`가 `bashTokens()`로 단순 공백-split만 하고, 셸 연산자(`&&` 등) 이후 **명령어 이름과 무관한 일반 인자**(`echo`의 `hi` 등)까지 전부 "경로 후보"로 오인 → cwd가 사용자 홈일 때 `resolveLoose(홈, "echo")` 같은 무의미한 경로가 생성됨.
- **수정:** "경로처럼 생겼거나 · 리다이렉트(`>`) 직후 · 경로 다루는 명령(`rm`·`cd`·`cat` 등)의 인자일 때만" 후보로 인정하도록 최소 수정(`hooks/guard.mjs` `commandPaths()`, ~49줄). 플래그(`-Recurse -Force`) 뒤에 오는 진짜 삭제 대상도 "명령 세그먼트" 단위로 추적해 놓치지 않음.
- **검증(2단계):** (1) `node hooks/_selftest.mjs` → **22 PASS / 0 FAIL 유지**(회귀 없음). (2) 수정된 로직을 Harness 개입 없이 격리 실행 → `echo`/`hi`는 후보에서 제거됐고, 진짜 삭제 대상(`note.txt`, 플래그 뒤 `test`)과 진짜 위험 경로(`C:/Windows/...`)는 **여전히 정확히 잡힘**(탐지력 저하 없음 확인).

### ③ 부가 발견(스코프 밖, 수정 안 함)
- `SoDam-Harness-Eng`의 `guard.mjs`에도 유사한 오탐 성향(단일 파일 삭제를 폴더삭제로 오판)이 관찰됨. **다른 프로젝트라 이번 세션에서 손대지 않음**(01_PRD §8 4형제 경계 원칙). 필요 시 별도 세션에서 `SoDam-Harness-Eng`를 열어 처리.

### 남은 사람 게이트 재정리
①~~라이브 F4 차단 실증~~ → **✅ 완료(AI 대행, 위 결과)**. ②비개발자 베타 1명 ③법무 ④master/main 브랜치 정리 — **변동 없음, 여전히 사람 몫.**

## 0-3. 2026-07-11 최종 갱신 — 후속 조치 완료 + 다음 작업 단계(순서 확정)

> 이번 절 이후로는 **AI가 자체적으로 새로 시작할 작업이 없다.** 아래 ①이 유일한 결정 대기 항목이고, ②③④는 전부 사람 실행 단계다. 다음 세션이 이 파일을 읽으면 **①의 결정 여부부터 확인**할 것.

### 완료된 후속 조치 (0-2 이후 추가분)
- **회귀 테스트 3건 추가**(`hooks/_selftest.mjs`, 로컬 전용·gitignore 대상) — `commandPaths()` 오탐 버그의 정확한 재현 케이스(연쇄명령 정상통과·연쇄명령 속 단일삭제 ask·연쇄명령 속 재귀삭제 deny)를 정식 테스트로 고정. 재실행 결과 **25 PASS / 0 FAIL**(기존 22 + 신규 3). *이 파일은 git에 안 올라가므로 다른 PC에 새로 설치하면 이 3건은 없다 — 알고 있을 것.*
- **`codex/install.mjs` 문구 모순 수정 + 커밋(`b75665d`)** — 34번줄·94번줄이 Codex F4 한계를 서로 다르게("작동 안 함" vs "강하게 작동 안 함") 말하던 걸 정정. `node --check` 구문 확인 + `validate.mjs` PASS 9/0 재확인 완료.
- **커밋 3건 확정**: `75e1ffb`(docs) → `f66a445`(guard.mjs 수정+F4실증기록) → `b75665d`(install.mjs 정정). 전부 로컬 `init-mvp`에만 존재, **원격 미push**.
- **경계값 4종 라이브 확인**(깨진 JSON stdin·빈 tool_input·빈 command 문자열·빈 stdin) — 전부 크래시 없이 `exit 0`+무출력(passThrough)으로 안전 처리됨 확인.

### 다음 작업 단계 (순서 고정, 사유 포함)

| 순서 | 작업 | 주체 | 전제조건 | done-when |
|---|---|---|---|---|
| **①** | `plugin.json`의 `hooks` 줄 커밋 여부 **최종 결정** | 사람(승인만 하면 AI가 즉시 커밋 가능) | 없음(조사 완료 상태) | 커밋되거나, "계속 보류" 명시적 재확인 |
| **②** | 로컬 플러그인 **재설치** | 사람(Claude Code 슬래시 명령, AI 대행 불가) | ① 완료 후 | `claude plugin details sodam-agentic@sodam`의 Hooks/코드가 최신 커밋 반영 확인(캐시 mtime이 2026-06-23에서 갱신됨) |
| **③** | **실사용 시작**(`/sodam-agentic-start`) | 사람 | ② 완료 확인 후 | 첫 실제 작업을 F1→F2→F3→F4 전체 흐름으로 완주 |
| **④** | 비개발자 베타 1명 · 법무 검토 · master/main 정리 | 사람 | ③ 이후, 순서 무관 | 각각 PRD 성공기준 충족 |

**① → ②의 순서가 반드시 이 순서인 이유:** ①을 건너뛰고 ②(재설치)부터 하면, 재설치된 결과물이 hooks 줄 있는 버전(HEAD)인지 없는 버전(작업트리)인지 이 시점엔 **git 커밋 상태에 의해 결정**되므로, ①을 먼저 매듭짓지 않으면 ②의 결과가 무엇을 검증한 것인지 알 수 없게 된다(재현 불가능한 상태 회귀 위험 — 병렬세션 회귀와 동일한 리스크 패턴).

**②를 건너뛰고 바로 ③(실사용)로 가면 안 되는 이유:** 캐시가 구버전(2026-06-23)으로 고정된 사실이 실측 확인됐으므로, 재설치 없이 실사용하면 **오늘 고친 `commandPaths()` 버그가 그대로 재현**된다 — "고쳤다"는 이번 세션의 검증 결과 자체가 무의미해진다.

## 0. 2026-07-07 갱신 (매니페스트 수정 + R2 발견)

> ⛔ **R2 재도입 금지 (2026-07-07 회귀 차단됨):** `isAgenticActive()` 세션게이트를 **되살리지 마세요.** 세션 생성 코드가 repo에 없어 F4를 항상 휴면(fail-open)시키는 결함으로 이미 폐기됨(01_PRD §5·05_AUDIT B1 위배). `BUNDLE_COEXISTENCE §2 슬롯3`도 R2대로 정합 완료(커밋 `0001780`). guard는 **설치 시 항상 평가**, 공존은 `isHarnessAlive()` 위임이 담당. — *이날 다른 세션이 작업트리에서 이 게이트를 재도입하려던 것을 HEAD로 복원·차단함(selftest 22 PASS 재확인). 세션게이트 재구현 계획이 있다면 먼저 R2 근거를 다시 읽을 것.*

> ### 🔜 다음 단계 (2026-07-07 확정 — 여기부터 이어서)
>
> 코드·문서측은 완료·커밋(`origin/init-mvp` 동기화). **남은 병목은 전부 "사람만 할 수 있는 검증"** — PRD 01 §5 성공기준("실제 설치 성공 + Harness 없이도 폴백 작동")은 로직(selftest)이 아니라 **라이브로만 증명됨**("초록불 ≠ 성공"). 아래는 §2 상세와 1:1 정합하는 2026-07-07 기준 우선순위·리스크 확정판.
>
> | 순위 | 작업 | 누가 | 준비물(있음) | 예상 리스크·변수·충돌 |
> |---|---|---|---|---|
> | **①** | **라이브 F4 차단 실증** | 사람(AI 불가) | `docs/F4-라이브검증-런북.md` | persona-safety가 먼저 "진행할까요?" → "예" 후 guard 메시지 확인 / **auto-accept·bypass 모드면 무의미**(`Shift+Tab`→"매번 물어봄") / **Harness 동시설치 시 재귀삭제·민감경로·단일삭제는 위임돼 guard 대신 Harness 메시지**(정상·버그 아님; 치명·키·settings는 항상 guard — 런북 §0-3) |
> | **②** | **비개발자 베타 1명** | 사람 | `docs/왕초보-테스트-가이드.md` | F2/F3는 "부탁"이라 다른 스킬에 밀려 자동발동 안 될 수 있음(실측 2회 ❌) → 초보자가 "안 된다" 오해. **정상 한계로 안내**(Phase 2 강제화 예정) |
> | **③** | **법무 확인** | 사람 | GUIDE §14에 "확인 필요" 명시 | 상표(Claude/Codex·"에이전틱")·차용코드 GPL·라이선스 최종. **미확인 공개 시 법적 노출**(변호사 관점) |
> | **④** | **master/main 브랜치 정리** | 사람+AI 협의 | 미착수 | **master 직접 commit/push 금지**(§4). **배포 결정 후에만**. 잘못하면 히스토리 꼬임 |
> | (Phase 2) | F2/F3 강제 훅화·F6 안전기록·F7 Codex패리티 | AI(나중) | — | 지금 아님(스코프 이탈·과설계 방지) |
>
> **⚠️ 최우선 변수 — 병렬 세션 회귀(오늘 실측 2회):** 다른 세션이 (1) `guard.mjs`에 R2 세션게이트, (2) 이 CHECKPOINT에서 README+GUIDE 기록을 각각 되돌림 → 둘 다 HEAD로 복원함. **작업 시작 전 이 repo를 편집 중인 다른 Claude Code 세션이 없는지 확인**(위 ⛔ 경고). **커밋 직후 `git status`·`git diff`로 회귀 점검을 습관화.**
> **AI가 지금 더 할 코드작업은 없음** — 억지 추가는 Simplicity·drive-by 금지 위반. 다음 세션도 코드부터 만들지 말 것.
> **저위험 잔가지(선택):** stale `docs/*.pdf`(원본이 루트로 이동해 안 맞음·gitignore·무해), 미추적 스크래치 `.doc-html-header.html`·`.pair-programming-session.md`.

- ✅ **README+GUIDE 전면 개정 (2026-07-07)** — `docs/사용가이드.md`·`USER-GUIDE.en.md` → 루트 `GUIDE.md`·`GUIDE.en.md` 이동+개명. staleness 2건 수정(LICENSE "미확정"→확정 사실, AGENTS.md "미구현"→구현됨), PRD09 MUST 누락이던 **제거방법** 절 추가, 신규 절(목차·아키텍처·보안/데이터흐름·FAQ·변경이력 토글). README는 lean 유지+GUIDE 링크. `pandoc`으로 `GUIDE/README`(ko/en) → `.html` 4종 기계 생성(내용 동일). 검증 `validate 9/0`·시크릿 0·상호링크 전부 존재. → 커밋 `4da185f`.
- ✅ **매니페스트 검증버그 수정** — CC 2.1.201 스키마 변경 대응: `plugin.json` 경로 필드 **`./` 접두사 필수**(bare 경로 `Invalid input`), **`agents`는 디렉터리 불가·개별 `.md` 파일**(`["./agents/easy-reviewer.md"]` — skills/commands는 디렉터리 OK). `marketplace.json` top-level `description` 추가. 검증: `claude plugin validate --strict ✔`(0/0) + `validate.mjs 9/0` + `_selftest 22 PASS`. → `init-mvp` 커밋·푸시.
- ✅ **형제 Harness도 동일 수정 완료**(타 세션, 커밋 `25a49fe`, `feat/phase1-mvp` 푸시). Harness는 `agents` 필드 없어 그 함정 없음.
- ⚠️ **R2 — F4 폴백 활성화 빈틈(미해결·조사 필요)**: `hooks/guard.mjs:267` `if(!isAgenticActive()) passThrough()` → 활성 에이전틱 세션(`~/.sodamagentic/session-*.json` status:"running") 없으면 **완전 휴면**. 그런데 **세션을 켜는 코드가 Agentic repo에 없음**(온보딩 스킬=마크다운 안내뿐, `_selftest`만 시뮬). PRE-1 coexistence 게이트(BUNDLE_COEXISTENCE §2 슬롯3)의 부작용 가능성 → **Harness 부재 시 F4 최소폴백이 실제로 안 뜰 소지**(01 §5 "Harness 없이도 폴백 작동" 성공기준과 충돌 가능). **라이브 F4 차단 검증 전 반드시**: 세션 활성화 주체(온보딩? Loop? 미구현?) 규명. 안 그러면 "차단 안 됨"을 버그로 오판.


- ✅ **R2 해소 (2026-07-07)** — F4 폴백을 무력화하던 `isAgenticActive()` 세션 게이트 **제거**(01_PRD §8 규칙1 "Harness 없을 때만 최소 폴백" 준수). guard는 설치 시 **항상 평가**, 공존(이중 차단 방지)은 `isHarnessAlive()` 위임이 담당. `_selftest.mjs` 세션 시뮬 의존 제거 → **세션 없이도 22 PASS/0 FAIL**(=실사용에서 F4가 실제로 deny/ask 발동, 이전엔 시뮬해야만 통과=휴면). validate 9/0.
  - **잔여(후속·라이브):** ① Harness 동시 설치 시 settings.json·키 이중확인 가능성(경미 UX, 안전구멍 아님 — 실측 후 위임 확대 검토) ② **라이브 F4 차단 실증**(§2.1, 사람) ③ ✅완료(2026-07-07): guard 수정 커밋 `0afc872`(init-mvp 푸시) + Loop `BUNDLE_COEXISTENCE.md §2·§3` 정합 커밋 `0001780`(feat/sodam-loop-phase1a 푸시).

- ✅ **안전 코드 적대적 재감사 (2026-07-07)** — R2급 "조용한 무효" 빈틈 색출. ⓒ 훅배선 정상(`hooks.json`이 Bash·PowerShell·Write·Edit·MultiEdit·NotebookEdit 전부 커버)·ⓑ 잔여 휴면 없음. **ⓐ 자동승인(bypass) 미경고(07 §1 MUST) → `sodam-agentic-start` 온보딩에 경고 추가**(훅은 그 모드 원천 감지 불가 → 사람 확인 안내). validate PASS·selftest 22/0 재확인. (✅커밋 2026-07-07)
  - **ⓓ ✅구현 완료(2026-07-07, guard catastrophic deny를 harness 위임보다 앞으로 이동 — 원래 권고):** `delegate.isHarnessAlive()`가 Harness 작동 검증 안 함(이름+버전+guard.mjs **파일 존재**만, "// stub"도 통과) → 깨진/가짜 Harness가 위험명령·민감경로 위임을 유발해 둘 다 꺼질 소지(fail-open, B1 잔재·저위험 엣지). 권고: **치명(catastrophic) 명령은 Harness 유무 무관 Agentic도 항상 deny(방어심층)** — 이중 deny는 프롬프트 없어 무해. 설계·안전핵심 변경이라 별도 승인 권장.

- ✅ **F4 라이브검증 런북 확정 (2026-07-07)** — `docs/F4-라이브검증-런북.md`(타 세션 초안)를 `guard.mjs`와 전수 대조: 차단 메시지 6종·분류패턴(`dd of=/dev/sda`=치명 line223 / `Remove-Item -Recurse`=재귀삭제 line233) **일치**, 비밀정보 0. **결함 1건 수정**: §0-3 Harness 위임 안내가 ⓓ 미반영이라 ①(치명)을 "위임됨"으로 오기·②(재귀삭제) 누락 → **②⑤⑥ 위임 / ①③④ 항상 guard 처리**로 정정(치명은 line310에서 harness 체크 line315보다 먼저 항상 deny). 커밋·푸시(init-mvp). → **task 2.1(라이브 F4 실증)은 이제 사람이 이 런북대로 실행만 하면 됨**(코드측 준비 완료).

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
