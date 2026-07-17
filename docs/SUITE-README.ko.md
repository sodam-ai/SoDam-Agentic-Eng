# SoDam Claude Code 플러그인 스위트 — 완전 초보자 가이드

> **버전** v0.1.0 · **라이선스** Apache-2.0 · **제작** SoDam AI Studio · **최종 업데이트** 2026-06-29

---

## 목차

1. [이게 뭔가요?](#1-이게-뭔가요)
2. [무엇을 해주나요?](#2-무엇을-해주나요)
3. [사전 준비물](#3-사전-준비물)
4. [다운로드 및 설치 방법](#4-다운로드-및-설치-방법)
5. [빠른 시작 — 5분 완성](#5-빠른-시작--5분-완성)
6. [플러그인별 상세 설명](#6-플러그인별-상세-설명)
7. [명령어 전체 목록](#7-명령어-전체-목록)
8. [보안 및 데이터 흐름](#8-보안-및-데이터-흐름)
9. [아키텍처 구조](#9-아키텍처-구조)
10. [파일 및 문서 위치](#10-파일-및-문서-위치)
11. [문제 및 오류 대처법](#11-문제-및-오류-대처법)
12. [FAQ (자주 묻는 질문)](#12-faq-자주-묻는-질문)
13. [라이선스 · 저작권 · 법률 사항](#13-라이선스--저작권--법률-사항)
14. [기여 방법 및 연락처](#14-기여-방법-및-연락처)

---

## 1. 이게 뭔가요?

**SoDam(소담) Claude Code 플러그인 스위트**는  
AI 코딩 도구인 **Claude Code**를 처음 쓰는 분들도 안전하고 쉽게  
쓸 수 있도록 만든 **6개의 무료 플러그인 묶음**입니다.

### Claude Code가 뭔가요?
Claude Code는 미국 AI 회사 **Anthropic**이 만든 도구입니다.  
쉽게 말하면 "AI가 코드를 대신 짜주는 도우미 프로그램"입니다.  
컴퓨터 화면에서 채팅하듯 AI에게 "이 기능 만들어줘", "이 오류 고쳐줘"라고  
하면 AI가 직접 코드 파일을 읽고 고쳐줍니다.

### 플러그인이 뭔가요?
플러그인은 **기본 프로그램에 기능을 추가하는 확장팩**입니다.  
예를 들어 스마트폰에 앱을 설치하는 것처럼,  
Claude Code에 SoDam 플러그인을 설치하면 기능이 늘어납니다.

### SoDam 스위트의 6가지 플러그인

| 이름 | 역할 | 한마디 요약 |
|------|------|------------|
| 🛡 **SoDamHarness** | 안전·백업·되돌리기 | "AI가 실수해도 되돌릴 수 있어요" |
| 🧠 **SoDamContext** | 설명서 건강검진 | "AI 사용설명서를 깔끔하게 관리해요" |
| 🚀 **SoDamAgentic** | AI 계획·검토 진입점 | "AI가 먼저 계획을 보여주고 확인받아요" |
| ✏️ **SoDamPrompt** | AI 스킬 모음 | "실생활에 쓸 수 있는 AI 기능 10가지" |
| 🔍 **SoDamReverse** | 코드·앱 분석 | "내 코드가 어떻게 동작하는지 분석해요" |
| 🔁 **SoDamLoop** | 자동 반복 엔진 | "같은 작업을 자동으로 여러 번 해요" (출시 예정) |

---

## 2. 무엇을 해주나요?

### 🛡 SoDamHarness — "안전벨트"
- AI가 파일을 지우거나 덮어쓰기 전에 **자동으로 백업**해 줍니다
- 위험한 명령(예: 폴더 전체 삭제, 시스템 파일 수정)을 **자동으로 막아**줍니다
- 문제가 생기면 "되돌려 줘"라고 하면 **이전 상태로 복구**해 줍니다
- 모든 안내가 **쉬운 한국어**로 나옵니다

**예시**
```
AI가 중요한 폴더를 지우려고 할 때:
→ "폴더를 통째로 지우는 작업은 안전하게 막았어요.
   정말 필요하면 파일을 하나씩 지워보세요."
```

### 🧠 SoDamContext — "설명서 관리사"
- Claude Code가 사용하는 설명서 파일(CLAUDE.md)을 **점검하고 다듬어** 줍니다
- 중복 내용, 비밀번호 실수 노출, 너무 긴 내용 등을 **자동으로 발견**합니다
- 수정하기 전에 **미리보기**를 보여주고 확인을 받습니다
- 수정 후에도 **언제든 되돌릴** 수 있습니다

**예시**
```
CLAUDE.md 검진 결과:
→ "중복 줄 3개, 연속 빈 줄 5개 발견됐어요.
   450줄 → 442줄로 줄일 수 있어요. 진행할까요?"
```

### 🚀 SoDamAgentic — "계획 확인사"
- AI가 작업을 시작하기 전에 **계획을 먼저 보여줍니다**
- "무엇을 / 왜 / 어떻게" 3가지를 사람이 읽고 **확인(승인)한 후**에만 진행합니다
- 초보자도 AI가 뭘 하려는지 이해하고 **운전석에 앉을** 수 있습니다

**예시**
```
사용자: "로그인 기능 추가해줘"
AI:     "계획을 먼저 보여드릴게요.
         - 무엇: 이메일/비밀번호 로그인 화면 추가
         - 왜: 사용자 인증이 필요하기 때문
         - 완성 기준: 로그인 성공 시 홈 화면 이동
         진행할까요?"
```

### ✏️ SoDamPrompt — "실생활 AI 스킬 10가지"
일상에서 바로 쓸 수 있는 AI 기능 모음입니다.

| 스킬 이름 | 하는 일 |
|-----------|---------|
| SNS 캡션 | 사진·상황에 맞는 SNS 게시글 문구 작성 |
| 공부 계획표 | 시험 일정에 맞는 공부 계획 자동 작성 |
| 긴 글 3줄 요약 | 긴 글을 3줄로 핵심만 정리 |
| 독후감 도우미 | 책 내용 기반 독후감 초안 작성 |
| 발표 대본 | 주제에 맞는 발표용 대본 작성 |
| 부탁·사과 메시지 | 상황에 맞는 정중한 메시지 작성 |
| 쉽게 설명해줘 | 어려운 개념을 쉬운 말로 설명 |
| 영어 자연스럽게 | 한국어 → 자연스러운 영어 번역 |
| 자기소개 다듬기 | 자기소개서 문장 개선 |
| 정중한 메시지 | 공식적인 이메일·메시지 작성 |

### 🔍 SoDamReverse — "코드 분석가"
- 내가 만든 코드나 앱이 **어떻게 동작하는지 분석**해 줍니다
- 보안 취약점, 의심스러운 코드 패턴을 **한국어 보고서**로 알려줍니다
- **3중 안전장치**: 위험한 요청(크랙, 해킹 등)은 자동으로 거부합니다
- **본인 소유 코드·교육 목적 전용**입니다

### 🔁 SoDamLoop — "자동 반복 엔진" (출시 예정)
- 같은 작업을 자동으로 여러 번 반복합니다
- 폭주 방지, 자동 정지 기능 포함
- 현재 개발 중 (Phase 0)

---

## 3. 사전 준비물

설치 전 아래 항목을 먼저 준비해 주세요.

### 필수 프로그램

| 프로그램 | 버전 | 다운로드 주소 | 확인 명령어 |
|---------|------|--------------|------------|
| **Claude Code** | 최신 버전 | [claude.ai/code](https://claude.ai/code) | 앱 실행 후 버전 표시 확인 |
| **Node.js** | 18 이상 | [nodejs.org](https://nodejs.org) | `node --version` |
| **Git** | 2.x 이상 | [git-scm.com](https://git-scm.com) | `git --version` |

### 설치 여부 확인 방법

**Windows 사용자:**
1. 키보드에서 `Windows키 + R` 누르기
2. `cmd` 입력 후 엔터
3. 아래 명령어를 하나씩 입력해서 버전 번호가 나오는지 확인

```
node --version
```
→ `v18.0.0` 또는 더 높은 숫자가 나와야 합니다.

```
git --version
```
→ `git version 2.x.x` 가 나와야 합니다.

**Mac 사용자:**
1. `Command + 스페이스` 누르기
2. `터미널` 검색 후 실행
3. 동일하게 위 명령어 입력

### Node.js 설치 방법 (아직 없는 경우)

1. [nodejs.org](https://nodejs.org) 접속
2. 초록색 **"LTS" 버튼** 클릭 (숫자가 18 이상인지 확인)
3. 다운로드된 파일 실행
4. "다음 → 다음 → 설치" 계속 클릭
5. 설치 완료 후 컴퓨터 재시작
6. 명령 프롬프트에서 `node --version` 으로 확인

### Claude Code 설치 방법 (아직 없는 경우)

1. [claude.ai/code](https://claude.ai/code) 접속
2. 본인 운영체제(Windows/Mac)에 맞는 버전 다운로드
3. 설치 프로그램 실행 후 안내에 따라 설치
4. **Anthropic 계정 로그인** (없으면 가입 필요)

---

## 4. 다운로드 및 설치 방법

### 설치 순서 (반드시 이 순서대로!)

플러그인들이 서로 협력하기 때문에 **순서가 중요합니다.**

```
1순위: 🛡 SoDamHarness (다른 플러그인들의 안전 기반)
2순위: 🧠 SoDamContext (설명서 관리)
3순위: 🚀 SoDamAgentic (계획·검토 진입점)
4순위: ✏️ SoDamPrompt (실생활 스킬)
5순위: 🔍 SoDamReverse (코드 분석)
6순위: 🔁 SoDamLoop (출시 후 설치)
```

### Step 1 — SoDamHarness 설치

Claude Code를 열고 아래 명령어를 입력하세요.

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Harness-Eng
```

설치 완료 메시지가 나오면:

```
/plugin install sodam-harness@sodam
```

**설치 확인:**
```
/sodam-harness-status
```
→ "SoDamHarness 정상 작동 중" 메시지가 나오면 성공입니다.

### Step 2 — SoDamContext 설치

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Context-Eng
/plugin install sodam-context@sodam
```

### Step 3 — SoDamAgentic 설치

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam
```

**설치 확인:**
```
/sodam-agentic:start
```
→ 소담 온보딩 화면이 나오면 성공입니다.

### Step 4 — SoDamPrompt 설치

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Prompt-Eng
/plugin install sodam-prompt@sodam
```

### Step 5 — SoDamReverse 설치

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Reverse-Eng
/plugin install sodam-reverse@sodam
```

**설치 확인:**
```
/re-selftest
```
→ "6/6 PASS" 가 나오면 성공입니다.

### 설치 후 반드시 할 일

**Claude Code를 완전히 종료하고 다시 시작**해 주세요.  
플러그인은 재시작해야 정상으로 인식됩니다.

---

## 5. 빠른 시작 — 5분 완성

설치가 끝났으면 아래 순서대로 해보세요.

### 1분: 안전벨트 상태 확인
```
/sodam-harness-status
```
→ 초록색 체크 표시가 나오면 안전벨트가 켜진 것입니다.

### 2분: AI와 계획 먼저 세우기
Claude Code에서 아무 작업이나 시켜보세요:
```
간단한 할 일 목록 앱 만들어줘
```
→ SoDamAgentic이 자동으로 계획을 보여줍니다.  
→ "네" 또는 "진행" 이라고 입력하면 작업 시작됩니다.

### 3분: AI 스킬 사용해보기
```
/긴글-3줄요약
```
→ 요약할 텍스트를 붙여넣으라는 안내가 나옵니다.

### 4분: 코드 분석 해보기 (코드가 있다면)
```
/re-start 내파일이름.js
```
→ 해당 파일에 대한 한국어 분석 보고서가 나옵니다.

### 5분: 설명서 점검하기
```
/sodam-context-checkup
```
→ CLAUDE.md 파일의 건강 상태를 점검합니다.

---

## 6. 플러그인별 상세 설명

### 🛡 SoDamHarness 상세

**하는 일:**
- Claude Code가 파일을 수정·삭제하려 할 때 자동으로 감지
- 위험 수준에 따라 **차단(deny)** 또는 **확인 요청(ask)**
- 모든 수정 전 파일을 `~/.sodamharness/backups/` 에 백업

**차단되는 것들:**

| 작업 | 이유 |
|------|------|
| 폴더 전체 삭제 (rm -rf) | 되돌릴 수 없는 비가역 작업 |
| 시스템 폴더 수정 | Windows·Mac 운영체제 손상 위험 |
| 비밀번호 설정 파일(.ssh, .aws 등) 수정 | 계정 탈취 위험 |
| 드라이브 포맷 | 전체 데이터 손실 |
| fork bomb 실행 | 컴퓨터 다운 |

**확인 요청하는 것들:**

| 작업 | 이유 |
|------|------|
| 단일 파일 삭제 | 백업 후 확인받기 |
| 기존 파일 덮어쓰기 | 백업 후 확인받기 |
| git push --force | 원격 저장소 변경 |

**AI 설명서 수정 허용 (특별 예외):**
- `~/.claude/CLAUDE.md` — Context 처방 대상 파일
- `~/.claude/AGENTS.md` — Context 처방 대상 파일
- 위 두 파일은 Context 플러그인이 안전하게 관리합니다

**되돌리기 사용법:**
```
/sodam-harness-undo
```
→ 가장 최근 백업으로 복구됩니다.

```
/sodam-harness-log
```
→ 백업 목록을 보고 특정 시점으로 돌아갈 수 있습니다.

---

### 🧠 SoDamContext 상세

**하는 일:**
Claude Code가 참고하는 AI 사용설명서 파일들을 관리합니다.

**대상 파일:**
- `CLAUDE.md` — Claude Code가 읽는 프로젝트 설명서
- `AGENTS.md` — AI 에이전트 역할 설명서

**3단계 작업 흐름:**

```
1단계: 문진 (/sodam-context-intake)
   → "어떤 프로젝트인지" 질문에 답하면 CLAUDE.md 초안을 만들어 줍니다

2단계: 검진 (/sodam-context-checkup)
   → 기존 CLAUDE.md의 문제점을 6가지 기준으로 점검합니다
   (중복, 비밀 노출, 모순, 구조 문제, 보안, 가독성)

3단계: 처방 (/sodam-context-treat)
   → 문제 있는 부분을 다듬고 미리보기를 보여준 뒤 확인받습니다
```

**안전 원칙:**
- 처방 후 파일이 더 작아질 때만 적용합니다
- 적용 전 SoDamHarness가 자동으로 백업합니다
- 비밀번호처럼 보이는 내용은 자동으로 건드리지 않습니다

---

### 🚀 SoDamAgentic 상세

**하는 일:**
AI가 무언가를 만들기 전에 계획을 먼저 보여주는 "안전 진입점"입니다.

**작동 흐름:**
```
사용자 요청 → AI 계획 제시 → 사용자 확인 → 작업 시작
```

**계획에 포함되는 내용:**
1. **무엇을 만들까** — 한 문장 요약
2. **왜 필요한가** — 목적 설명
3. **완성 기준** — "이렇게 되면 끝"
4. **어떤 파일을 건드릴지** — 영향 범위

**추가 안전 기능:**
- 위험 명령어 자동 감지 (Harness와 별개의 추가 보호)
- 비밀번호 노출 감지
- 환경 변수 탈취 시도 차단

**주의사항:**
- AI에게 "그냥 바로 해" 라고 하면 따르지만, 계획 설명은 항상 보여줍니다
- 자동으로 혼자 계속 진행하지 않습니다 (항상 사람이 중간에 확인)

---

### ✏️ SoDamPrompt 상세

**사용 방법:**
Claude Code 채팅창에 `/` 를 입력하면 사용 가능한 스킬 목록이 나옵니다.

**10가지 스킬 상세:**

**1. /sns-캡션**
```
사용 예: /sns-캡션
→ "어떤 사진/상황인지 설명해주세요"
→ 설명 입력
→ 인스타그램·X(트위터) 등에 쓸 수 있는 문구 3가지 제안
```

**2. /공부-계획표**
```
사용 예: /공부-계획표
→ 과목, 시험 날짜, 하루 공부 가능 시간 입력
→ 날짜별 공부 계획표 자동 생성
```

**3. /긴글-3줄요약**
```
사용 예: /긴글-3줄요약
→ 요약할 글 붙여넣기
→ 핵심 3줄로 정리
```

**4. /독후감-도우미**
```
사용 예: /독후감-도우미
→ 책 제목, 줄거리, 인상 깊은 부분 입력
→ 독후감 구조 제안 + 초안 작성
```

**5. /발표-대본**
```
사용 예: /발표-대본
→ 발표 주제, 시간(분), 청중 수준 입력
→ 발표 대본 작성
```

**6. /부탁-사과-메시지**
```
사용 예: /부탁-사과-메시지
→ 상황 설명
→ 정중한 부탁 또는 사과 메시지 작성
```

**7. /쉽게-설명해줘**
```
사용 예: /쉽게-설명해줘
→ 어려운 개념이나 용어 입력
→ 초등학생도 이해할 수 있는 설명
```

**8. /영어-자연스럽게**
```
사용 예: /영어-자연스럽게
→ 한국어 문장 입력
→ 원어민처럼 자연스러운 영어로 번역
```

**9. /자기소개-다듬기**
```
사용 예: /자기소개-다듬기
→ 기존 자기소개 문장 입력
→ 더 자연스럽고 인상적인 문장으로 개선
```

**10. /정중한-메시지**
```
사용 예: /정중한-메시지
→ 상황과 전달할 내용 입력
→ 공식적이고 정중한 이메일/메시지 작성
```

---

### 🔍 SoDamReverse 상세

**하는 일:**
내 코드나 앱이 어떻게 동작하는지 분석하고 한국어 보고서를 만들어 줍니다.

**사용 대상:**
- 본인이 만든 코드
- 본인이 소유한 앱
- 교육 및 학습 목적
- 보안 취약점 확인 (본인 시스템 한정)

**절대 사용 불가:**
- 다른 사람의 코드를 허락 없이 분석
- 크랙, 해킹, 라이선스 우회
- 인증 우회 코드 작성
- 비밀번호·API 키 추출

**3중 안전장치:**
```
1층: AI가 위험 요청을 스스로 거부 (SKILL 수준)
2층: 훅이 위험 명령을 자동 차단 (re-deny-guard.mjs)
3층: 파일 무결성 검증 (integrity.json SHA-256)
```

**기본 사용법:**
```
/re-start 파일이름.js
```
→ 한국어 분석 보고서가 생성됩니다.

**보고서 포함 내용:**
- 전체 구조 요약
- 주요 기능 목록
- 보안 위험 항목 (있는 경우)
- 개선 제안

---

## 7. 명령어 전체 목록

### 🛡 SoDamHarness 명령어

| 명령어 | 하는 일 |
|--------|---------|
| `/sodam-harness-status` | 현재 안전벨트 상태 확인 |
| `/sodam-harness-undo` | 가장 최근 백업으로 되돌리기 |
| `/sodam-harness-log` | 백업 목록 보기 |
| `/sodam-harness-trust` | 이 폴더에서 반복 확인 안 하도록 설정 |
| `/sodam-harness-fix` | 문제 발생 시 자가 진단 및 수정 |
| `/sodam-harness-install` | 설치 상태 점검 및 재설정 |

### 🧠 SoDamContext 명령어/스킬

| 명령어 | 하는 일 |
|--------|---------|
| `/sodam-context-intake` | 새 프로젝트 설명서(CLAUDE.md) 작성 |
| `/sodam-context-checkup` | 기존 설명서 건강 점검 |
| `/sodam-context-treat` | 설명서 문제 자동 처방·다듬기 |

### 🚀 SoDamAgentic 명령어/스킬

| 명령어 | 하는 일 |
|--------|---------|
| `/sodam-agentic:start` | 소담 스위트 온보딩 시작 |

> AI에게 작업을 시키면 자동으로 계획-확인 흐름이 발동됩니다.

### ✏️ SoDamPrompt 스킬

| 명령어 | 하는 일 |
|--------|---------|
| `/sns-캡션` | SNS용 캡션 문구 작성 |
| `/공부-계획표` | 공부 계획표 자동 생성 |
| `/긴글-3줄요약` | 긴 텍스트 3줄 요약 |
| `/독후감-도우미` | 독후감 작성 도움 |
| `/발표-대본` | 발표 대본 작성 |
| `/부탁-사과-메시지` | 정중한 메시지 작성 |
| `/쉽게-설명해줘` | 어려운 개념 쉬운 설명 |
| `/영어-자연스럽게` | 한국어 → 자연스러운 영어 |
| `/자기소개-다듬기` | 자기소개 문장 개선 |
| `/정중한-메시지` | 공식 이메일/메시지 작성 |

### 🔍 SoDamReverse 명령어

| 명령어 | 하는 일 |
|--------|---------|
| `/re-start <파일경로>` | 코드 분석 시작 |
| `/re-report` | 분석 보고서 생성 |
| `/re-selftest` | 안전장치 자가 점검 (6/6 PASS 확인) |
| `/re-android` | Android APK 분석 (Phase 2 예정) |
| `/re-binary` | 바이너리 파일 분석 (Phase 3 예정) |

### 🔁 SoDamLoop 명령어 (출시 예정)

현재 개발 중입니다. Phase 1 출시 후 이 문서가 업데이트됩니다.

---

## 8. 보안 및 데이터 흐름

### 데이터가 외부로 나가나요?
**아니요.** SoDam 플러그인은 외부 서버로 아무 데이터도 보내지 않습니다.

- 모든 처리는 **내 컴퓨터 안에서만** 이루어집니다
- 네트워크 요청을 하는 코드는 의도적으로 제거되었습니다
- API 키·비밀번호 등 민감 정보를 절대 저장하거나 전송하지 않습니다

### 백업 파일은 어디에 저장되나요?
```
Windows: C:\Users\사용자이름\.sodamharness\backups\
Mac:     ~/.sodamharness/backups/
```
- 이 폴더는 **내 컴퓨터에만** 있습니다
- 인터넷에 업로드되지 않습니다
- 직접 열어서 확인할 수 있습니다

### 보안 파일(비밀번호, API 키)은 어떻게 처리하나요?
- `.env`, `.pem`, `.ssh` 등 민감 파일은 **백업에서 제외**됩니다
- 실수로 백업되어 다른 곳에 복사될 위험이 없습니다
- 단, 이런 파일이 작업 중 삭제되어도 **복구가 불가능**하므로 주의하세요

### 코드 검사 시 코드가 외부로 전송되나요?
Claude Code 자체는 Anthropic 서버와 통신하지만,  
SoDam 플러그인이 추가로 외부 서버에 코드를 보내는 일은 없습니다.

### 어떤 것이 차단되나요?
```
차단 예시:
✗ rm -rf ~                    (홈 폴더 전체 삭제)
✗ Remove-Item -Recurse C:\   (드라이브 전체 삭제)
✗ format C:                  (디스크 포맷)
✗ ~/.ssh/ 파일 수정           (SSH 키 탈취 위험)
✗ ~/.aws/ 파일 수정           (AWS 자격증명 탈취 위험)
✗ C:\Windows\ 파일 수정       (시스템 손상 위험)
✗ 크랙·해킹 관련 코드 요청    (법적·윤리적 금지)
```

---

## 9. 아키텍처 구조

### 전체 동작 방식

```
[사용자] → [Claude Code] → [SoDam 플러그인] → [작업 실행]
                               ↓
                          [PreToolUse 훅]
                               ↓
                    안전한가? → YES → 실행
                              → NO  → 차단/확인
```

### 플러그인 간 협력 방식

```
🛡 SoDamHarness (안전 기반 인프라)
    ↑ Harness가 켜져 있으면 아래 플러그인들이 Harness에 의존합니다
    │
    ├── 🧠 SoDamContext → CLAUDE.md 수정 시 Harness가 백업
    ├── 🚀 SoDamAgentic → 위험 명령 차단을 Harness에 위임
    ├── 🔍 SoDamReverse → 위험 패턴을 Harness 규칙에 주입
    └── 🔁 SoDamLoop    → (출시 예정) Harness 안전망 위에서 동작
```

### 훅(Hook)이란?
훅은 Claude Code가 어떤 작업을 하기 전에 "먼저 확인"하는 장치입니다.

```
Claude Code가 파일 삭제를 시도
         ↓
PreToolUse 훅 발동 (SoDamHarness)
         ↓
guard.mjs 가 분석: "이 작업 안전한가?"
         ↓
    안전  → 통과
    위험  → "차단됩니다" 메시지 + 작업 중단
    중간  → "진행할까요?" 확인 요청
```

---

## 10. 파일 및 문서 위치

### 플러그인 설치 위치

```
Windows: C:\Users\사용자이름\.claude\plugins\
Mac:     ~/.claude/plugins/
```

### SoDamHarness 백업 위치

```
Windows: C:\Users\사용자이름\.sodamharness\backups\
Mac:     ~/.sodamharness/backups/
```

### Claude Code 설정 파일

```
Windows: C:\Users\사용자이름\.claude\settings.json
Mac:     ~/.claude/settings.json
```

### AI 사용설명서 파일 위치

```
전역(모든 프로젝트 공통): ~/.claude/CLAUDE.md
프로젝트별: 프로젝트폴더/CLAUDE.md
```

### 로그 파일

```
Harness 활동 로그:    ~/.sodamharness/activity.log
Harness 백업 목록:    ~/.sodamharness/backups/
```

### SoDamReverse 분석 보고서

```
저장 위치: 분석 대상 파일과 같은 폴더/
파일명:    [원본파일명]-report-[날짜].md
```

---

## 11. 문제 및 오류 대처법

### 플러그인 명령어가 인식이 안 될 때

**원인**: Claude Code를 재시작하지 않았을 가능성이 높습니다.

**해결 방법:**
1. Claude Code 완전 종료 (창 닫기)
2. 다시 실행
3. `/sodam-harness-status` 입력해서 확인

### "설치된 플러그인을 찾을 수 없습니다" 오류

**해결 방법:**
```
/sodam-harness-install
```
→ 설치 상태를 점검하고 재설정합니다.

### 되돌리기가 안 될 때

**원인**: 삭제된 파일이 비밀 파일(.env 등)이면 백업에서 제외됩니다.

**해결 방법:**
1. `/sodam-harness-log` 로 백업 목록 확인
2. 해당 백업이 있으면 `/sodam-harness-undo` 시도
3. 없으면 수동으로 복구해야 합니다 (백업되지 않은 파일은 복구 불가)

### `/re-selftest` 에서 FAIL이 나올 때

```
node hooks/_selftest.mjs
```
를 터미널에서 직접 실행해서 어떤 테스트가 실패하는지 확인하세요.

실패 항목을 `/sodam-harness-fix` 로 해결하거나  
GitHub 이슈로 제보해 주세요.

### CLAUDE.md 처방이 "더 커진다" 고 거부될 때

처방 후 파일이 줄어들지 않으면 처방이 거부됩니다.  
이는 정상 동작입니다. 이미 최적화된 파일이거나  
처방이 필요 없는 상태입니다.

### 백업 폴더가 너무 커질 때

```
/sodam-harness-log
```
로 오래된 백업을 확인하고 수동으로 삭제하세요.

```
Windows: C:\Users\사용자이름\.sodamharness\backups\ 폴더 열기
→ 오래된 날짜 폴더 삭제
```

### Node.js 버전이 맞지 않을 때

Node.js 18 미만이면 일부 기능이 작동하지 않습니다.

1. `node --version` 으로 현재 버전 확인
2. 18 미만이면 [nodejs.org](https://nodejs.org) 에서 최신 LTS 설치
3. 기존 Node.js 제거 후 새로 설치

---

## 12. FAQ (자주 묻는 질문)

**Q. 완전 무료인가요?**  
A. 네, SoDam 플러그인 자체는 무료입니다.  
다만 Claude Code 사용에는 Anthropic 계정이 필요하며, 사용량에 따라 요금이 발생할 수 있습니다.

**Q. 코딩을 전혀 몰라도 쓸 수 있나요?**  
A. SoDamPrompt의 10가지 스킬은 코딩 없이 바로 쓸 수 있습니다.  
SoDamReverse, SoDamContext는 기본적인 파일 개념만 알면 됩니다.

**Q. Windows와 Mac 모두 되나요?**  
A. 네, 모두 지원합니다. Linux도 지원됩니다.

**Q. 내 파일이 AI에게 보내지나요?**  
A. Claude Code가 Anthropic 서버와 통신하는 것은 기본 동작이지만,  
SoDam 플러그인이 추가로 외부에 보내는 것은 없습니다.

**Q. 여러 컴퓨터에서 쓸 수 있나요?**  
A. 각 컴퓨터에 별도로 설치해야 합니다. 설정은 컴퓨터마다 독립적입니다.

**Q. SoDamLoop는 언제 출시되나요?**  
A. 현재 Phase 0 (기술 검증) 단계입니다. 출시 예정일은 미정입니다.  
GitHub 저장소를 팔로우하면 업데이트 알림을 받을 수 있습니다.

**Q. 플러그인을 제거하고 싶으면 어떻게 하나요?**  
A. Claude Code에서:
```
/plugin uninstall sodam-harness
```
형태로 제거할 수 있습니다.

**Q. 내가 만든 스킬이나 규칙을 추가할 수 있나요?**  
A. SoDamHarness의 경우 `~/.sodamharness/safety-rules.json` 에  
규칙을 직접 추가할 수 있습니다. 자세한 내용은 GUIDE.md를 참고하세요.

**Q. 백업 파일을 열어볼 수 있나요?**  
A. 네, `~/.sodamharness/backups/` 폴더를 직접 탐색기로 열어서  
파일 내용을 확인할 수 있습니다.

**Q. 기업에서 상업적으로 써도 되나요?**  
A. Apache-2.0 라이선스에 따라 상업적 사용이 가능합니다.  
단, 저작권 표시와 라이선스 표시를 유지해야 합니다.  
자세한 내용은 [라이선스 섹션](#13-라이선스--저작권--법률-사항)을 참고하세요.

---

## 13. 라이선스 · 저작권 · 법률 사항

### 라이선스

이 소프트웨어는 **Apache License 2.0**을 따릅니다.

```
Copyright 2026 SoDam AI Studio

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### 당신이 할 수 있는 것 (Apache-2.0)

| 허용 여부 | 내용 |
|-----------|------|
| ✅ 허용 | 개인 프로젝트에서 자유롭게 사용 |
| ✅ 허용 | 상업적 목적으로 사용 |
| ✅ 허용 | 수정하여 사용 |
| ✅ 허용 | 다른 사람에게 배포 |
| ✅ 허용 | 특허 사용 (기여자가 부여) |

### 반드시 지켜야 하는 것

| 의무 | 내용 |
|------|------|
| ⚠️ 필수 | 원본 저작권 표시 유지: `Copyright 2026 SoDam AI Studio` |
| ⚠️ 필수 | 라이선스 파일(LICENSE) 포함하여 배포 |
| ⚠️ 필수 | 수정한 경우 수정했음을 명시 |
| ⚠️ 필수 | NOTICE 파일이 있으면 함께 배포 |

### 할 수 없는 것

| 금지 | 내용 |
|------|------|
| ❌ 금지 | 저작권 표시 제거 |
| ❌ 금지 | SoDam AI Studio 이름으로 보증받는 것처럼 사용 |
| ❌ 금지 | 상표권 사용 ("Claude", "Anthropic" 상표는 Anthropic 소유) |

### 상표 관련 주의사항

- **"Claude"**, **"Claude Code"**, **"Anthropic"** 은 Anthropic PBC의 상표입니다
- SoDam 플러그인은 Claude Code와 연동되지만,  
  Anthropic이 공식 지원하거나 제휴한 제품이 아닙니다
- SoDam AI Studio는 Anthropic과 무관한 독립 개발자/팀입니다

### 책임 제한

이 소프트웨어는 **"있는 그대로(AS IS)"** 제공됩니다.  
사용으로 인한 데이터 손실, 시스템 문제, 기타 손해에 대해  
SoDam AI Studio는 법적 책임을 지지 않습니다.

중요한 파일은 SoDam 플러그인 외에도  
별도의 외부 백업을 유지하시길 강력히 권장합니다.

### 면책 동의

SoDam 플러그인을 설치·사용함으로써 아래 사항에 동의한 것으로 간주됩니다:
1. 이 소프트웨어는 보증 없이 제공됨을 이해합니다
2. 사용에 의한 모든 결과는 사용자 본인이 책임집니다
3. SoDamReverse는 본인 소유 코드 및 교육 목적으로만 사용합니다
4. 불법적인 목적(크랙, 해킹, 라이선스 우회 등)으로 사용하지 않습니다

### 오픈소스 의존성

이 프로젝트는 Node.js 기본 내장 모듈만 사용합니다 (외부 npm 패키지 없음).  
따라서 별도의 오픈소스 의존성 고지가 필요하지 않습니다.

---

## 14. 기여 방법 및 연락처

### 버그 신고 및 기능 제안

각 플러그인의 GitHub 저장소에서 이슈를 제출해 주세요:

- Harness: https://github.com/sodam-ai/SoDam-Harness-Eng/issues
- Context: https://github.com/sodam-ai/SoDam-Context-Eng/issues
- Agentic: https://github.com/sodam-ai/SoDam-Agentic-Eng/issues
- Prompt: https://github.com/sodam-ai/SoDam-Prompt-Eng/issues
- Reverse: https://github.com/sodam-ai/SoDam-Reverse-Eng/issues

### 이슈 제출 시 포함할 정보

```
OS: (예: Windows 11, macOS 14)
Claude Code 버전: (버전 확인: Claude Code 앱 → 정보)
Node.js 버전: (node --version 결과)
플러그인 버전: (v0.1.0)
발생한 문제: (어떤 명령어를 입력했는지, 무슨 에러가 나왔는지)
```

### 개인정보

이슈 제출 시 **API 키, 비밀번호, 개인 파일 경로** 등 민감 정보는  
절대 포함하지 마세요.

---

*이 문서는 SoDam AI Studio가 작성했으며 Apache-2.0 라이선스를 따릅니다.*  
*PDF 변환: `pandoc SUITE-README.ko.md -o SUITE-README.ko.pdf --pdf-engine=wkhtmltopdf`*
