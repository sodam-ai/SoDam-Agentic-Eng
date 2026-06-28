# SoDamAgentic

> A **Claude Code / Codex plugin** for beginner vibe-coders.
> It spoon-feeds, in **plain Korean**, how to properly direct an AI (plan first → review → safety).
> 🇰🇷 한국어: [README.md](./README.md)

> ⚠️ Currently in **Phase 1 (MVP)**. Some features are early-stage.

---

## What it does (4 things)

| Feature | Description |
|---|---|
| **Onboarding** | `/sodam-agentic-start` — explains the 4 steps of directing an AI, in Korean |
| **Plan First (F2)** | Before writing code, shows a "what / why / done-criteria" plan and asks for approval |
| **Easy Review (F3)** | Summarizes changes as "what / why / any risks?" in plain language |
| **Safety (F4)** | Auto-blocks/asks on risky commands, key exposure, writes outside the work folder, settings changes |

## Requirements
- **Node.js 18+** (the safety hook needs it)
- **Claude Code** (or Codex)

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
3. Verify: type `/sodam-agentic` — three commands should appear.

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

> ⚠️ **Safety hooks (F4) do not work in Codex.** Only the Plan (F2) and Review (F3) skills are available.

## Usage (beginner steps)
1. `/sodam-agentic-start` → read the onboarding.
2. Ask "make ○○" → if a **plan appears first**, approve with "yes/proceed".
3. After the work, read the **review summary** and check the risks.

## Commands
| Command | Description |
|---|---|
| `/sodam-agentic-start` | Onboarding |
| `/sodam-agentic-plan` | Plan first |
| `/sodam-agentic-review` | Change review |

## Test / Verify
- **Structure check:** `node scripts/validate.mjs` (validates manifest / skills / hooks)
- **Live safety hook:** after install, try a risky command and confirm it is blocked

## Safety notes
- **Never put secrets** (API keys, passwords, `.env`) in code, docs, or logs.
- The safety net blocks irreversible risks and asks on the rest. It is **not "100% safe."**

## Troubleshooting
| Symptom | Fix |
|---|---|
| `/sodam-agentic` doesn't show | Reinstall (`/plugin install sodam-agentic@sodam`) |
| Korean text is garbled | Capture the screen and report |
| Code without a plan | Early-version limitation — to be improved |
| "Node not found" | Install Node.js 18+ and retry |

## License
Apache-2.0 © SoDam AI Studio
