# 소담 에이전틱 (SoDamAgentic)

> 초보 바이브코더를 위한 **Claude Code / Codex 플러그인**.
> "AI에게 제대로 일 시키는 법(계획 먼저 → 검토 → 안전)"을 **쉬운 한국어**로 떠먹여 줍니다.
> 🇺🇸 English: [README.en.md](./README.en.md)
> 📖 더 상세한 설명(아키텍처·보안·FAQ·제거 방법 등)은 **[GUIDE.md — 왕초보 가이드](./GUIDE.md)** 를 보세요.

> ⚠️ 현재 **Phase 1 (MVP) 구현 중**입니다. 일부 기능은 초기 버전입니다.

**목차:** [기능](#features) · [준비물](#requirements) · [설치](#install) · [사용법](#usage) · [명령어](#commands) · [테스트](#test) · [제거](#uninstall) · [안전](#safety) · [오류 대처](#trouble) · [라이선스](#license) · [패밀리](#family)

---

<a id="features"></a>
## 무엇을 해주나요 (4가지)

| 기능 | 설명 |
|---|---|
| **온보딩** | `/sodam-agentic-start` — AI에게 일 시키는 4단계를 한국어로 안내 |
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
   /plugin install sodam-agentic@sodam
   ```
3. 확인: `/sodam-agentic` 까지 입력 → 명령 3개가 뜨면 성공.

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

> ⚠️ Codex에서는 **안전 훅(F4)이 작동하지 않습니다.** 계획(F2)·검토(F3) 스킬만 사용 가능합니다.

<a id="usage"></a>
## 사용법 (왕초보 단계)
1. `/sodam-agentic-start` → 온보딩 안내를 읽습니다.
2. "○○ 만들어줘"라고 부탁 → **계획이 먼저** 뜨면 "네/진행" 으로 승인.
3. 작업이 끝나면 **검토 요약**을 읽고 위험을 직접 확인.

> 이 도구의 **아키텍처(구성요소·훅 실행 흐름)**·**보안/데이터 흐름**이 궁금하면 → [GUIDE.md §9~10](./GUIDE.md#architecture)

<a id="commands"></a>
## 명령어
| 명령 | 설명 |
|---|---|
| `/sodam-agentic-start` | 온보딩(시작 안내) |
| `/sodam-agentic-plan` | 계획 먼저 |
| `/sodam-agentic-review` | 변경점 검토 |

<a id="test"></a>
## 테스트 / 검증
- **구조 검증:** `node scripts/validate.mjs` (매니페스트·스킬·훅 구조 점검)
- **안전 훅 라이브:** 설치 후 위험 명령(예: 폴더 통째 삭제)을 시켜 차단되는지 확인

<a id="uninstall"></a>
## 제거 방법
- Claude Code: `/plugin uninstall sodam-agentic` 입력 → `/sodam-agentic` 가 더는 안 뜨면 완료.
- Codex: `.agents/skills/`에 복사된 스킬 폴더를 직접 삭제.
- 남는 데이터: 이 플러그인은 영구 설정·로그·백업을 만들지 않아 제거 후 남는 파일이 없습니다. 자세히 → [GUIDE.md §11](./GUIDE.md#uninstall)

<a id="safety"></a>
## 안전 주의 (꼭!)
- API 키·비밀번호·`.env` 등 **비밀정보는 코드·문서·로그 어디에도 넣지 마세요.**
- 안전장치는 "되돌릴 수 없는 위험은 차단, 나머지는 확인"입니다. **"100% 안전"은 아닙니다.**
- 자동 승인(auto-accept/bypass) 모드에서는 확인창이 조용히 통과됩니다 — `Shift+Tab`으로 "매번 물어봄"을 권장합니다.

<a id="trouble"></a>
## 오류 대처
| 증상 | 해결 |
|---|---|
| `/sodam-agentic` 안 뜸 | 설치 다시 (`/plugin install sodam-agentic@sodam`) |
| 한글이 깨짐 | 화면을 캡처해 문의 |
| 계획 없이 코드부터 짬 | 초기 버전 한계 — 보강 예정 |
| `Node가 없다`고 나옴 | Node.js 18+ 설치 후 재시도 |

더 자세한 표(9가지 증상)·FAQ·변경이력은 → [GUIDE.md §12~16](./GUIDE.md#troubleshooting)

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

**Apache License 2.0** · 저작권자 **SoDam AI Studio** · 2026(전문: [`LICENSE`](./LICENSE), 고지: [`NOTICE`](./NOTICE)).
수정·복제·재배포·**상업적 사용**·판매·서비스 운영·교육·납품 모두 ✅ (NOTICE 보존 조건). **"있는 그대로(AS IS)" 제공, 보증 없음** — 사용 결과는 사용자 책임입니다.
이 키트는 **무료**지만, **AI 모델(Claude/Codex) 사용료·약관은 Anthropic·OpenAI를 따로 따릅니다.** "Claude·Codex" 등은 각사 상표이며 설명적 표기로만 사용합니다.
⚠️ 법무 확인 대기 중인 항목(상표 범위 등) 포함 전체 내용은 → [GUIDE.md §14](./GUIDE.md#license-legal) (법률 자문 아님, 참고용)
