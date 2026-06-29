# SoDamHarness Backup API — 공유 계약서 (v0.1)

> 작성: 2026-06-29 | 소유: SoDamAgentic (진입점·계약 관리자)
> 근거: SoDamHarness PRD `06_CORE_DRAFTS.md §3` + `02_DATA_MODEL.md`
> 목적: Context.Treat · Loop.undo · Reverse.inject 가 이 계약을 참조해 구현한다.

---

## 왜 이 계약이 필요한가

SoDamContext와 SoDamLoop는 Harness의 `createBackup()` / `undoAction()`을 호출해야
"처방 후 원복" / "루프 되돌리기" 기능을 구현할 수 있다.
Harness가 이 API를 export하기 전까지 두 형제의 핵심 기능은 블로킹된 상태다.

---

## 공유 루트 디렉토리

```
~/.sodamharness/          ← Harness PRD 확정 경로 (02_DATA_MODEL)
  backups/
    <backupId>/           ← backupId = ISO 타임스탬프 (예: 2026-06-29T12-00-00)
      metadata.json       ← { originalPath, timestamp, hash, workingDir }
      files/              ← 실제 백업 파일들 (원본 구조 유지)
  settings.json           ← { version, lastBackup, totalBackups }
```

> Phase 2 목표: `~/.sodam/` 공유 루트로 통합 (현재는 Harness 자체 루트 사용)

---

## 핵심 함수 계약 (backup.mjs export)

### `createBackup(filePaths, workingDir)`

```js
/**
 * 위험 작업 직전 파일을 백업한다.
 * @param {string[]} filePaths - 백업할 파일 경로 배열 (절대경로)
 * @param {string} workingDir - 현재 작업 폴더 (컨텍스트용)
 * @returns {{ backupId: string, timestamp: string, hash: string, success: boolean, error?: string }}
 *
 * 실패 시: success=false, error=한국어 사유 — 절대 throw 하지 않음
 * 성공 조건: 모든 파일 복사 완료 + metadata.json 기록
 */
export async function createBackup(filePaths, workingDir) {}
```

**Harness guard.mjs가 호출하는 흐름:**
```
위험 명령 감지 → createBackup(paths) → success?
  ├─ true  → ASK("백업 완료. 정말 할까요?")
  └─ false → DENY("백업 실패로 안전하게 멈췄어요")  ← fail-safe 원칙
```

---

### `listBackups(workingDir?)`

```js
/**
 * 백업 목록을 반환한다. 사용자가 무엇을 되돌릴지 고를 때 사용.
 * @param {string} [workingDir] - 지정 시 해당 폴더 백업만 필터
 * @returns {{ backups: Array<{ backupId, timestamp, originalPaths, description }>, success: boolean }}
 */
export async function listBackups(workingDir) {}
```

---

### `restoreBackup(backupId)`

```js
/**
 * 사용자가 선택한 백업을 원본 경로로 복구한다.
 * @param {string} backupId - listBackups()가 반환한 backupId
 * @returns {{ success: boolean, restoredPaths: string[], error?: string }}
 *
 * 복구 전 현재 파일을 임시 백업(중첩 보호). 실패 시 임시 백업에서 재복구.
 */
export async function restoreBackup(backupId) {}
```

---

### `isFamilyAlive(siblingName)`

```js
/**
 * 형제 플러그인이 설치되어 있는지 확인한다.
 * @param {'SoDamHarness'|'SoDamLoop'|'SoDamContext'|'SoDamAgentic'|'SoDamPrompt'|'SoDamReverse'} siblingName
 * @returns {boolean}
 *
 * 구현: ~/.sodamharness/settings.json의 registeredSiblings 목록 확인
 *        또는 플러그인 설치 경로에 plugin.json 존재 여부
 */
export function isFamilyAlive(siblingName) {}
```

---

## 형제별 사용 패턴

### SoDamContext가 사용하는 방법 (처방 전 백업)

```js
// Context의 treat.mjs 예시 (Harness 감지 후 사용)
import { createBackup, restoreBackup } from '~/.sodamharness/lib/backup.mjs';

async function treat(targetFile) {
  const { backupId, success } = await createBackup([targetFile], process.cwd());
  if (!success) return { error: '백업 실패 — 처방 중단' };
  // ... 처방 적용 ...
  // 처방 실패 시:
  await restoreBackup(backupId);
}
```

### SoDamLoop가 사용하는 방법 (루프 시작 전 백업)

```js
// Loop의 loop-start.mjs 예시
import { createBackup } from '~/.sodamharness/lib/backup.mjs';

async function startLoop(targetPaths) {
  // PRD §5: "시작 전 백업 + 무결성 검증 후 루프 시작"
  const backup = await createBackup(targetPaths, process.cwd());
  if (!backup.success) {
    return DENY('루프 시작 전 백업 실패 — 안전을 위해 멈췄습니다');
  }
  // ... 루프 시작 ...
}
```

### SoDamReverse가 사용하는 방법 (규칙 주입)

```js
// Reverse의 re-inject-harness.mjs (이미 구현됨)
// Harness의 safety-rules.json에 RE 전용 deny 패턴 추가
// createBackup() 불필요 — 분석 전용, 파일 수정 없음
```

---

## Harness 구현 시 지켜야 할 불변 규칙

| # | 규칙 | 근거 |
|---|------|------|
| 1 | **절대 throw 하지 않음** — 항상 `{ success, error? }` 반환 | guard.mjs가 예외 처리 못 하면 fail-open 위험 |
| 2 | **백업 폴더에 비밀값 저장 금지** | PRD §3 불변 원칙 |
| 3 | **복구 전 현재 파일 임시 백업** | 중첩 보호 |
| 4 | **backupId는 타임스탬프** (충돌 방지용 random suffix 추가 권장) | 동시 작업 환경 |
| 5 | **비동기(async) — 동기 차단 금지** | hook 타임아웃 방지 |

---

## 구현 순서 (Harness Phase 1 착수 가이드)

```
1. backup.mjs  ← 이것부터 (Context·Loop이 기다림)
   - createBackup() 구현 + 단위 테스트 PASS
2. guard.mjs   ← Agentic guard.mjs 패턴 재사용 가능
   - isSensitive() + matchesCatastrophic() + matchesRisky()
   - matchesRisky → createBackup() 호출
3. hooks.json  ← PreToolUse: Bash|Write|Edit|MultiEdit|PowerShell
4. commands/   ← install·status·fix·undo
5. skills/beginner-tone/SKILL.md  ← 초보자 말투
6. selftest     ← 전체 파이프라인 검증
```

---

_마지막 수정: 2026-06-29 | SoDamAgentic v0.1.0_
_이 파일 위치: SoDamAgentic/docs/api-contracts/harness-backup-api.md_
