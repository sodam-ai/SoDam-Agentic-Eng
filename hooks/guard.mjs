// SoDamAgentic — guard.mjs
// PreToolUse 안전 가드레일 훅 — "최소 폴백"(4종 화이트리스트). Node.js, Windows·Mac 공용.
// 입력(stdin): { tool_name, tool_input, cwd, ... }
// 출력(stdout): { hookSpecificOutput: { hookEventName, permissionDecision, permissionDecisionReason } }
//   - permissionDecision: "deny"(AI가 못 뚫는 차단) | "ask"(사용자 확인) | 출력 없음(=기본 흐름)
//
// 불변 규칙(보안 1순위):
//   · 명령/경로는 "검사"만 한다 — 절대 실행하거나 eval 하지 않는다.
//   · 토큰·인증파일·비밀값에 접근/저장하지 않는다(자기보안 grep 0).
//   · 외부로 아무것도 전송하지 않는다.  · 경로는 os.homedir() 기준(하드코딩 금지).
//
// 4형제 경계(01_PRD §8): 일반 안전(백업·되돌리기)은 SoDamHarness 소유.
//   이 파일은 Harness가 없거나(미설치·구버전·헬스체크 실패) Codex일 때를 위한 "최소 폴백"이며,
//   백업 엔진을 재구현하지 않는다(Harness의 backup.mjs를 import 하지 않음).
//   ※ 위임/전체폴백 전환(fail-closed)은 Task 3의 delegate.mjs가 담당. 현재 파일은 폴백을 항상 적용.
//
// 4종 화이트리스트(최소 폴백):
//   ① 위험·치명 명령(rm -rf·재귀삭제·format 등) → deny / 단일 파일 삭제 → ask(백업은 Harness 담당)
//   ② API키·비밀값 노출(echo $KEY·.env 업로드·BASE_URL 변조·키 리터럴) → deny / .env 로컬 읽기 → ask
//   ③ 작업폴더 밖 민감 위치(시스템·홈·자격증명 폴더) 쓰기 → deny
//   ④ .claude/settings(.local).json 쓰기(주입 경로 CVE-2025-59536) → ask(확인)
//
// deny-first: 되돌릴 수 없는 건 deny, 되돌릴 수 있는 건 ask, 나머지는 조용히 통과(과잉 확인창 방지).
// 정직한 한계: 위험 패턴은 "초안"이며 모든 위험을 100% 잡지 못한다(01_PRD §8.8).

import { readFileSync, existsSync, lstatSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isHarnessAlive } from "./delegate.mjs";

const WIN = process.platform === "win32";
const here = path.dirname(fileURLToPath(import.meta.url));
const RULES_PATH = path.join(here, "..", "data", "agentic-rules.json");

// ── 규칙 로드 (데이터-주도 + fail-closed 내장 기본값) ──
// 키탐지 패턴을 데이터에 두는 이유: guard.mjs 소스에 민감 환경변수 접근 리터럴을 두지 않아
// 자기보안 grep을 0으로 유지하기 위함. 규칙 파일이 없거나 깨지면 내장 기본값으로 계속 막는다.
function loadRules() {
  const fallback = {
    key_exposure_deny: [
      "sk-ant-[A-Za-z0-9_\\-]{12,}",
      "sk-[A-Za-z0-9]{20,}",
      "\\b(curl|wget|scp|Invoke-WebRequest|Invoke-RestMethod)\\b[^|;&]*\\.env\\b",
      "ANTHROPIC_BASE_URL\\s*=",
      "\\becho\\b[^|;&]*\\$\\{?[A-Za-z_][A-Za-z0-9_]*(KEY|TOKEN|SECRET)",
      "echo\\b[^|;&]*%[A-Za-z_][A-Za-z0-9_]*(KEY|TOKEN|SECRET)%",
    ],
    key_exposure_ask: ["\\b(cat|type|more|less|Get-Content)\\b[^|;&]*\\.env(\\b|$)"],
    extra_denied: [],
    extra_protected_paths: [],
  };
  try {
    if (!existsSync(RULES_PATH)) return fallback;
    const r = JSON.parse(readFileSync(RULES_PATH, "utf8"));
    return {
      key_exposure_deny: Array.isArray(r.key_exposure_deny) ? r.key_exposure_deny : fallback.key_exposure_deny,
      key_exposure_ask: Array.isArray(r.key_exposure_ask) ? r.key_exposure_ask : fallback.key_exposure_ask,
      extra_denied: Array.isArray(r.extra_denied) ? r.extra_denied : [],
      extra_protected_paths: Array.isArray(r.extra_protected_paths) ? r.extra_protected_paths : [],
    };
  } catch {
    return fallback; // 손상 시에도 막는다(fail-closed)
  }
}
function compileAll(arr) {
  const out = [];
  for (const s of arr) {
    try { out.push(new RegExp(s, "i")); } catch { /* 잘못된 패턴은 건너뜀 */ }
  }
  return out;
}
const RULES = loadRules();
const KEY_DENY = compileAll(RULES.key_exposure_deny);
const KEY_ASK = compileAll(RULES.key_exposure_ask);
const EXTRA_DENIED = compileAll(RULES.extra_denied);
const EXTRA_PROTECTED = (RULES.extra_protected_paths || []).map((p) => String(p));

// ── stdin 전체 읽기 ──
function readStdin() {
  try { return readFileSync(0, "utf8"); } catch { return ""; }
}

// ── 결정 출력 후 종료 ──
function decide(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}
function passThrough() {
  process.exit(0); // 출력 없음 = 기본 권한 흐름(우리가 판단 안 함)
}

// ── Bash 명령 토큰화 (따옴표 제거) ──
function bashTokens(cmd) {
  return cmd.split(/\s+/).map((t) => t.replace(/^["']+|["']+$/g, "")).filter(Boolean);
}

// ── 셸 명령에서 경로 후보(민감 검사용) ── (Harness 검증 로직)
const SHELL_OPS = new Set(["|", "||", "&&", ";", "&", ">", ">>", "<", "2>", "2>>"]);
function commandPaths(cmd) {
  const out = [];
  const toks = bashTokens(cmd);
  for (let i = 0; i < toks.length; i++) {
    if (i === 0) continue;
    const prevTok = (toks[i - 1] || "").replace(/^["']+|["']+$/g, "");
    if (/^-[Cc]$/.test(prevTok)) continue; // git -C <경로> / -c <key=val> 의 값 제외
    const t = toks[i].replace(/^["';|&]+|["';|&]+$/g, "");
    if (!t) continue;
    if (t.startsWith("-")) continue;
    if (t.startsWith("/")) {
      if (!WIN) out.push(t);
      else if (/[\\/].+/.test(t.slice(1))) out.push(t);
      continue;
    }
    if (SHELL_OPS.has(t)) continue;
    out.push(t);
  }
  return out;
}

// ── 파일 쓰기 계열 도구의 대상 경로 ──
function writeTargets(ti) {
  const out = [];
  for (const key of ["file_path", "path", "notebook_path"]) {
    if (typeof ti[key] === "string" && ti[key]) out.push(ti[key]);
  }
  if (Array.isArray(ti.edits)) {
    for (const e of ti.edits) if (e && typeof e.file_path === "string") out.push(e.file_path);
  }
  return out;
}

// ── 파일 쓰기 도구의 '내용'(키 노출 검사용) ──
function writeContents(ti) {
  const out = [];
  for (const key of ["content", "new_string", "new_str"]) {
    if (typeof ti[key] === "string" && ti[key]) out.push(ti[key]);
  }
  if (Array.isArray(ti.edits)) {
    for (const e of ti.edits) if (e && typeof e.new_string === "string") out.push(e.new_string);
  }
  return out;
}

// ── 경로 정규화 (~ 확장 + Git Bash 드라이브 마운트 /c/ → c:\ 처리) ──
function resolveLoose(cwd, p) {
  let s = String(p);
  if (s.startsWith("~")) s = homedir() + s.slice(1);
  if (WIN) {
    const m = s.match(/^\/([a-zA-Z])\/(.*)$/);
    if (m) s = `${m[1]}:\\${m[2]}`;
  }
  try { return path.resolve(cwd, s); } catch { return s; }
}

// ── 민감 위치 판정 (여기를 건드리면 deny) ── (Harness 검증 로직)
function toComparable(p) {
  return WIN ? p.replace(/\//g, "\\").toLowerCase() : p;
}
function isSensitive(absInput) {
  let abs;
  try {
    abs = path.isAbsolute(absInput) ? absInput : path.resolve(absInput);
  } catch {
    return true; // 판정 불가 → 안전하게 민감으로 간주
  }
  const a = toComparable(abs);
  const home = toComparable(homedir());

  if (a === home) return true;
  for (const d of [".ssh", ".aws", ".codex", ".claude", ".gnupg", ".config"]) {
    const sd = toComparable(path.join(homedir(), d));
    if (a === sd || a.startsWith(sd + path.sep)) return true;
  }
  const sys = WIN
    ? ["c:\\windows", "c:\\program files", "c:\\program files (x86)", "c:\\programdata"]
    : ["/etc", "/usr", "/bin", "/sbin", "/var", "/system", "/library", "/boot", "/dev", "/proc"];
  for (const s of sys) {
    if (a === s || a.startsWith(s + path.sep)) return true;
  }
  if (WIN && /^[a-z]:\\?$/.test(a)) return true;
  if (!WIN && a === "/") return true;
  // 사용자가 추가한 보호 경로(데이터)
  for (const p of EXTRA_PROTECTED) {
    const sp = toComparable(p);
    if (a === sp || a.startsWith(sp + path.sep)) return true;
  }
  return false;
}
function isSymlink(p) {
  try {
    const abs = path.resolve(p);
    return existsSync(abs) && lstatSync(abs).isSymbolicLink();
  } catch {
    return false;
  }
}

// ── ① 위험 등급 (패턴 초안 — §8.8 한계) ── (Harness 검증 로직 복사)
const CATASTROPHIC = [
  /\brm\s+-[a-zA-Z]*\s*(~|\/|\$\{?HOME\}?|%USERPROFILE%)\s*(\/\*)?\s*($|[;&|])/i,
  /\bremove-item\b[^|;&]*-recurse[^|;&]*(~|\$HOME|%USERPROFILE%|[A-Za-z]:\\?\s*$)/i,
  /\b(del|erase)\s+\/s\b[^|;&]*[A-Za-z]:\\?\s*$/i,
  /\b(rmdir|rd)\s+\/s\b[^|;&]*[A-Za-z]:\\?\s*$/i,
  /\bformat\s+[A-Za-z]:/i,
  /\bmkfs\b/i,
  /:\(\)\s*\{[^}]*\}\s*;\s*:/,
  /\bdd\b[^|;&]*\bof=\/dev\/(sd|nvme|disk|hd)/i,
  />\s*\/dev\/(sd|nvme|disk|hd)/i,
];
const RISKY_DELETE = [
  /\brm\b/i, /\b(del|erase)\b/i, /\b(rmdir|rd)\b/i, /\bunlink\b/i, /\bremove-item\b/i, /\b(ri|rd)\b\s/i,
  /\.(rmtree|removedirs)\s*\(/i, /\bos\.(remove|unlink|rmdir)\s*\(/i,
  /\bfs\.(rm|rmsync|unlink|unlinksync|rmdir|rmdirsync)\b/i, /\b(rmsync|unlinksync|rmdirsync)\s*\(/i,
];
const RECURSIVE_DELETE = [
  /\brm\s+-[a-z]*r/i,
  /\bremove-item\b[^;&|]*-recurse/i,
  /\b(rd|rmdir)\b[^;&|]*(\/s|-recurse)/i,
  /\.(rmtree|removedirs)\s*\(/i,
  /\[\s*(system\.)?io\.directory\]::\s*delete/i,
  /deletedirectory\s*\(/i,
  /add-type[\s\S]*visualbasic[\s\S]*delete/i,
  /\b(fs\.)?(rm|rmsync)\s*\([^;&|]*recursive/i,
];
const FOLDER_DENY_MSG =
  "폴더를 통째로 지우는 작업은 안전하게 막았어요. 폴더는 되돌리기가 어렵거든요. 정말 필요하면 폴더 안의 파일부터 하나씩 지워 보세요.";

function normalizeForClassify(cmd) {
  return cmd.replace(/\bgit\s+(?:(?:-C|-c)\s+(?:"[^"]*"|'[^']*'|\S+)\s+)+/gi, "git ");
}
function anyMatch(list, s) { for (const re of list) if (re.test(s)) return true; return false; }

// ── ④ settings 파일(.claude/settings(.local).json) 판정 ──
function isSettingsFile(p) {
  return /\.claude[\\/]+settings(\.local)?\.json$/i.test(String(p).replace(/\\/g, "/").replace(/\//g, "/"));
}

// ── 메인 ──
function main() {
  const raw = readStdin();
  let input;
  try { input = JSON.parse(raw); } catch { passThrough(); return; }

  const toolName = input.tool_name || "";
  const ti = input.tool_input || {};
  const cwd = input.cwd || process.cwd();
  // Harness가 확실히 살아있으면(존재+최소버전+헬스체크) 겹치는 안전(위험명령·민감경로)은 위임 → 중복 프롬프트 방지
  const harness = isHarnessAlive();

  const isWriteTool = ["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(toolName);
  const isShellTool = !isWriteTool && typeof ti.command === "string" && ti.command.length > 0;
  if (!isWriteTool && !isShellTool) { passThrough(); return; }

  // ── 셸 명령 ──
  if (isShellTool) {
    const cmd = String(ti.command || "");

    // ② 키/비밀값 노출 — 등급과 무관하게 먼저 검사(echo $KEY 같은 건 '안전'으로 분류되니까)
    if (anyMatch(KEY_DENY, cmd)) {
      decide("deny", "API 키·비밀값이 노출될 수 있는 작업이라 막았어요. 키는 코드·화면·외부 전송 어디에도 남기면 안 돼요(.env 등 본인 환경에만 보관).");
      return;
    }

    const level = anyMatch(CATASTROPHIC, normalizeForClassify(cmd))
      ? "catastrophic"
      : (anyMatch(RISKY_DELETE, normalizeForClassify(cmd)) || anyMatch(EXTRA_DENIED, cmd))
        ? "risky"
        : "safe";

    // ② .env 로컬 읽기 등 모호한 키 접근 → ask (safe로 분류돼도 확인)
    if (level === "safe" && anyMatch(KEY_ASK, cmd)) {
      decide("ask", "비밀값이 들어 있을 수 있는 파일(.env 등)을 여는 작업이에요. 키가 화면·기록에 남지 않게 주의하세요. 정말 진행할까요?");
      return;
    }
    if (level === "safe") { passThrough(); return; }

    // ③④ 명령이 건드리는 경로 검사 — ④ settings는 항상, ③ 민감위치는 Harness 없을 때만(있으면 위임)
    const paths = commandPaths(cmd).map((p) => resolveLoose(cwd, p));
    for (const ap of paths) {
      if (isSettingsFile(ap)) {
        decide("ask", "이 파일(.claude/settings)은 AI의 권한·안전 설정을 바꿀 수 있어 위험해요(주입 통로로 악용된 사례 있음). 정말 이 변경이 필요한가요?");
        return;
      }
      if (!harness && isSensitive(ap)) {
        decide("deny", "시스템·홈 등 민감한 위치를 건드리는 위험한 작업이라 막았어요. 안전을 위해 작업용 폴더 안에서만 진행해 주세요.");
        return;
      }
    }

    // ① 위험·치명 명령 — Harness가 살아있으면 위임(중복 차단/프롬프트 방지)
    if (harness) { passThrough(); return; }
    if (level === "catastrophic") {
      decide("deny", "되돌릴 수 없는 위험한 명령이라 막았어요. 정말 필요하면 더 작은 단위로 나눠서 해보세요.");
      return;
    }
    // ① 폴더(재귀) 삭제 → deny (백업·되돌리기 어려움)
    if (anyMatch(RECURSIVE_DELETE, cmd)) {
      decide("deny", FOLDER_DENY_MSG);
      return;
    }
    // ① 단일 파일 삭제 등 risky → ask (Agentic은 백업 안 함 — Harness가 있으면 되돌리기 가능)
    decide("ask", "되돌리기 어려운 작업이에요. (SoDamHarness가 함께 설치돼 있으면 백업·되돌리기를 도와줘요.) 작게 나눠서 하면 더 안전해요. 정말 진행할까요?");
    return;
  }

  // ── 파일 쓰기 계열 (Write/Edit/...) ──
  const targets = writeTargets(ti);
  for (const t of targets) {
    const abs = resolveLoose(cwd, t);
    if (isSettingsFile(abs)) { // ④
      decide("ask", "이 파일(.claude/settings)은 AI의 권한·안전 설정을 바꿀 수 있어 위험해요(주입 통로로 악용된 사례 있음). 정말 이 변경이 필요한가요?");
      return;
    }
    if (!harness && isSensitive(abs)) { // ③ Harness 없을 때만(있으면 위임)
      decide("deny", "시스템·홈 등 민감한 위치의 파일이라 안전을 위해 막았어요.");
      return;
    }
    if (!harness && isSymlink(abs)) {
      decide("deny", "바로가기(심볼릭 링크) 파일이라 안전을 위해 막았어요.");
      return;
    }
  }
  // ② 파일 '내용'에 키/비밀값 리터럴을 적으려 하면 차단(하드코딩 금지)
  const contents = writeContents(ti);
  for (const c of contents) {
    if (anyMatch(KEY_DENY, c)) {
      decide("deny", "파일에 API 키·비밀값을 직접 적으려는 것 같아 막았어요. 키는 코드에 넣지 말고 .env 같은 본인 환경 변수로 관리하세요.");
      return;
    }
  }
  // 그 외(새 파일·일반 덮어쓰기)는 통과 — 일반 백업/확인은 Harness 소유(폴백 범위 밖, 과잉 확인 방지)
  passThrough();
}

main();
