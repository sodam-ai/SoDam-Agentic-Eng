#!/usr/bin/env node
/**
 * SoDamAgentic — Codex 설치 스크립트
 * 실행: node codex/install.mjs  (프로젝트 루트에서)
 *
 * 스킬(skills/)을 Codex 기본 경로(.agents/skills/)에 복사합니다.
 * Codex에는 Claude Code 마켓플레이스가 없으므로 이 스크립트로 수동 설치합니다.
 */

import { existsSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');
const CWD = process.cwd();

// 소스: 이 플러그인의 skills 폴더
const SRC_SKILLS   = join(PLUGIN_ROOT, 'skills');
const SRC_AGENTS   = join(PLUGIN_ROOT, 'AGENTS.md');

// 대상: 사용자 프로젝트의 Codex 기본 경로
const DEST_SKILLS  = join(CWD, '.agents', 'skills');
const DEST_AGENTS  = join(CWD, 'AGENTS.md');

const GREEN  = s => `\x1b[32m${s}\x1b[0m`;
const YELLOW = s => `\x1b[33m${s}\x1b[0m`;
const RED    = s => `\x1b[31m${s}\x1b[0m`;

console.log('\n=== SoDamAgentic — Codex 설치 ===\n');

// ─── 한계 안내 (설치 전 반드시 표시) ────────────────────────────────────────
console.log(YELLOW('⚠️  Codex 한계 안내:'));
console.log(YELLOW('   훅(F4 안전 차단)은 Codex에서 Claude Code만큼 강하게 작동하지 않습니다.'));
console.log(YELLOW('   계획(F2)·검토(F3) 스킬은 동일하게 작동합니다.'));
console.log(YELLOW('   위험 명령 실행 전에 스스로 한 번 더 확인하세요.\n'));

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

// ─── 결과 요약 ───────────────────────────────────────────────────────────────
console.log(`\n설치 완료: ${installed}개 스킬 → ${DEST_SKILLS}\n`);
console.log('Codex에서 활성화되는 스킬:');
console.log('  sodam-agentic-start  — 온보딩 시작 안내 (F1)');
console.log('  sodam-agentic-plan   — 새 작업 전 계획 먼저 (F2)');
console.log('  sodam-agentic-review — 작업 후 변경점 검토 (F3)');
console.log('');
console.log(YELLOW('⚠️  다시 한 번: 안전 훅(F4)은 Codex에서 작동하지 않습니다.'));
console.log('   Claude Code에서 사용하면 F4까지 모두 작동합니다.\n');
