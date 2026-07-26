# 소담 에이전틱 (SoDamAgentic)

> 초보 바이브코더를 위한 **Claude Code / Codex 플러그인**.
> "AI에게 제대로 일 시키는 법(계획 먼저 → 검토 → 안전)"을 **쉬운 한국어**로 떠먹여 줍니다.
> 🇺🇸 English: [README.en.md](./README.en.md)
> 📖 더 상세한 설명(아키텍처·보안·FAQ·제거 방법 등)은 **[GUIDE.md — 왕초보 가이드](./GUIDE.md)** 를 보세요.

> ⚠️ 현재 **Phase 1 (MVP) 완료 + Phase 2 일부(F6 안전 기록·F7 Codex 안전 패리티) 완료**입니다. 일부 기능은 초기 버전입니다.

**목차:** [기능](#features) · [준비물](#requirements) · [설치](#install) · [사용법](#usage) · [명령어](#commands) · [테스트](#test) · [제거](#uninstall) · [안전](#safety) · [오류 대처](#trouble) · [라이선스](#license) · [패밀리](#family)

---

<a id="features"></a>
## 무엇을 해주나요 (4가지)

| 기능 | 설명 |
|---|---|
| **온보딩** | `/sodam-agentic:start` — AI에게 일 시키는 4단계를 한국어로 안내 |
| **계획 먼저 (F2)** | 코드 짜기 전에 "무엇을·왜·완성기준" 계획을 먼저 보여주고 승인받음 |
| **변경점 검토 (F3)** | 바꾼 내용을 "무엇을 / 왜 / 위험은?" 쉬운 말로 요약 |
| **안전 (F4)** | 위험 명령·키 노출·작업폴더 밖 쓰기·설정파일 변경을 자동 차단/확인 |

<a id="requirements"></a>
## 준비물
- **Node.js 18 이상** (없으면 안전 훅이 안 돕니다)
- **Claude Code** (또는 Codex)

<a id="install"></a>
## 설치 (Claude Code) — 따라하기
> 이 저장소는 **비공개**입니다. 본인 GitHub 계정으로 접근 가능할 때만 설치됩니다.

1. 마켓플레이스 추가 (입력칸에 그대로 붙여넣고 Enter):
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. 설치:
   ```
   /plugin install sodam-agentic@sodam-agentic
   ```
3. 확인: `/sodam-agentic:` 까지 입력 → 명령 4개가 뜨면 성공.

## 설치 (Codex) — Codex 사용자

1. 이 저장소를 클론합니다:
   ```
   git clone https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. **내 프로젝트 폴더**에서 설치 스크립트를 실행합니다 (클론한 경로로 바꾸세요):
   ```
   node C:\경로\SoDam-Agentic-Eng\codex\install.mjs
   ```
3. 완료: 스킬이 내 프로젝트의 `.agents/skills/`에 복사됩니다.

> ⚠️ Codex에도 **같은 안전 훅(F4)·안전 기록(F6)이 등록됩니다**(F7, 2026-07-15). 계획(F2)·검토(F3) 스킬도 그대로 사용 가능합니다. 다만 Codex에서 확인(ask) 창이 실제로 뜨는지는 아직 사람이 직접 확인하지 않았습니다 — 자세히: [GUIDE.md §10](./GUIDE.md#security-data-flow)

<a id="usage"></a>
## 사용법 (왕초보 단계)
1. `/sodam-agentic:start` → 온보딩 안내를 읽습니다.
2. "○○ 만들어줘"라고 부탁 → **계획이 먼저** 뜨면 "네/진행" 으로 승인.
3. 작업이 끝나면 **검토 요약**을 읽고 위험을 직접 확인.

> 이 도구의 **아키텍처(구성요소·훅 실행 흐름)**·**보안/데이터 흐름**이 궁금하면 → [GUIDE.md §9~10](./GUIDE.md#architecture)

<a id="commands"></a>
## 명령어
| 명령 | 설명 |
|---|---|
| `/sodam-agentic:start` | 온보딩(시작 안내) |
| `/sodam-agentic:plan` | 계획 먼저 |
| `/sodam-agentic:review` | 변경점 검토 |
| `/sodam-agentic:log` | 막힘·확인 기록 조회(F6) |

<a id="test"></a>
## 테스트 / 검증
- **구조 검증:** `node scripts/validate.mjs` (매니페스트·스킬·훅 구조 점검)
- **안전 훅 라이브:** 설치 후 위험 명령(예: 폴더 통째 삭제)을 시켜 차단되는지 확인

<a id="uninstall"></a>
## 제거 방법
- Claude Code: `/plugin uninstall sodam-agentic` 입력 → `/sodam-agentic` 가 더는 안 뜨면 완료.
- Codex: `.agents/skills/`에 복사된 스킬 폴더를 직접 삭제.
- 남는 데이터: 안전 기록 파일(`~/.sodamagentic/safety-log.jsonl`, F6)은 플러그인 폴더 밖에 있어 제거해도 자동으로 지워지지 않습니다. 자세히 → [GUIDE.md §11](./GUIDE.md#uninstall)

<a id="safety"></a>
## 안전 주의 (꼭!)
- API 키·비밀번호·`.env` 등 **비밀정보는 코드·문서·로그 어디에도 넣지 마세요.**
- 안전장치는 "되돌릴 수 없는 위험은 차단, 나머지는 확인"입니다. **"100% 안전"은 아닙니다.**
- 자동 승인(auto-accept/bypass) 모드에서는 확인창이 조용히 통과됩니다 — `Shift+Tab`으로 "매번 물어봄"을 권장합니다.
- 막히거나(deny) 확인받은(ask) 기록은 `/sodam-agentic:log`로 나중에 다시 볼 수 있습니다(F6, 안전하게 통과한 작업은 기록 안 됨, 내 컴퓨터에만 저장).

<a id="trouble"></a>
## 오류 대처
| 증상 | 해결 |
|---|---|
| `/sodam-agentic` 안 뜸 | 설치 다시 (`/plugin install sodam-agentic@sodam-agentic`) |
| 한글이 깨짐 | 화면을 캡처해 문의 |
| 계획 없이 코드부터 짬 | 초기 버전 한계 — 보강 예정 |
| `Node가 없다`고 나옴 | Node.js 18+ 설치 후 재시도 |

더 자세한 표(13가지 증상)·FAQ·변경이력은 → [GUIDE.md §12~16](./GUIDE.md#troubleshooting)

<a id="family"></a>
## 소담 패밀리 (함께 쓰면 더 강력)

SoDamAgentic은 6개 플러그인 패밀리의 진입점입니다. 함께 설치하면 더 안전하고 완전합니다.

| 플러그인 | 역할 | 설치 순서 |
|---|---|---|
| 🛡 SoDamHarness | 안전·백업·되돌리기 | 1번째 (필수) |
| 🔁 SoDamLoop | 자율 반복 엔진 | 2번째 |
| 🧠 SoDamContext | 설명서 건강검진 | 3번째 |
| 🚀 **SoDamAgentic** | **진입점·계획·검토 (지금 이것)** | 4번째 |
| ✏️ SoDamPrompt | 프롬프트 입문 웹앱 | 5번째 |
| 🔍 SoDamReverse | 코드·앱 분석 보고서 | 6번째 |

> 자세한 협업 규약: [docs/family-synergy.md](./docs/family-synergy.md)

<a id="license"></a>
## 라이선스 · 저작권 · 상업적 용도

> ⚠️ 이 저장소는 현재 **비공개(PRIVATE)**이며 아직 일반 공개 배포되지 않았습니다(개인용 도구, 2026-07-15 확정). 아래 조건은 향후 공개 시를 대비한 사전 명시입니다.

**Apache License 2.0** · 저작권자 **SoDam AI Studio** · 2026(전문: [`LICENSE`](./LICENSE), 고지: [`NOTICE`](./NOTICE)).
수정·복제·재배포·**상업적 사용**·판매·서비스 운영·교육·납품 모두 ✅ (단, 수정 파일에 변경 표시 + `LICENSE`·`NOTICE` 보존 조건). **"있는 그대로(AS IS)" 제공, 어떠한 보증도 없음** — 법이 허용하는 한도 내에서 저작권자·기여자는 데이터 손실 등 어떠한 손해에도 책임지지 않으며, 사용 결과는 사용자 책임입니다.
이 키트는 **무료**지만, **AI 모델(Claude/Codex) 사용료·약관은 Anthropic·OpenAI를 따로 따릅니다.** "Claude·Codex" 등은 각사 상표이며 설명적 표기로만 사용하고 공식 제휴·보증으로 오인시키지 않습니다.
이 프로젝트는 **AI 코딩 도구(Claude Code)의 도움을 받아 개발**되었습니다 — 재배포·상업 활용을 계획한다면 AI 생성 콘텐츠 관련 법적 고려사항도 별도로 확인하세요(자세히: [GUIDE.md §14](./GUIDE.md#license-legal)).
⚠️ 법무 확인 대기 중인 항목(상표 범위 등, 공개 배포 전까지는 필수 아님) 포함 전체 내용·재배포 체크리스트는 → [GUIDE.md §14](./GUIDE.md#license-legal) (법률 자문 아님, 참고용)
