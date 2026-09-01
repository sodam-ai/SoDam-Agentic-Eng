# SoDamAgentic (소담 에이전틱)

> A **Claude Code / Codex plugin** for beginner "vibe coders."
> It spoon-feeds you "how to make an AI work properly" (plan first → execute → review → safety) in plain language.
> **This single document covers everything from installation to troubleshooting and licensing.** It's written so that someone who has never used AI, a computer, or a smartphone before can follow along.
>
> 🇰🇷 한국어 버전: [README.md](./README.md) (identical content, identical order)

> ⚠️ **Current status (honestly stated):** Phase 1 (MVP, F1–F5) and Phase 2 (F6 safety log, F7 Codex safety parity) are code-complete. All three Phase 3 entry gates (items that require a human's real, live confirmation) have now passed as of 2026-08-20 — Gate 1 was initially **started ahead of formal closure**, with the developer explicitly approving F8's start before the gate closed (we keep this history exactly as it happened, below), but it has since closed for real once the F2/F3 on-screen banners were actually confirmed live. **F8 (Easy Mode)** has been built out to the scope the developer specified, and further expansion has been **deliberately paused** since then (as of `v0.2.2`) — continuing without real usage evidence was judged as over-engineering. We're now waiting on real-world usage feedback. A few other items are still "code and automated tests pass, only a human's live on-screen confirmation remains." We do not overstate this — see the most recent entry in [§8 Update Summary](#changelog) for the honest, current state.
> 🔧 2026-09-01 safety review round (v0.2.5–v0.2.8): During live testing, we found and fixed 4 new defects in the safety hook itself — one of them (key-exposure scanning was completely missing for Jupyter notebook edits) was the most severe found so far. All were reproduced, fixed, and re-verified with automated tests before being committed. See the latest entry in [§8 Update Summary](#changelog) for details.
> ⚠️ **This GitHub repository is PUBLIC.** That said, it is still a personal tool the developer built for their own use, and it is not offered as a formally supported release for the general public. The license terms below (Apache-2.0) reflect this public status as it actually stands.

---

> 🌸 One of the seven siblings of [SoDam Family](https://github.com/sodam-ai/SoDam-Family).

<a id="toc"></a>
## Table of Contents

1. [Project Introduction](#intro)
2. [Prerequisites](#prerequisites)
3. [Required Programs / How to Download](#install-programs)
4. [Quick Start (5-Minute Golden Path)](#quickstart)
5. [Installation](#install-detail)
6. [How to Run / Use / How It Works](#usage)
7. [Command List](#commands)
8. [Update Summary](#changelog)
9. [File / Document Locations](#file-locations)
10. [Workflow](#workflow)
11. [Architecture](#architecture)
12. [Security · Data Flow](#security-data-flow)
13. [Troubleshooting](#troubleshooting)
14. [FAQ](#faq)
15. [Legal · Copyright · License · Commercial Use](#license-legal)
16. [Uninstall](#uninstall)
17. [Contributing / Contact](#contribute)
18. [Recommended MCPs (Optional, Reference)](#recommended-mcp)

---

<a id="intro"></a>
## 1. Project Introduction

**SoDamAgentic** is a Claude Code (or Codex) **plugin** (= an add-on component that gives an AI program extra capabilities) that spoon-feeds you "how to make an AI work properly," in plain Korean by default (this document is the English mirror). When you ask for new work, it does not jump straight to writing code. Instead, it first shows you **① what will be built ② why ③ what "done" looks like** and asks for your approval (plan first); once the work is finished, it summarizes **what changed, why, and whether there is any risk** in plain language (change review); and it automatically blocks or asks for confirmation on dangerous commands or secret-exposure attempts (the safety hook).

Think of it this way: **the AI is a machine in a factory, and you are the person designing that factory.** Instead of just telling the machine "figure it out," you first decide what to build, why, and how far to go; you review what the machine did; and risky actions are filtered out automatically.

**Audience:** **non-developers and "vibe coders"** who have never coded but want to ask an AI in natural language to build something. Technical terms are explained in parentheses the moment they appear.

---

<a id="prerequisites"></a>
## 2. Prerequisites (you need these for it to work)

| Requirement | Why it's needed | Required / Optional |
|---|---|---|
| **Node.js 18 or newer** | The safety hook runs on this. Without it, the safety feature itself doesn't turn on | **Required** |
| **Claude Code** (or Codex) | The program SoDam gets installed into | **Required** (one of the two) |
| **A GitHub account** | SoDam is fetched from GitHub (an online code warehouse). The repository is **public**, so anyone can install it without special access rights | **Optional** |
| **git** (command-line tool) | Only needed for the **Codex** install path — Codex installation works by `git clone`-ing the whole repository and then running the install script. **The Claude Code marketplace install does not need git** | **Required (Codex install only)** |
| **Internet connection** | Needed while installing (after installation, the plugin itself sends no network requests — see [§12](#security-data-flow)) | **Required (install time only)** |

> 💡 **How to check:** type `node -v` in a terminal (a black window) → if a version number `v18.` or higher appears, you're good.

---

<a id="install-programs"></a>
## 3. Required Programs / How to Download

### 3-1. Download and install Node.js
1. Go to the official site https://nodejs.org → click the green **"LTS"** button to download it.
2. Double-click the downloaded installer → "Next → Next → Install" (the defaults are fine).
3. Restarting your computer once after installing is a good idea.
4. Verify: type `node -v` in a terminal → if a version number appears, you're done.

### 3-2. Download and prepare Claude Code
- If you're already using Claude Code, skip this (this very conversation may already be Claude Code).
- If this is your first time, follow the official guide (https://code.claude.com). Node.js must be installed first.

### 3-3. If you use Codex
- Install the Codex CLI itself by following OpenAI's official guide. This plugin adds its skills **after** Codex is already installed → see [§5 Installation (Codex)](#install-detail).

---

<a id="quickstart"></a>
## 4. Quick Start (5-Minute Golden Path)

1. **Install** — paste this into the Claude Code input box and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   /plugin install sodam-agentic@sodam-agentic
   ```
2. **Start** — type `/sodam-agentic:start` → a Korean onboarding guide appears.
3. **Ask for something** — ask in natural language, e.g. "make me XYZ" → a **plan** appears first; approve it with "yes/go ahead" → once the work is done, check the **review summary**.

→ That's it — you get a "this works" experience in about **5 minutes**. You don't need to run any diagnostic commands first; just asking is the first step.

---

<a id="install-detail"></a>
## 5. Installation

> ⚠️ This repository is currently **public**. The commands below succeed without any special access rights.

### 5-1. Claude Code — Installation
1. Register the marketplace (the plugin "store") — paste this and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
   → success looks like an "added" style message.
2. Install:
   ```
   /plugin install sodam-agentic@sodam-agentic
   ```
   → success looks like "installed."
   > ⚠️ **Type the marketplace name exactly.** It must be `sodam-agentic@sodam-agentic`. The marketplace name must exactly match the `name` field in `.claude-plugin/marketplace.json` (shortening it to `@sodam` will fail).
3. Verify: type just `/sodam-agentic:` → if 5 commands (`start`, `plan`, `review`, `log`, `f8-easy`) show up as autocomplete suggestions, you're done.

**(For local testing)** You can also register with a local folder path instead of an internet address:
```
/plugin marketplace add D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam-agentic
```

### 5-2. Codex — Installation
1. Clone this repository:
   ```
   git clone https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
2. Run the install script **from inside your project folder** (adjust the path to where you cloned it):
   ```
   node C:\path\to\SoDam-Agentic-Eng\codex\install.mjs
   ```
   > ⚠️ **Watch your folder.** You must `cd` into the project folder you want to work in **before** running the command above. The install script creates `.agents/` and `.codex/` based on "the folder you ran the command from" (current working directory). If you run it from the wrong folder, the skills and safety hooks get installed there instead.
3. Done: skills get copied into your project's `.agents/skills/`, `AGENTS.md` gets copied to your project root (only if it doesn't already exist there), the safety hook (`hooks/guard.mjs` + `hooks/delegate.mjs`) and rule data (`data/agentic-rules.json`) get copied into `.agents/hooks/` and `.agents/data/`, and a `PreToolUse` entry is automatically registered in `.codex/hooks.json` (merged with any existing file, no duplicate registration).

> ⚠️ **The same safety hook (F4) and safety log (F6) are registered in Codex too.** The plan (F2) and review (F3) skills work the same way. However, **whether the confirmation ("ask") prompt actually appears on screen in Codex has not yet been confirmed live by a human** — details: [§12 Security · Data Flow](#security-data-flow), and the most recent entry in [§8 Update Summary](#changelog).

---

<a id="usage"></a>
## 6. How to Run / Use / How It Works

**The simplest way to use it (try this first):**
1. Type `/sodam-agentic:start` → read through the "4 steps to make an AI work properly" onboarding once.
2. **Just ask in natural language.** For example: "make me a notepad webpage." You don't need to run diagnostic commands first — just asking comes first.
3. Before writing code, the AI shows you a plan (① what ② why ③ definition of done) — read it and approve with **"yes" / "go ahead."**
4. Once the work is finished, read the "what changed, why, and any risk?" summary and make the final call yourself.

**One easy-to-miss step (recommended):**
- Running `/init` once helps the AI better understand your current folder (project). This is the step beginners skip most often.

**Still don't understand (F8):**
- Say "this is too hard to understand" and a simpler explanation (F8, Easy Mode) appears automatically. To call it directly, use `/sodam-agentic:f8-easy`. Only the explanations get simpler — the safety steps (F2, F3, F4) work exactly the same regardless of this mode — see [§14 FAQ](#faq).

**What happens automatically behind the scenes (nothing you need to do):**
- Every single time the AI tries to write a file or run a command, SoDam's safety hook steps in first to decide whether it's safe, needs confirmation, or should be blocked (see the "decision flow" in [§11 Architecture](#architecture)). This always runs automatically without any action from you.

---

<a id="commands"></a>
## 7. Command List

| Command | When to use it |
|---|---|
| `/sodam-agentic:start` | First time starting — onboarding (4-step guide) + a safety status check |
| `/sodam-agentic:plan` | When you want to see the "plan first" feature again right now (normally it triggers automatically on a new task request) |
| `/sodam-agentic:review` | When you want to see the "change review" again right now (normally it triggers automatically right after files change) |
| `/sodam-agentic:log` | To check the record of what the safety system has blocked (deny) or asked about (ask) (F6) |
| `/sodam-agentic:f8-easy` | When you need an even simpler explanation than the F1 onboarding, e.g. "this is too hard to understand" (F8, also auto-triggers from natural language) |

> The format is `/plugin-name:command`. Opening a new chat and typing just `/sodam-agentic:` will list all 5 commands.

---

<a id="changelog"></a>
## 8. Update Summary

> The following is a date-by-date summary of the actual history in `CHANGELOG.md` (newest first). Click each entry to expand it.

<details open>
<summary><b>🔴 2026-09-01 — 4 safety-hook defects found and fixed during live testing (v0.2.5–v0.2.8)</b></summary>

While repeatedly testing whether the implemented features actually work correctly from several angles, we found and fixed 4 new defects in the safety hook itself. None of them were "not blocked at all" from the start — each was "missed only in a specific situation" — and each was handled in order: reproduce → root-cause → fix → re-verify with automated tests.

- **v0.2.5 — Catastrophic-command ordering defect**: An irreversible command like `rm -rf ~` would get downgraded to a weaker confirmation (ask) step whenever its target also happened to be "outside the working folder." Found and fixed.
- **v0.2.6 — Windows destructive-command ordering defect**: Windows commands that wipe an entire folder or drive (`Remove-Item`, `del`, `erase`, `rd`) were missed whenever written in a common real-world order (flags placed after the path). Found and fixed.
- **v0.2.7 — Two defects: key exposure and symlink creation**: The rule blocking secret keys from being printed to the screen missed the most common way developers actually write that code; the rule blocking symbolic-link creation missed a combined short flag (force + symbolic together). Both found and fixed.
- **v0.2.8 — Key-exposure check completely missing for Jupyter notebooks (most severe)**: The 3 defects above were cases of "protection getting weaker." This one was different — **the protection didn't run at all.** Writing an API key directly into a Jupyter notebook (.ipynb) cell edit went through completely unfiltered. We pinpointed the exact cause (a mismatched field name for the cell content) by cross-checking Claude Code's own official tool schema, and fixed it.
- **Verification**: All 4 were reproduced before the fix, then confirmed fixed with automated tests after (138 tests, all passing, 0 failures at the end), and we re-checked that unrelated features weren't affected.

</details>

<details>
<summary><b>📄 2026-08-21 — Remaining F8 answers · third-party license audit · safety-warning gap fixed (v0.2.1–v0.2.4)</b></summary>

- **Closed the last internal gaps in F8 (Easy Mode)**: Section 2 offers the user 3 choices ("I don't know how to phrase it," "I don't understand what's on screen," "I'm scared of breaking something") — the remaining ones without answers were filled in. Afterward, we deliberately decided to stop expanding F8 ("stop here instead of adding more") — expanding without concrete evidence was judged as over-engineering.
- **Audited the licenses of borrowed open-source references**: Internal research notes had marked 4 reference repositories (anthropics/skills, wshobson/agents, OpenHarness, claude-code-harness) as "directly imported" / "copy-pasted." We looked up their actual licenses directly via the `gh` CLI. 3 are MIT (zero GPL/AGPL contamination confirmed); anthropics/skills has no LICENSE file at all. Added a new [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) with the original copyright notices for the 3 MIT repos.
- **Found and fixed a missing safety warning in `commands/start.md`**: `skills/start/SKILL.md` (the natural-language auto-trigger path) had a warning paragraph about auto-accept/bypass mode silently passing safety confirmations — but the paragraph was missing from the direct `/sodam-agentic:start` command path (`commands/start.md`). Added it.
- **Verification**: after every change, re-confirmed 126 PASS/0 FAIL on the automated test suite and PASS 14/WARN 1/FAIL 0 on the structure validator, and only kept a change once no regression was found.

</details>

<details>
<summary><b>🆕 2026-08-13~15 — Redefined Gate 1, corrected the "primary user" record, and started F8 (Easy Mode) v1</b></summary>

- **Gate 1 redefined:** item ④ (confirming live that the "ask" prompt appears in Codex) was reclassified as "conditionally deferred until Codex is actually being used" (right now usage is 100% Claude Code, so an unverified Codex path carries no real exposure). Gate 1 now effectively comes down to a single remaining item — ③ (a live confirmation of the F2/F3 on-screen banners) — which is still unconfirmed.
- **"Primary user" record corrected:** an earlier note said "a few close friends are already using it heavily," which the developer personally corrected to "the primary — and effectively only — user is me." The plan to close Gate 1 item ③ by "asking a friend to confirm" was withdrawn, reverting to the original method (the developer observing it directly during their own normal use).
- **F8 (Easy Mode) v1 started:** added `/sodam-agentic:f8-easy` — an **extra explanation layer**, one step simpler than the F1 onboarding, that re-explains "the 4 steps to make an AI work properly" using an even easier analogy. It does not replace or skip safety steps like plan-first (F2) or review (F3). This feature was originally supposed to wait until Gate 1 closed, but **the developer explicitly approved starting it now**, ahead of the gate closing.
- **Made the safety code structurally unaware of F8:** `hooks/guard.mjs` and `hooks/delegate.mjs` (the code that actually blocks real danger) contain **not a single line** related to F8. Instead of "toggling a setting and checking the result," an automated test directly scans both files' source code to confirm no F8-related wording exists in them at all — since the safety code doesn't even know F8 exists, turning F8 on or off cannot affect the safety level.
- **Tested unusual/invalid inputs:** fed the safety hook six kinds of malformed input directly — broken data, missing fields, a 50,000-character command string, and more. All of them were handled safely with no crashes (genuinely dangerous content was still caught correctly no matter how long it was, and everything else safely passed through).
- **Verification:** all 100 automated tests passed (0 failures). Directly diffed the safety files (`hooks/guard.mjs`, `hooks/delegate.mjs`, `hooks/hooks.json`) and confirmed **not one character changed** as a result of this work.

</details>

<details>
<summary><b>🔍 2026-08-04 — Current status check (Phase 3 entry-gate status, no code change)</b></summary>

Based on `CHECKPOINT.md` (internal development notes), here is the honest, current status of Gate 1 (5 items requiring a human's actual live confirmation) that must pass before Phase 3 (a beginner-friendly mode, MCP curation) can start:

- ① Automatic blocking of `.mcp.json` — **confirmed** (reproduced live twice on 2026-08-04, also confirmed in the safety log).
- ② Blocking a full-folder deletion — already confirmed by automated tests (local self-test), but a human actually asking "delete it" and watching it happen on screen is **still not confirmed** (the AI often second-guesses itself and asks before even attempting the tool call, so the actual blocking code in the hook rarely gets the chance to run).
- ③ On-screen banners for plan-first (F2) / change-review (F3) (`🚀`/`🔍`) — attempted in multiple sessions, but **still never once observed** (most likely because skills are "requests" that can't be force-triggered — a platform limitation).
- ④ Whether the confirmation ("ask") prompt actually appears in Codex — this only matters if you use Codex, and it **hasn't been attempted yet**.
- ⑤ A stale state file belonging to a sibling plugin (SoDamLoop) — a file on this machine has sat in a "running" state for over 5 weeks, and there's a possibility it's related to self-protection guards on editing safety files; it hasn't been cleaned up yet (a human needs to do this directly).

**Summary:** the safety features themselves (code, automated tests) keep working correctly, but 4 of the above 5 items still need a human to actually watch them happen on screen. This does not mean the safety system isn't actually blocking things — it means **the confirmation process itself isn't finished yet.**

</details>

<details>
<summary><b>🛠 2026-08-03 — Investigated a safety-log (F6) omission bug and added retry logic</b></summary>

- During real-world use, a `.mcp.json` block (deny) correctly appeared on screen, but that moment was missing from the safety log file (`safety-log.jsonl`). The leading suspect (not fully proven, but plausible): a Windows file-lock conflict caused by multiple sibling SoDam projects trying to write to the same shared log file at the same time.
- Added a short retry (up to 3 attempts, 20ms each) to the logging function in `hooks/guard.mjs` to absorb temporary contention. If it still fails, it silently gives up as before — **a logging failure never affects the actual block/ask decision itself** (this is purely an audit-trail issue, not a flaw in the safety feature).
- Confirmed no regressions via the local self-test (`hooks/_selftest.mjs`): **98 PASS / 0 FAIL**.
- Clarified the "try a dangerous command live" test wording in `LIVE_TEST_GUIDE.md` to explicitly say "don't ask me, just run it" (because the AI sometimes second-guesses itself, which meant the actual blocking code in the hook never got exercised).

</details>

<details>
<summary><b>🧪 2026-08-03 — First real-world live test results</b></summary>

- Ran a comprehensive test on the actual usage screen for the first time. Confirmed that both the `.mcp.json` block (deny) and the outside-workdir write confirmation (ask) work correctly in practice.
- An interesting finding: the AI incorrectly self-reported that "the confirmation prompt didn't show up this time," but cross-checking the actual log file showed the confirmation prompt had, in fact, appeared normally (confirmation prompts are on-screen popups, so even the AI itself can't always see them from the chat transcript text alone).
- The full-folder-delete block and the settings-file block still couldn't be reached this time either, because the AI second-guessed itself and asked before even attempting the dangerous command.

</details>

<details>
<summary><b>🔐 2026-08-02 — Attempted a safe migration of the safety log to the official permanent data path</b></summary>

- Worked on moving the safety log (`safety-log.jsonl`) from the old `~/.sodamagentic` location to Claude Code's official plugin data path (`${CLAUDE_PLUGIN_DATA}`). Using this path means data survives updates/reinstalls, and gets automatically cleaned up when the plugin is fully removed.
- **Designed with zero regression risk:** if the new path is actually passed in, it's used; if it's missing or looks wrong (e.g., in Codex), it falls back to the old `~/.sodamagentic` exactly as before. Worst case, behavior stays identical to today.
- ⚠️ **Honest limitation:** whether this new path is actually substituted correctly as a literal string in the real installed environment had not been confirmed live as of this patch. Recent checks suggest it's still writing to the old location (`~/.sodamagentic`), and which location is actually in use needs to be re-checked after a reinstall.

</details>

<details>
<summary><b>🔴 2026-08-02 — Found and fixed a hidden flaw in Codex safety parity (security)</b></summary>

- Found an actual flaw in the Codex-side safety feature that had been marked "complete": if the sibling Claude Code plugin (SoDamHarness) is installed on the same machine, this plugin would wrongly conclude "the sibling is alive" even while running under Codex, and hand off some protections (like sensitive-path checks) to that sibling — but the Codex install script never actually registers that sibling's hooks with Codex, so nobody was actually receiving that handoff. It was a "delegation into thin air."
- Fixed `hooks/guard.mjs` to detect, from its own file path, whether it's running as the Codex-deployed copy — if so, it never delegates to a sibling and **always uses the full safety fallback** (this detection logic is called `IS_CODEX_DEPLOY` in the code).
- Added 3 regression tests that reproduce this flaw; local self-test confirmed 95 PASS.

</details>

<details>
<summary><b>🔐 2026-08-02 — Expanded protected settings.json keys to 11 (security)</b></summary>

- Re-cross-checked official documentation and expanded the list of "sensitive" `.claude/settings.json` items that get an immediate block (deny) rather than just a confirmation (ask), from 4 (`mcpServers`, `enableAllProjectMcpServers`, `permissions`, `hooks`) to **11**. New additions: `enabledMcpjsonServers`, `disabledMcpjsonServers`, `enabledMcpServers`, `disabledMcpServers` (related to auto-approving MCP servers), `disableAllHooks` (a single switch that turns off all safety hooks), `env` (environment variables that could secretly redirect AI network traffic), and `apiKeyHelper` (a setting that could change how authentication works).
- Local self-test confirmed no regressions: 92 PASS.

</details>

<details>
<summary><b>🛡 2026-07-27 — 4 focused security hardening changes: settings.json · marketplace name · .mcp.json</b></summary>

1. Upgraded sensitive changes to `.claude/settings.json` (4 items at the time) from confirmation (ask) to an immediate block (deny). Until then, a confirmation prompt appeared regardless of content — meaning the most dangerous kind of change, one that could disable the AI's own safety mechanisms, was only being defended by a single confirmation prompt.
2. Extended the block to also cover **deleting** those same sensitive items (not just adding them) — deleting an existing protection is just as dangerous as adding a malicious one.
3. **Discovered and fixed a marketplace name collision.** While tracing why installation itself was failing during real-world testing, found that this plugin's marketplace name (`sodam`) collided with a sibling plugin's name — changed it to `sodam-agentic` (the install command in this document is the result).
4. **Discovered and fixed a protection gap around `.mcp.json`** (the file that actually defines MCP servers to run). Confirmed via official documentation that the sensitive setting `mcpServers` actually lives only in `.mcp.json`, a **completely different file** from `.claude/settings.json`. In other words, item 1's protection had been watching a location where that setting didn't even exist — now `.mcp.json` is always blocked regardless of content.

The local self-test suite grew from 67 to 85 tests, all passing.

</details>

<details>
<summary><b>🚀 2026-07-26 — Added on-screen banners for plan/review activation</b></summary>

- So that it's obvious from the screen whether plan-first (F2) / change-review (F3) actually triggered, added instructions to the skill files to print `🚀 소담 — 계획 먼저` / `🔍 소담 — 변경점 검토` at the top of the response when they activate (no logic changes — just added instructions to the documents).

</details>

<details>
<summary><b>✅ 2026-07-18 — Switched to short slash commands + fixed a sibling-detection path bug</b></summary>

- Shortened long names like `/sodam-agentic:sodam-agentic-start` to today's `/sodam-agentic:start` (all 4 commands).
- Added `commands/plan.md` and `commands/review.md` so the "plan first" and "review" features can also be called **directly**, in addition to auto-triggering.
- Fixed a false negative where the sibling-plugin detection logic didn't match the actual Windows Claude Code install path; while fixing that, also discovered and closed a real protection gap where "confirm writes outside the working folder" had silently stopped working once delegation to the (mismatched) sibling was enabled. That check now always runs on its own regardless of whether a sibling is present.

</details>

<details>
<summary><b>🔧 2026-07-16~17 — Added a source label + hardened against sibling-plugin conflicts</b></summary>

- Added a `[소담 에이전틱]` source label in front of every confirmation (ask) / block (deny) message. If installed alongside a sibling plugin (SoDamHarness), safety messages could appear from either one at the same time — this label lets users tell them apart at a glance.
- Fixed a diagnostic tool (`family-health.mjs`) that was displaying old notes as if they were live, real-time facts.

</details>

<details>
<summary><b>✅ 2026-07-15 — Implemented F6 safety logging + F7 Codex safety parity</b></summary>

- **F6.** Added automatic logging to a safety-log file every time the safety hook makes a confirm (ask) or block (deny) decision. Secret values are automatically masked before being saved. Viewable via `/sodam-agentic:log`.
- **F7.** After confirming via official documentation that Codex CLI's actual hook schema is effectively identical to Claude Code's, extended the install process to **register the exact same safety hook (`hooks/guard.mjs`) in Codex too**, rather than building new logic from scratch.
- The local self-test suite grew from 44 to 54 tests.

</details>

<details>
<summary><b>🛡 2026-07-12~14 — Found and closed several real protection gaps via live testing</b></summary>

- Fixed cases where the "block writes outside the working folder" rule was missing in certain situations.
- Started catching commands that create shortcuts (symbolic links / junctions), and hardened path checks to detect links even in the middle of a path.
- Added a new safeguard against patterns that download and immediately execute unverified external code (e.g., `curl | bash`) — a gap that had never been checked before.
- Found and fixed an inconsistency where path checks were applied differently depending on the tool type (file-writing tool vs. shell command).
- Regression tests grew from 22 to 44, all passing.

</details>

<details>
<summary><b>✅ 2026-07-11 — First live confirmation that the safety hook actually works on the real usage screen</b></summary>

- For the first time, went beyond code simulation (self-tests) and actually tried dangerous-looking commands on the real usage screen to visually confirm they were truly blocked.
- Found and fixed a false-positive bug where chaining several commands together would cause perfectly ordinary, non-dangerous commands to get wrongly blocked as "dangerous."

</details>

<details>
<summary><b>🔧 2026-07-07 — Made the safety fallback always-on + a full documentation rewrite</b></summary>

- Found and fixed a flaw where the safety fallback (F4) could stay dormant under certain conditions — now it's always on once installed.
- Hardened irreversible, catastrophic commands to always be blocked regardless of whether the sibling plugin (SoDamHarness) is installed (defense in depth).
- Documented, in the onboarding guide, the limitation that confirmation prompts get silently passed through in auto-approve mode.

</details>

<details>
<summary><b>📦 [0.1.0] — 2026-06-28 (initial release, Phase 1 MVP)</b></summary>

- **F1** Korean onboarding (`/sodam-agentic:start`) — a 4-step guide: plan → execute → review → safety.
- **F2** Plan-first skill — explicit approval of what/why/definition-of-done before any code is written.
- **F3** Plain-language change-review skill + a delegate agent (`easy-reviewer`).
- **F4** Safety hook — 4 minimal fallback block categories, delegation to Harness, fail-closed.
- **F5** Support for installing on both tools (Claude Code + Codex).
- Added `LICENSE` (Apache-2.0) and `NOTICE`.

**Known limitations (at the time):** F2/F3 skills were "requests" that couldn't be enforced; F4 safety was weaker on Codex than on Claude Code (later closed by F7).

</details>

---

<a id="file-locations"></a>
## 9. File · Document Locations

**Development folder (source):** `D:\AI_Dev_Work\2026y\26y_06m_26d_SoDam-Agentic-Eng`
**GitHub (online):** https://github.com/sodam-ai/SoDam-Agentic-Eng (public)

| What | Location |
|---|---|
| Plugin manifest files | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| Onboarding command | `commands/start.md` (`/sodam-agentic:start`) |
| Plan/review/log commands | `commands/plan.md`, `commands/review.md`, `commands/log.md` |
| Auto-triggering skills | `skills/start/SKILL.md`, `skills/plan/SKILL.md`, `skills/review/SKILL.md` |
| Easy Mode (F8) | `skills/f8-easy/SKILL.md` (auto-trigger), `commands/f8-easy.md` (manual `/sodam-agentic:f8-easy`) |
| Read-only review helper agent | `agents/easy-reviewer.md` |
| Safety hook | `hooks/hooks.json` (wiring), `hooks/guard.mjs` (decision logic), `hooks/delegate.mjs` (sibling detection) |
| Safety rules (data) | `data/agentic-rules.json` |
| Structure-check tools | `scripts/validate.mjs`, `scripts/family-health.mjs` |
| Codex installer | `codex/install.mjs` |
| Shared AI instructions | `AGENTS.md` (shared by Claude Code and Codex), `CLAUDE.md` (pointer) |
| Sibling-family collaboration doc | `docs/family-synergy.md` |
| Live-test procedure guide | `LIVE_TEST_GUIDE.md` |
| Legal documents | `LICENSE` (Apache-2.0 full text), `NOTICE` (copyright notice), `THIRD_PARTY_NOTICES.md` (attribution for referenced open-source repos) |
| Change history (source) | `CHANGELOG.md` |
| **Safety log file (on your computer, F6)** | `~/.sodamagentic/safety-log.jsonl` (on Windows: `C:\Users\<you>\.sodamagentic\safety-log.jsonl`) — this is the **currently confirmed, actually-used location**. Code that moves this to the official permanent data path (`${CLAUDE_PLUGIN_DATA}`, documented as `~/.claude/plugins/data/sodam-agentic/safety-log.jsonl`) is already in place, but **whether that path is actually active has not been confirmed live yet** — `/sodam-agentic:log` checks both locations |
| **Codex hook registration file** | `.codex/hooks.json` inside your project (auto-created/merged during install) |
| Where Claude Code stores the installed plugin | `C:\Users\<you>\AppData\Roaming\claude-code\plugins\` |

---

<a id="workflow"></a>
## 10. Workflow

**Analogy:** the AI is a machine in a factory, and you are **the person designing that factory.** The review step is like a **construction inspector** checking a finished building.

```
[Start] /sodam-agentic:start  →  confirm safety is on + 4-step guide
   │
   ▼
[Plan first]  "make me X"  →  AI presents a plan (what/why/definition of done)  →  you approve with "yes/go ahead"
   │
   ▼
[Execute]  AI does the work  ──(if a risky action is attempted)──▶  [Safety]  auto block or confirm
   │
   ▼
[Review]  what/why/any risk?  summary  →  you make the final call  →  done
```

Core principle: **the AI doesn't just "figure it out on its own" — you sit in the driver's seat.**

> **How to tell it activated:** when plan-first (F2) actually runs, `🚀 소담 — 계획 먼저` appears at the top of the response; when change-review (F3) runs, `🔍 소담 — 변경점 검토` appears. If you don't see this text (sometimes another skill takes priority and the auto-trigger doesn't fire), just ask directly: "show me the plan first" / "review the changes."

---

<a id="architecture"></a>
## 11. Architecture

This plugin is a **purely local tool with no server, no database, and no login.** Within the SoDam family of 6 sibling plugins (SoDamHarness · SoDamLoop · SoDamContext · **SoDamAgentic** · SoDamPrompt · SoDamReverse), it plays the **entry-point role (plan and review)** — general safety/backup belongs to SoDamHarness, and repeated/autonomous work belongs to SoDamLoop; this plugin does not duplicate those areas, and instead collaborates by "delegating when a sibling is present."

| Component | File | Role |
|---|---|---|
| Manifest | `.claude-plugin/plugin.json`, `marketplace.json` | Tells Claude Code "this folder is a plugin" |
| Onboarding (F1) | `commands/start.md`, `skills/start/SKILL.md` | `/sodam-agentic:start` — the 4-step guide |
| Plan/review (F2·F3) | `skills/plan/`, `skills/review/` (auto-trigger) + `commands/plan.md`, `commands/review.md` (manual call) | Auto-triggers on a new task request / on completed changes, and can also be called directly |
| Easy Mode (F8) | `skills/f8-easy/SKILL.md` (auto) + `commands/f8-easy.md` (manual) | One step simpler than F1's explanations. Designed to never reference `guard.mjs`/`delegate.mjs` at all (enforced by an automated source-word scan of both files) — never replaces or skips the F2/F3 safety steps |
| Review helper agent | `agents/easy-reviewer.md` | A **read-only** sub-agent (only uses `Read`, `Grep`, `Glob`) that F3 delegates to when there are many changes |
| Safety hook (F4) | `hooks/hooks.json` (wiring) + `hooks/guard.mjs` (decision logic) + `hooks/delegate.mjs` (sibling detection) | Always intervenes **right before** Bash, PowerShell, Write, Edit, MultiEdit, or NotebookEdit run |
| Safety rule data | `data/agentic-rules.json` | Adjustable rule values (dangerous patterns, when to skip planning, etc.) with no code changes needed |
| Safety log (F6) | Inside `decide()` in `hooks/guard.mjs` + `commands/log.md` | Logs every confirm (ask) / block (deny) decision to a log file, queryable via a command |
| Codex support (F5·F7) | `codex/install.mjs` | A separate installer for Codex (which has no marketplace) — copies skills/hooks as files, reusing the same `guard.mjs` instead of building new safety logic |
| Shared AI instructions | `AGENTS.md`, `CLAUDE.md` | Rule files read by both Claude Code and Codex |

### Safety hook (F4) decision flow

```
The moment Claude Code is about to run a tool (Bash, PowerShell, Write, Edit, etc.)
        │
        ▼
   hooks/guard.mjs decides first (PreToolUse = "right before execution")
        │
        ├─ Safe          → just proceed (not even logged)
        ├─ Needs confirm (ask)  → "are you sure you want to proceed?"
        ├─ Risky (deny)   → "blocked" (if the sibling SoDamHarness is alive, overlapping items are delegated)
        └─ Catastrophic   → "blocked" (always self-enforced, **regardless** of whether a sibling is present)
```

- `isHarnessAlive()` in `hooks/delegate.mjs` checks whether the sibling plugin **SoDamHarness** exists (checking 3 conditions: install location, minimum version, and a health check).
- If Harness is alive, "overlapping" risks (writes to sensitive paths, symlink bypasses, etc.) are handed off to Harness so a confirmation prompt doesn't appear twice.
- **However, irreversible catastrophic commands, `.mcp.json`, the outside-workdir-write confirmation, and `.claude/settings.json` checks are always performed by this plugin itself, regardless of whether Harness is installed** — a second layer of defense in case a sibling is absent or lacks that particular protection.
- **When running under Codex, delegation to a sibling never happens at all.** `guard.mjs` detects, from its own file path (`.agents/hooks/guard.mjs`), whether it is the Codex-deployed copy — if so, it always uses the full fallback even if a sibling is detected, because the Codex installer doesn't register that sibling's hooks with Codex, so there'd be nobody to actually receive the delegation.

---

<a id="security-data-flow"></a>
## 12. Security · Data Flow

- **What this plugin reads:** only the tool name and arguments that Claude Code (or Codex) is about to execute (the command string to run, or the file path/content it's about to write). This is passed to the hook via standard input (stdin). It does not otherwise inspect file contents or the full conversation.
- **What this plugin never does:** send its own network requests (to any external server) · store or log API keys/passwords/tokens · automatically execute external code · use `eval` or dynamic code execution. (Self-security self-check result: 0 findings.)

### The 4 safety fallback categories (F4) — what guard.mjs always checks

| # | What it checks | When it's dangerous | When it's ambiguous |
|---|---|---|---|
| ① | Dangerous/catastrophic commands (deleting an entire folder, `format`, fork bombs, writing directly to a disk device, patterns that immediately execute unverified external code, etc.) | **Blocked (deny)** — catastrophic-level ones are always blocked regardless of whether a sibling is present | Relatively lighter risks, like deleting a single file, get a **confirmation (ask)** |
| ② | Secret/API key exposure (`sk-ant-...`-style patterns, commands that exfiltrate `.env`, tampering with `ANTHROPIC_BASE_URL`, `echo $KEY`-style patterns) | **Blocked (deny)** | Just reading `.env` to the screen (e.g. `cat .env`) gets a **confirmation (ask)** |
| ③ | Sensitive locations outside the working folder (the user's home folder itself, `~/.ssh`, `~/.aws`, `~/.claude`, `~/.codex`, `~/.gnupg`, `~/.config`, system folders like `C:\Windows` or `C:\Program Files`, a drive root, or a symbolic link/junction anywhere along the path) | **Blocked (deny)** | Any other write outside the working folder (even to a non-sensitive location) **always gets a confirmation (ask)** |
| ④ | Sensitive keys in `.claude/settings.json` / `settings.local.json` (11 total: `mcpServers`, `enableAllProjectMcpServers`, `permissions`, `hooks`, `enabledMcpjsonServers`, `disabledMcpjsonServers`, `enabledMcpServers`, `disabledMcpServers`, `disableAllHooks`, `env`, `apiKeyHelper`) being added, edited, or **deleted** | **Blocked (deny)** | Any other, non-sensitive settings change (e.g. changing the model name) gets a **confirmation (ask)** |

**+ Always blocked separately:** `.mcp.json` (the file that defines which MCP servers Claude Code will automatically run when it opens a folder) is **always blocked entirely, regardless of content.** If this file changes unintentionally, an unfamiliar program could get launched automatically the next time this folder is opened. If you really need to change it, do it yourself directly in a text editor.

> 💡 **Caveat:** we confirmed via official documentation that `enabledMcpServers` and `disabledMcpServers` are actually stored in a separate file (`~/.claude.json`), not `.claude/settings.json`. This hook only watches for these two names inside `.claude/settings.json`, so right now this specific check never actually triggers for them (harmless from a safety standpoint, so we left them in the list) — noted here for accuracy.

### Delegation to Harness (avoiding duplicate confirmation prompts for overlapping safety checks)

If the sibling plugin **SoDamHarness** is alive (meets all 3 conditions: installed, minimum version, health check), overlapping items like the "sensitive location block" in ③ and symlink-bypass checks are delegated to Harness so a confirmation prompt doesn't appear twice. However, the catastrophic-command block in ①, `.mcp.json`, the outside-workdir-write confirmation, and the settings check in ④ are always self-enforced by this plugin regardless of a sibling's presence (defense in depth — and under Codex, delegation never happens at all).

### What the F6 safety log records

Only when the safety hook makes a **confirm (ask)** or **block (deny)** decision does it log one line, in the shape `{decision, target, reason, timestamp}`. **Safely passed-through work is never logged** (to keep the log from growing endlessly). If the target string contains a secret-looking pattern (like an API key), it is automatically masked to `[REDACTED]` before being saved. There's a short retry (up to 3 attempts) in case multiple projects try to write at the same time, but if it still fails, it silently gives up — **a logging failure never affects the safety decision itself.** This log never leaves your computer. Check it via [`/sodam-agentic:log`](#commands).

### Real decision examples (wording taken directly from the actual code)

| Stage | Example situation | What actually appears (summarized) |
|---|---|---|
| ✅ Safe (pass) | Ordinary work like creating a new file or changing a normal setting | (no message — it just proceeds) |
| ❓ Confirm (ask) | Deleting a single file, writing outside the working folder | "[소담 에이전틱] This is hard to undo... are you sure you want to proceed?" |
| ⛔ Block (deny) | Work that risks exposing a secret value | "[소담 에이전틱] Blocked because this could expose an API key or secret..." |
| ⛔ Block (deny) | Deleting an entire folder | "[소담 에이전틱] Blocked deleting an entire folder for safety..." |
| ⛔ Block (deny) | Changing or deleting a sensitive item in `.claude/settings.json` | "[소담 에이전틱] Blocked — this item could change the AI's own safety settings..." |
| ⛔ Block (deny) | Creating or changing `.mcp.json` | "[소담 에이전틱] Blocked — this file defines MCP servers Claude Code runs automatically..." |
| ⛔ Block (always, catastrophic) | An irreversible destructive command, or a pattern that immediately runs unverified external code | "[소담 에이전틱] Blocked an irreversible, dangerous command..." |

> The `[소담 에이전틱]` prefix is a source label so that, even if installed alongside a sibling plugin (like SoDamHarness) and both hooks fire at once, you can immediately tell which plugin blocked what. The same standard is applied **whether you ask in natural language or specify a command directly.**

### Honest limitations (no overstatement)

As the code comments in this repository state plainly, **"the dangerous-pattern list is a draft, and it does not catch 100% of all dangers."** The safety hook only goes as far as "block what can't be undone, and ask about the rest" — the final judgment call is always a human's. If **auto-approve / bypass-permissions** mode is enabled at the bottom of your screen, confirmation prompts get silently passed through, weakening this protection — for safe use, we recommend keeping "ask every time" mode via `Shift+Tab` (the hook has no way to detect this mode on its own).

---

<a id="troubleshooting"></a>
## 13. Troubleshooting

| Symptom (what you see) | Why (cause) | Fix (what to do) |
|---|---|---|
| Installed it but nothing happens | Didn't run `/init` / didn't read the onboarding | Start with `/sodam-agentic:start` to check status |
| `/sodam-agentic` shows no commands | Not installed, or a typo in the marketplace name | Re-run `/plugin install sodam-agentic@sodam-agentic` (must be `@sodam-agentic`) |
| "No access / permission denied" during install | Unlikely to be an access issue since the repository is public — more likely a network problem or a typo in the URL/name | Check your internet connection and double-check the `/plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng` address |
| "Node not found" | Node.js is not installed | Install Node.js 18+ following [§3](#install-programs), then retry |
| Korean text shows as `□□□` | A font/character-display issue | Check your terminal/editor's UTF-8 settings; screenshot it and ask for help |
| Code gets written without a plan first | Another skill took priority (F2 is a "request," not a hard enforcement) | This can happen normally — just ask directly, "show me the plan first" |
| A dangerous command wasn't blocked | The safety hook isn't running, or auto-approve mode is on | Check whether auto-approve/bypass mode is on first ([§12](#security-data-flow)); otherwise, screenshot and ask for help |
| Confirmation prompts appear too often | Multiple safety layers (including a sibling plugin) overlap | Can be tuned so only truly risky things prompt, via `data/agentic-rules.json` |
| Commands still show old names / a recent fix isn't showing up | The installed copy (cache) isn't up to date | `/plugin uninstall sodam-agentic@sodam-agentic` → `/plugin install sodam-agentic@sodam-agentic` → `/reload-plugins` (in exactly this order — `marketplace update` alone is not enough) |
| Is it okay to type in a password or API key? | — | **Never do this.** Keep it only in your own environment (e.g. `.env`) — the hook will block it immediately if detected |
| I want to remove it / something looks off after an update | Uninstall / update | See [§16 Uninstall](#uninstall) |
| I can't remember what got blocked last time | — | Use `/sodam-agentic:log` (only blocked/confirmed items are logged — safely passed-through work is not) |
| The confirmation ("ask") prompt doesn't seem to show up in Codex | Something that hasn't been confirmed live by a human yet | Check first with Codex's own `/hooks` command to see if it's registered, then screenshot and ask for help |

---

<a id="faq"></a>
## 14. FAQ

**Q. Is this actually safe?**
A. No, it's not "100% safe." It's more like "block what can't be undone, and ask about the rest." The code comments in this repository honestly state that the dangerous-pattern list is a draft and doesn't catch every possible danger. The final call is always a human's.

**Q. Do I need an internet connection all the time?**
A. Only **while installing.** Once installed, the plugin itself sends no network requests (though Claude Code/Codex itself obviously needs the internet to talk to the AI model).

**Q. Does it cost money?**
A. The plugin itself is **free (Apache-2.0)**. However, the cost of using Claude/Codex (AI model usage fees) follows Anthropic's/OpenAI's own terms separately — see [§15 License](#license-legal).

**Q. Is it just as safe on Codex as on Claude Code?**
A. **The same safety features are registered on Codex too** — plan (F2), review (F3), blocking, and the safety log (F6) all use the same logic. However, **whether the "may I proceed?" prompt actually appears on screen in Codex has not yet been confirmed live by a human** — we don't claim full parity until it has been.

**Q. Do I need SoDamHarness (a sibling plugin) to use this?**
A. No. Without Harness, this plugin's "minimal safety fallback" runs in **full mode** on its own. Stronger features like automatic backup and undo do require Harness, though.

**Q. Can I use this commercially?**
A. The plugin itself is Apache-2.0, so commercial use, redistribution, and running it as a service are all allowed (as long as you preserve the NOTICE file). But check each provider's own terms for the commercial conditions of using the Claude/Codex models — see [§15 License](#license-legal).

**Q. Can I look back at what got blocked or confirmed?**
A. Yes. Use `/sodam-agentic:log` to see recent entries in plain language. Safely passed-through work isn't logged — only blocked (deny) or confirmed (ask) items are. The log stays on your computer and is never sent anywhere.

**Q. Does what I ask the AI to do get sent somewhere?**
A. This plugin itself sends no network requests. That's separate from Claude Code/Codex itself communicating with the AI model. The safety log (F6) isn't a transmission — it's just **saved to a file on your computer.**

**Q. Do I need to install all 5 other sibling plugins too?**
A. No. This plugin works on its own with minimal safety. Pairing it with SoDamHarness makes safety stronger, and pairing it with SoDamLoop enables repeated/autonomous work.

**Q. Why does it always block `.mcp.json`? What if I actually want to add a real MCP server?**
A. Just open that file yourself, directly, in a text editor. What this plugin blocks is only "the AI automatically changing this file on its own."

**Q. Do the plan (F2) and review (F3) prompts show up every time?**
A. There's no technical mechanism yet that forces them to appear every time (skills are "requests" the AI honors, and can lose out to other skills). If you don't see it, just ask directly: "show me the plan first" / "review the changes."

**Q. What is F8 (Easy Mode)? Do I need it?**
A. It's an **even simpler explanation layer** for when you've read the F1 onboarding once but still think "I don't understand any of this." Saying something like "this is too hard to understand" triggers it automatically, or you can call it directly with `/sodam-agentic:f8-easy`. It only makes the *explanations* simpler — safety steps like plan-first (F2) and review (F3) work exactly the same **whether this mode is on or off.**

---

<a id="license-legal"></a>
## 15. Legal · Copyright · License · Commercial Use

> ⚠️ **This section is not legal advice.** It's general guidance — before any real-world distribution or commercial use, please get your own professional (e.g., a lawyer) to review it, at your own responsibility. We do not guarantee "100% legal/safe."

### 15-1. Basic license information

| Item | Detail |
|---|---|
| License | **Apache License, Version 2.0** (full text: [`LICENSE`](./LICENSE)) |
| Copyright holder | **SoDam AI Studio** |
| Year | 2026 |
| Notice | Copyright/trademark notices are included in the [`NOTICE`](./NOTICE) file |
| External runtime dependencies | **0** (uses only Node.js standard features — see `package.json`) |

### 15-2. Scope of allowed commercial use (subject to preserving NOTICE)

| Action | Allowed |
|---|---|
| Modify | ✅ |
| Copy | ✅ |
| Redistribute | ✅ |
| **Commercial use** | ✅ |
| Sell | ✅ |
| Run as a service (SaaS) | ✅ |
| Use for education | ✅ |
| Deliver to a company/client | ✅ |

All of the above are allowed as long as you follow Apache-2.0's conditions: **preserve copies of `LICENSE` and `NOTICE`, and mark any files you modified as changed.**

### 15-3. AI model usage fees are separate (please confirm this)

**This plugin itself is free under Apache-2.0, but Anthropic Claude's and OpenAI Codex's model usage fees and terms of service are completely separate from this plugin's license, and follow each company's own terms.** If you plan to use this commercially, make sure to separately check Claude's (Anthropic) and Codex's (OpenAI) commercial-use policies. The same applies to the terms of any external MCP servers/APIs you connect.

### 15-4. Third-party trademarks (no implied affiliation or endorsement)

"**Claude**" and "**Claude Code**" are trademarks of **Anthropic**; "**Codex**" is a trademark of **OpenAI**. This project uses those names **only to describe compatibility/target platforms**, does not use their logos without permission, and **does not imply any official affiliation, endorsement, or sponsorship.** This project is an **unofficial, third-party tool** — not a product made or certified by Anthropic or OpenAI. "SoDam" (소담) is the name of this project (SoDam AI Studio).

### 15-5. No warranty · limitation of liability (Apache-2.0 §7·§8)

This software is provided **"AS IS,"** with **no warranties of any kind, express or implied** (including merchantability, fitness for a particular purpose, and non-infringement). The copyright holder and contributors are **not liable for any direct, indirect, special, or incidental damages** arising from the use of this software, to the fullest extent permitted by law. **We do not use phrases like "perfectly safe" or "100% guaranteed."** Use is entirely **at your own risk**, and this document is for reference only.

### 15-6. No unauthorized inclusion

This repository does not contain anyone else's copyrighted work, trademarks, logos, personal information, client information, or confidential information. Strong copyleft licenses like GPL/AGPL were deliberately not borrowed from (because they risk propagating a source-disclosure obligation when delivered/sold commercially) — we directly verified the actual licenses of the 4 reference repositories via the `gh` CLI (0 GPL/AGPL found), and their attribution notices are listed separately in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

### 15-7. AI-assisted development disclosure (transparency)

A significant portion of this project's code and documentation was **written with the help of AI coding tools.** Core logic like the safety hook (F4) has been validated through repeated real-world testing, but AI-written code is not automatically guaranteed to be as complete or accurate as human-written code — **we recommend your own code review** before applying this to a production or commercial environment.

---

<a id="uninstall"></a>
## 16. Uninstall

**Claude Code:**
1. Type `/plugin uninstall sodam-agentic` in the input box (or choose "remove" from the marketplace screen).
2. Verify: if typing `/sodam-agentic` no longer shows any commands, removal is complete.

**Codex:**
- Since installation works by copying files, just delete the `.agents/skills/`, `.agents/hooks/`, and `.agents/data/` folders in your project directly. To also remove the `PreToolUse` entry registered in `.codex/hooks.json`, edit that JSON file directly and delete that entry.

**Data that stays behind (important):** removing the plugin does **not** automatically delete the safety log file (`~/.sodamagentic/safety-log.jsonl`), because it's stored outside the plugin folder, in your user home folder. If you want it completely gone, delete that file yourself.

---

<a id="contribute"></a>
## 17. Contributing / Contact

This repository is **public**, but it is still run as the developer's **personal-use tool**, and there isn't a formal contribution (PR) process yet. Please leave questions or bug reports as a GitHub issue.

---

<a id="recommended-mcp"></a>
## 18. Recommended MCPs (Optional, Reference)

**MCP** (Model Context Protocol) lets AI connect to external tools/services. The 4 below are reference candidates SoDam Agentic reviewed against its own trust criteria (official repo? source public and directly reviewed? maintained by a well-known org/person? any known issue history? — needs 2+ of 4).

> ⚠️ **Honest note**: This list is **reference only**. SoDam Agentic does not auto-install or enable any of these — if you decide you need one, install/connect it **yourself** (e.g. via the `/plugin` screen).

| MCP | Purpose | Notes |
|---|---|---|
| **Context7** (Upstash) | Lets AI look up current library/framework docs directly | — |
| **Playwright MCP** (Microsoft) | Lets AI open, click, and inspect web pages directly | Prompt-injection risk (a page's hidden content tricking the AI) is a general limitation of this class of tool |
| **Chrome DevTools MCP** (Google) | Lets AI open and inspect a running web app's screen/console/performance | **Use version 1.1.0 or later** (a security issue disclosed 2026-08-17 affected earlier versions and was fixed in 1.1.0) |
| **GitHub Official MCP Server** (GitHub) | Lets AI manage repos/issues/PRs directly | No confirmed real-world use in the SoDam family yet, so listed as reference-only |

Full research/rationale is kept in `.PRD/12_PHASE3_GATE3_MCP_CURATION.md` (developer reference, not included in this repo).

---

*Document version as of: 2026-09-01 (plugin version v0.2.8) · This document was written based on "code actually implemented and verified so far" — anything not directly executed and confirmed is honestly flagged in [§8](#changelog).*
