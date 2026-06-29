#!/usr/bin/env node
/**
 * SoDam 패밀리 헬스체크 — 6형제 설치·구현 상태를 한눈에 확인
 * 실행: node scripts/family-health.mjs
 * 근거: docs/family-synergy.md, docs/api-contracts/harness-backup-api.md
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';

const home = os.homedir();

// 6형제 정의 (설치 순서 기준)
const FAMILY = [
  {
    name: 'SoDamHarness',
    emoji: '🛡',
    role: '안전·백업·되돌리기',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_22d_SoDam-Harness-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      'hooks/guard.mjs',
      'hooks/hooks.json',
    ],
    sharedOutput: join(home, '.sodamharness'),
    apiContractPath: 'scripts/backup.mjs',
    prdDone: true,
    codeDone: false,
    note: 'Phase 1 미착수 — backup.mjs 구현 최우선',
  },
  {
    name: 'SoDamLoop',
    emoji: '🔁',
    role: '자율 반복 엔진',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_27d_SoDam-Loop-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      'hooks/hooks.json',
    ],
    apiContractPath: null,
    prdDone: true,
    codeDone: false,
    note: 'Phase 0 스파이크(반복 모터 실증) 먼저 → Harness 완료 후 Phase 1a',
  },
  {
    name: 'SoDamContext',
    emoji: '🧠',
    role: '설명서 건강검진',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_25d_SoDam-Context-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      'lib/checkup.mjs',
      'lib/treat.mjs',
    ],
    apiContractPath: null,
    prdDone: true,
    codeDone: false,
    note: 'Harness backup API 완료 후 언블로킹',
  },
  {
    name: 'SoDamAgentic',
    emoji: '🚀',
    role: '진입점·계획·검토',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      'hooks/guard.mjs',
      'hooks/hooks.json',
      'skills/sodam-agentic-plan/SKILL.md',
      'skills/sodam-agentic-review/SKILL.md',
    ],
    apiContractPath: null,
    prdDone: true,
    codeDone: true,
    note: 'Phase 1 완료 ✅',
  },
  {
    name: 'SoDamPrompt',
    emoji: '✏️',
    role: '무코드 SKILL 라이브러리',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_28d_SoDam-Prompt-Eng',
    criticalFiles: [
      'README.md',
      'LICENSE',
    ],
    apiContractPath: null,
    prdDone: true,
    codeDone: false,
    note: 'SKILL.md 10개 완료(P1), 저장소 정리(P2)·GitHub push(P3)·사람 검수(P4) 대기',
  },
  {
    name: 'SoDamReverse',
    emoji: '🔍',
    role: '코드·앱 분석 보고서',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_30d_SoDam-Reverse-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      '.claude-plugin/marketplace.json',
      'hooks/hooks.json',
      'hooks/re-deny-guard.mjs',
      'hooks/_selftest.mjs',
      'skills/re-router/SKILL.md',
    ],
    apiContractPath: null,
    prdDone: true,
    codeDone: true, // M2·M3 완료(6/6 PASS), M4 시너지 완료(2026-06-29)
    note: 'Phase 1 MVP 완료 ✅ — M4(Harness+Context 시너지) 완료, M5 라이브 검증 대기',
  },
];

// ─── 체크 함수 ──────────────────────────────────────────────────────────────

function checkFiles(sibling) {
  const results = [];
  for (const f of sibling.criticalFiles) {
    const full = join(sibling.projectPath.replace(/\//g, '/'), f);
    results.push({ file: f, exists: existsSync(full) });
  }
  return results;
}

function getPluginVersion(projectPath) {
  const pluginJson = join(projectPath.replace(/\//g, '/'), '.claude-plugin', 'plugin.json');
  if (!existsSync(pluginJson)) return null;
  try {
    const data = JSON.parse(readFileSync(pluginJson, 'utf8'));
    return data.version || '?';
  } catch { return '?'; }
}

function checkHarnessOutput(sibling) {
  if (!sibling.sharedOutput) return null;
  return existsSync(sibling.sharedOutput);
}

// ─── 리포트 ──────────────────────────────────────────────────────────────────

console.log('\n🏠 SoDam 패밀리 헬스체크\n');
console.log('='.repeat(60));

let allOk = 0, needWork = 0;
const actionItems = [];

for (const sib of FAMILY) {
  const fileResults = checkFiles(sib);
  const missing = fileResults.filter(r => !r.exists);
  const version = getPluginVersion(sib.projectPath);
  const harnessOutput = checkHarnessOutput(sib);

  const statusEmoji = missing.length === 0 ? '✅' : (missing.length < fileResults.length ? '🔶' : '❌');
  const prdStatus = sib.prdDone ? '✅' : '🔶';
  const codeStatus = sib.codeDone && missing.length === 0 ? '✅' : '❌';

  if (missing.length === 0) allOk++;
  else {
    needWork++;
    actionItems.push({ name: sib.name, emoji: sib.emoji, note: sib.note, missing });
  }

  console.log(`\n${sib.emoji} ${sib.name} (${sib.role})`);
  console.log(`   PRD: ${prdStatus}  코드: ${codeStatus}  버전: ${version || '미설치'}`);

  if (sib.name === 'SoDamHarness' && harnessOutput !== null) {
    console.log(`   ~/.sodamharness: ${harnessOutput ? '✅ 존재' : '❌ 없음 (미구현)'}`);
  }

  if (missing.length > 0) {
    console.log(`   ❌ 누락 파일 (${missing.length}개):`);
    for (const m of missing) {
      console.log(`      • ${m.file}`);
    }
  } else {
    console.log(`   ✅ 핵심 파일 모두 존재`);
  }

  if (sib.note) {
    console.log(`   💡 ${sib.note}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 요약: ${allOk}개 준비됨 / ${needWork}개 작업 필요\n`);

if (actionItems.length > 0) {
  console.log('📋 작업 필요 목록 (우선순위 순):');
  actionItems.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.emoji} ${item.name}`);
    console.log(`   → ${item.note}`);
    if (item.missing.length <= 3) {
      item.missing.forEach(m => console.log(`   누락: ${m.file}`));
    } else {
      console.log(`   누락: ${item.missing.length}개 파일`);
    }
  });
}

// Harness API 계약서 존재 확인
const apiContract = resolve(import.meta.dirname || process.cwd(), '..', 'docs', 'api-contracts', 'harness-backup-api.md');
console.log(`\n📄 Harness API 계약서: ${existsSync(apiContract) ? '✅ 존재' : '❌ 없음'}`);
console.log(`   위치: docs/api-contracts/harness-backup-api.md`);

// 시너지 공통 헌법 확인
const synergyDoc = resolve(import.meta.dirname || process.cwd(), '..', 'docs', 'family-synergy.md');
console.log(`📄 패밀리 시너지 헌법: ${existsSync(synergyDoc) ? '✅ 존재' : '❌ 없음'}`);

console.log('\n' + '─'.repeat(60));
console.log('💡 다음 세션 안내:');
console.log('   1. SoDam-Harness-Eng 폴더에서 새 세션 열기 [최우선 — Context·Loop 블로킹 해제]');
console.log('      → backup.mjs → guard.mjs → hooks.json 순서로 구현');
console.log('   2. SoDam-Reverse-Eng: M5 라이브 검증 (사람 직접)');
console.log('      → 새 세션에서 /re-start samples/safe-login.js → 보고서 확인');
console.log('   3. SoDam-Prompt-Eng: P2(저장소 정리)·P3(GitHub push)·P4(사람 검수)');
console.log('─'.repeat(60) + '\n');
