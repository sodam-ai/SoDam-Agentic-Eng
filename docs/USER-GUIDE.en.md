# SoDamAgentic — User Guide (for absolute beginners)

> 🇺🇸 English guide · Korean (default): [사용가이드.md](./사용가이드.md)
> This guide is written so that **people new to AI, computers, smartphones, or electronics** can follow it step by step.
> ⚠️ **Status:** Phase 1 (early MVP). Some features are still being refined (see "Development status" at the end).

---

## 0. What is this? (one sentence)

> **SoDam** is a **Claude Code / Codex plugin** that spoon-feeds, in **plain language**, how to properly direct an AI.

Analogy: **the AI is a factory machine; you are the person designing the factory.** Instead of "just do it," you first decide *what / why / how far* to build, then review what the AI did, and block anything dangerous.

**The 4 things it does:**
| Feature | One line |
|---|---|
| Onboarding | Explains the 4 steps of directing an AI |
| Plan First | Before writing code, shows a "what / why / done-criteria" plan and asks for approval |
| Easy Review | Summarizes changes as "what / why / any risks?" |
| Safety | Auto-blocks or asks on risky commands, secret exposure, writes in the wrong place, settings changes |

---

## 1. Prerequisites (required to work)

| Item | Why | Where to get it |
|---|---|---|
| **Node.js 18+** | The safety hook runs on it. Without it, safety won't turn on | https://nodejs.org → download "LTS" |
| **Claude Code** | The program SoDam installs into (or Codex) | https://code.claude.com (follow official setup) |
| **GitHub account + access** | SoDam is fetched from GitHub. It is **private** now, so access is needed | https://github.com (free) |
| **Internet** | Needed for install | — |

> 💡 **Check (optional):** in a terminal, run `node -v` → if it shows `v18....` or higher, you're good.

---

## 2. Download & install required programs (step by step)

### 2-1. Install Node.js
1. Go to https://nodejs.org → click the green **"LTS"** button to download.
2. Double-click the installer → "Next → Next → Install" (defaults are fine).
3. Restarting your computer once makes it reliable.

### 2-2. Prepare Claude Code
- If you already use Claude Code, skip this.
- If new, follow the official guide (https://code.claude.com). Node.js must be installed first.

---

## 3. Quick start (3-step golden path)

1. **Install:** in the Claude Code input box:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   /plugin install sodam-agentic@sodam
   ```
2. **Start:** `/sodam-agentic-start` → guidance appears.
3. **Ask:** say "make ○○" → if a **plan** appears first, approve → work → check the **review summary**.

→ A "it works!" experience in about 5 minutes.

---

## 4. Installation (detailed)

> ⚠️ The repository is currently **private**. It installs only if your GitHub account **has access**.

**Claude Code:**
1. Add the marketplace — paste and press Enter:
   ```
   /plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
   ```
   → success shows "added / sodam".
2. Install:
   ```
   /plugin install sodam-agentic@sodam
   ```
   → success shows "installed".
3. Verify: type `/sodam-agentic` → three commands (`-start`, `-plan`, `-review`) appear.

**(For the developer's own local test)** you can also install from a local folder:
```
/plugin marketplace add D:/AI_Dev_Work/2026y/26y_06m_26d_SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam
```

---

## 5. Run / use / how it works (step by step)

1. Type **`/sodam-agentic-start`** → read the 4-step onboarding.
2. (Recommended) run **`/init`** once → the AI recognizes the current folder. *Beginners skip this most often.*
3. **Ask in plain language:** e.g., "make a notepad web page".
4. **Check the plan:** when the AI shows "①what ②why ③done-criteria" before code, read it and approve with **"yes/proceed"**.
5. **Review:** when done, read the "what / why / any risks?" summary and decide.
6. **Safety:** risky commands (e.g., deleting a whole folder) are auto-blocked or prompt "proceed?".

---

## 6. Command list

| Command | When to use |
|---|---|
| `/sodam-agentic-start` | First start / onboarding |
| `/sodam-agentic-plan` | "Plan first" (usually auto-triggered) |
| `/sodam-agentic-review` | "Change review" (usually auto-triggered) |

> Commands also work namespaced: `/sodam-agentic:sodam-agentic-start`.

---

## 7. Workflow

```
[Start] /sodam-agentic-start  →  safety on + 4 steps
   │
   ▼
[Plan First]  "make it"  →  AI proposes a plan  →  you approve
   │
   ▼
[Run]  AI works  ──(if risky)──▶  [Safety]  auto block / confirm
   │
   ▼
[Review]  what·why·risk  summary  →  you decide  →  done
```
Core principle: **not "the AI handles everything" — the human is in the driver's seat.**

---

## 8. File & document locations

**Dev folder (source):** `D:\AI_Dev_Work\2026y\26y_06m_26d_SoDam-Agentic-Eng`
**GitHub:** https://github.com/sodam-ai/SoDam-Agentic-Eng (private, branch `init-mvp`)

| What | Location |
|---|---|
| Plugin manifests | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| Onboarding command | `commands/sodam-agentic-start.md` |
| Plan / review features | `skills/sodam-agentic-plan/`, `skills/sodam-agentic-review/` |
| Review sub-agent | `agents/easy-reviewer.md` |
| Safety hooks | `hooks/hooks.json`, `hooks/guard.mjs`, `hooks/delegate.mjs` |
| Safety rules (data) | `data/agentic-rules.json` |
| Structure validator | `scripts/validate.mjs` |
| Docs | `README.md`/`README.en.md`/`docs/` |
| Installed location | `C:\Users\<user>\AppData\Roaming\claude-code\plugins\` (automatic) |

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `/sodam-agentic` doesn't show | Not installed | Run `/plugin install sodam-agentic@sodam` again |
| "no permission/access" on install | No access to private repo | Sign in to your GitHub account with access |
| "Node not found" | Node.js missing | Install Node.js 18+ (2-1) and retry |
| Korean shows as `□□□` | Rendering issue | Capture the screen and report (English fallback available) |
| Code without a plan | Early-version limit (auto-trigger not guaranteed) | May be normal — report it for improvement |
| Risky command not blocked | Hook not active | Capture and report (check Node / install) |
| Commands show old names | Cached install | `/plugin marketplace update sodam` → reinstall |

---

## 10. Safety notes (please follow)

- **Never put secrets** (passwords, API keys, `.env`) in code, docs, or chat.
- The safety net blocks irreversible risks and asks on the rest. It is **not "100% safe"** — the human makes the final call.
- Be careful not to let the AI auto-run newly received external files/tools.

---

## 11. License · Copyright · Commercial use (please read)

> ⚠️ **This document is not legal advice.** The below is general guidance; verify **at your own responsibility** before distribution or commercial use.

- **License (tentative):** **Apache License 2.0** recommended · copyright **SoDam AI Studio** · 2026.
  ⚠️ **Not finalized yet, and a `LICENSE` file is not yet included** in the repo (only declared in manifests). Treat it as "tentative" until a `LICENSE`/`NOTICE` is added.
- **Permitted (Apache-2.0, keep NOTICE):** modify ✅ / copy ✅ / redistribute ✅ / commercial use ✅ / sell ✅ / run as a service ✅ / education ✅ / deliver to clients ✅.
- **Warranty & liability:** provided **"AS IS"** with **no warranty of any kind.** Use is **at the user's own risk** (including data loss / malfunction).
- **AI model fees & terms are separate:** this plugin is free (tentative Apache-2.0), but **Claude (Anthropic) / Codex (OpenAI) model fees and terms follow each provider's ToS.** Not related to this tool.
- **Third-party trademarks:** "Claude · Anthropic · Codex · OpenAI" are their owners' trademarks. Used **descriptively only**; **no implication of official affiliation/endorsement.**
- **No unauthorized inclusion:** others' works, trademarks, logos, personal data, customer/confidential info are not included (zero in this repo).
- **Adding external assets:** if you add fonts/images/icons, **verify each one's commercial-use license separately.**
- **Avoid strong copyleft (GPL/AGPL) borrowing** (risk of source-disclosure obligations in commercial/delivery use).

---

## 12. Development status (honest)

- ✅ **Verified:** install, Korean rendering, command consistency, **onboarding (F1) actually runs**.
- ⬜ **Not yet live-verified:** Plan First (F2) / Review (F3) **auto-trigger**, safety hook (F4) blocking when installed.
- ⬜ **Not built yet:** Codex install script, shared instructions (AGENTS.md), `LICENSE` file.
- This is pre-beta. Rough edges may exist, and **finding them is the current goal.**

---

*Document baseline: 2026-06-23 · Written against the "actually developed features so far."*
