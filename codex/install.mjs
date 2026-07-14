#!/usr/bin/env node
/**
 * SoDamAgentic — Codex 설치 스크립트
 * 실행: node codex/install.mjs  (프로젝트 루트에서)
 *
 * 스킬(skills/)을 Codex 기본 경로(.agents/skills/)에 복사합니다.
 * Codex에는 Claude Code 마켓플레이스가 없으므로 이 스크립트로 수동 설치합니다.
 *
 * F7(2026-07-15): hooks/(guard.mjs+delegate.mjs)와 data/(agentic-rules.json)도
 * .agents/ 아래로 복사하고, .codex/hooks.json에 PreToolUse 훅으로 등록합니다.
 * Codex의 PreToolUse 훅 입출력 스키마가 Claude Code와 사실상 동일함을 확인해
 * guard.mjs를 재구현 없이 그대로 재사용합니다(01_PRD §8 "안전 중복 신규구현 금지").
 * ⚠️ 정직한 한계: hooks.json 로드 경로·"ask" 확인창 실제 동작은 Codex CLI로 라이브 검증 전까지 미확정.
 */

import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');
const CWD = process.cwd();

// 소스: 이 플러그인의 폴더들
const SRC_SKILLS = join(PLUGIN_ROOT, 'skills');
const SRC_AGENTS = join(PLUGIN_ROOT, 'AGENTS.md');
const SRC_HOOKS  = join(PLUGIN_ROOT, 'hooks');
const SRC_DATA   = join(PLUGIN_ROOT, 'data');

// 대상: 사용자 프로젝트의 Codex 기본 경로
const DEST_SKILLS = join(CWD, '.agents', 'skills');
const DEST_AGENTS = join(CWD, 'AGENTS.md');
const DEST_HOOKS  = join(CWD, '.agents', 'hooks');
const DEST_DATA   = join(CWD, '.agents', 'data');
const DEST_CODEX_HOOKS_JSON = join(CWD, '.codex', 'hooks.json');
const GUARD_DEST_PATH = join(DEST_HOOKS, 'guard.mjs');

const GREEN  = s => `\x1b[32m${s}\x1b[0m`;
const YELLOW = s => `\x1b[33m${s}\x1b[0m`;
const RED    = s => `\x1b[31m${s}\x1b[0m`;

console.log('\n=== SoDamAgentic — Codex 설치 ===\n');

// ─── 한계 안내 (설치 전 반드시 표시) ────────────────────────────────────────
console.log(YELLOW('⚠️  Codex 한계 안내:'));
console.log(YELLOW('   Codex 훅도 이제 등록됩니다(F7). 다만 "확인창(ask)"이 Claude Code처럼'));
console.log(YELLOW('   실제로 뜨는지는 아직 라이브로 검증 전입니다 — 설치 후 한 번 직접 테스트해보세요.'));
console.log(YELLOW('   계획(F2)·검토(F3) 스킬은 두 도구에서 동일하게 작동합니다.\n'));

// ─── 1. 대상 폴더 생성 ───────────────────────────────────────────────────────
try {
  mkdirSync(DEST_SKILLS, { recursive: true });
} catch (e) {
  console.error(RED(`❌ 폴더 생성 실패: ${DEST_SKILLS}`));
  console.error(RED(`   ${e.message}`));
  process.exit(1);
}

// ─── 2. 스킬 복사 ────────────────────────────────────────────────────────────
let installed = 0;

try {
  const skillDirs = readdirSync(SRC_SKILLS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  if (skillDirs.length === 0) {
    console.error(RED('❌ skills/ 폴더가 비어 있거나 찾을 수 없습니다.'));
    process.exit(1);
  }

  for (const skill of skillDirs) {
    const src  = join(SRC_SKILLS, skill);
    const dest = join(DEST_SKILLS, skill);
    cpSync(src, dest, { recursive: true, force: true });
    console.log(GREEN(`✅ 스킬 설치: ${skill}`));
    console.log(`   ${src} → ${dest}`);
    installed++;
  }
} catch (e) {
  console.error(RED(`❌ 스킬 복사 실패: ${e.message}`));
  process.exit(1);
}

// ─── 3. AGENTS.md 복사 (이미 있으면 덮어쓰지 않음) ─────────────────────────
if (existsSync(SRC_AGENTS)) {
  if (!existsSync(DEST_AGENTS)) {
    try {
      cpSync(SRC_AGENTS, DEST_AGENTS);
      console.log(GREEN('\n✅ AGENTS.md → 프로젝트 루트에 설치'));
    } catch (e) {
      console.log(YELLOW(`\n⚠️  AGENTS.md 복사 실패 (선택 항목): ${e.message}`));
    }
  } else {
    console.log('\nℹ️  AGENTS.md 이미 존재합니다. 덮어쓰지 않습니다.');
  }
}

// ─── 4. 안전 훅(guard.mjs+delegate.mjs) + 데이터(agentic-rules.json) 복사 (F7) ──
// hooks/·data/를 형제 폴더 구조 그대로 복사해야 guard.mjs의 상대경로
// (path.join(here, "..", "data", "agentic-rules.json")) 가 그대로 맞는다.
let hooksCopied = false;
try {
  mkdirSync(DEST_HOOKS, { recursive: true });
  mkdirSync(DEST_DATA, { recursive: true });
  for (const name of readdirSync(SRC_HOOKS)) {
    if (name.startsWith('_')) continue; // _selftest.mjs 등 로컬 전용 파일은 배포 제외
    cpSync(join(SRC_HOOKS, name), join(DEST_HOOKS, name), { recursive: true, force: true });
  }
  if (existsSync(SRC_DATA)) {
    cpSync(SRC_DATA, DEST_DATA, { recursive: true, force: true });
  }
  console.log(GREEN(`\n✅ 안전 훅 설치: ${DEST_HOOKS}`));
  hooksCopied = true;
} catch (e) {
  console.log(YELLOW(`\n⚠️  안전 훅 복사 실패(F7 안전장치가 등록되지 않습니다): ${e.message}`));
}

// ─── 5. .codex/hooks.json에 PreToolUse 등록 (기존 내용 보존, 병합) ─────────
if (hooksCopied) {
  try {
    mkdirSync(join(CWD, '.codex'), { recursive: true });

    let config = { hooks: {} };
    if (existsSync(DEST_CODEX_HOOKS_JSON)) {
      try {
        config = JSON.parse(readFileSync(DEST_CODEX_HOOKS_JSON, 'utf8'));
        if (!config || typeof config !== 'object') config = { hooks: {} };
        if (!config.hooks || typeof config.hooks !== 'object') config.hooks = {};
      } catch {
        console.log(YELLOW(`⚠️  기존 .codex/hooks.json을 읽지 못해(문법 오류) 새로 만듭니다. 기존 파일은 그대로 두고 병합만 스킵합니다.`));
        config = { hooks: {} };
      }
    }

    const guardCommand = `node "${GUARD_DEST_PATH}"`;
    if (!Array.isArray(config.hooks.PreToolUse)) config.hooks.PreToolUse = [];
    const alreadyRegistered = config.hooks.PreToolUse.some(
      entry => Array.isArray(entry?.hooks) && entry.hooks.some(h => h?.command === guardCommand),
    );
    if (!alreadyRegistered) {
      config.hooks.PreToolUse.push({
        matcher: 'Bash|PowerShell|apply_patch',
        hooks: [{ type: 'command', command: guardCommand, timeout: 30 }],
      });
      writeFileSync(DEST_CODEX_HOOKS_JSON, JSON.stringify(config, null, 2) + '\n', 'utf8');
      console.log(GREEN(`✅ Codex 훅 등록: ${DEST_CODEX_HOOKS_JSON}`));
    } else {
      console.log('ℹ️  Codex 훅이 이미 등록돼 있습니다. 중복 등록하지 않습니다.');
    }
  } catch (e) {
    console.log(YELLOW(`⚠️  .codex/hooks.json 등록 실패(F7 안전장치가 자동 활성화되지 않습니다): ${e.message}`));
  }
}

// ─── 결과 요약 ───────────────────────────────────────────────────────────────
console.log(`\n설치 완료: ${installed}개 스킬 → ${DEST_SKILLS}\n`);
console.log('Codex에서 활성화되는 스킬:');
console.log('  sodam-agentic-start  — 온보딩 시작 안내 (F1)');
console.log('  sodam-agentic-plan   — 새 작업 전 계획 먼저 (F2)');
console.log('  sodam-agentic-review — 작업 후 변경점 검토 (F3)');
console.log('');
if (hooksCopied) {
  console.log(GREEN('✅ 안전 훅(F4)·안전 기록(F6)도 함께 설치됐습니다.'));
  console.log(YELLOW('⚠️  다음 확인 필요(직접 테스트): Codex CLI의 `/hooks` 명령으로 훅이 로드됐는지 확인하고,'));
  console.log(YELLOW('   위험하지 않은 명령 하나로 "ask" 확인창이 실제로 뜨는지 한 번 시험해보세요.'));
} else {
  console.log(YELLOW('⚠️  안전 훅 설치에 실패했습니다 — 위 오류 메시지를 확인하세요.'));
}
console.log('');
