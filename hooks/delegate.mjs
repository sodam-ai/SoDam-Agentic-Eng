// SoDamAgentic — delegate.mjs
// SoDamHarness(일반 안전 소유)가 "확실히 살아있는지" 감지한다.
//   살아있으면 → 겹치는 안전(위험명령·민감경로)을 Harness에 위임(중복 차단/프롬프트 방지).
//   아니면(미설치·구버전·헬스체크 실패·감지 오류) → Agentic이 전체 폴백 유지(fail-closed).
//
// 감지 3조건: ① 존재 ② 최소버전 ③ 헬스체크(guard.mjs 존재). 하나라도 실패·예외면 false.
// 보안: 테스트용 env 오버라이드(백도어) 없음 — 운영 경로는 항상 사용자 홈의 plugins 폴더만 본다.
//       (공격자가 가짜 Harness를 가리켜 안전을 끄지 못하게)
//
// 자기보안: fs/os/path 모듈만 사용. 네트워크·외부 명령 실행·동적 코드 실행·민감 환경변수 접근 0.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const MIN_VERSION = "0.1.0";

function safeReaddir(dir) {
  try { return readdirSync(dir); } catch { return []; }
}

// "a.b.c" semver 간이 비교: a<b → -1, a==b → 0, a>b → 1
function cmpVersion(a, b) {
  const pa = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

// pluginsBase 아래(3단계까지)에서 name == "sodam-harness" 매니페스트를 찾는다.
// 3단계까지 보는 이유(2026-07-16 실측 발견): 실제 Windows Claude Code 설치는
// <marketplace>/<plugin>/<version>/.claude-plugin/plugin.json 처럼 버전 폴더가 한 겹 더 있다
// (2단계까지만 보면 그 버전 폴더 안의 매니페스트를 놓친다).
function findHarness(pluginsBase) {
  if (!existsSync(pluginsBase)) return null;
  const dirs = [];
  for (const e of safeReaddir(pluginsBase)) {
    const p1 = path.join(pluginsBase, e);
    try { if (!statSync(p1).isDirectory()) continue; } catch { continue; }
    dirs.push(p1);
    for (const e2 of safeReaddir(p1)) {
      const p2 = path.join(p1, e2);
      try { if (!statSync(p2).isDirectory()) continue; } catch { continue; }
      dirs.push(p2);
      for (const e3 of safeReaddir(p2)) {
        const p3 = path.join(p2, e3);
        try { if (statSync(p3).isDirectory()) dirs.push(p3); } catch { /* skip */ }
      }
    }
  }
  for (const dir of dirs) {
    for (const man of [path.join(dir, ".claude-plugin", "plugin.json"), path.join(dir, "plugin.json")]) {
      try {
        if (!existsSync(man)) continue;
        const j = JSON.parse(readFileSync(man, "utf8"));
        if (j && j.name === "sodam-harness") return { dir, version: j.version || "0.0.0" };
      } catch { /* 깨진 매니페스트 무시 */ }
    }
  }
  return null;
}

// 테스트 가능한 코어: 주어진 plugins 폴더 기준으로 3조건 판정.
export function isHarnessAliveAt(pluginsBase) {
  try {
    const h = findHarness(pluginsBase);
    if (!h) return false;                                       // ① 존재 실패
    if (cmpVersion(h.version, MIN_VERSION) < 0) return false;   // ② 최소버전 미달
    if (!existsSync(path.join(h.dir, "hooks", "guard.mjs"))) return false; // ③ 헬스체크 실패
    return true;
  } catch {
    return false; // 감지 자체 오류 → 안 살아있음(fail-closed)
  }
}

// 운영 경로: 사용자 홈의 Claude Code plugins 폴더 후보들만 본다(임의 env 오버라이드 불가 —
//   테스트 백도어 아님, OS 표준 사용자별 앱데이터 위치 조회일 뿐).
// 2026-07-16 실측 발견: 실제 Windows Claude Code는 plugin 캐시를 ~/.claude/plugins가 아니라
//   %APPDATA%\claude-code\plugins\cache 에 둔다. 기존 경로는 그대로 두고(다른 설치 방식/환경
//   대비) 실제 확인된 경로를 후보로 추가한다 — 하나라도 찾으면 위임.
function pluginsBaseCandidates() {
  const out = [path.join(homedir(), ".claude", "plugins")];
  if (process.platform === "win32" && process.env.APPDATA) {
    out.push(path.join(process.env.APPDATA, "claude-code", "plugins", "cache"));
  }
  return out;
}
// _selftest.mjs 전용: Agentic 자체 폴백 로직(harness=false 상황)을 이 실행 기기의 실제
// Harness 설치 여부와 무관하게 결정적으로 검증하기 위한 강제 플래그. "위임(harness=true)"으로
// 속이는 방향이 아니라 그 반대(항상 폴백)만 가능 — 보호를 줄이는 방향이 아니라 늘리는 방향이라
// 위 "테스트용 오버라이드(백도어) 없음" 원칙(안전 완화 방지)과 충돌하지 않는다.
export function isHarnessAlive() {
  if (process.env.SODAM_AGENTIC_TEST_FORCE_NO_HARNESS === "1") return false;
  for (const base of pluginsBaseCandidates()) {
    if (isHarnessAliveAt(base)) return true;
  }
  return false;
}
