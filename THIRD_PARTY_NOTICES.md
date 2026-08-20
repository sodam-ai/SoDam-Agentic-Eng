# THIRD_PARTY_NOTICES

> 이 문서는 SoDamAgentic을 설계·구현하면서 **구조·아이디어를 참고한** 오픈소스 저장소의 원저작권 고지를 담습니다.
> 이 프로젝트 자체의 라이선스는 [`LICENSE`](./LICENSE)(Apache-2.0)이며, 이 문서는 그와 별개로 **참고한 3rd-party 저장소에 대한 귀속(attribution) 고지**입니다.
> 실사(2026-08-21) 기준: `gh` CLI로 각 저장소의 실제 라이선스를 직접 조회해 확인했습니다. GPL/AGPL 등 카피레프트 코드는 **0건**입니다.

---

## 1. wshobson/agents (MIT)

- 저장소: https://github.com/wshobson/agents
- 참고한 부분: 번들 마켓플레이스(`marketplace.json`) 구조 골격
- 라이선스: MIT License

```
MIT License

Copyright (c) 2024 Seth Hobson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 2. HKUDS/OpenHarness (MIT)

- 저장소: https://github.com/HKUDS/OpenHarness
- 참고한 부분: 권한 `path_rules` 스키마 설계
- 라이선스: MIT License

```
MIT License

Copyright (c) 2025 OpenHarness Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 3. Chachamaru127/claude-code-harness (MIT)

- 저장소: https://github.com/Chachamaru127/claude-code-harness
- 참고한 부분: 안전 규칙 체계(R01~R13)의 설계 방향 — 이 프로젝트의 `hooks/guard.mjs`는 이를 직접 재사용한 코드가 아니라, **자체 구현**(Node `.mjs`, 런타임 의존성 0)입니다.
- 라이선스: MIT License

```
MIT License

Copyright (c) 2024-2025 Manus AI & Chachamaru

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 4. anthropics/skills (라이선스 파일 없음 — 별도 표기)

- 저장소: https://github.com/anthropics/skills
- 참고한 부분: `SKILL.md` 파일의 형식(frontmatter `name`/`description` 필드 구성) — Claude Code의 공식 Skill 규격(사양)이며, 이 프로젝트의 스킬 파일이 Claude Code와 호환되려면 이 형식을 따라야 합니다.
- 실사 결과: 이 저장소 루트에는 `LICENSE` 파일이 **존재하지 않습니다**(`gh api repos/anthropics/skills/license` → 404, 2026-08-21 확인). 즉 별도의 명시적 라이선스 고지가 없는 상태입니다.
- ⚠️ **정직한 고지:** 이 프로젝트가 참고한 것은 문서 형식(스키마)이며 저작권으로 보호되는 구체적 문구·예제 코드를 그대로 복사한 사실은 없습니다(전체 소스코드 검색 결과 anthropics/skills의 리터럴 텍스트 재사용 0건, 2026-08-21 확인). 다만 "형식 참고가 저작권 문제에서 완전히 자유로운지"는 저작권법의 아이디어/표현 이분법(idea-expression dichotomy)에 대한 법적 판단이 필요한 영역이라, 이 문서가 최종 결론을 내리지 않습니다 — 실제 상업적 배포·법적 분쟁 우려 시 별도 법무 검토를 권장합니다.

---

## 요약

| 저장소 | 라이선스 | GPL/AGPL 여부 |
|---|---|---|
| wshobson/agents | MIT | 아니오 |
| HKUDS/OpenHarness | MIT | 아니오 |
| Chachamaru127/claude-code-harness | MIT | 아니오 |
| anthropics/skills | 없음(unlicensed) | 아니오(형식만 참고) |

**GPL/AGPL 계열 카피레프트 코드 차용 = 0건**으로 확인되었습니다(`.PRD/08_LICENSE_LEGAL.md` §11 MUST 요구사항 충족).
