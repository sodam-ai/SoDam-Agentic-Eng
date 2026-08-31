# SoDam 패밀리 시너지 헌법 (family-synergy.md)

> 이 문서는 SoDam 6형제 플러그인이 **충돌 없이 조화롭게 동작**하기 위한 공통 규약입니다.
> 근거: PRD §05_FAMILY_RISKS (PART A·B·C), §06_EXTENSIBILITY + 5개 형제 실측(2026-06-29)
> 소유: SoDamAgentic (진입점·관리자)

---

## 1. 6형제 역할 분담 — 겹치면 안 되는 영역

| 플러그인 | 단독 소유 역할 | 절대 침범 금지 |
|---------|-------------|-------------|
| 🛡 **SoDamHarness** | 위험 차단·백업·되돌리기·안전 경고 | 다른 형제가 일반 안전 로직 재구현 금지 |
| 🧠 **SoDamContext** | AGENTS.md·CLAUDE.md 건강검진·자동 생성 | Harness 백업 없이 파일 자동 삭제 금지 |
| 🔁 **SoDamLoop** | 자율 반복 엔진 (make→check→fix) | 반복 폭주 차단은 자체 가드레일만 |
| 🚀 **SoDamAgentic** | 진입점·계획 먼저·변경점 검토·큐레이션 | 일반 안전·백업·반복은 각 형제에 위임 |
| ✏️ **SoDamPrompt** | 프롬프트 입문 웹앱 (Next.js/Supabase) | 다른 형제의 훅·플러그인 구조에 간섭 금지 |
| 🔍 **SoDamReverse** | 코드·앱 분석 → 한국어 보고서 | 분석 외 목적 파일 수정 금지 |

**한 줄 원칙**: 안전은 Harness, 기억은 Context, 반복은 Loop, 입문은 Agentic·Prompt, 분석은 Reverse.

---

## 2. 설치 순서 (필수 — 변경하면 C2 위험)

```
1. SoDamHarness   ← 안전 기반. 나머지 5개가 이걸 감지·위임함
2. SoDamLoop      ← 반복 기반. Harness 백업에 의존
3. SoDamContext   ← 설명서 기반. Harness 처방(Treat)에 의존
4. SoDamAgentic   ← 진입점. 위 3개가 깔려 있을 때 최강 발휘
5. SoDamPrompt    ← 웹앱. 나머지와 독립 스택이라 순서 유연
6. SoDamReverse   ← 분석 막내. 모든 안전 인프라 위에서 동작
```

> ⚠️ Harness 없이 설치해도 각 형제는 **자기완결 폴백(fail-closed)**으로 작동합니다.
> 단, 백업·되돌리기 기능이 빠져 "최소 안전"만 제공됩니다.

---

## 3. 훅 충돌 방지 규약 (C1·C6 — 가장 중요)

### 규약 A: 새 PreToolUse 훅 파일 추가 금지

훅은 **병렬 실행** (순서 미보장). 6개가 모두 새 훅을 등록하면:
- 같은 명령에 확인창 6개 연속 → 초보자 permission fatigue → 그냥 허용 → 안전 무력화

**대신:** Harness의 `extra_denied` 배열 또는 `extra_protected_paths`에 규칙 주입.

```jsonc
// 다른 형제의 규칙을 Harness agentic-rules.json extra_denied에 추가 예시
// (Reverse가 제안한 패턴 — 06_FAMILY_SYNERGY.md)
{
  "extra_denied": [
    "분석 없이 .apk 직접 실행",   // Reverse 추가
    "루프 상한 없이 시작"           // Loop 추가
  ]
}
```

### 규약 B: `bypassPermissions` 모드 권유 절대 금지

어느 형제도 `bypassPermissions` 모드를 사용자에게 권유하지 않는다.
이 모드는 **모든 훅을 무효화**한다 (실측 확인됨).

### 규약 C: 입력 변조 금지

훅에서 `updatedInput`으로 입력을 고쳐서 통과시키는 방식 금지.
`permissionDecision: "deny"` 또는 `"ask"`만 사용.

### 규약 D: Harness 감지 위임 패턴

Harness가 살아있으면 **겹치는** 위험 명령·민감 경로 검사를 Harness에 위임 (중복 확인창 방지).
각 형제는 `delegate.mjs` 또는 동일 패턴으로 `isHarnessAlive()` 체크 후 폴백.
**단, 되돌릴 수 없는 치명 명령은 위임하지 않고 항상 자체 deny 한다**(ⓓ 방어심층 — `isHarnessAlive()`는 파일 존재만 확인하므로 껍데기·깨진 Harness에 위임하면 무방비가 되는 fail-open을 막는다).

```js
// SoDamAgentic guard.mjs 구현 예 (다른 형제도 동일 패턴)
const harness = isHarnessAlive();
if (!harness && isSensitive(path)) decide("deny", "..."); // 민감경로: Harness 없을 때만
if (level === "catastrophic") { decide("deny", "..."); return; } // ⓓ 치명: Harness 무관 항상 deny
if (harness) passThrough();                               // 그 외 겹치는 안전: Harness 있으면 위임
```

#### 위임 참여 현황 (2026-09-01 추가 — 실제 코드 전수 대조 결과)

위 규약은 "각 형제가 위임 패턴을 쓴다"고 전제하지만, **실제로 이 패턴을 구현한 건 SoDamAgentic뿐**이다.
Agentic의 `.PRD/CHECKPOINT.md`(2026-08-23, 7형제 가드 전수 조사)가 확인한 실측:

| 프로젝트 | 가드 파일 | Harness 위임 여부 |
|---|---|---|
| SoDamHarness | `hooks/guard.mjs` | (위임 대상 자신) |
| **SoDamAgentic** | `hooks/guard.mjs` | ✅ 위임함(`isHarnessAlive()` 폴백) |
| SoDamLoop | `hooks/safety-gate.mjs` | ❌ 위임 없음 — 항상 독립 deny |
| SoDamReverse | `hooks/re-deny-guard.mjs` | ❌ 위임 없음 — 항상 독립 deny |
| SoDamContext | `lib/prevent-write.mjs` | (쓰기 전용, 위임 개념 해당 없음) |

즉 **deny 가능한 PreToolUse 가드가 최대 5개(Harness·Agentic·Loop·Reverse + 개별 자기보호) 동시에
활성화될 수 있고, 그중 위임으로 중복을 줄이는 건 Agentic 하나뿐**이다. Loop·Reverse는 각자
독립적으로 판정하므로, 이 문서의 규약 D만 보고 "위임하면 중복 확인창이 사라진다"고 기대하면
Loop·Reverse가 관련된 상황에서는 틀린다. (근거: 코드가 아니라 이번에 대조한 사실 — 새 형제가
추가되거나 Loop·Reverse가 위임 패턴을 나중에 채택하면 이 표는 그때 다시 갱신할 것.)

---

## 4. 공유 인터페이스 (미래 계약)

> 현재 미구현. Phase 2 목표.

| 인터페이스 | 소유 | 사용처 |
|-----------|------|--------|
| `backup(path)` / `undo()` | Harness | Context.Treat, Loop.undo |
| `isFamilyAlive(name)` | 공통 표준화 | 각 형제 폴백 결정 |
| `logSafetyEvent(event)` | Harness | Reverse.SafetyLog, Loop.grader |

---

## 5. 단일 마켓플레이스 요건 (C2 — 의존 자동설치) — ⚠️ 2026-08-02 정정

> 아래 "해법"(형제마다 공용 `sodam` 이름 재사용)은 2026-07-27 `05_FAMILY_RISKS.md` addendum에서
> **폐기됐다** — 정확히 이 패턴이 실제 이름 충돌 사고를 냈다(`CHECKPOINT.md §0-32` 참조). 현재
> 표준은 **형제마다 고유한 마켓플레이스·플러그인 이름**이다(예: 이 저장소는 `sodam-agentic`). 아래
> 원문은 그 사고가 나기 전 초안이라 참고만 하고, 실제 설치 명령은 각 형제 저장소의 README를 따를 것.

Claude Code의 `plugin.json` 의존성 자동설치는 **같은 마켓플레이스에 등록된 플러그인만** 작동.

**현재 상태**: 6개가 각자 별도 GitHub repo, 각자 고유 이름으로 등록됨(자동 의존성 설치는 여전히 안 됨 — 형제마다 개별 설치 필요, 아래는 이름 규칙 예시일 뿐)

```bash
# 형제마다 고유 이름으로 개별 설치(예시 — 실제 주소·이름은 각 저장소 README 확인)
/plugin marketplace add https://github.com/sodam-ai/SoDam-Harness-Eng
/plugin install sodam-harness@sodam-harness
# (형제마다 반복, 마켓플레이스 이름은 형제별로 다름 — 공용 "@sodam" 금지)
```

---

## 6. 통합 베타 시나리오 (Phase 1 졸업 공통 조건)

Harness·Loop·Agentic 모두 "초보 베타 1명" 조건을 Phase 1 졸업 요건으로 가지고 있음.
**3번 따로 하지 말고 1번 통합으로 진행.**

```
[통합 베타 골든 패스]
1. SoDamHarness 설치 → /sodam-harness-start → 위험 명령 1회 테스트
2. SoDamContext 설치 → /sodam-context-start → 설명서 건강검진 1회
3. SoDamLoop 설치   → /sodam-loop-start → 간단한 반복 작업 1회
4. SoDamAgentic 설치→ /sodam-agentic:start → 계획→실행→검토 1회 완주
목표 시간: 60~90분
성공 기준: 초보 1명이 안내서 없이 각 단계를 통과
```

---

## 7. 비상 연락망 (충돌 발생 시)

훅이 충돌하거나 의도치 않은 차단이 발생하면:

1. `extra_denied` / `extra_protected_paths` 목록 확인
2. 해당 규칙을 추가한 형제 플러그인 특정
3. Harness `agentic-rules.json`에서 해당 항목 임시 제거
4. 재현 케이스를 해당 형제 GitHub Issues에 보고

---

_마지막 수정: 2026-06-29 | SoDamAgentic v0.1.0_
