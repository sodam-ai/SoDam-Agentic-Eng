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
//   ③ 작업폴더 밖 민감 위치(시스템·홈·자격증명 폴더) 쓰기 → deny / 그 외 작업폴더 밖 쓰기 → ask(2026-07-12, D1)
//   ④ .claude/settings(.local).json 쓰기(주입 경로 CVE-2025-59536) → ask(확인)
//
// deny-first: 되돌릴 수 없는 건 deny, 되돌릴 수 있는 건 ask, 나머지는 조용히 통과(과잉 확인창 방지).
// 정직한 한계: 위험 패턴은 "초안"이며 모든 위험을 100% 잡지 못한다(01_PRD §8.8).

import { readFileSync, readdirSync, existsSync, lstatSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isHarnessAlive } from "./delegate.mjs";

// ── 안전 폴백은 "항상 켜짐"(설치되면 늘 보호) ──────────────────────────────
// 근거: 01_PRD §8 규칙1 "일반 안전은 Harness 소유, Harness 없을 때만 각자 최소 폴백".
//   폴백은 안전망이므로 워크플로 세션에 의존해 켜고 끄면 안 된다.
//   이전 isAgenticActive() 세션 게이트는 프로덕션에서 `~/.sodamagentic/session-*.json`을
//   만드는 코드가 없어(온보딩=마크다운·selftest만 시뮬) F4를 항상 휴면시키는 결함이었다
//   → 제거(CHECKPOINT R2, 2026-07-07 해소). 공존(이중 차단 방지)은 아래 isHarnessAlive() 위임이 담당.

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
// 명령 구분자(새 명령 시작) vs 리다이렉트(다음 토큰=경로 대상)를 구분해야
// "cd X && echo hi > note.txt" 같은 연쇄 명령에서 echo/hi 같은 일반 단어를
// 경로로 오인하지 않는다(실측 버그, 2026-07-11 라이브 발견).
const CMD_SEPARATORS = new Set(["|", "||", "&&", ";", "&"]);
const REDIRECTS = new Set([">", ">>", "<", "2>", "2>>"]);
// 이 명령들의 인자만 "경로일 수 있다"고 본다(과탐지 방지, 인자는 플래그를 건너뛰어도 추적).
const PATH_TAKING_CMDS = new Set([
  "rm", "del", "erase", "rmdir", "rd", "ri", "remove-item", "unlink",
  "cat", "type", "more", "less", "get-content",
  "cd", "cp", "copy", "mv", "move", "touch", "mkdir", "md",
]);
function looksLikePath(t) {
  return t.includes("/") || t.includes("\\") || /^[a-zA-Z]:/.test(t) || t.startsWith("~");
}
function commandPaths(cmd) {
  const out = [];
  const toks = bashTokens(cmd);
  let inPathCmdSegment = false; // 직전 && ; | 이후 명령이 경로를 다루는 명령인지(플래그 넘어서도 유지)
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i];
    const quoteStripped = raw.replace(/^["']+|["']+$/g, "");

    if (CMD_SEPARATORS.has(quoteStripped)) { inPathCmdSegment = false; continue; }
    if (REDIRECTS.has(quoteStripped)) { continue; } // 자기 자신은 후보 아님, 다음 토큰이 대상

    const t = raw.replace(/^["';|&]+|["';|&]+$/g, "");
    if (!t) continue;

    const prevQuoteStripped = i > 0 ? (toks[i - 1] || "").replace(/^["']+|["']+$/g, "") : "";
    if (/^-[Cc]$/.test(prevQuoteStripped)) continue; // git -C <경로> / -c <key=val> 의 값 제외

    if (i === 0 || CMD_SEPARATORS.has(prevQuoteStripped)) {
      // 이 토큰은 (새) 명령어 이름 — 그 자체는 경로 후보 아님, 경로다루는명령인지만 기록
      inPathCmdSegment = PATH_TAKING_CMDS.has(t.toLowerCase());
      continue;
    }

    if (t.startsWith("-")) continue; // 플래그는 경로 아님(세그먼트 상태는 유지)

    if (t.startsWith("/")) {
      if (!WIN) { out.push(t); continue; }
      else if (/[\\/].+/.test(t.slice(1))) { out.push(t); continue; }
      continue;
    }

    const prevIsRedirect = REDIRECTS.has(prevQuoteStripped);
    if (prevIsRedirect || inPathCmdSegment || looksLikePath(t)) out.push(t);
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
// ── 작업폴더 밖 판정(D1, 2026-07-12) ── isSensitive()는 홈·시스템 등 "정해진 목록"만 검사한다.
//   그 목록에 없는 임의 폴더(예: 다른 프로젝트)는 걸러지지 않아, 07_SECURITY §1 "작업폴더 안만
//   쓰기 허용"과 실제 구현 사이에 간극이 있었다(라이브 검증 발견). 치명적 위치는 아니므로
//   deny가 아니라 ask로 한 단계만 확인한다(deny-first 원칙: 되돌릴 수 있는 것 = ask).
function isOutsideWorkdir(absInput, cwd) {
  let a, c;
  try { a = toComparable(path.isAbsolute(absInput) ? absInput : path.resolve(absInput)); } catch { return false; }
  try { c = toComparable(path.resolve(cwd)); } catch { return false; }
  if (a === c) return false;
  return !a.startsWith(c + path.sep);
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
  // 원격 코드 다운로드+즉시실행(07_SECURITY §2 "명령어 주입" 수용기준) — rm -rf급으로 되돌릴 수 없음
  /\b(curl|wget)\b[^|;&]*\|\s*(bash|sh|zsh|python3?|node)\b/i,
  /\b(iwr|invoke-webrequest|irm|invoke-restmethod)\b[^|;&]*\|\s*(iex|invoke-expression)\b/i,
  /\b(iex|invoke-expression)\b\s*\(?[^;&|\n]*\b(downloadstring|invoke-webrequest|invoke-restmethod|\biwr\b|\birm\b)\b/i,
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
  // 안전 폴백은 항상 평가한다(세션 게이트 없음 — R2). 위험하지 않은 작업은 끝에서 조용히 통과.
  const raw = readStdin();
  let input;
  try { input = JSON.parse(raw); } catch { passThrough(); return; }
  if (!input || typeof input !== "object") { passThrough(); return; } // null·숫자 등 비객체 JSON도 안전 통과

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

    // ③④ 명령이 건드리는 경로 검사 — ④ settings는 항상, ③ 민감위치는 Harness 없을 때만(있으면 위임)
    // ⚠️ 위험도 등급(level)과 무관하게 항상 실행한다(2026-07-12 라이브 검증 발견): "safe" 등급 명령
    // (echo·Set-Content 등 리다이렉트/쓰기 계열)이 위험 명령 목록에 없다는 이유로 이 검사 자체를
    // 건너뛰어, 셸 명령으로는 민감경로·작업폴더 밖 쓰기가 무방비로 통과되던 구멍을 막음.
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
      if (!harness && isOutsideWorkdir(ap, cwd)) {
        decide("ask", "지금 작업 중인 폴더 밖의 위치를 건드리려고 해요. 다른 폴더까지 손대는 게 맞나요? 확실하면 진행해도 돼요.");
        return;
      }
    }

    if (level === "safe") { passThrough(); return; }

    // ① 치명(catastrophic) 명령 — Harness 유무 무관 항상 deny (ⓓ 방어심층)
    //   근거: isHarnessAlive()는 guard.mjs 파일 존재만 확인 → 껍데기/깨진 Harness면 위임 후 무방비.
    //   되돌릴 수 없는 명령은 어떤 경우에도 막는다(fail-closed). 이중 deny는 프롬프트 없어 무해.
    if (level === "catastrophic") {
      decide("deny", "되돌릴 수 없는 위험한 명령이라 막았어요. 정말 필요하면 더 작은 단위로 나눠서 해보세요.");
      return;
    }
    // ① 그 외 위험(재귀/단일 삭제) — Harness가 살아있으면 위임(중복 차단/프롬프트 방지)
    if (harness) { passThrough(); return; }
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
    if (!harness && isOutsideWorkdir(abs, cwd)) {
      decide("ask", "지금 작업 중인 폴더 밖의 위치에 쓰려고 해요. 다른 폴더까지 손대는 게 맞나요? 확실하면 진행해도 돼요.");
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
