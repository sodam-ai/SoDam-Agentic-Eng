# 소담 에이전틱 (SoDamAgentic)

> 초보 바이브코더를 위한 **Claude Code / Codex 플러그인**.
> "AI에게 제대로 일 시키는 법(계획 먼저 → 검토 → 안전)"을 **쉬운 한국어**로 떠먹여 줍니다.
> 🇺🇸 English: [README.en.md](./README.en.md)

> ⚠️ 현재 **Phase 1 (MVP) 구현 중**입니다. 일부 기능은 초기 버전입니다.

---

## 무엇을 해주나요 (4가지)

| 기능 | 설명 |
|---|---|
| **온보딩** | `/sodam-agentic-start` — AI에게 일 시키는 4단계를 한국어로 안내 |
| **계획 먼저 (F2)** | 코드 짜기 전에 "무엇을·왜·완성기준" 계획을 먼저 보여주고 승인받음 |
| **변경점 검토 (F3)** | 바꾼 내용을 "무엇을 / 왜 / 위험은?" 쉬운 말로 요약 |
| **안전 (F4)** | 위험 명령·키 노출·작업폴더 밖 쓰기·설정파일 변경을 자동 차단/확인 |

## 준비물
- **Node.js 18 이상** (없으면 안전 훅이 안 돕니다)
- **Claude Code** (또는 Codex)

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

## 사용법 (왕초보 단계)
1. `/sodam-agentic-start` → 온보딩 안내를 읽습니다.
2. "○○ 만들어줘"라고 부탁 → **계획이 먼저** 뜨면 "네/진행" 으로 승인.
3. 작업이 끝나면 **검토 요약**을 읽고 위험을 직접 확인.

## 명령어
| 명령 | 설명 |
|---|---|
| `/sodam-agentic-start` | 온보딩(시작 안내) |
| `/sodam-agentic-plan` | 계획 먼저 |
| `/sodam-agentic-review` | 변경점 검토 |

## 테스트 / 검증
- **구조 검증:** `node scripts/validate.mjs` (매니페스트·스킬·훅 구조 점검)
- **안전 훅 라이브:** 설치 후 위험 명령(예: 폴더 통째 삭제)을 시켜 차단되는지 확인

## 안전 주의 (꼭!)
- API 키·비밀번호·`.env` 등 **비밀정보는 코드·문서·로그 어디에도 넣지 마세요.**
- 안전장치는 "되돌릴 수 없는 위험은 차단, 나머지는 확인"입니다. **"100% 안전"은 아닙니다.**

## 오류 대처
| 증상 | 해결 |
|---|---|
| `/sodam-agentic` 안 뜸 | 설치 다시 (`/plugin install sodam-agentic@sodam`) |
| 한글이 깨짐 | 화면을 캡처해 문의 |
| 계획 없이 코드부터 짬 | 초기 버전 한계 — 보강 예정 |
| `Node가 없다`고 나옴 | Node.js 18+ 설치 후 재시도 |

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

## 라이선스
Apache-2.0 © SoDam AI Studio
