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
// ⚠️ B2 수정(2026-08-02, 05_AUDIT_AND_DECISIONS.md 결정 "Codex에선 위임 안 함, 전체 폴백 유지"):
//   isHarnessAlive()는 Claude Code 전용 플러그인 경로만 보고 "지금 Codex 위에서 실행 중인지"는
//   전혀 모른다. 같은 PC에 Claude Code+SoDamHarness가 설치돼 있으면(형제 플러그인 세트 전제상 흔함)
//   Codex 위에서도 harness=true로 오판해 아래 isSensitive()·pathTraversesSymlink() 검사를 위임한다는
//   이유로 건너뛰는데, codex/install.mjs는 Harness의 훅을 .codex/hooks.json에 등록하지 않아 그
//   위임을 아무도 받지 않는 "허공 위임"이었다(실사용 코드 대조로 확인됨). 아래 IS_CODEX_DEPLOY가
//   자신의 파일 경로로 Codex 배포본(codex/install.mjs의 고정 목적지 .agents/hooks/guard.mjs)임을
//   스스로 감지하면 harness를 무조건 false로 강제해, Codex 쪽은 항상 "전체 폴백"을 쓰도록 만든다.
//
// 4종 화이트리스트(최소 폴백):
//   ① 위험·치명 명령(rm -rf·재귀삭제·format 등) → deny / 단일 파일 삭제 → ask(백업은 Harness 담당)
//   ② API키·비밀값 노출(echo $KEY·.env 업로드·BASE_URL 변조·키 리터럴) → deny / .env 로컬 읽기 → ask
//   ③ 작업폴더 밖 민감 위치(시스템·홈·자격증명 폴더) 쓰기 → deny / 그 외 작업폴더 밖 쓰기 → ask(2026-07-12, D1)
//   ④ .claude/settings(.local).json 쓰기(주입 경로 CVE-2025-59536)
//      → Write/Edit/MultiEdit로 mcpServers·enableAllProjectMcpServers·permissions·hooks 등
//        민감 항목을 바꾸면 deny(07_SECURITY §1/§5 MUST), 그 외 항목만 바꾸면 ask.
//        셸 명령 경유(cat·리다이렉트 등)는 내용을 구조적으로 알 수 없어 ask 유지
//        (deny로 올리면 단순 조회(cat)까지 막는 과잉차단이 되어 대상에서 제외, 2026-07-27).
//
// deny-first: 되돌릴 수 없는 건 deny, 되돌릴 수 있는 건 ask, 나머지는 조용히 통과(과잉 확인창 방지).
// 정직한 한계: 위험 패턴은 "초안"이며 모든 위험을 100% 잡지 못한다(01_PRD §8.8).
//
// F6(2026-07-15): deny/ask 결정마다 ~/.sodamagentic/safety-log.jsonl에 기록(로그 실패가
// 안전 판정을 절대 막지 않도록 best-effort). 조회는 commands/log.md(/sodam-agentic:log).

import { readFileSync, readdirSync, existsSync, lstatSync, appendFileSync, mkdirSync } from "node:fs";
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
// codex/install.mjs는 이 파일을 항상 <프로젝트>/.agents/hooks/guard.mjs로 복사한다(DEST_HOOKS 상수).
// 이 경로(부모의 부모 폴더 이름이 ".agents")에서 실행 중이면 Codex 배포본으로 간주한다 — 실제
// Claude Code 플러그인 설치 경로(~/.claude/plugins/... 또는 %APPDATA%\claude-code\plugins\cache\...)엔
// ".agents"라는 폴더명이 등장하지 않아 오탐 없이 구분 가능.
const IS_CODEX_DEPLOY = path.basename(path.dirname(here)) === ".agents";
const RULES_PATH = path.join(here, "..", "data", "agentic-rules.json");
// SODAM_AGENTIC_DATA 오버라이드는 _selftest.mjs가 실제 홈 디렉터리를 건드리지 않고
// 격리된 임시 폴더에서 로그 기록을 검증하기 위함(운영 시에는 항상 아래 우선순위로 결정).
//
// 데이터 저장 위치 우선순위(2026-08-02, CHECKPOINT §0-30 설계를 방어적으로 적용):
//   ① SODAM_AGENTIC_DATA(테스트 격리 전용, 최우선)
//   ② process.argv[2] — hooks.json이 "${CLAUDE_PLUGIN_DATA}"를 인자로 넘기면 여기로 들어온다
//      (공식 영구 데이터 경로, 업데이트·재설치 생존 + 제거 시 자동정리). 단 이 치환이 정말
//      "command 문자열 안에서" 실제로 일어나는지는 아직 라이브 미검증이므로, 치환이 실패해
//      리터럴 "${CLAUDE_PLUGIN_DATA}" 문자열이 그대로 들어오거나 절대경로가 아니면 무시한다.
//   ③ (폴백) 기존 ~/.sodamagentic — ①②가 전부 실패해도(Codex처럼 애초에 인자를 안 주는 환경 포함)
//      오늘까지의 동작과 완전히 동일하게 계속 작동한다(회귀 없음이 이 설계의 핵심).
function resolveLogDir() {
  if (process.env.SODAM_AGENTIC_DATA) return process.env.SODAM_AGENTIC_DATA;
  const arg = process.argv[2];
  if (typeof arg === "string") {
    const trimmed = arg.trim();
    if (trimmed && !trimmed.includes("${") && path.isAbsolute(trimmed)) return trimmed;
  }
  return path.join(homedir(), ".sodamagentic");
}
const LOG_DIR = resolveLogDir();
const LOG_PATH = path.join(LOG_DIR, "safety-log.jsonl");

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

// ── F6: 안전 기록 — 키/토큰 패턴 마스킹 후 저장(02_DATA_MODEL "키 값 로그 저장 금지" 준수) ──
function maskSecrets(s) {
  let out = String(s);
  for (const re of KEY_DENY) out = out.replace(re, "[REDACTED]");
  for (const re of KEY_ASK) out = out.replace(re, "[REDACTED]");
  return out;
}
// target: 차단/확인 대상(경로 또는 명령 원문). 로그 실패가 안전 판정을 절대 막지 않도록 best-effort.
function logSafetyEvent(action, target, reason) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      action,
      target: maskSecrets(target == null ? "" : String(target)),
      reason,
      created_at: new Date().toISOString(),
    };
    appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // 로그는 관측용 부가기능 — 실패해도 안전 판정(decide 결과)에는 영향 없음
  }
}

// ── 결정 출력 후 종료 ──
// 소담 패밀리(Harness 등)와 동시 설치 시 어느 플러그인이 막았는지 사용자가 구분할 수 있도록 출처 표시.
function decide(decision, reason, target) {
  const taggedReason = `[소담 에이전틱] ${reason}`;
  logSafetyEvent(decision, target, taggedReason);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: taggedReason,
      },
    }),
  );
  process.exit(0);
}
function passThrough() {
  process.exit(0); // 출력 없음 = 기본 권한 흐름(우리가 판단 안 함) — F6 기록 대상 아님(로그 비대화 방지)
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

// Edit/MultiEdit가 "지우는" 원본 조각(old_string). settings.json에서 민감 키를 삭제하는 것도
// 추가·수정과 동일하게 위험(보호 규칙 제거)이라 이것도 감시 대상이다(2026-07-27, 실사용 검증 중 발견).
function oldContents(ti) {
  const out = [];
  for (const key of ["old_string", "old_str"]) {
    if (typeof ti[key] === "string" && ti[key]) out.push(ti[key]);
  }
  if (Array.isArray(ti.edits)) {
    for (const e of ti.edits) if (e && typeof e.old_string === "string") out.push(e.old_string);
  }
  return out;
}

// Write는 old_string이 없다(파일 전체를 교체) — 덮어써지기 직전의 실제 파일 내용을 대신 읽는다.
function existingFileContent(abs) {
  try { return existsSync(abs) ? readFileSync(abs, "utf8") : ""; } catch { return ""; }
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
// ── 링크 경유 우회 판정(2026-07-14, CHECKPOINT 잔여위험 해소) ──
// 기존 isSymlink()은 "쓰기 대상 파일 자체"만 lstat해서, 중간 폴더가 심볼릭 링크/junction이면
// (예: 작업폴더\linkdir\file.txt, linkdir가 작업폴더 밖을 가리킴) 놓쳤다. 작업폴더부터 대상까지
// 경로의 각 구성요소를 전부 lstat해서, 어디든 링크가 끼어 있으면 잡는다.
// realpath 정규화 대신 이 방식을 쓰는 이유: cwd 자체가 심볼릭 경로인 환경(예: macOS /tmp)에서
// realpath 비교는 정상적인 작업폴더 내 쓰기까지 전부 오탐(링크로 오판)낼 수 있어, cwd 자신의
// 경로 형태를 건드리지 않는 이 컴포넌트별 lstat 방식이 더 안전하다.
function pathTraversesSymlink(absTarget, cwd) {
  let cAbs;
  try { cAbs = path.resolve(cwd); } catch { return isSymlink(absTarget); }
  const rel = path.relative(cAbs, absTarget);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return isSymlink(absTarget); // 작업폴더 밖은 leaf만(밖 여부는 다른 검사가 처리)
  let cur = cAbs;
  for (const seg of rel.split(path.sep)) {
    if (!seg) continue;
    cur = path.join(cur, seg);
    if (isSymlink(cur)) return true;
  }
  return false;
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

// .mcp.json — 실제로 mcpServers(=Claude Code가 자동 실행할 명령)가 정의되는 파일. 공식문서로 확인
// (2026-07-27, 실사용 테스트 중 발견): mcpServers는 .claude/settings.json엔 존재조차 안 하는
// 필드고 .mcp.json에만 있다. 그동안 SETTINGS_SENSITIVE_KEYS의 "mcpServers"는 settings.json에서만
// 검사해 진짜 위험 파일(.mcp.json)은 완전히 무방비였다 — 이 파일 자체가 "무엇을 실행할지" 정의이므로
// 안전한 내용이 없어(전체가 위험 대상), 부분 판정 없이 파일 전체를 deny한다.
function isMcpConfigFile(p) {
  return /(^|[\\/])\.mcp\.json$/i.test(String(p).replace(/\\/g, "/"));
}
const MCP_CONFIG_DENY_MSG = "이 파일(.mcp.json)은 Claude Code가 자동으로 실행할 MCP 서버를 정의하는 곳이라, AI가 여기를 바꾸면 다음에 이 폴더를 열 때 낯선 프로그램이 자동 실행될 수 있어요. 되돌리기 어려운 위험이라 막았어요. 정말 필요하면 편집기를 열어 사용자가 직접 바꿔주세요.";
// ── ④ settings '민감 변경' 판정(07_SECURITY §1/§5 MUST — 이 항목들은 ask가 아니라 deny) ──
// mcpServers/enableAllProjectMcpServers(임의 MCP 활성)·permissions(권한 상승)·hooks(안전훅 관련)는
// 전부 AI 안전장치를 약화시키는 데 악용될 수 있어 "그냥 확인창"(93% 무조건 승인, 06 A2)만으론 부족하다고
// 스펙이 못박은 항목. Write/Edit/MultiEdit는 new content(writeContents)로 판정 가능하지만, 셸 리다이렉트는
// 임의 문자열이라 안전하게 판정 못 해 이 함수의 대상에서 제외(그 경로는 기존 ask 그대로 유지).
// 2026-07-27 실사용 테스트에서 발견·공식문서(code.claude.com/docs/en/mcp.md) 확인: enabledMcpjsonServers/
// disabledMcpjsonServers가 .mcp.json 프로젝트 서버의 승인·신뢰 여부를 실제로 결정하는 필드.
// ⚠️ 2026-08-02 정정(공식문서 code.claude.com/docs/en/mcp.md 재확인): enabledMcpServers/disabledMcpServers는
// 이름은 비슷하지만 실제로는 .claude/settings.json이 아니라 ~/.claude.json(별도 파일, 내장 서버 on/off용)에
// 저장된다 — isSettingsFile()이 그 경로를 매칭하지 않아 이 두 키는 이 파일 기준으로는 발동 조건이 성립하지
// 않는다. ~/.claude.json은 Claude Code 자신이 MCP 승인 등으로 수시로 정상 쓰기하는 별도 신뢰 경계라, 지금
// 함부로 감시 범위를 넓히면 정상 동작 오탐 위험이 커서 이번엔 손대지 않는다(별도 세션에서 신중히 설계,
// 제거도 안 함 — 실제 settings.json에 이 키가 등장해도 막아주는 건 안전 쪽으로 무해하므로 목록엔 남긴다).
// 2026-08-02 추가(공식문서 code.claude.com/docs/en/settings.md 확인): disableAllHooks(훅 전체를 끄는
// 단일 스위치라 F4 보호 기능이 통째로 꺼질 수 있음)·env(모든 세션에 주입되는 환경변수 — ANTHROPIC_BASE_URL
// 값을 다른 곳으로 바꾸면 API 통신 경로가 조용히 바뀌어 자격증명 안전에 영향, 07_SECURITY.md §6이 이미
// SHOULD로 요구했으나 미구현 상태였음)·apiKeyHelper(인증 헤더를 만드는 명령 설정 자체를 다른 값으로 바꿀
// 수 있음)도 동급 위험으로 확인돼 추가.
const SETTINGS_SENSITIVE_KEYS = [
  "mcpServers", "enableAllProjectMcpServers", "permissions", "hooks",
  "enabledMcpjsonServers", "disabledMcpjsonServers", "enabledMcpServers", "disabledMcpServers",
  "disableAllHooks", "env", "apiKeyHelper",
];
function touchesSensitiveSettingsKeys(strings) {
  for (const s of strings) {
    for (const key of SETTINGS_SENSITIVE_KEYS) {
      if (new RegExp(`"${key}"\\s*:`).test(s)) return true;
    }
  }
  return false;
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
  // Codex 배포본이면(IS_CODEX_DEPLOY) 위 B2 근거로 위임을 아예 시도하지 않고 항상 전체 폴백을 쓴다.
  const harness = IS_CODEX_DEPLOY ? false : isHarnessAlive();

  const isWriteTool = ["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(toolName);
  const isShellTool = !isWriteTool && typeof ti.command === "string" && ti.command.length > 0;
  if (!isWriteTool && !isShellTool) { passThrough(); return; }

  // ── 셸 명령 ──
  if (isShellTool) {
    const cmd = String(ti.command || "");

    // ② 키/비밀값 노출 — 등급과 무관하게 먼저 검사(echo $KEY 같은 건 '안전'으로 분류되니까)
    if (anyMatch(KEY_DENY, cmd)) {
      decide("deny", "API 키·비밀값이 노출될 수 있는 작업이라 막았어요. 키는 코드·화면·외부 전송 어디에도 남기면 안 돼요(.env 등 본인 환경에만 보관).", cmd);
      return;
    }

    const level = anyMatch(CATASTROPHIC, normalizeForClassify(cmd))
      ? "catastrophic"
      : (anyMatch(RISKY_DELETE, normalizeForClassify(cmd)) || anyMatch(EXTRA_DENIED, cmd))
        ? "risky"
        : "safe";

    // ② .env 로컬 읽기 등 모호한 키 접근 → ask (safe로 분류돼도 확인)
    if (level === "safe" && anyMatch(KEY_ASK, cmd)) {
      decide("ask", "비밀값이 들어 있을 수 있는 파일(.env 등)을 여는 작업이에요. 키가 화면·기록에 남지 않게 주의하세요. 정말 진행할까요?", cmd);
      return;
    }

    // ③④ 명령이 건드리는 경로 검사 — ④ settings는 항상, ③ 민감위치는 Harness 없을 때만(있으면 위임)
    // ⚠️ 위험도 등급(level)과 무관하게 항상 실행한다(2026-07-12 라이브 검증 발견): "safe" 등급 명령
    // (echo·Set-Content 등 리다이렉트/쓰기 계열)이 위험 명령 목록에 없다는 이유로 이 검사 자체를
    // 건너뛰어, 셸 명령으로는 민감경로·작업폴더 밖 쓰기가 무방비로 통과되던 구멍을 막음.
    const paths = commandPaths(cmd).map((p) => resolveLoose(cwd, p));
    for (const ap of paths) {
      if (isSettingsFile(ap)) {
        decide("ask", "이 파일(.claude/settings)은 AI의 권한·안전 설정을 바꿀 수 있어 위험해요(주입 통로로 악용된 사례 있음). 정말 이 변경이 필요한가요?", ap);
        return;
      }
      if (isMcpConfigFile(ap)) {
        decide("deny", MCP_CONFIG_DENY_MSG, ap);
        return;
      }
      if (!harness && isSensitive(ap)) {
        decide("deny", "시스템·홈 등 민감한 위치를 건드리는 위험한 작업이라 막았어요. 안전을 위해 작업용 폴더 안에서만 진행해 주세요.", ap);
        return;
      }
      if (!harness && pathTraversesSymlink(ap, cwd)) {
        decide("deny", "경로 중간에 바로가기(심볼릭 링크·폴더 연결)가 있어 실제로 어디에 쓰는지 확실하지 않아요. 안전을 위해 막았어요.", ap);
        return;
      }
      // ⚠️ harness 유무와 무관하게 항상 실행(2026-07-17 라이브 검증 발견): SoDamHarness 실제
      // 설치본(guard.mjs)을 직접 읽고 실행해보니 "작업폴더 밖 새 파일 쓰기 → 확인" 보호를
      // 전혀 구현하지 않는다(설계상 의도적 — "cwd 밖이면 무조건 차단은 과잉"이라 폐기했다고
      // 스스로 명시). 위임했는데 이 보호만 조용히 사라지는 걸 막기 위해 이 체크만은 항상 자체 수행.
      if (isOutsideWorkdir(ap, cwd)) {
        decide("ask", "지금 작업 중인 폴더 밖의 위치를 건드리려고 해요. 다른 폴더까지 손대는 게 맞나요? 확실하면 진행해도 돼요.", ap);
        return;
      }
    }

    if (level === "safe") { passThrough(); return; }

    // ① 치명(catastrophic) 명령 — Harness 유무 무관 항상 deny (ⓓ 방어심층)
    //   근거: isHarnessAlive()는 guard.mjs 파일 존재만 확인 → 껍데기/깨진 Harness면 위임 후 무방비.
    //   되돌릴 수 없는 명령은 어떤 경우에도 막는다(fail-closed). 이중 deny는 프롬프트 없어 무해.
    if (level === "catastrophic") {
      decide("deny", "되돌릴 수 없는 위험한 명령이라 막았어요. 정말 필요하면 더 작은 단위로 나눠서 해보세요.", cmd);
      return;
    }
    // ① 그 외 위험(재귀/단일 삭제) — Harness가 살아있으면 위임(중복 차단/프롬프트 방지)
    if (harness) { passThrough(); return; }
    // ① 폴더(재귀) 삭제 → deny (백업·되돌리기 어려움)
    if (anyMatch(RECURSIVE_DELETE, cmd)) {
      decide("deny", FOLDER_DENY_MSG, cmd);
      return;
    }
    // ① 단일 파일 삭제 등 risky → ask (Agentic은 백업 안 함 — Harness가 있으면 되돌리기 가능)
    decide("ask", "되돌리기 어려운 작업이에요. (SoDamHarness가 함께 설치돼 있으면 백업·되돌리기를 도와줘요.) 작게 나눠서 하면 더 안전해요. 정말 진행할까요?", cmd);
    return;
  }

  // ── 파일 쓰기 계열 (Write/Edit/...) ──
  const targets = writeTargets(ti);
  for (const t of targets) {
    const abs = resolveLoose(cwd, t);
    if (isMcpConfigFile(abs)) { // ⑤
      decide("deny", MCP_CONFIG_DENY_MSG, abs);
      return;
    }
    if (isSettingsFile(abs)) { // ④
      // 추가/수정뿐 아니라 "삭제"(기존 보호 규칙을 지워서 무력화)도 같은 위험이라 함께 본다.
      const before = toolName === "Write" ? [existingFileContent(abs)] : oldContents(ti);
      if (touchesSensitiveSettingsKeys(writeContents(ti)) || touchesSensitiveSettingsKeys(before)) {
        decide("deny", "이 파일(.claude/settings)에서 MCP 활성화·권한·훅 경로처럼 AI 안전장치 자체를 바꿀 수 있는 항목을 변경(추가·수정·삭제 포함)하려고 해요. 되돌리기 어려운 위험이라 막았어요. 정말 필요하면 편집기를 열어 사용자가 직접 바꿔주세요.", abs);
        return;
      }
      decide("ask", "이 파일(.claude/settings)은 AI의 권한·안전 설정을 바꿀 수 있어 위험해요(주입 통로로 악용된 사례 있음). 정말 이 변경이 필요한가요?", abs);
      return;
    }
    if (!harness && isSensitive(abs)) { // ③ Harness 없을 때만(있으면 위임)
      decide("deny", "시스템·홈 등 민감한 위치의 파일이라 안전을 위해 막았어요.", abs);
      return;
    }
    if (!harness && pathTraversesSymlink(abs, cwd)) {
      decide("deny", "바로가기(심볼릭 링크) 파일이거나 경로 중간에 폴더 연결(junction)이 있어 실제로 어디에 쓰는지 확실하지 않아요. 안전을 위해 막았어요.", abs);
      return;
    }
    // ⚠️ harness 유무와 무관하게 항상 실행 — 위 셸 명령 분기와 동일 근거(2026-07-17).
    if (isOutsideWorkdir(abs, cwd)) {
      decide("ask", "지금 작업 중인 폴더 밖의 위치에 쓰려고 해요. 다른 폴더까지 손대는 게 맞나요? 확실하면 진행해도 돼요.", abs);
      return;
    }
  }
  // ② 파일 '내용'에 키/비밀값 리터럴을 적으려 하면 차단(하드코딩 금지)
  const contents = writeContents(ti);
  for (const c of contents) {
    if (anyMatch(KEY_DENY, c)) {
      decide("deny", "파일에 API 키·비밀값을 직접 적으려는 것 같아 막았어요. 키는 코드에 넣지 말고 .env 같은 본인 환경 변수로 관리하세요.", "[파일 내용 - 비밀값 패턴 감지, 원문 미기록]");
      return;
    }
  }
  // 그 외(새 파일·일반 덮어쓰기)는 통과 — 일반 백업/확인은 Harness 소유(폴백 범위 밖, 과잉 확인 방지)
  passThrough();
}

main();
