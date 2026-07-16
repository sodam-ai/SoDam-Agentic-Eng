// SoDamAgentic — 구조 검증 (설치 전 '깨짐' 선제거). read-only, 외부 전송/eval 0.
// 검사: plugin.json·marketplace.json·commands·skills·agents·hooks.json 의
//       필수 필드/이름규칙/경로 존재 + 설치 캐시가 작업트리와 같은지(Windows).
//       ★SKILL.md name 누락(버전해시 버그) 등.
// 한계: 구조만 검증. '실제 발동(설치 후 트리거)'은 라이브 스모크 테스트로만 확인됨.
//
// 2026-07-16 추가(캐시 검사): guard.mjs를 여러 번 고쳐도 Claude Code가 실제로 쓰는
// 설치 캐시는 /reload-plugins(또는 재설치) 전까지 갱신 안 된다는 게 라이브 테스트로
// 확인됨(CHECKPOINT §0-3~§0-5에 반복 기록된 문제, 07_SECURITY.md §9 MUST 요건과
// 직결). 사람이 매번 기억해서 확인하는 대신 이 검증기가 자동으로 잡아내게 함.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, warn = 0, fail = 0;
const OK = (m) => { console.log("  PASS  " + m); pass++; };
const WARN = (m) => { console.log("  WARN  " + m); warn++; };
const FAIL = (m) => { console.log("  FAIL  " + m); fail++; };
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function frontmatter(file) {
  const txt = readFileSync(file, "utf8");
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim();
  }
  return fm;
}
function rel(p) { return path.relative(ROOT, p).replace(/\\/g, "/"); }

// 1) plugin.json
console.log("\n[plugin.json]");
const pjPath = path.join(ROOT, ".claude-plugin", "plugin.json");
if (!existsSync(pjPath)) FAIL(".claude-plugin/plugin.json 없음");
else try {
  const pj = JSON.parse(readFileSync(pjPath, "utf8"));
  if (!pj.name) FAIL("name 없음");
  else if (!KEBAB.test(pj.name)) FAIL("name kebab-case 아님: " + pj.name);
  else OK("name=" + pj.name + (pj.version ? " v" + pj.version : ""));
} catch (e) { FAIL("JSON 파싱 실패: " + e.message); }

// 2) marketplace.json
console.log("\n[marketplace.json]");
const mpPath = path.join(ROOT, ".claude-plugin", "marketplace.json");
if (!existsSync(mpPath)) WARN("없음 (로컬 설치 테스트 불가)");
else try {
  const mp = JSON.parse(readFileSync(mpPath, "utf8"));
  if (!mp.name) FAIL("name 없음"); else OK("market name=" + mp.name);
  if (!Array.isArray(mp.plugins) || !mp.plugins.length) FAIL("plugins 비어있음");
  else for (const p of mp.plugins) {
    if (!p.name || !p.source) { FAIL("plugin 항목 name/source 누락"); continue; }
    const man = path.resolve(ROOT, p.source, ".claude-plugin", "plugin.json");
    if (!existsSync(man)) FAIL("source '" + p.source + "' → .claude-plugin/plugin.json 없음");
    else OK("plugin '" + p.name + "' source='" + p.source + "' → 매니페스트 OK");
  }
} catch (e) { FAIL("JSON 파싱 실패: " + e.message); }

// 3) 컴포넌트 frontmatter (commands / skills / agents)
function checkComponents(dir, kind) {
  const base = path.join(ROOT, dir);
  console.log("\n[" + dir + "]");
  if (!existsSync(base)) { WARN("디렉터리 없음 (해당 컴포넌트 없음)"); return; }
  const items = [];
  if (kind === "skill") {
    for (const sub of readdirSync(base)) {
      const sp = path.join(base, sub);
      if (!statSync(sp).isDirectory()) continue;
      const sk = path.join(sp, "SKILL.md");
      if (!existsSync(sk)) FAIL("skills/" + sub + " 에 SKILL.md 없음");
      else items.push({ file: sk, dirName: sub });
    }
  } else {
    for (const f of readdirSync(base)) if (f.endsWith(".md")) items.push({ file: path.join(base, f), dirName: f.replace(/\.md$/, "") });
  }
  if (!items.length) WARN("항목 없음");
  for (const { file, dirName } of items) {
    const fm = frontmatter(file);
    if (!fm) { FAIL(rel(file) + " : frontmatter(---) 없음"); continue; }
    if (!fm.name) FAIL(rel(file) + " : name 없음 (★설치 시 이름=버전해시 버그)");
    else if (kind === "skill" && !KEBAB.test(fm.name)) FAIL(rel(file) + " : name kebab-case 아님(" + fm.name + ")");
    if (!fm.description) FAIL(rel(file) + " : description 없음");
    if (fm.description && fm.description.length > 1536) WARN(rel(file) + " : description 1536자 초과(" + fm.description.length + ")");
    if (kind === "skill" && fm.name && fm.name !== dirName) WARN(rel(file) + " : name(" + fm.name + ")≠폴더(" + dirName + ")");
    if (fm.name && fm.description) OK(rel(file) + " name=" + fm.name);
  }
}
checkComponents("commands", "command");
checkComponents("skills", "skill");
checkComponents("agents", "agent");

// 4) hooks/hooks.json (공식: { "hooks": { "PreToolUse": [...] } } 래퍼)
console.log("\n[hooks/hooks.json]");
const hjPath = path.join(ROOT, "hooks", "hooks.json");
if (!existsSync(hjPath)) WARN("없음");
else try {
  const hj = JSON.parse(readFileSync(hjPath, "utf8"));
  const events = hj.hooks || hj;
  const cmds = [];
  for (const ev of Object.keys(events)) {
    if (!Array.isArray(events[ev])) continue;
    for (const m of events[ev]) for (const h of (m.hooks || [])) if (h.command) cmds.push(h.command);
  }
  if (!hj.hooks) WARN("최상위 'hooks' 래퍼 없음 (공식 형식과 다름)");
  if (!cmds.length) WARN("command 없음");
  for (const c of cmds) {
    const tok = c.split(/\s+/).find((t) => t.replace(/["']/g, "").endsWith(".mjs"));
    if (!tok) { WARN(".mjs 경로 못 찾음: " + c); continue; }
    const resolved = tok.replace(/["']/g, "").replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, ROOT);
    if (existsSync(resolved)) OK("hook 스크립트 존재: " + rel(resolved));
    else FAIL("hook 스크립트 없음: " + resolved);
  }
} catch (e) { FAIL("JSON 파싱 실패: " + e.message); }

// 5) 설치 캐시 vs 작업트리 guard.mjs 일치 여부 (Windows 전용, 다른 OS는 수동 확인)
console.log("\n[설치 캐시 최신성]");
if (process.platform !== "win32") {
  WARN("이 검사는 Windows 캐시 경로만 지원 — 다른 OS는 /reload-plugins 후 직접 확인 필요");
} else try {
  const pj2 = JSON.parse(readFileSync(pjPath, "utf8"));
  const mp2 = existsSync(mpPath) ? JSON.parse(readFileSync(mpPath, "utf8")) : null;
  if (!mp2 || !mp2.name || !pj2.name || !pj2.version) {
    WARN("plugin.json/marketplace.json 정보 부족 — 캐시 경로를 구성할 수 없음");
  } else {
    const cacheGuard = path.join(
      homedir(), "AppData", "Roaming", "claude-code", "plugins", "cache",
      mp2.name, pj2.name, pj2.version, "hooks", "guard.mjs",
    );
    if (!existsSync(cacheGuard)) {
      WARN("설치된 캐시를 못 찾음(" + cacheGuard + ") — 아직 설치 안 했거나 경로가 다를 수 있음");
    } else {
      const wtGuard = readFileSync(path.join(ROOT, "hooks", "guard.mjs"), "utf8");
      const cached = readFileSync(cacheGuard, "utf8");
      if (wtGuard === cached) OK("설치 캐시가 작업트리 guard.mjs와 동일함(실제로 최신 코드가 켜져 있음)");
      else FAIL("설치 캐시가 작업트리와 다름 — 방금 고친 안전 코드가 실제로는 아직 안 켜져 있을 수 있음. `/reload-plugins` 실행 후 재확인하세요.");
    }
  }
} catch (e) { WARN("캐시 비교 중 오류(무시 가능, 수동 확인 권장): " + e.message); }

console.log("\n결과: PASS " + pass + " / WARN " + warn + " / FAIL " + fail);
process.exit(fail ? 1 : 0);
