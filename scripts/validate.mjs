// SoDamAgentic — 구조 검증 (설치 전 '깨짐' 선제거). read-only, 외부 전송/eval 0.
// 검사: plugin.json·marketplace.json·commands·skills·agents·hooks.json 의
//       필수 필드/이름규칙/경로 존재. ★SKILL.md name 누락(버전해시 버그) 등.
// 한계: 구조만 검증. '실제 발동(설치 후 트리거)'은 라이브 스모크 테스트로만 확인됨.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
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

console.log("\n결과: PASS " + pass + " / WARN " + warn + " / FAIL " + fail);
process.exit(fail ? 1 : 0);
