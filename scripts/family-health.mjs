#!/usr/bin/env node
/**
 * SoDam 패밀리 헬스체크 — 6형제 설치·구현 상태를 한눈에 확인
 * 실행: node scripts/family-health.mjs
 * 근거: docs/family-synergy.md, docs/api-contracts/harness-backup-api.md
 *
 * 2026-07-16 정정: 이전 버전은 "Phase 1 완료 ✅" 같은 서술형 메모를 실시간 검사 결과와
 * 같은 줄에 섞어 출력해, 실제로는 그 시점에 사람이 손으로 써둔 스냅샷일 뿐인데도
 * "방금 확인한 사실"처럼 보였다(family-agentic 세션 라이브 테스트 중 발견 — family-health.mjs
 * 자체 최종수정일이 2026-06-29인데 그 이후 진행된 형제들 상태 변화를 전혀 반영 못 함).
 * 이번 정정 원칙: 이 스크립트가 "지금 실제로 확인한 것"과 "누군가 예전에 적어둔 메모"를
 * 절대 같은 신뢰도로 보이지 않게 분리한다. 메모는 작성일을 항상 함께 표시한다.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';

const home = os.homedir();
// 아래 note들이 마지막으로 사람 손으로 확인·작성된 날짜(이 파일 자체의 그때 최종수정일과 동일).
// 이 스크립트를 다시 손보며 note 내용을 갱신하면 이 상수도 함께 갱신할 것.
const NOTES_AS_OF = '2026-06-29';

// 6형제 정의 (설치 순서 기준)
// note: 라이브 검사 결과가 아니라 NOTES_AS_OF 시점에 사람이 적어둔 메모(참고용, 최신 아닐 수 있음).
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
    note: 'Phase 1 완료 ✅ — selftest 75 PASS. Context 처방 예외 추가됨',
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
    note: 'Phase 0 스파이크(반복 모터 실증) 먼저 → Harness 완료 후 Phase 1a',
  },
  {
    name: 'SoDamContext',
    emoji: '🧠',
    role: '설명서 건강검진',
    projectPath: 'D:/AI_Dev_Work/2026y/26y_06m_25d_SoDam-Context-Eng',
    criticalFiles: [
      '.claude-plugin/plugin.json',
      'lib/checkup-cli.mjs',
      'lib/treat.mjs',
    ],
    note: 'Harness guard.mjs 블로커 해제 완료 — C3 처방 e2e 검증 대기',
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
    note: 'Phase 1 MVP 완료 ✅ — M4(Harness+Context 시너지) 완료, M5 라이브 검증 대기',
  },
];

// ─── 체크 함수 (전부 지금 이 순간 실제로 파일시스템을 확인 — 라이브) ─────────────

function checkFiles(sibling) {
  const results = [];
  for (const f of sibling.criticalFiles) {
    const full = join(sibling.projectPath, f);
    results.push({ file: f, exists: existsSync(full) });
  }
  return results;
}

function getPluginVersion(projectPath) {
  const pluginJson = join(projectPath, '.claude-plugin', 'plugin.json');
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

// PRD 폴더 존재만 확인(내용 검증 아님) — 예전엔 하드코딩된 prdDone 값이 이 자리를 대신했음.
function checkPrdFolder(projectPath) {
  return existsSync(join(projectPath, '.PRD'));
}

// 형제 저장소에 CHECKPOINT.md가 있으면, 그게 이 스크립트의 note보다 훨씬 최신·신뢰할 수 있는 정보원.
function checkCheckpoint(projectPath) {
  return existsSync(join(projectPath, 'CHECKPOINT.md'));
}

// ─── 리포트 ──────────────────────────────────────────────────────────────────

console.log('\n🏠 SoDam 패밀리 헬스체크\n');
console.log('='.repeat(60));
console.log('ℹ️  아래 "PRD"·"핵심 파일"·"버전"·"CHECKPOINT.md 존재"는 지금 이 순간 실시간으로');
console.log(`   확인한 사실입니다. "💡 메모"는 실시간 확인이 아니라 ${NOTES_AS_OF}에 사람이`);
console.log('   적어둔 스냅샷이라 최신이 아닐 수 있습니다 — 형제 폴더에 CHECKPOINT.md가');
console.log('   있으면 그쪽이 훨씬 신뢰할 수 있는 최신 정보원입니다.');

let allOk = 0, needWork = 0;
const actionItems = [];

for (const sib of FAMILY) {
  const fileResults = checkFiles(sib);
  const missing = fileResults.filter(r => !r.exists);
  const version = getPluginVersion(sib.projectPath);
  const harnessOutput = checkHarnessOutput(sib);
  const hasPrd = checkPrdFolder(sib.projectPath);
  const hasCheckpoint = checkCheckpoint(sib.projectPath);

  const prdStatus = hasPrd ? '✅' : '❌';
  const filesStatus = missing.length === 0 ? '✅' : '❌';

  if (missing.length === 0) allOk++;
  else {
    needWork++;
    actionItems.push({ name: sib.name, emoji: sib.emoji, missing });
  }

  console.log(`\n${sib.emoji} ${sib.name} (${sib.role})`);
  console.log(`   PRD 폴더: ${prdStatus}  핵심 파일: ${filesStatus}  버전: ${version || '미설치'}  CHECKPOINT.md: ${hasCheckpoint ? '✅ 있음(최신 정보는 여기서)' : '❌ 없음'}`);

  if (sib.name === 'SoDamHarness' && harnessOutput !== null) {
    console.log(`   ~/.sodamharness: ${harnessOutput ? '✅ 존재' : '❌ 없음 (미구현)'}`);
  }

  if (missing.length > 0) {
    console.log(`   ❌ 누락 파일 (${missing.length}개):`);
    for (const m of missing) {
      console.log(`      • ${m.file}`);
    }
  } else {
    console.log('   ✅ 핵심 파일 모두 존재');
  }

  if (sib.note) {
    console.log(`   💡 메모(${NOTES_AS_OF} 작성, 라이브 재확인 아님): ${sib.note}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 요약(라이브 파일 존재 기준): ${allOk}개 핵심 파일 모두 존재 / ${needWork}개 누락 있음\n`);

if (actionItems.length > 0) {
  console.log('📋 핵심 파일이 누락된 형제:');
  actionItems.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.emoji} ${item.name}`);
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
console.log('   위치: docs/api-contracts/harness-backup-api.md');

// 시너지 공통 헌법 확인
const synergyDoc = resolve(import.meta.dirname || process.cwd(), '..', 'docs', 'family-synergy.md');
console.log(`📄 패밀리 시너지 헌법: ${existsSync(synergyDoc) ? '✅ 존재' : '❌ 없음'}`);

console.log('\n' + '─'.repeat(60));
console.log('💡 다음 확인 방법 (더는 여기에 우선순위를 하드코딩하지 않습니다 — 금방 낡기 때문):');
console.log('   각 형제 중 위에서 "CHECKPOINT.md: ✅ 있음"으로 뜬 폴더를 열어,');
console.log('   그 파일의 맨 위 절을 읽으면 그 형제의 진짜 최신 상태를 알 수 있습니다.');
console.log('   이 스크립트가 확인하는 건 "파일이 있는가"뿐 — 진행 상황 판단은 각 형제 자신의');
console.log('   CHECKPOINT.md(있는 경우) 또는 해당 저장소 세션에서 직접 확인하세요.');
console.log('─'.repeat(60) + '\n');
