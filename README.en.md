# SoDamAgentic (소담 에이전틱)

> A **Claude Code / Codex plugin** for beginner vibe-coders.
> It spoon-feeds, in **plain language**, how to properly direct an AI (plan first → execute → review → safety).
> **This single document covers everything from installation to troubleshooting and licensing.** Written so that anyone new to AI, computers, or smartphones can follow along.
>
> 🇰🇷 한국어 버전: [README.md](./README.md) (identical content)

> ⚠️ **Current status:** Phase 1 (MVP) complete + a large part of Phase 2 complete (F6 safety history, F7 Codex safety parity, `.claude/settings.json` and `.mcp.json` protection). Some items are "code complete, awaiting a human's on-screen confirmation" — see [§17 Current development status](#dev-status) for an honest breakdown.
> ⚠️ **This is a PRIVATE repository.** It has not been publicly released yet — it is a personal tool the developer built for their own use (confirmed 2026-07-15). The license terms below are stated in advance for a future public release.

---

<a id="toc"></a>
## Table of Contents

0. [What is this tool (at a glance)](#what-is-this)
1. [Prerequisites](#prerequisites)
2. [Downloading & installing required programs](#install-programs)
3. [Quick start (3-step golden path)](#quickstart)
4. [Installation (detailed)](#install-detail)
5. [Run / use / how it works](#usage)
6. [Command list](#commands)
7. [Workflow](#workflow)
8. [File & document locations](#file-locations)
9. [Architecture](#architecture)
10. [Security & data flow](#security-data-flow)
11. [Uninstall](#uninstall)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)
14. [Safety notes](#safety-notes)
15. [License, copyright & commercial use](#license-legal)
16. [Changelog summary](#changelog)
17. [Current development status (honestly)](#dev-status)
18. [The SoDam family (stronger together)](#family)

---

<a id="what-is-this"></a>
## 0. What is this tool (at a glance)

> **SoDamAgentic** is a **plugin (add-on)** for Claude Code (or Codex) that spoon-feeds "how to properly direct an AI" in plain language.

Analogy: **the AI is the machinery in a factory, and you are the person designing that factory.** Instead of "just handle it," you first decide **what, why, and how far** to build, then review what the AI did, and dangerous things get blocked automatically.

**The 4 things it does:**

| Feature | Description |
|---|---|
| **Onboarding (F1)** | `/sodam-agentic:start` — explains the 4 steps of directing an AI (plan → execute → review → safety), in Korean |
| **Plan First (F2)** | Before writing code, shows a "① what ② why ③ done-criteria" plan and asks for approval |
| **Easy Review (F3)** | Summarizes changes as "what / why / any risks?" in plain language (delegates to a read-only sub-AI when changes are large) |
| **Safety (F4)** | Auto-blocks (deny) or asks (ask) on risky commands, secret exposure, writes outside the work folder, and settings-file changes; block/ask history is recorded by F6 |

> 💬 **If the terms are unfamiliar:** `plugin` = an add-on that gives the AI program new features · `hook` = a watchdog that automatically steps in **right before** the AI does something · `marketplace` = the "store" plugins are fetched from (here, a GitHub address) · `slash command` = a command starting with `/` · `session` = this one conversation window (ends when closed) · `MCP` = the protocol an AI uses to talk to external tools (this plugin itself doesn't use MCP, but it does guard the `.mcp.json` config file — see [§10](#security-data-flow)).

---

<a id="prerequisites"></a>
## 1. Prerequisites (you need these for it to work)

| Requirement | Why | Required/Optional |
|---|---|---|
| **Node.js 18+** | The safety hook runs on this. Without it, the safety features don't turn on at all | **Required** |
| **Claude Code** (or Codex) | The program SoDam installs into | **Required** (one of the two) |
| **A GitHub account + access to this repository** | SoDam is fetched from GitHub. It is currently **private**, so you need access | **Required** |
| **git** (command-line tool) | The Codex installer fetches the repo via `git clone` (the Claude Code marketplace install doesn't need git) | **Required (for Codex install)** |
| **An internet connection** | Needed at install time (once installed, the plugin itself makes no network requests — [§10](#security-data-flow)) | **Required (install time only)** |

> 💡 **How to check:** type `node -v` in a terminal (black window) → if it shows `v18.` or higher, you're good.

---

<a id="install-programs"></a>
## 2. Downloading & installing required programs (step by step)

### 2-1. Download & install Node.js
1. Go to https://nodejs.org → click the green **"LTS"** button to download.
2. Double-click the installer → "Next → Next → Install" (defaults are fine).
3. Restarting your computer once afterward makes sure it takes effect.
4. Verify: type `node -v` in a terminal → done if a version number appears.

### 2-2. Get Claude Code ready
- If you're already using Claude Code, skip this (this very conversation is Claude Code).
- If this is your first time, follow the official guide (https://code.claude.com). (Node.js must already be installed.)

### 2-3. If you use Codex
- Install the Codex CLI itself by following OpenAI's official guide. This plugin adds skills **after** Codex is already installed → [§4 Install (Codex)](#install-detail).

---

<a id="quickstart"></a>
## 3. Quick start (3-step golden path)

1. **Install:** paste this into the Claude Code input box and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   /plugin install sodam-agentic@sodam-agentic
   ```
2. **Start:** type `/sodam-agentic:start` → the Korean-language onboarding guide appears.
3. **Direct it:** ask for something in natural language ("build ○○") → if a **plan** appears first, approve with "yes/proceed" → after the work is done, read the **review summary**.

→ This whole thing takes about **5 minutes** to get to a "wow, it worked" moment. There's no need to lead with confirmation/diagnostic commands — just ask for what you want first.

---

<a id="install-detail"></a>
## 4. Installation (detailed)

> ⚠️ This repository is currently **private**. The commands below only succeed if your GitHub account **has access**.

### Claude Code — install
1. Register the marketplace (the plugin "store") — paste this into the input box and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
   → success if you see an "added" style message.
2. Install:
   ```
   /plugin install sodam-agentic@sodam-agentic
   ```
   → success if you see "installed."
   > ⚠️ **Marketplace name matters (confirmed 2026-07-27):** make sure to type `sodam-agentic@sodam-agentic` exactly. Shortening it to `@sodam` will fail (the marketplace name used to collide with a sibling plugin — fixed on this date, see [§16 Changelog](#changelog)).
3. Verify: type just `/sodam-agentic:` → done if 4 commands (`start`, `plan`, `review`, `log`) show up in autocomplete.

**(For the developer's own local testing)** You can also register a local folder path instead of a URL:
```
/plugin marketplace add D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam-agentic
```

### Codex — install
1. Clone this repository:
   ```
   git clone https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. **From inside your own project folder**, run the install script (update the path to where you cloned it):
   ```
   node C:\path\to\SoDam-Agentic-Eng\codex\install.mjs
   ```
   > ⚠️ **Watch for the wrong folder:** depending on your terminal tool, the working directory can reset to your home folder between commands. Always **`cd` into the project folder you actually want to work in first**, then run the command above — otherwise the skills/config end up installed into the wrong place (e.g. your home folder).
3. Done: skills are copied into your project's `.agents/skills/`, and the safety hook is registered in `.codex/hooks.json`.

> ⚠️ **The same safety hook (F4) and safety history (F6) are registered in Codex too** (F7, implemented 2026-07-15). Plan (F2) and Review (F3) skills work the same way. However, **whether the "ask" confirmation prompt actually appears on screen in Codex has not yet been confirmed by a human** — details: [§10 Security & data flow](#security-data-flow), [§17 Current development status](#dev-status).

---

<a id="usage"></a>
## 5. Run / use / how it works (step by step)

**Run (turning it on after install):**
1. Type `/sodam-agentic:start` → read the "4 steps of directing an AI" onboarding.
2. (Recommended) Run `/init` once → the AI recognizes your current folder (project). *This is the step beginners skip most often.*

**Use (what the human does):**
3. **Ask in natural language:** e.g. "build me a notepad web page." No need to lead with confirmation/diagnostic commands — just ask first.
4. **Check the plan:** before writing code, the AI shows a "① what ② why ③ done-criteria" plan — read it and approve with **"yes/proceed."**
5. **Review:** once the work is done, read the "what changed / why / any risks?" summary and make the final call yourself.

**How it works (what happens automatically under the hood):**
6. **Every single time** the AI tries to write a file or run a command, SoDam's safety hook steps in first to decide safe/ask/deny (see the "decision flow" in [§9 Architecture](#architecture)). This runs automatically with no action needed from you.

> Curious about the **architecture** (components, hook decision flow)? → [§9](#architecture). Curious about **security/data flow**? → [§10](#security-data-flow).

---

<a id="commands"></a>
## 6. Command list

| Command | When to use it |
|---|---|
| `/sodam-agentic:start` | First-time start / onboarding |
| `/sodam-agentic:plan` | Manually invoke "Plan First" (usually triggers automatically) |
| `/sodam-agentic:review` | Manually invoke "Easy Review" (usually triggers automatically) |
| `/sodam-agentic:log` | View blocked (deny) / asked-about (ask) history (F6) |

> The format is `/plugin-name:command` (shortened since 2026-07-18 — it used to be as long as `/sodam-agentic:sodam-agentic-start`). Open a new conversation and type just `/sodam-agentic:` to see all 4 commands listed.

---

<a id="workflow"></a>
## 7. Workflow

```
[Start] /sodam-agentic:start  →  safety turns on + 4-step guide
   │
   ▼
[Plan First]  "build ___"  →  AI proposes a plan  →  you approve
   │
   ▼
[Execute]  AI does the work  ──(if risky)──▶  [Safety]  auto block / ask
   │
   ▼
[Review]  what/why/risk summary  →  you judge  →  done
```

> **How to confirm it fired (added 2026-07-26):** when Plan First (F2) actually runs, `🚀 SoDam — Plan First` appears at the top of the response; when Easy Review (F3) runs, `🔍 SoDam — Easy Review` appears. If you don't see this text, another skill took priority and F2/F3 didn't fire — just ask directly, "show me the plan first" / "review this."

Core principle: **the AI doesn't "just handle everything" — the human stays in the driver's seat.**

---

<a id="file-locations"></a>
## 8. File & document locations

**Development folder (source):** `D:\AI_Dev_Work\2026y\26y_06m_26d_SoDam-Agentic-Eng`
**GitHub (online):** https://github.com/sodam-ai/SoDam-Agentic-Eng (private, branch `init-mvp`)

| What | Location |
|---|---|
| Plugin manifest files | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| Onboarding command | `commands/start.md` (`/sodam-agentic:start`) |
| Safety-log lookup command | `commands/log.md` (`/sodam-agentic:log`, F6) |
| Plan / Review features | `skills/plan/` (`/sodam-agentic:plan`), `skills/review/` (`/sodam-agentic:review`) |
| Review helper AI | `agents/easy-reviewer.md` |
| Safety hook | `hooks/hooks.json` (wiring), `hooks/guard.mjs` (decision logic), `hooks/delegate.mjs` (sibling detection) |
| Safety rules (data) | `data/agentic-rules.json` |
| Structure checker | `scripts/validate.mjs` |
| Codex installer | `codex/install.mjs` (doubles as F5·F7) |
| **Safety log file (your computer, F6)** | `~/.sodamagentic/safety-log.jsonl` (outside the plugin folder, in your home folder) |
| **Codex hook registration file (F7)** | `.codex/hooks.json` in your own project (auto-created/merged on install) |
| Documentation (root, including this one) | `README.md`/`README.en.md` (this document) · each `.html` version |
| Legal documents | `LICENSE` (Apache-2.0 full text) · `NOTICE` (copyright notice) |
| AI-shared instructions | `AGENTS.md` (shared by Claude Code & Codex) · `CLAUDE.md` (pointer) |
| Family collaboration doc | `docs/family-synergy.md` |
| Changelog (developer-facing source) | `CHANGELOG.md` |
| Where it lives after install | `C:\Users\<you>\AppData\Roaming\claude-code\plugins\` (managed automatically by Claude Code) |

---

<a id="architecture"></a>
## 9. Architecture

This plugin is a **purely local tool with no server, database, or login.** Its components:

| Component | File | Role |
|---|---|---|
| Manifest | `.claude-plugin/plugin.json`, `marketplace.json` | Tells Claude Code "this folder is a plugin" |
| Onboarding (F1) | `commands/start.md` | Defines the `/sodam-agentic:start` slash command |
| Plan & Review (F2·F3) | `skills/plan/` · `skills/review/` (auto-triggered) + `commands/plan.md` · `commands/review.md` (manual invoke) | Auto-fires on new task requests / after changes, and can also be called directly |
| Review helper agent | `agents/easy-reviewer.md` | A **read-only** sub-AI that F3 delegates to when there are a lot of changes |
| Safety hook (F4) | `hooks/hooks.json` (wiring) + `hooks/guard.mjs` (decision logic) + `hooks/delegate.mjs` (sibling detection) | Always steps in **right before** Bash/PowerShell/Write/Edit run |
| Safety rules data | `data/agentic-rules.json` | Adjustable rule values without touching code |
| Safety history (F6) | Inside `decide()` in `hooks/guard.mjs` + `commands/log.md` | Every ask/deny decision is logged to `~/.sodamagentic/safety-log.jsonl`, viewable via command |
| Codex support (F5) | `codex/install.mjs` | A separate installer for Codex, which has no marketplace (copies skills as files) |
| Codex safety parity (F7) | `codex/install.mjs` registers into `.codex/hooks.json` | Instead of building new safety logic, it registers **the exact same `hooks/guard.mjs` into Codex too** (merges with any existing config) |

### Safety hook (F4) decision flow

```
The moment Claude Code is about to run a tool (Bash, Write, Edit, etc.)
        │
        ▼
   hooks/guard.mjs decides first (PreToolUse = "right before execution")
        │
        ├─ Safe            → passes through
        ├─ Needs ask        → "Are you sure you want to proceed?"
        ├─ Deny             → "Blocked" (delegated to sibling SoDamHarness for overlapping items, if present)
        └─ Catastrophic     → "Blocked" (always, regardless of whether a sibling is present)
```

- `isHarnessAlive()` in `hooks/delegate.mjs` checks whether the sibling plugin **SoDamHarness** is present.
- If Harness is present, "overlapping" risks (recursive deletes, sensitive paths, etc.) are handed off to Harness so you don't get two confirmation prompts (Harness also adds automatic backup/undo).
- **However, irreversible catastrophic commands and the auto-executed config file (`.mcp.json`) are always blocked by this plugin itself regardless of whether a sibling is installed** — a defense-in-depth measure for when a sibling is missing or lacks that specific feature.
- **Ask/deny decisions are automatically logged to `~/.sodamagentic/safety-log.jsonl` by F6** (safe pass-throughs aren't logged; secret values are masked before saving). View them with [`/sodam-agentic:log`](#commands).

---

<a id="security-data-flow"></a>
## 10. Security & data flow

- **What this plugin reads:** only the name of the tool Claude Code is about to run and its arguments (e.g., the command string, or the file path being written to). This is passed to the hook via standard input (stdin). It does not otherwise inspect file contents or conversation content.
- **What this plugin never does:** make its own network requests (send data to an external server) · store or log API keys/passwords/tokens · auto-execute external code. (Self-security self-check result: 0 findings — `hooks/_selftest.mjs`)
- **Persistent data (F6):** the safety hook writes a line to `~/.sodamagentic/safety-log.jsonl` (your computer's user folder, outside the plugin's own development folder) **only** when it makes an **ask** or **deny** decision. Each entry is `{decision, target, reason, timestamp}`; if the target string matches a secret pattern (like an API key), it is automatically masked as `[REDACTED]` before saving. **Safe pass-throughs are never logged.** This log is never transmitted anywhere — it stays on your computer only — and even if logging itself fails, it never affects the safety decision (block/ask) itself. View it with the [`/sodam-agentic:log`](#commands) command.

### Real decision examples

| Level | Example situation | What actually appears (summary) |
|---|---|---|
| ✅ Safe (pass) | Creating a new file, changing an ordinary setting value | (nothing shown, just proceeds) |
| ❓ Ask | Deleting a single file, writing outside the work folder | "[SoDamAgentic] This is hard to undo… are you sure you want to proceed?" |
| ⛔ Deny | An action that risks exposing a secret value | "[SoDamAgentic] Blocked — this could expose a secret value…" |
| ⛔ Deny | Deleting an entire folder | "[SoDamAgentic] Blocked — this would safely wipe out an entire folder…" |
| ⛔ Deny | Changing or deleting the MCP-enable / permissions / hook-path settings in `.claude/settings.json` (2026-07-27) | "[SoDamAgentic] Blocked — this changes the AI's own safety settings…" (other ordinary setting changes still just get an ask) |
| ⛔ Deny | Creating or editing `.mcp.json` (the file that actually defines MCP servers) (2026-07-27) | "[SoDamAgentic] Blocked — this file defines MCP servers that Claude Code auto-runs…" |
| ⛔ Deny (always, catastrophic) | A disk-wiping-level command, or a pattern that runs unreviewed external code straight through a shell | "[SoDamAgentic] Blocked — this is an irreversible, dangerous command…" |

> This table is copied verbatim from the actual message text in this repository's real code (`hooks/guard.mjs`) — no exaggeration, exactly how it behaves. The `[SoDamAgentic]` prefix identifies which plugin blocked something when a sibling like SoDamHarness fires its own hook at the same time.
>
> **Why `.mcp.json` matters so much:** `.mcp.json` is the file that defines which programs (MCP servers) Claude Code **automatically starts** when you open a folder. If its contents get changed without your intent, an unintended program could start automatically the next time you open this folder. That's why this file is **always blocked outright**, regardless of content — if you genuinely need to change it, open it yourself in a text editor.
> **Consistency note:** you cannot get around the above by "telling the AI to run it as a raw command" instead of asking in natural language — both paths are checked against the exact same rules.

---

<a id="uninstall"></a>
## 11. Uninstall

**Claude Code:**
1. Type `/plugin uninstall sodam-agentic` (or choose "remove" from the marketplace screen).
2. Verify: typing `/sodam-agentic` no longer shows any commands → done.

**Codex:**
- Since installation is a "file copy," just delete the SoDam-related skill folder(s) directly from your project's `.agents/skills/`.

**Leftover data (important):** the safety log file `~/.sodamagentic/safety-log.jsonl` is **not automatically deleted** when you uninstall (it lives outside the plugin folder, in your home folder). Delete it yourself if you want it fully gone. If you also used Codex, the entry registered in your project's `.codex/hooks.json` (F7) also remains after uninstall — delete the `PreToolUse` entry in that JSON directly if you want it removed.

---

<a id="troubleshooting"></a>
## 12. Troubleshooting

| Symptom (what you see) | Why (cause) | Fix |
|---|---|---|
| Installed, but nothing seems to happen | Didn't run `/init` / didn't read onboarding | Check status with `/sodam-agentic:start` |
| `/sodam-agentic` shows nothing | Not installed, or a marketplace-name typo | Reinstall: `/plugin install sodam-agentic@sodam-agentic` (must be `@sodam-agentic`, not `@sodam`) |
| "No access / permission denied" during install | No access to the private repository | Confirm your GitHub login and access rights |
| "Node not found" | Node.js isn't installed | Install Node.js 18+ per [§2](#install-programs) and retry |
| Korean text shows as `□□□` | Font rendering issue | Take a screenshot and report it (an English version is available) |
| Code gets written without a plan first | Another skill took priority (F2 is a "request," not enforced) | May be normal — just ask directly, "show me the plan first" |
| A risky command wasn't blocked | The safety hook isn't active, or auto-accept mode is on | First check whether auto-accept/bypass mode is on (§14); otherwise, screenshot and report |
| Confirmation prompts appear too often | Multiple safety layers overlap | Can be tuned to only prompt for genuinely risky things — let us know |
| Commands show the old names / install cache seems stale | The installed cache isn't up to date (`marketplace update` alone does not refresh the cache) | `/plugin uninstall sodam-agentic` → `/plugin install sodam-agentic@sodam-agentic` → `/reload-plugins` (in that exact order) |
| Can I put in a password or API key? | — | **Never do this.** Keep secrets only in your own environment (e.g. `.env`) |
| I want to remove it / it's acting weird after an update | Uninstall/update | See [§11 Uninstall](#uninstall) |
| I can't remember what got blocked last time | — | Check with `/sodam-agentic:log` (only blocks/asks are logged; safe pass-throughs aren't) |
| The Codex confirmation (ask) prompt doesn't seem to appear | Not yet confirmed live by a human (F7) | First check registration with Codex's own `/hooks` command, then let us know |

---

<a id="faq"></a>
## 13. FAQ

**Q. Is this really safe?**
A. No, it is not "100% safe." It blocks irreversible risks and asks about the rest. The human always makes the final call.

**Q. Does it cost money?**
A. The plugin itself is **free (Apache-2.0)**. However, the cost of using Claude/Codex (AI model usage fees) follows Anthropic's/OpenAI's own terms separately.

**Q. Is it just as safe in Codex as in Claude Code?**
A. **The same safety hook is registered in Codex too** (F7). Plan (F2), Review (F3), blocking, and safety history (F6) all use the same logic. However, **whether the "may I proceed?" prompt actually appears on screen in Codex has not yet been confirmed by a human** — we don't claim full parity, and we say so honestly.

**Q. Can I look back at what got blocked or asked about?**
A. Yes. Use `/sodam-agentic:log` to view recent history in plain Korean. Note that safe pass-throughs aren't logged — only blocked (deny) or asked-about (ask) items are kept. The log is stored on your computer only and never transmitted anywhere.

**Q. Can I use it without SoDamHarness?**
A. Yes. Without Harness, this plugin's "minimal safety fallback" runs in full mode. But stronger features like automatic backup/undo require Harness.

**Q. Can I use it commercially?**
A. This plugin itself is Apache-2.0, so commercial use, redistribution, and running it as a service are all allowed (subject to preserving the NOTICE file). But check each provider's own terms for the commercial conditions of using the Claude/Codex models. Details → [§15 License](#license-legal).

**Q. Do I have to install the other 5 sibling plugins too?**
A. No. This plugin works on its own with minimal safety. It becomes stronger alongside SoDamHarness → [§18 The SoDam family](#family).

**Q. Is what I ask it to do sent anywhere?**
A. This plugin itself makes no network requests ([§10](#security-data-flow)). That's separate from Claude Code/Codex itself communicating with the AI model. (Safety history (F6) isn't a transmission — it's **saved to a file on your own computer**, see above.)

**Q. Why does it always block `.mcp.json`? What if I actually want to add a real MCP server?**
A. Open the file yourself in a text editor (by hand). What this plugin blocks is only "the AI silently changing this file for you" — see [§10](#security-data-flow) for why that's risky.

---

<a id="safety-notes"></a>
## 14. Safety notes (please follow these)

- **Never put secrets** — passwords, API keys, `.env` contents — into code, documents, or chat.
- The safety net follows the rule **"block irreversible risks, ask about the rest."** It is **not "100% safe"** — the final judgment call is always yours.
- Be careful not to let the AI auto-run newly downloaded external files or tools.
- If **auto-accept/bypass-permissions** mode is on at the bottom of the screen, confirmation prompts pass through silently — use `Shift+Tab` for "ask every time" mode for safer use.
- Blocked (deny) or asked-about (ask) actions can be reviewed later with `/sodam-agentic:log` (safe pass-throughs aren't logged; stored on your computer only).

---

<a id="license-legal"></a>
## 15. License, copyright & commercial use (important — strict standard, please read)

> ⚠️ **This section is not legal advice.** It is general guidance — before any actual distribution or commercial use, please verify **at your own responsibility**, including consulting a professional (e.g. a lawyer) where appropriate. It does not guarantee "100% legal/safe."
> ⚠️ **Current release status:** this repository is currently **private** and has not been publicly released to the general public (a personal tool for the developer's own use, confirmed 2026-07-15). The terms below are **stated in advance for a future public release.**

### 15-1. Basic license information

| Item | Detail |
|---|---|
| License | **Apache License, Version 2.0** (full text: [`LICENSE`](./LICENSE)) |
| Copyright holder | **SoDam AI Studio** |
| Year | 2026 |
| Notice | Copyright/trademark notice included in [`NOTICE`](./NOTICE) |
| External runtime dependencies | **0** (uses only Node.js standard functionality — minimizes supply-chain risk; verifiable in `package.json`) |

### 15-2. What you can do / conditions to follow

| Action | Allowed | Condition |
|---|---|---|
| Modify | ✅ | Mark modified files as changed from the original |
| Copy / redistribute | ✅ | Distribute a copy of `LICENSE` and `NOTICE` alongside it |
| **Commercial use** | ✅ | Same as above |
| Sell | ✅ | Same as above |
| Run as a service (SaaS) | ✅ | Same as above |
| Educational use | ✅ | Same as above |
| Deliver to a company/client | ✅ | Same as above |
| Redistribute as closed-source | ✅ | Apache-2.0 does not force derivative works to be open-sourced (unlike GPL) |

### 15-3. Warranty & liability limitation (Apache-2.0 §7·§8, strictly applied)

This software is provided **"AS IS"** with **no warranty of any kind, express or implied** (including merchantability, fitness for a particular purpose, and non-infringement). To the maximum extent permitted by law, the copyright holder and contributors are **not liable for any damages** arising from use of this software — direct, indirect, special, or incidental (including data loss, lost business, or business interruption). Outcomes from use are **entirely your own responsibility.**

### 15-4. What you must separately verify, regardless of this plugin's license

- **AI model usage fees & terms of service:** this kit is **free (Apache-2.0)**, but **the usage fees and commercial terms for Claude (Anthropic) / Codex (OpenAI) follow each company's own terms**, entirely separate from this plugin's license.
- **The terms of any external MCP servers/APIs you connect.**
- **The license of any fonts/images/icons you add yourself** (this repository itself contains **no images, fonts, video, or audio**).

### 15-5. Third-party trademarks (strict — no implied affiliation/endorsement)

"**Claude**" and "**Claude Code**" are trademarks of **Anthropic**; "**Codex**" is a trademark of **OpenAI**. This project uses these names **only to describe compatibility**, never uses their logos without permission, and **never implies an official partnership, endorsement, or sponsorship.** "SoDam," "소담" is the name of this project (SoDam AI Studio).

### 15-6. AI-assisted development disclosure (transparency)

A significant portion of this project's code and documentation was **written with the help of an AI coding tool (Claude Code)**. The copyright/patent law surrounding AI-assisted content is still not fully settled in every jurisdiction — **if you plan to redistribute or use this commercially, please have this reviewed separately by legal counsel.** Core logic like the safety hook (F4) has been validated through repeated real-world testing (§16), but AI-written code writing does not automatically guarantee the same completeness/accuracy as human-written code — **an independent code review is strongly recommended** before production or commercial deployment.

### 15-7. No unauthorized inclusion (strict)

- This repository contains **no** third-party copyrighted works, trademarks, logos, personal data, client information, or confidential information (repeatedly confirmed via `hooks/_selftest.mjs` self-checks, result: 0 findings).
- No real personal data, real API keys, or real client information is used in any sample/dummy data.
- **No GPL/AGPL or other strong-copyleft-licensed code was intentionally borrowed** (due to the risk of triggering a source-disclosure obligation on commercial/client delivery). That said, the exact license text of any referenced open-source repositories (e.g. community resources like `anthropics/skills`) should be re-verified at the time of any public release (checklist item ⑤ below).

### 15-8. Minimum checklist before redistribution/public release

① Include the full `LICENSE` text ② Include the `NOTICE` file (preserve the copyright notice) ③ Mark modified files as changed ④ Never use "Claude/Codex/Anthropic/OpenAI" trademarks in a way that implies endorsement or partnership ⑤ Re-verify the license of any referenced external code ⑥ Get legal review on potential trademark conflicts around the product name / "agentic engineering" phrasing (not required until public release, see §17).

---

<a id="changelog"></a>
## 16. Changelog summary

<details>
<summary><b>📦 [0.1.0] — 2026-06-28 (initial release, Phase 1 MVP)</b> — click to expand</summary>

**Features added**
- F1 Onboarding — 4-step Korean-language guide (shared with Codex)
- F2 Plan First — "what / why / done-criteria" approval before code
- F3 Easy Review — plain-language change summary + delegate agent
- F4 Safety hook — minimal 4-category fallback blocking, Harness delegation, fail-closed
- F5 Install support for both tools (Claude Code + Codex)

**Docs & verification tools added**
- README (ko/en), Guide (ko/en), the family collaboration doc (`family-synergy.md`)
- Structure validator (`validate.mjs`), family health check, safety-hook self-test (`_selftest.mjs`)
- `LICENSE` (Apache-2.0), `NOTICE`

**Known limitations**
- F2/F3 are "requests," not enforced (can be preempted by other skills) — enforcement considered for Phase 2
- Codex's F4 safety was weaker than Claude Code's — later equalized under F7 (see 2026-07-15 below)

</details>

<details>
<summary><b>🔧 2026-07-07 safety hardening (patch within the same version)</b> — click to expand</summary>

- Fixed a defect where the safety fallback (F4) could stay dormant under certain conditions — now it always turns on once installed.
- Strengthened irreversible catastrophic commands to always be blocked regardless of whether the sibling plugin (SoDamHarness) is installed (defense in depth).
- Documented, in the onboarding guide, the limitation that confirmation prompts pass through silently in auto-accept mode.
- Full revision of the docs (README, GUIDE) — fixed stale guidance, added architecture/security/FAQ/uninstall sections.

</details>

<details>
<summary><b>✅ 2026-07-11 live verification + bug fixes</b> — click to expand</summary>

- **Confirmed the safety hook (F4) genuinely works on a real, live screen.** Until now it had only passed self-checks (code simulation) — this time an actually risky-looking command was attempted and visually confirmed to be blocked for real.
- Found and fixed an issue where chaining several requests together ("move this folder and then create a file") could cause a perfectly ordinary, non-risky step to be wrongly blocked as "risky."
- Unified inconsistent wording across the Codex install instructions.

</details>

<details>
<summary><b>🛡️ 2026-07-12~14 safety hardening — multiple real protection gaps found and closed via live testing + security audit completed</b> — click to expand</summary>

- Fixed a case where an extremely rare input value could cause the hook program to hang.
- Strengthened the "block writes outside the work folder" rule, which was missing in some situations.
- Brought commands that create shortcut-style links (symlink family) under review, and hardened the related path checks.
- Found and unified an inconsistency where natural-language requests and directly-specified commands were being checked at different strictness levels.
- Added a new safeguard against running unreviewed external code straight through — previously not checked at all.
- Found and unified an inconsistency where path-check coverage differed depending on which tool type was used (e.g. a file-write tool vs. a shell command).
- Re-confirmed all required items under an international security checklist (OWASP ASVS); a full-repository secret scan found 0 issues.
- Regression tests: expanded from 22 to 44, all passing.

</details>

<details>
<summary><b>✅ 2026-07-15 — F6 safety history + F7 Codex safety parity implemented</b> — click to expand</summary>

- **F6.** Every ask/deny decision is now automatically logged to `~/.sodamagentic/safety-log.jsonl`. Secret values are auto-masked before saving. View with `/sodam-agentic:log`.
- **F7.** Confirmed via official documentation that Codex CLI's actual hook schema is effectively identical to Claude Code's → rather than building new logic, extended the install process to **register that same `hooks/guard.mjs` into Codex too** (`.codex/hooks.json`, merged with any existing config).
- ⚠️ Honest limitation: whether the ask confirmation prompt actually appears in Codex has not yet been confirmed by a human.
- Regression tests: 44 → 54.

</details>

<details>
<summary><b>🔧 2026-07-16~17 — added source attribution + fixed sibling-detection false negative and a real protection gap</b> — click to expand</summary>

- Added a `[SoDamAgentic]` source tag in front of ask/deny messages (to distinguish it when a sibling plugin fires its hook at the same time).
- Fixed the diagnostic tool (`family-health.mjs`) presenting stale notes as if they were current, live facts — descriptive notes now show their write date.
- Added a new "is the install cache up to date" automatic check to the structure validator (`validate.mjs`).
- Fixed sibling plugin (SoDamHarness) detection always returning "not found" because the detection path didn't match the actual Windows cache location.
- **That fix surfaced a real protection gap:** the "block new writes outside the work folder" check that had been delegated to the sibling plugin was silently missing there in the first place → this specific check is now always performed by this plugin itself regardless of whether the sibling is present.
- Regression tests held at 54, all passing.

</details>

<details>
<summary><b>✅ 2026-07-18 — short-form slash commands completed</b> — click to expand</summary>

- Shortened long names like `/sodam-agentic:sodam-agentic-start` to `/sodam-agentic:start` (all 4 commands).
- Added `commands/plan.md` and `commands/review.md` so "Plan First" and "Review" can also be invoked **directly as commands**, in addition to auto-triggering.
- Adjusted autocomplete so it always shows the full `sodam-agentic:name` form — confirmed on a real screen.
- Verification: structure check and self-test (54 cases) both passed.

</details>

<details>
<summary><b>🚀 2026-07-26 — added F2/F3 trigger markers</b> — click to expand</summary>

- Added instructions so Plan First (F2) and Easy Review (F3) print `🚀 SoDam — Plan First` / `🔍 SoDam — Easy Review` at the top of the response whenever they actually fire, so you can tell at a glance on screen (no logic change — instruction-only addition).

</details>

<details>
<summary><b>🛡️ 2026-07-27 — 4 focused security hardening items: settings.json · marketplace name · .mcp.json (most recent)</b> — click to expand</summary>

1. **Promoted sensitive `.claude/settings.json` changes (MCP enable, permissions, hook paths) from ask to deny.** Until now, these always just triggered a confirmation prompt regardless of content — meaning the single most dangerous kind of change (one that can neutralize the AI's own safety mechanism) was defended only by a prompt that's easy to click through. Now these are blocked immediately.
2. **Also block "deleting" the same sensitive keys, not just adding them.** The prior fix only caught new additions; it missed the case of removing an existing protection — found via actual reproduction and closed.
3. **Found and fixed a marketplace name collision.** While tracing why installation itself was failing during live testing, discovered that this plugin's marketplace name (`sodam`) collided with a sibling plugin's — renamed to `sodam-agentic`, and the install command fully updated to `sodam-agentic@sodam-agentic`.
4. **Found and closed a protection gap around `.mcp.json` (the file that actually defines MCP servers).** Live testing revealed, via official documentation, that the sensitive `mcpServers` setting actually only exists in `.mcp.json` — a **completely different file** from `.claude/settings.json`. In other words, item 1's protection had been watching a location where that setting doesn't even exist, while the real file was never monitored at all. `.mcp.json` is now always blocked regardless of its content.

**Verification:** self-test cases grew from 67 → 76 → 78 → **85**, and all were re-run directly with **everything passing** (`PASS 85 / FAIL 0`). Structure validation is also clean at `PASS 13 / WARN 0 / FAIL 0` (reflecting the marketplace reinstall as well).

</details>

<details>
<summary><b>🗓️ Still planned (not yet decided whether to start)</b> — click to expand</summary>

- Promoting F2/F3 from skills to an enforced hook (guaranteeing 100% auto-trigger) — whether to start this is still undecided.

</details>

---

<a id="dev-status"></a>
## 17. Current development status (honestly)

- ✅ **Verified (confirmed by actually running it):** safety self-test **85 PASS / 0 FAIL** (`hooks/_selftest.mjs`), structure validation **PASS 13 / WARN 0 / FAIL 0** (`scripts/validate.mjs`), confirmed the install cache exactly matches the working code.
- ✅ **Code complete:** all of F1–F7 implemented, plus `.claude/settings.json` and `.mcp.json` protection.
- ✅ **Multiple rounds of live verification (2026-07-11 to 2026-07-18):** repeated testing on a real, live screen found and fixed numerous real issues (see §16), and all required items under an international security checklist (OWASP) were re-confirmed.
- ⚠️ **What still needs a human to confirm directly (stated honestly):**
  1. Whether the `.mcp.json` block actually fires immediately, with no prompt, **on a real Claude Code screen** (code and self-tests are done; only the on-screen reproduction remains)
  2. Re-confirming on a real screen that catastrophic commands like a full folder delete get blocked outright, "no questions asked"
  3. Whether the Plan First (F2) / Easy Review (F3) trigger markers (`🚀`/`🔍`) show up every time on genuinely new tasks
  4. Whether the "ask" confirmation prompt actually appears on screen in Codex (F7)
  5. (Only needed if a public release is being considered) Non-developer beta testing and final legal review around trademarks — not a required precondition right now since this is for personal use
- **Confirmed personal-use scope (2026-07-15):** this tool was built by the developer for their own real use. Item 5 above (beta/legal) is not a required condition right now, and would only become relevant again if a public release is considered later. This is stated plainly, without exaggeration.

---

<a id="family"></a>
## 18. The SoDam family (stronger together)

SoDamAgentic is the entry point of a 6-plugin family. Installing them together makes things safer and more complete (it also works alone, with minimal safety).

| Plugin | Role | Install order |
|---|---|---|
| 🛡 SoDamHarness | Safety · backup · undo | 1st (recommended) |
| 🔁 SoDamLoop | Autonomous repeat engine | 2nd |
| 🧠 SoDamContext | Documentation health check | 3rd |
| 🚀 **SoDamAgentic** | **Entry point · plan · review (this one)** | 4th |
| ✏️ SoDamPrompt | Prompt-learning web app | 5th |
| 🔍 SoDamReverse | Code/app analysis reports | 6th |

> Full collaboration spec: [docs/family-synergy.md](./docs/family-synergy.md)

---

*Document version date: 2026-07-27 · This document is written based on "features actually implemented and verified so far" (anything not confirmed by directly running it is stated honestly in §17).*
