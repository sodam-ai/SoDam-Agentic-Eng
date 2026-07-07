# SoDamAgentic — Beginner's GUIDE

> 🇺🇸 English (this page) · 한국어(기본): [GUIDE.md](./GUIDE.md)
> This guide is written so that **people new to AI, computers, smartphones, or electronics** can follow it step by step.
> Need the short version? See [README.en.md](./README.en.md) first. This document is the **detailed edition**.
> ⚠️ **Status:** Phase 1 (MVP). Some items are still awaiting a human live check (see "Development status" at the end).

---

## Table of Contents

0. [What is this?](#what-is-this)
1. [Prerequisites](#prerequisites)
2. [Downloading & installing required programs](#install-programs)
3. [Quick start (3 steps)](#quickstart)
4. [Installation (detailed)](#install-detail)
5. [Run / use / how it works](#usage)
6. [Command list](#commands)
7. [Workflow](#workflow)
8. [File & document locations](#file-locations)
9. [Architecture](#architecture)
10. [Security & data flow](#security-data-flow)
11. [Uninstall](#uninstall)
12. [Troubleshooting](#troubleshooting)
13. [Safety notes](#safety-notes)
14. [License, copyright & commercial use](#license-legal)
15. [Changelog summary](#changelog)
16. [FAQ](#faq)
17. [Current development status (honestly)](#dev-status)

---

<a id="what-is-this"></a>
## 0. What is this? (one sentence)

> **SoDam** is a **Claude Code / Codex plugin** that spoon-feeds, in **plain language**, how to properly direct an AI.

Analogy: **the AI is a factory machine; you are the person designing the factory.** Instead of "just do it," you first decide *what / why / how far* to build, then review what the AI did, and block anything dangerous.

**The 4 things it does:**
| Feature | One line |
|---|---|
| Onboarding | Explains the 4 steps of directing an AI, in Korean by default |
| Plan First | Before writing code, shows a "what / why / done-criteria" plan and asks for approval |
| Easy Review | Summarizes changes as "what / why / any risks?" |
| Safety | Auto-blocks or asks on risky commands, secret exposure, writes in the wrong place, settings changes |

> 💬 **New to these terms?** `plugin` = an add-on package that extends Claude Code/Codex · `hook` = a watchdog that automatically steps in right before/after the AI does something · `marketplace` = the "store" a plugin is fetched from (here, a GitHub URL) · `slash command` = a command starting with `/` · `session` = this one conversation window (ends when you close it) · `MCP` = a standard protocol for AI to talk to external tools (this plugin does not use it).

---

<a id="prerequisites"></a>
## 1. Prerequisites (required to work)

| Item | Why | Where to get it |
|---|---|---|
| **Node.js 18+** | The safety hook runs on it. Without it, safety won't turn on | https://nodejs.org → download "LTS" |
| **Claude Code** | The program SoDam installs into (or Codex) | https://code.claude.com (follow official setup) |
| **GitHub account + access** | SoDam is fetched from GitHub. The repo is currently **private**, so access is required | https://github.com (free signup) |
| **Internet connection** | Needed at install time | — |

> 💡 **Check (optional):** in a terminal, type `node -v` → `v18....` or higher means OK.

---

<a id="install-programs"></a>
## 2. Downloading & installing required programs (step by step)

### 2-1. Install Node.js
1. Go to https://nodejs.org → click the green **"LTS"** button to download.
2. Double-click the installer → "Next → Next → Install" (keep defaults).
3. Restarting your computer once afterward makes sure it takes effect.

### 2-2. Get Claude Code ready
- Already using Claude Code? Skip this — you're using it right now.
- First time? Follow the official guide (https://code.claude.com). Node.js must be installed first.

---

<a id="quickstart"></a>
## 3. Quick start (3-step golden path)

1. **Install:** in the Claude Code input box:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   /plugin install sodam-agentic@sodam
   ```
2. **Start:** `/sodam-agentic-start` → onboarding appears.
3. **Ask it to do something:** "make ○○" → if a **plan** appears first, approve with "yes" → work happens → check the **review summary**.

→ A "this works" moment in about 5 minutes.

---

<a id="install-detail"></a>
## 4. Installation (detailed)

> ⚠️ This repository is currently **private** — it installs only for GitHub accounts with access.

**Claude Code:**
1. Register the marketplace (the "store") — paste this into the input box and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
   → Success looks like an "added / sodam" message.
   > 🖼️ *(screenshot placeholder — to be added after a human live test)*
2. Install:
   ```
   /plugin install sodam-agentic@sodam
   ```
   → Success looks like "installed."
3. Verify: type `/sodam-agentic` — three commands (`-start`, `-plan`, `-review`) should appear.
   > 🖼️ *(screenshot placeholder)*

**(For the developer's own local testing)** you can install from a local folder instead of the internet:
```
/plugin marketplace add D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam
```

**Codex users:**
1. Clone the repository: `git clone https://github.com/sodam-ai/SoDam-Agentic-Eng`
2. From your project folder, run: `node C:\path\to\SoDam-Agentic-Eng\codex\install.mjs`
3. Done — skills are copied into your project's `.agents/skills/`.
> ⚠️ **Safety hooks (F4) are weaker in Codex than in Claude Code** — see [§10 Security & data flow](#security-data-flow).

---

<a id="usage"></a>
## 5. Run / use / how it works (step by step)

1. Type **`/sodam-agentic-start`** → read the "4 steps to direct an AI" onboarding.
2. (Recommended) Run **`/init`** once → the AI recognizes your current project folder. *Beginners skip this most often.*
3. **Ask in plain language:** e.g. "build me a notepad web page." (You don't need to run a check/diagnostic command first — just asking is the natural first step.)
4. **Check the plan:** before writing code, the AI should show a "① what ② why ③ done-criteria" plan — read it and approve with **"yes/proceed."**
5. **Review:** once the work is done, read the "what changed, why, any risk?" summary and judge for yourself.
6. **Safety:** if you ask for something risky (e.g. deleting a whole folder), it auto-blocks or asks "are you sure?"

---

<a id="commands"></a>
## 6. Command list

| Command | When to use it |
|---|---|
| `/sodam-agentic-start` | First start / onboarding |
| `/sodam-agentic-plan` | "Plan first" feature (usually auto-triggers) |
| `/sodam-agentic-review` | "Change review" feature (usually auto-triggers) |

> Commands also work in `/plugin-name:command` form (`/sodam-agentic:sodam-agentic-start`).

---

<a id="workflow"></a>
## 7. Workflow (how it operates)

```
[Start] /sodam-agentic-start  →  safety on + 4-step onboarding
   │
   ▼
[Plan First]  "build me X"  →  AI proposes a plan  →  you approve
   │
   ▼
[Execute]  AI does the work  ──(if risky)──▶  [Safety]  auto-block / ask
   │
   ▼
[Review]  "what / why / risk" summary  →  you decide  →  done
```
Core principle: **"Not the AI running the show" — the human stays in the driver's seat.**

---

<a id="file-locations"></a>
## 8. File & document locations

**Development folder (source):** `D:\AI_Dev_Work\2026y\26y_06m_26d_SoDam-Agentic-Eng`
**GitHub (internet):** https://github.com/sodam-ai/SoDam-Agentic-Eng (private, branch `init-mvp`)

| What | Location |
|---|---|
| Plugin manifest | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| Onboarding command | `commands/sodam-agentic-start.md` |
| Plan / review features | `skills/sodam-agentic-plan/`, `skills/sodam-agentic-review/` |
| Review sub-agent | `agents/easy-reviewer.md` |
| Safety hooks | `hooks/hooks.json`, `hooks/guard.mjs`, `hooks/delegate.mjs` |
| Safety rules (data) | `data/agentic-rules.json` |
| Structure checker | `scripts/validate.mjs` |
| Codex installer | `codex/install.mjs` |
| Docs (root) | `README.md`/`README.en.md` (short) · `GUIDE.md`/`GUIDE.en.md` (this document) · matching `.html` versions |
| Legal documents | `LICENSE` (full Apache-2.0 text) · `NOTICE` (copyright notice) |
| Shared AI instructions | `AGENTS.md` (Claude Code & Codex) · `CLAUDE.md` (pointer) |
| Sibling-plugin collaboration doc | `docs/family-synergy.md` |
| Changelog | `CHANGELOG.md` |
| Post-install location | `C:\Users\<you>\AppData\Roaming\claude-code\plugins\` (automatic) |

---

<a id="architecture"></a>
## 9. Architecture

This plugin is a **purely local tool — no server, no database, no login.** Its parts:

| Component | File | Role |
|---|---|---|
| Manifest | `.claude-plugin/plugin.json`, `marketplace.json` | Tells Claude Code "this folder is a plugin" |
| Onboarding (F1) | `commands/sodam-agentic-start.md` | Defines the `/sodam-agentic-start` slash command |
| Plan / Review (F2·F3) | `skills/sodam-agentic-plan/`, `skills/sodam-agentic-review/` | Guidance that auto-triggers on new requests / after changes |
| Review sub-agent | `agents/easy-reviewer.md` | A **read-only** sub-AI that F3 delegates to when there are many changes |
| Safety hooks (F4) | `hooks/hooks.json` (wiring) + `hooks/guard.mjs` (decision logic) + `hooks/delegate.mjs` (sibling detection) | Steps in **right before** every Bash/PowerShell/Write/Edit |
| Safety rules data | `data/agentic-rules.json` | Adjustable rule values without touching code |
| Codex support (F5) | `codex/install.mjs` | A separate installer for Codex (which has no marketplace) — copies skill files |

### Safety hook (F4) decision flow

```
The instant Claude Code is about to run a tool (Bash · Write · Edit, etc.)
        │
        ▼
   hooks/guard.mjs judges first (PreToolUse = "right before execution")
        │
        ├─ safe            → passes through
        ├─ ask             → "are you sure you want to proceed?"
        ├─ deny (risky)    → "blocked" (if sibling SoDamHarness is present, overlapping cases delegate to it)
        └─ deny (catastrophic) → "blocked" (**always**, regardless of whether a sibling is installed)
```

- `isHarnessAlive()` in `hooks/delegate.mjs` detects whether the sibling plugin **SoDamHarness** is present.
- If Harness is present, "overlapping" risks (recursive delete, sensitive paths, etc.) are delegated to it so you don't get asked twice — Harness also adds automatic backup/undo.
- **But irreversible, catastrophic commands (disk-wipe-grade) are always blocked by this plugin too, regardless of Harness** — a defense-in-depth safeguard for when a sibling is missing or broken.

---

<a id="security-data-flow"></a>
## 10. Security & data flow

- **What this plugin reads:** only the tool name and its arguments that Claude Code is about to run (e.g. the command string, or the file path being written) — delivered to the hook via standard input (stdin). It does not otherwise inspect your file contents or conversation.
- **What it never does:** make its own network requests (send anything to an external server) · store or log API keys/passwords/tokens · auto-execute external code. (Self-security self-test result: 0 findings — `hooks/_selftest.mjs`)
- **Persistent data:** the current version does not create any separate settings/log/backup files — every safety decision happens instantly in the moment and is not saved anywhere. This section will be updated if Phase 2 adds "safety history (F6)."

### The 3 real decision levels

| Level | Example situation | What actually appears (summarized) |
|---|---|---|
| ✅ safe (pass) | `echo hello`, creating a new file | (no message — it just proceeds) |
| ❓ ask | deleting a single file, editing `.claude/settings.json` | "This is hard to undo… are you sure you want to proceed?" |
| ⛔ deny | trying to expose an API key | "Blocked — this could expose an API key or secret…" |
| ⛔ deny | deleting an entire folder | "Blocked — safely stopped this whole-folder delete…" |
| ⛔ deny (always, catastrophic) | a disk-wipe-grade command | "Blocked — this is an irreversible, dangerous command…" |

> This table is taken directly from the actual code (`hooks/guard.mjs`) — no exaggeration, exactly how it behaves.

---

<a id="uninstall"></a>
## 11. Uninstall

**Claude Code:**
1. Type `/plugin uninstall sodam-agentic` in the input box (or remove it from the marketplace screen).
2. Verify: typing `/sodam-agentic` no longer shows the commands.

**Codex:**
- Installation copies files, so removal means deleting the SoDam-related skill folder(s) from your project's `.agents/skills/` directly.

**What's left behind:** this plugin currently creates no separate persistent settings/log/backup files, so nothing remains on your computer after removal. (This section will be updated if a future safety-history feature adds persistent data.)

---

<a id="troubleshooting"></a>
## 12. Troubleshooting

| Symptom (what you see) | Why (cause) | Fix |
|---|---|---|
| Installed, but nothing seems to happen | Didn't run `/init` / skipped onboarding | Start with `/sodam-agentic-start` to check status |
| `/sodam-agentic` doesn't show anything | Not installed | Reinstall: `/plugin install sodam-agentic@sodam` |
| "No access / permission denied" during install | No access to the private repo | Confirm you're logged into the right GitHub account with access |
| "Node not found" | Node.js not installed | Install Node.js 18+ per [§2](#install-programs) and retry |
| Korean text shows as `□□□` | Rendering/encoding issue | Capture the screen and report (an English fallback can be provided) |
| Code gets written without a plan first | Another skill won out (F2 is a "request," not enforced) | May be expected — report it; enforcement is planned for Phase 2 |
| A risky command wasn't blocked | Safety hook not running | Capture and report (check Node.js and install status) |
| Confirmation prompts appear too often | Multiple safety layers overlapping | Can be tuned to only ask on real risk — let us know |
| Commands show old names | Cached install | `/plugin marketplace update sodam` → reinstall |
| Can I put in a password/API key? | — | **Never.** Keep secrets only in your own environment (e.g. `.env`) |
| I want to remove it / it's acting odd after an update | Uninstall / update conflict | See [§11 Uninstall](#uninstall) |

---

<a id="safety-notes"></a>
## 13. Safety notes (must follow)

- **Never put secrets** — passwords, API keys, `.env` contents — in code, docs, or chat.
- The safety net blocks irreversible risks and asks on the rest. It is **not "100% safe"** — the final call is always yours.
- Be careful about letting the AI auto-run newly downloaded external files or tools.
- If **auto-accept / bypass-permissions** mode is on (shown at the bottom of the screen), confirmation prompts pass through silently — for real safety, use `Shift+Tab` to switch to "ask every time."

---

<a id="license-legal"></a>
## 14. License, copyright & commercial use (important — please read)

> ⚠️ **This is not legal advice.** The following is general guidance; verify at your own responsibility before real-world distribution or commercial use.

- **License (final):** **Apache License 2.0** · Copyright **SoDam AI Studio** · 2026. The full text is in the repository root `LICENSE` file; the notice is in `NOTICE`.
- **Permitted scope (NOTICE-preservation condition):** modify ✅ / copy ✅ / redistribute ✅ / commercial use ✅ / sell ✅ / run as a service ✅ / use in education ✅ / deliver to clients/companies ✅.
- **Warranty & liability:** this software is provided **"AS IS," with no warranty of any kind.** Outcomes from using it are **your responsibility** (including data loss or malfunction).
- **AI model fees/terms are separate:** this kit is **free (Apache-2.0)**, but **the usage fees and terms for the AI models (Claude/Codex) follow Anthropic's and OpenAI's own terms** — unrelated to this tool's license.
- **Third-party trademarks:** "Claude, Anthropic, Codex, OpenAI" are trademarks of their respective owners. Used only in a **descriptive (compatibility/target) sense** — never implying official partnership or endorsement.
- **No unauthorized inclusion:** no third-party works, trademarks, logos, personal data, client information, or secrets are included (zero in this repository too).
- **Adding external assets:** if you add fonts, images, or icons, **check each asset's own license for commercial-use permission** separately.
- **GPL/AGPL-style strong copyleft code is avoided** (risk of propagating source-disclosure obligations on commercial delivery).
- ⚠️ **Still pending (awaiting legal review):** whether the product name / "agentic engineering" phrasing conflicts with any trademark, and re-confirming the exact license of any referenced external code. This section will be updated once resolved.

---

<a id="changelog"></a>
## 15. Changelog summary

<details>
<summary><b>📦 [0.1.0] — 2026-06-28 (initial release, Phase 1 MVP)</b> — click to expand</summary>

**Added**
- F1 Onboarding — 4-step Korean guidance (with Codex support)
- F2 Plan First — approve a "what / why / done-criteria" plan before code
- F3 Easy Review — plain-language change summary + delegate sub-agent
- F4 Safety hooks — 4-category minimal fallback blocking, Harness delegation, fail-closed
- F5 Install support for both tools (Claude Code + Codex)

**Docs & verification tools added**
- README (ko/en), GUIDE (ko/en), sibling-collaboration doc (`family-synergy.md`)
- Structure validator (`validate.mjs`), 6-sibling health check, safety self-test (`_selftest.mjs`)
- `LICENSE` (Apache-2.0), `NOTICE`

**Known limitations**
- F2/F3 are "requests," not enforced (can lose to other skills) — enforcement planned for Phase 2
- F4 safety is weaker in Codex than in Claude Code — parity planned for Phase 2

</details>

<details>
<summary><b>🔧 2026-07-07 Safety hardening (patch within the same version)</b> — click to expand</summary>

- Fixed a defect where the safety fallback (F4) could stay dormant under certain conditions — it now always turns on once installed.
- Hardened so that irreversible catastrophic commands are always blocked regardless of whether the sibling SoDamHarness is installed (defense in depth).
- Documented, in onboarding, the limitation that confirmation prompts pass through silently in auto-accept mode.
- Full overhaul of these docs (README/GUIDE) — fixed stale claims (e.g. "license not finalized"), added Architecture, Security, FAQ, and Uninstall sections.

</details>

<details>
<summary><b>🗓️ [0.2.0] — Phase 2 (planned)</b> — click to expand</summary>

- F6. Safety history (view block/ask history)
- F7. Codex safety parity (protection equal to F4)
- Promote F2/F3 from skills to an enforced hook (guaranteed auto-trigger)

</details>

---

<a id="faq"></a>
## 16. FAQ

**Q. Is this really safe?**
A. No — it's not "100% safe." It blocks irreversible risks and asks about the rest. The final judgment is always yours.

**Q. Does it cost money?**
A. The plugin itself is free (Apache-2.0). Using Claude/Codex (model usage fees) follows Anthropic's/OpenAI's own terms separately.

**Q. Is it just as safe in Codex as in Claude Code?**
A. No. Plan (F2) and Review (F3) work, but the safety hook (F4) is not as strong in Codex as in Claude Code (parity planned for Phase 2).

**Q. Can I use it without SoDamHarness installed?**
A. Yes. Without Harness, this plugin's "minimal safety fallback" runs in full mode. Stronger features like automatic backup/undo require Harness, though.

**Q. Can I use it commercially?**
A. This plugin itself is Apache-2.0, so commercial use, redistribution, and running it as a service are all allowed (NOTICE-preservation condition). But check Anthropic's/OpenAI's own commercial terms for using Claude/Codex.

**Q. Do I have to install the other 5 sibling plugins too?**
A. No. This plugin works fine on its own with minimal safety. Pairing it with SoDamHarness makes it stronger (see the "SoDam family" table in the README).

**Q. Is what I ask the AI to do sent somewhere?**
A. This plugin itself makes no network requests (see [§10 Security & data flow](#security-data-flow)). That's separate from Claude Code/Codex itself communicating with the AI model.

---

<a id="dev-status"></a>
## 17. Current development status (honestly)

- ✅ **Verified:** install, Korean rendering, command consistency, **onboarding (F1) actually works**.
- ✅ **Code complete + self-test passing:** the safety hook (F4) now always turns on, catastrophic commands are always blocked regardless of a sibling plugin, and the auto-accept-mode limitation is documented in onboarding. All 22 self-tests pass.
- ⬜ **Still needs a human to confirm directly:** whether the above blocking is visible in a real live Claude Code session, whether Plan (F2)/Review (F3) reliably auto-trigger without losing to other features, a beta test where a non-developer completes the whole flow alone, and final legal review (trademark/license).
- This is pre-beta for non-developers. There may be rough edges, and **finding them is the current goal.** No exaggeration — this is the honest, current state.

---

*Document version date: 2026-07-07 · This guide is written to match "what is actually implemented and verified so far."*
