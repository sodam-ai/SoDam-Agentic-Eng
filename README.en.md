# SoDamAgentic

> A **Claude Code / Codex plugin** for beginner vibe-coders.
> It spoon-feeds, in **plain language**, how to properly direct an AI (plan first → review → safety).
> 🇰🇷 한국어: [README.md](./README.md)
> 📖 For the detailed edition (architecture, security, FAQ, uninstall, etc.), see **[GUIDE.en.md](./GUIDE.en.md)**.

> ⚠️ Currently: **Phase 1 (MVP) complete + part of Phase 2 (F6 safety history, F7 Codex safety parity) complete.** Some features are early-stage.

**Contents:** [Features](#features) · [Requirements](#requirements) · [Install](#install) · [Usage](#usage) · [Commands](#commands) · [Test](#test) · [Uninstall](#uninstall) · [Safety](#safety) · [Troubleshooting](#trouble) · [License](#license) · [Family](#family)

---

<a id="features"></a>
## What it does (4 things)

| Feature | Description |
|---|---|
| **Onboarding** | `/sodam-agentic:start` — explains the 4 steps of directing an AI, in Korean |
| **Plan First (F2)** | Before writing code, shows a "what / why / done-criteria" plan and asks for approval |
| **Easy Review (F3)** | Summarizes changes as "what / why / any risks?" in plain language |
| **Safety (F4)** | Auto-blocks/asks on risky commands, key exposure, writes outside the work folder, settings changes |

<a id="requirements"></a>
## Requirements
- **Node.js 18+** (the safety hook needs it)
- **Claude Code** (or Codex)

<a id="install"></a>
## Install (Claude Code)
> This repository is **private** — it installs only for accounts with access.

1. Add the marketplace:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. Install:
   ```
   /plugin install sodam-agentic@sodam
   ```
3. Verify: type `/sodam-agentic:` — four commands should appear.

## Install (Codex)

1. Clone this repository:
   ```
   git clone https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. From **your project folder**, run the install script (update the path to where you cloned):
   ```
   node C:\path\to\SoDam-Agentic-Eng\codex\install.mjs
   ```
3. Done: skills are copied to your project's `.agents/skills/`.

> ⚠️ **The same safety hook (F4) and safety history (F6) are now registered in Codex too** (F7, 2026-07-15). Plan (F2) and Review (F3) skills work the same way. However, whether the "ask" confirmation prompt actually appears in Codex hasn't been confirmed by a human yet — see [GUIDE.en.md §10](./GUIDE.en.md#security-data-flow).

<a id="usage"></a>
## Usage (beginner steps)
1. `/sodam-agentic:start` → read the onboarding.
2. Ask "make ○○" → if a **plan appears first**, approve with "yes/proceed".
3. After the work, read the **review summary** and check the risks.

> Curious about the **architecture** (components, hook decision flow) or **security/data flow**? → [GUIDE.en.md §9–10](./GUIDE.en.md#architecture)

<a id="commands"></a>
## Commands
| Command | Description |
|---|---|
| `/sodam-agentic:start` | Onboarding |
| `/sodam-agentic:plan` | Plan first |
| `/sodam-agentic:review` | Change review |
| `/sodam-agentic:log` | View block/ask history (F6) |

<a id="test"></a>
## Test / Verify
- **Structure check:** `node scripts/validate.mjs` (validates manifest / skills / hooks)
- **Live safety hook:** after install, try a risky command and confirm it is blocked

<a id="uninstall"></a>
## Uninstall
- Claude Code: type `/plugin uninstall sodam-agentic` → done once `/sodam-agentic` no longer shows commands.
- Codex: delete the copied skill folder(s) from `.agents/skills/` directly.
- Leftover data: the safety log file (`~/.sodamagentic/safety-log.jsonl`, F6) lives outside the plugin folder, so it is not automatically deleted on removal. Details → [GUIDE.en.md §11](./GUIDE.en.md#uninstall)

<a id="safety"></a>
## Safety notes
- **Never put secrets** (API keys, passwords, `.env`) in code, docs, or logs.
- The safety net blocks irreversible risks and asks on the rest. It is **not "100% safe."**
- In auto-accept/bypass-permissions mode, confirmation prompts pass through silently — use `Shift+Tab` for "ask every time."
- Blocked (deny) or asked-about (ask) actions can be reviewed later with `/sodam-agentic:log` (F6; safe pass-throughs aren't logged; stored on your computer only).

<a id="trouble"></a>
## Troubleshooting
| Symptom | Fix |
|---|---|
| `/sodam-agentic` doesn't show | Reinstall (`/plugin install sodam-agentic@sodam`) |
| Korean text is garbled | Capture the screen and report |
| Code without a plan | Skill lost to another feature — to be enforced in Phase 2 |
| "Node not found" | Install Node.js 18+ and retry |

Full 13-row table, FAQ, and changelog → [GUIDE.en.md §12–16](./GUIDE.en.md#troubleshooting)

<a id="family"></a>
## The SoDam family (stronger together)

SoDamAgentic is the entry point of a 6-plugin family. Installing them together makes things safer and more complete.

| Plugin | Role | Install order |
|---|---|---|
| 🛡 SoDamHarness | Safety · backup · undo | 1st (recommended) |
| 🔁 SoDamLoop | Autonomous repeat engine | 2nd |
| 🧠 SoDamContext | Documentation health check | 3rd |
| 🚀 **SoDamAgentic** | **Entry point · plan · review (this one)** | 4th |
| ✏️ SoDamPrompt | Prompt-learning web app | 5th |
| 🔍 SoDamReverse | Code/app analysis reports | 6th |

> Full collaboration spec: [docs/family-synergy.md](./docs/family-synergy.md)

<a id="license"></a>
## License, copyright & commercial use

> ⚠️ This repository is currently **private** and has not been publicly released yet (a personal-use tool, confirmed 2026-07-15). The terms below are stated in advance for a future public release.

**Apache License 2.0** · Copyright **SoDam AI Studio** · 2026 (full text: [`LICENSE`](./LICENSE), notice: [`NOTICE`](./NOTICE)).
Modify, copy, redistribute, **commercial use**, sell, run as a service, use in education, deliver to clients — all ✅ (subject to marking modified files as changed + preserving `LICENSE`/`NOTICE`). Provided **"AS IS," with no warranty of any kind** — to the extent permitted by law, the copyright holder/contributors are not liable for any damages (including data loss); outcomes are your responsibility.
This kit is **free**, but **AI model (Claude/Codex) usage fees and terms follow Anthropic's/OpenAI's own terms** separately. "Claude/Codex" etc. are trademarks of their owners, used only descriptively, never implying endorsement.
This project was **developed with the help of an AI coding tool (Claude Code)** — if you plan to redistribute or use it commercially, also check the legal considerations around AI-assisted content separately (details: [GUIDE.en.md §14](./GUIDE.en.md#license-legal)).
⚠️ Some items are still pending legal review (e.g. trademark scope, not required until public release) — full text + redistribution checklist → [GUIDE.en.md §14](./GUIDE.en.md#license-legal) (not legal advice, for reference only)
