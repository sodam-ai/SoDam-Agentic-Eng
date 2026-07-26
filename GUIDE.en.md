# SoDamAgentic — Beginner's GUIDE

> 🇺🇸 English (this page) · 한국어(기본): [GUIDE.md](./GUIDE.md)
> This guide is written so that **people new to AI, computers, smartphones, or electronics** can follow it step by step.
> Need the short version? See [README.en.md](./README.en.md) first. This document is the **detailed edition**.
> ⚠️ **Status:** Phase 1 (MVP) complete + part of Phase 2 (F6 safety history, F7 Codex safety parity) complete. Some items are still awaiting a human live check (see "Development status" at the end).

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
   /plugin install sodam-agentic@sodam-agentic
   ```
2. **Start:** `/sodam-agentic:start` → onboarding appears.
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
   /plugin install sodam-agentic@sodam-agentic
   ```
   → Success looks like "installed."
3. Verify: type `/sodam-agentic:` — four commands (`start`, `plan`, `review`, `log`) should appear.
   > 🖼️ *(screenshot placeholder)*

**(For the developer's own local testing)** you can install from a local folder instead of the internet:
```
/plugin marketplace add D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam-agentic
```

**Codex users:**
1. Clone the repository: `git clone https://github.com/sodam-ai/SoDam-Agentic-Eng`
2. From your project folder, run: `node C:\path\to\SoDam-Agentic-Eng\codex\install.mjs`
3. Done — skills are copied into your project's `.agents/skills/`.
> ⚠️ **The same safety hooks (F4·F6) are now registered in Codex too** (F7, 2026-07-15). However, whether the "ask" confirmation prompt actually appears in Codex, and whether the config file is loaded from the exact expected path, has not yet been verified live by a human — see [§10 Security & data flow](#security-data-flow).

---

<a id="usage"></a>
## 5. Run / use / how it works (step by step)

1. Type **`/sodam-agentic:start`** → read the "4 steps to direct an AI" onboarding.
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
| `/sodam-agentic:start` | First start / onboarding |
| `/sodam-agentic:plan` | "Plan first" feature (usually auto-triggers) |
| `/sodam-agentic:review` | "Change review" feature (usually auto-triggers) |
| `/sodam-agentic:log` | View block(deny)/ask history (F6, added 2026-07-15) |

> The form is `/plugin-name:command` (as of 2026-07-17 the command names themselves were shortened — the old form repeated the plugin name twice, e.g. `/sodam-agentic:sodam-agentic-start`; it's now `/sodam-agentic:start`). Type `/sodam-agentic:` in a new session and all 4 should appear in the list.

---

<a id="workflow"></a>
## 7. Workflow (how it operates)

```
[Start] /sodam-agentic:start  →  safety on + 4-step onboarding
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

> **How to check it actually fired (added 2026-07-26):** when Plan First (F2) actually runs, the response starts with `🚀 SoDam — Plan First`; when Easy Review (F3) actually runs, it starts with `🔍 SoDam — Change Review`. If you don't see this marker, another skill won out and F2/F3 didn't fire — just ask directly, right there, with "show me the plan first" / "please review this."

---

<a id="file-locations"></a>
## 8. File & document locations

**Development folder (source):** `D:\AI_Dev_Work\2026y\26y_06m_26d_SoDam-Agentic-Eng`
**GitHub (internet):** https://github.com/sodam-ai/SoDam-Agentic-Eng (private, branch `init-mvp`)

| What | Location |
|---|---|
| Plugin manifest | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| Onboarding command | `commands/start.md` (`/sodam-agentic:start`) |
| Safety-log viewer command | `commands/log.md` (`/sodam-agentic:log`, F6) |
| Plan / review features | `skills/plan/` (`/sodam-agentic:plan`), `skills/review/` (`/sodam-agentic:review`) |
| Review sub-agent | `agents/easy-reviewer.md` |
| Safety hooks | `hooks/hooks.json`, `hooks/guard.mjs`, `hooks/delegate.mjs` |
| Safety rules (data) | `data/agentic-rules.json` |
| Structure checker | `scripts/validate.mjs` |
| Codex installer | `codex/install.mjs` (also handles F7) |
| **Safety log file (your computer, F6)** | `~/.sodamagentic/safety-log.jsonl` (outside the plugin folder, in your user home) |
| **Codex hook registration file (F7)** | Your project's `.codex/hooks.json` (auto-created/merged on install) |
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
| Onboarding (F1) | `commands/start.md` | Defines the `/sodam-agentic:start` slash command |
| Plan / Review (F2·F3) | `skills/plan/`·`skills/review/` (auto-trigger) + `commands/plan.md`·`commands/review.md` (manual `/sodam-agentic:plan`·`:review`) | Auto-triggers on new requests / after changes, and can also be invoked directly (added 2026-07-18 — Claude Code plugin skills alone don't support manual slash invocation, so command files were added) |
| Review sub-agent | `agents/easy-reviewer.md` | A **read-only** sub-AI that F3 delegates to when there are many changes |
| Safety hooks (F4) | `hooks/hooks.json` (wiring) + `hooks/guard.mjs` (decision logic) + `hooks/delegate.mjs` (sibling detection) | Steps in **right before** every Bash/PowerShell/Write/Edit |
| Safety rules data | `data/agentic-rules.json` | Adjustable rule values without touching code |
| Safety log (F6) | Logic inside `hooks/guard.mjs`'s `decide()` + `commands/log.md` | Records every ask/deny decision to `~/.sodamagentic/safety-log.jsonl`; view via the command |
| Codex support (F5) | `codex/install.mjs` | A separate installer for Codex (which has no marketplace) — copies skill files |
| Codex safety parity (F7) | `codex/install.mjs` registers into `.codex/hooks.json` | No new safety logic — **the same `hooks/guard.mjs` is registered into Codex too** (merges with any existing config) |

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
- **Ask/deny decisions are automatically logged by F6** to `~/.sodamagentic/safety-log.jsonl` (safe pass-throughs are not logged; secrets are automatically masked before saving). View with [`/sodam-agentic:log`](#commands).

---

<a id="security-data-flow"></a>
## 10. Security & data flow

- **What this plugin reads:** only the tool name and its arguments that Claude Code is about to run (e.g. the command string, or the file path being written) — delivered to the hook via standard input (stdin). It does not otherwise inspect your file contents or conversation.
- **What it never does:** make its own network requests (send anything to an external server) · store or log API keys/passwords/tokens · auto-execute external code. (Self-security self-test result: 0 findings — `hooks/_selftest.mjs`)
- **Persistent data (updated 2026-07-15 — F6):** the safety hook writes one line to `~/.sodamagentic/safety-log.jsonl` (in your computer's user folder, outside the plugin's development folder) **only when it decides ask or deny.** Each entry is `{decision, target, reason, timestamp}`; if the target text matches a secret pattern (e.g. an API key), it is automatically masked to `[REDACTED]` before being saved. **Safely-passed actions are never logged** (to keep the log from growing without bound). This log is never sent anywhere — it stays on your computer — and if writing to it ever fails (e.g. a disk issue), that never affects the actual safety decision (block/ask). View it with the [`/sodam-agentic:log`](#commands) command.

### The 3 real decision levels

| Level | Example situation | What actually appears (summarized) |
|---|---|---|
| ✅ safe (pass) | `echo hello`, creating a new file | (no message — it just proceeds) |
| ❓ ask | deleting a single file, editing `.claude/settings.json`, writing outside the working folder | "[SoDam Agentic] This is hard to undo… are you sure you want to proceed?" |
| ⛔ deny | trying to expose an API key | "[SoDam Agentic] Blocked — this could expose an API key or secret…" |
| ⛔ deny | deleting an entire folder | "[SoDam Agentic] Blocked — safely stopped this whole-folder delete…" |
| ⛔ deny (always, catastrophic) | a disk-wipe-grade command, `curl url \| bash` (running downloaded code without ever checking it) | "[SoDam Agentic] Blocked — this is an irreversible, dangerous command…" |

> This table is taken directly from the actual code (`hooks/guard.mjs`) — no exaggeration, exactly how it behaves. **The `[SoDam Agentic]` prefix (added 2026-07-16)** identifies the source so that when a sibling plugin like SoDamHarness is installed alongside it and both hooks fire, you can immediately tell which plugin blocked or asked.

> **Consistency hardening (2026-07-12):** telling the AI to run the exact command directly can no longer bypass the checks above — whether you ask in plain language or specify the exact command, it is checked the same way.

> **Logging hardening (2026-07-15, F6):** the ❓ask and ⛔deny rows in the table above are now automatically recorded to the safety log (`~/.sodamagentic/safety-log.jsonl`). ✅safe (pass) is not logged.

---

<a id="uninstall"></a>
## 11. Uninstall

**Claude Code:**
1. Type `/plugin uninstall sodam-agentic` in the input box (or remove it from the marketplace screen).
2. Verify: typing `/sodam-agentic` no longer shows the commands.

**Codex:**
- Installation copies files, so removal means deleting the SoDam-related skill folder(s) from your project's `.agents/skills/` directly.

**What's left behind (updated 2026-07-15 — F6):** uninstalling the plugin does **not** automatically delete the safety log `~/.sodamagentic/safety-log.jsonl` (it lives outside the plugin folder, in your user home). Delete that file yourself if you want it fully gone. If you also used it with Codex, the `.codex/hooks.json` entry (F7) it registered in your project also stays — remove the `PreToolUse` entry from that JSON file directly if you want it gone too.

---

<a id="troubleshooting"></a>
## 12. Troubleshooting

| Symptom (what you see) | Why (cause) | Fix |
|---|---|---|
| Installed, but nothing seems to happen | Didn't run `/init` / skipped onboarding | Start with `/sodam-agentic:start` to check status |
| `/sodam-agentic` doesn't show anything | Not installed | Reinstall: `/plugin install sodam-agentic@sodam-agentic` |
| "No access / permission denied" during install | No access to the private repo | Confirm you're logged into the right GitHub account with access |
| "Node not found" | Node.js not installed | Install Node.js 18+ per [§2](#install-programs) and retry |
| Korean text shows as `□□□` | Rendering/encoding issue | Capture the screen and report (an English fallback can be provided) |
| Code gets written without a plan first | Another skill won out (F2 is a "request," not enforced) | May be expected — report it; enforcement is planned for Phase 2 |
| A risky command wasn't blocked | Safety hook not running | Capture and report (check Node.js and install status) |
| Confirmation prompts appear too often | Multiple safety layers overlapping | Can be tuned to only ask on real risk — let us know |
| Commands show old names | Cached install is stale (`marketplace update` alone does not refresh the cache — confirmed by testing) | `/plugin uninstall sodam-agentic` → `/plugin install sodam-agentic@sodam-agentic` → `/reload-plugins` (in this exact order) |
| Can I put in a password/API key? | — | **Never.** Keep secrets only in your own environment (e.g. `.env`) |
| I want to remove it / it's acting odd after an update | Uninstall / update conflict | See [§11 Uninstall](#uninstall) |
| I can't remember what got blocked earlier | — | Use `/sodam-agentic:log` (only block/ask events are logged — safe pass-throughs aren't) |
| The Codex "ask" confirmation doesn't seem to appear | Not yet live-verified (F7, 2026-07-15) | First check registration with Codex's own `/hooks` command, then report it |

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

- **Current distribution status (important):** this repository is currently **private** and has not yet been publicly released (it is the developer's own personal-use tool, confirmed 2026-07-15). The license terms below are **stated in advance for a future public release.**
- **License (final):** **Apache License 2.0** · Copyright **SoDam AI Studio** · 2026. The full text is in the repository root `LICENSE` file; the notice is in `NOTICE`.
- **Permitted scope (NOTICE-preservation condition):** modify ✅ / copy ✅ / redistribute ✅ / commercial use ✅ / sell ✅ / run as a service ✅ / use in education ✅ / deliver to clients/companies ✅.
- **Derivative-work marking obligation (Apache-2.0 §4):** if you modify and redistribute this code, you must **mark the modified files as changed from the original** and include copies of the original `LICENSE` and `NOTICE`.
- **Warranty & liability limitation (Apache-2.0 §7–8):** this software is provided **"AS IS," with no warranty of any kind.** To the extent permitted by law, the copyright holder and contributors **are not liable for any direct or indirect damages** (including data loss, lost business, or business interruption) arising from its use. Outcomes from using it are **your responsibility**.
- **AI model fees/terms are separate:** this kit is **free (Apache-2.0)**, but **the usage fees and terms for the AI models (Claude/Codex) follow Anthropic's and OpenAI's own terms** — unrelated to this tool's license.
- **AI-assisted development disclosure (transparency, strict standard):** a substantial portion of this project's code and documentation was written with the help of an AI coding tool (Claude Code). The copyright/patent law around AI-assisted content is still not fully settled in every jurisdiction — **if you plan to redistribute this or use it commercially, check this separately.** Core logic such as the safety hooks (F4) has been verified through repeated real-world testing, but AI-written code does not automatically carry the same guarantee of completeness/correctness as human-written code — **an independent code review is recommended** before using this in production or commercial settings.
- **Third-party trademarks:** "Claude, Anthropic, Codex, OpenAI" are trademarks of their respective owners. Used only in a **descriptive (compatibility/target) sense** — never implying official partnership or endorsement.
- **No unauthorized inclusion:** no third-party works, trademarks, logos, personal data, client information, or secrets are included (zero in this repository too — repeatedly confirmed by `_selftest.mjs` self-checks).
- **Adding external assets:** if you add fonts, images, or icons, **check each asset's own license for commercial-use permission** separately.
- **GPL/AGPL-style strong copyleft code is avoided** (risk of propagating source-disclosure obligations on commercial delivery).
- **Minimum checklist before redistributing/releasing publicly:** ① include the full `LICENSE` ② include `NOTICE` (preserve the copyright notice) ③ mark modified files as changed ④ never use "Claude/Codex/Anthropic/OpenAI" trademarks in a way that implies endorsement or partnership ⑤ resolve the "still pending" item below first.
- ⚠️ **Still pending (awaiting legal review, not required until public release):** whether the product name / "agentic engineering" phrasing conflicts with any trademark, and re-confirming the exact license of any referenced external code. This section will be updated once resolved.

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
<summary><b>✅ 2026-07-11 Live verification + bug fix (patch within the same version)</b> — click to expand</summary>

- **Confirmed the safety hook (F4) actually works in a real usage session.** Until now it had only passed self-checks (code simulation) — this time a real risky-looking command was tried and confirmed to be genuinely blocked.
- Found and fixed one real issue in the process: when several actions were chained together in one request (e.g. "move this folder and create a file"), a completely harmless action could get wrongly blocked as "dangerous." This is now fixed, and re-checked to confirm genuinely dangerous commands are still blocked just as before.
- Unified inconsistent Codex install wording (the start-of-install message and the end-of-install message used to say different things).
- ⚠️ **If your installed copy is older, this fix may not be applied yet.** Uninstall and reinstall to pick up the latest version (see [§12 Troubleshooting](#troubleshooting)).

</details>

<details>
<summary><b>🛡️ 2026-07-12·13 Safety hardening — 5 real bugs found & fixed + security audit completed</b> — click to expand</summary>

**Found and fixed through live testing**
- Fixed a crash that could happen when the safety hook received a very unusual input signal.
- Found and closed a gap where **the "no writing outside the working folder" rule was missing in some cases**.
- Added a check so that creating a shortcut (symbolic link) itself now requires confirmation.
- **(Most serious) Found and closed a real gap where, if you told the AI to run an exact command directly, the working-folder rule above was skipped entirely.** Now the same check applies whether you ask in plain language or specify the exact command.
- Added a new safeguard against **running downloaded code without ever checking it** (the common `curl url | bash` attack pattern) — this was not being checked at all until now.
- Strengthened the wording for the Review (F3) feature so it triggers more reliably. **We are not yet certain this actually improved things** — recorded honestly, without overstating it.

**Separate OWASP-based security audit**
- Re-checked every required item on the OWASP ASVS checklist (secret exposure, settings-file protection, error-message information leaks, dependencies, etc.) — all passed.
- Re-scanned every tracked file in the repository for accidentally-committed secrets — 0 found.

**Regression tests**: the safety hook's own test suite grew from 22 to **42 checks**, all passing.

</details>

<details>
<summary><b>✅ 2026-07-15 — F6 safety history + F7 Codex safety parity, implemented</b> — click to expand</summary>

**F6. Safety history**
- The safety hook now writes a record to your computer's `~/.sodamagentic/safety-log.jsonl` every time it decides ask or deny (safely-passed actions are not logged).
- Secrets (like API keys) are automatically masked (`[REDACTED]`) before being saved, so they never sit in the log as-is.
- A new command, **`/sodam-agentic:log`**, lets you review "what was recently blocked or asked about" in plain language.
- Even if logging itself fails (e.g. a disk issue), it never affects the actual safety decision.

**F7. Codex safety parity**
- We confirmed, from Codex's own official documentation, that its hook mechanism is essentially the same as Claude Code's.
- So instead of building new safety logic, we extended the installer to **register the same safety hook (`hooks/guard.mjs`) into Codex too** (added to `.codex/hooks.json`; merges with any existing config instead of overwriting it).
- ⚠️ **Honest limitation:** whether the "ask" confirmation prompt actually appears on screen in Codex, and whether Codex reads its config from exactly this path, has not yet been confirmed by a human actually using Codex. Registration itself was verified by automated tests, but the final live check is still a human task.

**Verification**: the safety hook's own test suite grew from 42 to **54 checks**, all passing. Structure validation also clean.

</details>

<details>
<summary><b>🔧 2026-07-16 — Safety-message source tag + 2 diagnostic-tool improvements (patch within the same version)</b> — click to expand</summary>

- **Added a `[SoDam Agentic]` tag to block/ask messages.** When installed alongside a sibling plugin (like SoDamHarness) and both safety layers fire, it used to be impossible to tell which one had acted — now both the on-screen message and the `/sodam-agentic:log` history show the source.
- **Fixed `family-health.mjs` (the sibling-status diagnostic tool) presenting stale notes as if they were current facts.** Every "completed"-style note now shows the date it was written, clearly separated from anything checked live (like whether a file exists).
- **Added an "is the installed cache up to date?" check to `validate.mjs` (the structure validator).** This immediately caught the fact that the actually-installed cache was several days out of date (the entries below for 07-17 and 07-18 follow directly from this discovery).

</details>

<details>
<summary><b>🛡️ 2026-07-17 — 2 real safety-related bugs found and fixed during live verification</b> — click to expand</summary>

- **Found and fixed a bug where sibling-plugin (SoDamHarness) detection always failed on some machine setups.** The path-checking code was looking in the wrong location, so even when Harness was genuinely installed, it was wrongly treated as "not present." This wasn't dangerous in itself (it only skewed toward stricter checking), but it could cause confirmation prompts to appear twice when used alongside the sibling plugin. This is now resolved.
- **(Important) Found and fixed a real gap where a file could be silently created outside the current working folder.** Tracing the cause led to discovering that the sibling plugin (SoDamHarness) simply does not have an "ask before writing outside the working folder" feature at all (a deliberate design choice on the sibling's side). Since this plugin delegates that check to the sibling when present, the check itself was silently skipped whenever the sibling lacked it. **This one check is now always performed by this plugin directly, regardless of whether the sibling is installed.**
- The safety hook's own regression test suite (54 checks) still passes in full.
- ⚠️ **Honest limitation:** as of this document, a human has not yet re-confirmed this fix on an actual installed screen (the code fix and automated checks are done; live re-confirmation is still pending).

</details>

<details>
<summary><b>✅ 2026-07-18 — Short-form slash commands complete (autocomplete now correctly shows `/sodam-agentic:start`)</b> — click to expand</summary>

- **Shortened the command names.** What used to repeat the plugin name twice (`/sodam-agentic:sodam-agentic-start`) is now `/sodam-agentic:start` (across all 4 commands: `start`, `plan`, `review`, `log`).
- **Made "Plan First" and "Review" callable as direct commands too.** These two features used to only auto-trigger. We discovered a Claude Code platform limitation (confirmed via an official issue tracker report) that auto-trigger-only components cannot be typed directly with `/` — so we kept the auto-trigger behavior and added dedicated command files for direct invocation. `/sodam-agentic:plan` and `/sodam-agentic:review` can now be typed directly too.
- **Adjusted the autocomplete display format to the fully-qualified form that was actually wanted.** It initially showed up as a short form like `/log (sodam-agentic)`, but the intended display was the **fully-qualified `/sodam-agentic:log` form, with the plugin name always shown.** After adjusting an internal configuration detail, typing just `/sodam-agentic` in a new session now lists all 4 commands in the `sodam-agentic:name` form — confirmed on an actual screen.
- Both structure validation (`validate.mjs`) and the safety hook's self-test suite (`_selftest.mjs`, 54 checks) pass.

</details>

<details>
<summary><b>🗓️ Still planned (not yet decided whether to start)</b> — click to expand</summary>

- Promote F2/F3 from skills to an enforced hook (guaranteed auto-trigger) — whether to start this is not yet decided.

</details>

---

<a id="faq"></a>
## 16. FAQ

**Q. Is this really safe?**
A. No — it's not "100% safe." It blocks irreversible risks and asks about the rest. The final judgment is always yours.

**Q. Does it cost money?**
A. The plugin itself is free (Apache-2.0). Using Claude/Codex (model usage fees) follows Anthropic's/OpenAI's own terms separately.

**Q. Is it just as safe in Codex as in Claude Code?**
A. **The same safety hook is now registered in Codex too** (F7, 2026-07-15) — Plan (F2), Review (F3), blocking, and safety logging (F6) all use the same logic. However, **whether the "are you sure?" confirmation prompt actually appears in Codex, and whether the config is loaded from the exact right path, has not yet been confirmed by a human** — we're not claiming 100% parity, we're stating this honestly.

**Q. Can I look back at what got blocked or asked about?**
A. Yes — the `/sodam-agentic:log` command shows recent history in plain language. Note that **only blocked (deny) or asked-about (ask) actions are logged; safely-passed actions are not.** The log stays on your computer (`~/.sodamagentic/safety-log.jsonl`) and is never sent anywhere.

**Q. Can I use it without SoDamHarness installed?**
A. Yes. Without Harness, this plugin's "minimal safety fallback" runs in full mode. Stronger features like automatic backup/undo require Harness, though.

**Q. Can I use it commercially?**
A. This plugin itself is Apache-2.0, so commercial use, redistribution, and running it as a service are all allowed (NOTICE-preservation condition). But check Anthropic's/OpenAI's own commercial terms for using Claude/Codex.

**Q. Do I have to install the other 5 sibling plugins too?**
A. No. This plugin works fine on its own with minimal safety. Pairing it with SoDamHarness makes it stronger (see the "SoDam family" table in the README).

**Q. Is what I ask the AI to do sent somewhere?**
A. This plugin itself makes no network requests (see [§10 Security & data flow](#security-data-flow)). That's separate from Claude Code/Codex itself communicating with the AI model. (The safety log (F6) isn't sent anywhere either — it's **saved to a file on your own computer**; see the question just above.)

---

<a id="dev-status"></a>
## 17. Current development status (honestly)

- ✅ **Verified:** install, Korean rendering, command consistency, **onboarding (F1) actually works**.
- ✅ **Code complete + self-test passing:** the safety hook (F4) now always turns on, catastrophic commands are always blocked regardless of a sibling plugin, and the auto-accept-mode limitation is documented in onboarding. **Safety history (F6) and Codex safety parity (F7) implemented (2026-07-15).** All 54 self-tests pass.
- ✅ **Multiple rounds of live verification (2026-07-11~13):** repeated real-usage testing found and fixed 5 real bugs (see "Changelog summary" above), and every required item on the international OWASP security checklist was re-confirmed.
- ✅ **Short-form slash commands and the autocomplete display format confirmed live (2026-07-18):** `/sodam-agentic:start`, `:plan`, `:review`, `:log` were confirmed, via an actual screen capture, to all appear in autocomplete in the intended fully-qualified form.
- ✅ **`.claude/settings.json` protection hardened (2026-07-27):** items that can alter the AI's own safety controls — MCP enablement, permissions, hook paths — are now **blocked outright (deny)** instead of just asking (other, ordinary settings changes still just ask, as before). Also added an on-screen marker (🚀/🔍, see "Workflow" above) so you can immediately tell whether Plan First (F2) / Easy Review (F3) actually fired. The self-test suite grew from 67 to **76 checks**, all passing.
- ⚠️ **Still uncertain — stated honestly:** whether Review (F3) reliably auto-triggers in a fully unscripted, real-world usage session has not been conclusively confirmed even after repeated testing. Whether F7 (Codex confirmation prompt/logging) actually works has also not been live-verified by a human yet.
- ⬜ **Still needs a human to confirm directly:** ① whether the "ask before writing outside the working folder" prompt still fires correctly on an actual installed screen after the 2026-07-17 fix (the code fix and automated checks are done — only live re-confirmation is left) ② whether the safety log (F6) is written correctly through the actual installed path too (verification so far has only run directly from the development folder) ③ whether F7 (safety confirmation prompt, config load path) actually works live in Codex ④ (only needed if considering a public release) a non-developer beta test and final legal review.
- **Confirmed personal-use scope (2026-07-15):** this tool is built for the developer's own direct, real-world use. Item ④ above is **not a required precondition right now** — it would matter again if a public release is considered later. There may be rough edges, and finding them through real use is the current goal. No exaggeration — this is the honest, current state.

---

*Document version date: 2026-07-27 · This guide is written to match "what is actually implemented and verified so far."*
