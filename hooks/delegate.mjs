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

// pluginsBase 아래(2단계까지)에서 name == "sodam-harness" 매니페스트를 찾는다.
function findHarness(pluginsBase) {
  if (!existsSync(pluginsBase)) return null;
  const dirs = [];
  for (const e of safeReaddir(pluginsBase)) {
    const p1 = path.join(pluginsBase, e);
    try { if (!statSync(p1).isDirectory()) continue; } catch { continue; }
    dirs.push(p1);
    for (const e2 of safeReaddir(p1)) {
      const p2 = path.join(p1, e2);
      try { if (statSync(p2).isDirectory()) dirs.push(p2); } catch { /* skip */ }
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

// 운영 경로: 사용자 홈의 Claude Code plugins 폴더만 본다(오버라이드 불가).
export function isHarnessAlive() {
  return isHarnessAliveAt(path.join(homedir(), ".claude", "plugins"));
}
