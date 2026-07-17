# SoDam Claude Code Plugin Suite — Complete Beginner's Guide

> **Version** v0.1.0 · **License** Apache-2.0 · **Author** SoDam AI Studio · **Last Updated** 2026-06-29

---

## Table of Contents

1. [What Is This?](#1-what-is-this)
2. [What Does It Do?](#2-what-does-it-do)
3. [Prerequisites](#3-prerequisites)
4. [Download and Installation](#4-download-and-installation)
5. [Quick Start — Done in 5 Minutes](#5-quick-start--done-in-5-minutes)
6. [Detailed Plugin Descriptions](#6-detailed-plugin-descriptions)
7. [Complete Command Reference](#7-complete-command-reference)
8. [Security and Data Flow](#8-security-and-data-flow)
9. [Architecture](#9-architecture)
10. [File and Document Locations](#10-file-and-document-locations)
11. [Troubleshooting](#11-troubleshooting)
12. [FAQ](#12-faq)
13. [License · Copyright · Legal](#13-license--copyright--legal)
14. [Contributing and Contact](#14-contributing-and-contact)

---

## 1. What Is This?

**SoDam Claude Code Plugin Suite** is a collection of **6 free plugins** designed to help anyone — even complete beginners — use **Claude Code** safely and easily.

### What is Claude Code?
Claude Code is a tool made by the American AI company **Anthropic**.  
Simply put, it is an "AI assistant that writes code for you."  
In your computer's chat window, you can say things like "add this feature" or "fix this error,"  
and the AI will read and edit code files for you directly.

### What is a Plugin?
A plugin is an **extension pack that adds features to a base program.**  
Just like installing an app on your smartphone adds functionality,  
installing SoDam plugins into Claude Code unlocks additional capabilities.

### The 6 Plugins in the SoDam Suite

| Name | Role | Summary |
|------|------|---------|
| 🛡 **SoDamHarness** | Safety · Backup · Undo | "Undo AI mistakes anytime" |
| 🧠 **SoDamContext** | AI Manual Health Check | "Keeps your AI instruction file clean" |
| 🚀 **SoDamAgentic** | AI Planning Checkpoint | "AI shows its plan before doing anything" |
| ✏️ **SoDamPrompt** | AI Skill Library | "10 practical AI tools for daily life" |
| 🔍 **SoDamReverse** | Code and App Analysis | "Understand how your code works" |
| 🔁 **SoDamLoop** | Automated Repeat Engine | "Runs the same task automatically multiple times" (Coming Soon) |

---

## 2. What Does It Do?

### 🛡 SoDamHarness — "The Seatbelt"
- **Automatically backs up** files before Claude Code modifies or deletes them
- **Automatically blocks** dangerous commands (e.g., deleting entire folders, modifying system files)
- If something goes wrong, say "undo" to **restore** to the previous state
- All messages appear in **clear, friendly language**

**Example**
```
When AI attempts to delete an important folder:
→ "Deleting an entire folder was blocked for your safety.
   If necessary, try deleting files one at a time."
```

### 🧠 SoDamContext — "The Manual Manager"
- **Checks and refines** your CLAUDE.md instruction file that Claude Code reads
- **Automatically detects** duplicates, accidentally exposed passwords, overly long content, and more
- **Shows a preview** of changes before applying them
- You can **undo at any time** after changes

**Example**
```
CLAUDE.md Check-Up Results:
→ "Found 3 duplicate lines and 5 consecutive blank lines.
   Can reduce from 450 lines to 442. Proceed?"
```

### 🚀 SoDamAgentic — "The Plan Confirmer"
- **Shows a plan first** before the AI starts any task
- The person reads "what / why / how" and only proceeds after **explicit approval**
- Even beginners can understand what the AI is about to do and **stay in the driver's seat**

**Example**
```
User:  "Add a login feature"
AI:    "Let me show you the plan first.
        - What: Add email/password login screen
        - Why: User authentication is needed
        - Done When: Redirects to home screen on successful login
        Shall we proceed?"
```

### ✏️ SoDamPrompt — "10 Everyday AI Skills"
A collection of AI tools you can use right away in daily life.

| Skill Name | What It Does |
|-----------|-------------|
| SNS Caption | Write captions for Instagram/X posts |
| Study Schedule | Auto-generate a study plan based on exam dates |
| Long Text Summary | Summarize any long text to 3 key points |
| Book Report Helper | Draft a book report from your summary |
| Presentation Script | Write a speech script for any topic |
| Request/Apology Message | Write a polite request or apology message |
| Explain Simply | Explain any complex concept in plain language |
| Natural English | Translate Korean text to natural English |
| Self-Introduction Polish | Improve your self-introduction writing |
| Formal Message | Write a professional email or message |

### 🔍 SoDamReverse — "The Code Analyst"
- **Analyzes how** your code or app works
- Delivers a **Korean-language report** on security risks and suspicious code patterns
- **3-Layer Safety System**: automatically refuses dangerous requests (cracking, hacking, etc.)
- **For your own code and educational purposes only**

### 🔁 SoDamLoop — "The Auto-Repeat Engine" (Coming Soon)
- Automatically repeats the same task multiple times
- Includes runaway prevention and auto-stop features
- Currently in development (Phase 0)

---

## 3. Prerequisites

Please prepare the following before installation.

### Required Programs

| Program | Version | Download | Verify |
|---------|---------|----------|--------|
| **Claude Code** | Latest | [claude.ai/code](https://claude.ai/code) | Open app and check version |
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org) | `node --version` |
| **Git** | 2.x or higher | [git-scm.com](https://git-scm.com) | `git --version` |

### How to Check if Programs are Installed

**Windows users:**
1. Press `Windows key + R`
2. Type `cmd` and press Enter
3. Type each command below and check that a version number appears

```
node --version
```
→ Should show `v18.0.0` or higher.

```
git --version
```
→ Should show `git version 2.x.x`.

**Mac users:**
1. Press `Command + Space`
2. Search for `Terminal` and open it
3. Type the same commands above

### How to Install Node.js (if not already installed)

1. Go to [nodejs.org](https://nodejs.org)
2. Click the green **"LTS" button** (confirm the number is 18 or higher)
3. Run the downloaded file
4. Click "Next → Next → Install" to proceed
5. Restart your computer after installation
6. Confirm with `node --version` in Command Prompt

### How to Install Claude Code (if not already installed)

1. Go to [claude.ai/code](https://claude.ai/code)
2. Download the version for your OS (Windows/Mac)
3. Run the installer and follow the prompts
4. **Log in with your Anthropic account** (sign up if needed)

---

## 4. Download and Installation

### Installation Order (Must Follow This Order!)

Because these plugins work together, **order matters.**

```
1st: 🛡 SoDamHarness (safety foundation for all other plugins)
2nd: 🧠 SoDamContext (AI manual management)
3rd: 🚀 SoDamAgentic (planning checkpoint)
4th: ✏️ SoDamPrompt (everyday skills)
5th: 🔍 SoDamReverse (code analysis)
6th: 🔁 SoDamLoop (install when released)
```

### Step 1 — Install SoDamHarness

Open Claude Code and enter the following command.

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Harness-Eng
```

After the installation complete message appears:

```
/plugin install sodam-harness@sodam
```

**Verify installation:**
```
/sodam-harness-status
```
→ If you see "SoDamHarness is running normally," installation was successful.

### Step 2 — Install SoDamContext

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Context-Eng
/plugin install sodam-context@sodam
```

### Step 3 — Install SoDamAgentic

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Agentic-Eng
/plugin install sodam-agentic@sodam
```

**Verify installation:**
```
/sodam-agentic:start
```
→ If the SoDam onboarding screen appears, installation was successful.

### Step 4 — Install SoDamPrompt

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Prompt-Eng
/plugin install sodam-prompt@sodam
```

### Step 5 — Install SoDamReverse

```
/plugin marketplace add https://github.com/sodam-ai/SoDam-Reverse-Eng
/plugin install sodam-reverse@sodam
```

**Verify installation:**
```
/re-selftest
```
→ If you see "6/6 PASS," installation was successful.

### After Installation — Required Step

**Completely close Claude Code and restart it.**  
Plugins are only recognized after a restart.

---

## 5. Quick Start — Done in 5 Minutes

Once installed, try the following steps in order.

### Minute 1: Check Safety Status
```
/sodam-harness-status
```
→ If you see green checkmarks, the seatbelt is active.

### Minute 2: Plan With AI First
Ask Claude Code to do any task:
```
Make a simple to-do list app
```
→ SoDamAgentic automatically shows a plan.  
→ Type "yes" or "proceed" and work begins.

### Minute 3: Try an AI Skill
```
/긴글-3줄요약
```
→ A prompt appears asking you to paste the text you want summarized.  
(Note: skill names are in Korean; type the name as shown)

### Minute 4: Analyze Some Code (if you have code)
```
/re-start myfilename.js
```
→ A Korean-language analysis report is generated.

### Minute 5: Check Your AI Manual
```
/sodam-context-checkup
```
→ Checks the health of your CLAUDE.md file.

---

## 6. Detailed Plugin Descriptions

### 🛡 SoDamHarness Details

**What it does:**
Monitors when Claude Code attempts to modify or delete files,  
and responds based on danger level.

**What gets BLOCKED:**

| Action | Reason |
|--------|--------|
| Delete entire folders (rm -rf) | Irreversible action |
| Modify system folders | Risk of OS damage |
| Modify credential files (.ssh, .aws, etc.) | Risk of account hijacking |
| Format a drive | Total data loss |
| Run fork bomb | Computer crash |

**What requires CONFIRMATION:**

| Action | Reason |
|--------|--------|
| Delete a single file | Backup first, then confirm |
| Overwrite existing file | Backup first, then confirm |
| git push --force | Modifies remote repository |

**Special Exception — AI Manual Files:**
- `~/.claude/CLAUDE.md` — prescription target file for Context plugin
- `~/.claude/AGENTS.md` — prescription target file for Context plugin
- These two files are safely managed by the Context plugin

**How to use Undo:**
```
/sodam-harness-undo
```
→ Restores from the most recent backup.

```
/sodam-harness-log
```
→ View backup list and restore to a specific point in time.

---

### 🧠 SoDamContext Details

**What it does:**
Manages the AI instruction files that Claude Code reads.

**Target files:**
- `CLAUDE.md` — project instructions Claude Code reads
- `AGENTS.md` — AI agent role descriptions

**3-Step Workflow:**

```
Step 1: Intake (/sodam-context-intake)
   → Answer questions about your project to generate a CLAUDE.md draft

Step 2: Check-Up (/sodam-context-checkup)
   → Checks existing CLAUDE.md against 6 criteria
   (duplicates, exposed secrets, contradictions, structure, security, readability)

Step 3: Treat (/sodam-context-treat)
   → Refines problem areas, shows a preview, then waits for your approval
```

**Safety Principles:**
- Treatment is only applied when the file gets smaller afterward
- SoDamHarness automatically backs up before applying changes
- Content that looks like passwords is never touched automatically

---

### 🚀 SoDamAgentic Details

**What it does:**
A "safe entry point" that shows a plan before the AI builds anything.

**Workflow:**
```
User Request → AI Shows Plan → User Confirms → Task Begins
```

**What the plan includes:**
1. **What to build** — one-sentence summary
2. **Why it's needed** — purpose explanation
3. **Done-when** — "it's finished when..."
4. **What files will be touched** — scope of impact

**Additional Safety:**
- Automatic detection of dangerous commands (separate from Harness protection)
- Password exposure detection
- Environment variable hijacking prevention

**Note:**
- If you say "just do it right now," the AI will comply, but it will always show the plan summary
- The AI will not automatically continue on its own (human confirmation required each step)

---

### ✏️ SoDamPrompt Details

**How to use:**
Type `/` in the Claude Code chat window and a list of available skills appears.

**10 Skill Details:**

**1. /sns-캡션**
```
Example: /sns-캡션
→ "Please describe the photo/situation"
→ Enter description
→ 3 caption suggestions for Instagram/X
```

**2. /공부-계획표**
```
Example: /공부-계획표
→ Enter subject, exam date, daily study hours
→ Auto-generated daily study plan
```

**3. /긴글-3줄요약**
```
Example: /긴글-3줄요약
→ Paste the text to summarize
→ 3-line summary of key points
```

**4. /독후감-도우미**
```
Example: /독후감-도우미
→ Enter book title, plot, memorable parts
→ Suggested structure + draft book report
```

**5. /발표-대본**
```
Example: /발표-대본
→ Enter presentation topic, duration, audience level
→ Presentation script
```

**6. /부탁-사과-메시지**
```
Example: /부탁-사과-메시지
→ Describe the situation
→ Polite request or apology message
```

**7. /쉽게-설명해줘**
```
Example: /쉽게-설명해줘
→ Enter a difficult concept or term
→ Explanation simple enough for a child to understand
```

**8. /영어-자연스럽게**
```
Example: /영어-자연스럽게
→ Enter Korean sentence
→ Natural English translation (as a native speaker would say it)
```

**9. /자기소개-다듬기**
```
Example: /자기소개-다듬기
→ Enter existing self-introduction
→ Improved, more natural and impressive version
```

**10. /정중한-메시지**
```
Example: /정중한-메시지
→ Enter situation and what you want to convey
→ Formal, polite email or message
```

---

### 🔍 SoDamReverse Details

**What it does:**
Analyzes how your code or app works and produces a Korean-language report.

**Appropriate Uses:**
- Code you wrote yourself
- Apps you own
- Educational and learning purposes
- Security vulnerability checks (on your own systems only)

**Absolutely Prohibited:**
- Analyzing someone else's code without permission
- Cracking, hacking, license circumvention
- Writing authentication bypass code
- Extracting passwords or API keys

**3-Layer Safety System:**
```
Layer 1: AI refuses dangerous requests at the skill level
Layer 2: Hook auto-blocks dangerous commands (re-deny-guard.mjs)
Layer 3: File integrity verification (integrity.json SHA-256)
```

**Basic Usage:**
```
/re-start filename.js
```
→ A Korean-language analysis report is generated.

**Report Contents:**
- Overall structure summary
- List of main functions
- Security risk items (if any)
- Improvement suggestions

---

## 7. Complete Command Reference

### 🛡 SoDamHarness Commands

| Command | What It Does |
|---------|-------------|
| `/sodam-harness-status` | Check current safety status |
| `/sodam-harness-undo` | Restore from most recent backup |
| `/sodam-harness-log` | View backup history |
| `/sodam-harness-trust` | Skip repeated confirmations for this folder |
| `/sodam-harness-fix` | Self-diagnose and fix issues |
| `/sodam-harness-install` | Verify and reset installation |

### 🧠 SoDamContext Commands/Skills

| Command | What It Does |
|---------|-------------|
| `/sodam-context-intake` | Create new project instructions (CLAUDE.md) |
| `/sodam-context-checkup` | Health check of existing instructions |
| `/sodam-context-treat` | Auto-treat and refine instruction issues |

### 🚀 SoDamAgentic Commands/Skills

| Command | What It Does |
|---------|-------------|
| `/sodam-agentic:start` | Start SoDam suite onboarding |

> When you give the AI a task, the plan-confirm flow activates automatically.

### ✏️ SoDamPrompt Skills

| Command | What It Does |
|---------|-------------|
| `/sns-캡션` | Write SNS captions |
| `/공부-계획표` | Auto-generate study schedule |
| `/긴글-3줄요약` | Summarize long text to 3 lines |
| `/독후감-도우미` | Book report writing assistance |
| `/발표-대본` | Write presentation script |
| `/부탁-사과-메시지` | Write polite message |
| `/쉽게-설명해줘` | Simple explanation of difficult concepts |
| `/영어-자연스럽게` | Korean → natural English |
| `/자기소개-다듬기` | Improve self-introduction |
| `/정중한-메시지` | Write professional email/message |

### 🔍 SoDamReverse Commands

| Command | What It Does |
|---------|-------------|
| `/re-start <file path>` | Start code analysis |
| `/re-report` | Generate analysis report |
| `/re-selftest` | Safety system self-check (verify 6/6 PASS) |
| `/re-android` | Android APK analysis (Phase 2 — Coming Soon) |
| `/re-binary` | Binary file analysis (Phase 3 — Coming Soon) |

### 🔁 SoDamLoop Commands (Coming Soon)

Currently in development. This document will be updated when Phase 1 launches.

---

## 8. Security and Data Flow

### Does Data Get Sent Externally?
**No.** SoDam plugins do not send any data to external servers.

- All processing happens **only on your computer**
- No network request code has been intentionally included
- Sensitive information such as API keys and passwords is never stored or transmitted

### Where Are Backup Files Stored?
```
Windows: C:\Users\YourName\.sodamharness\backups\
Mac:     ~/.sodamharness/backups/
```
- This folder exists **only on your computer**
- It is not uploaded to the internet
- You can open it directly to inspect the files

### How Are Security Files (Passwords, API Keys) Handled?
- Sensitive files like `.env`, `.pem`, `.ssh` are **excluded from backups**
- There is no risk of them being accidentally backed up and copied elsewhere
- However, if these files are deleted during a task, **recovery is not possible** — exercise caution

### Is My Code Sent Externally During Analysis?
Claude Code itself communicates with Anthropic's servers,  
but SoDam plugins do not send code to any additional external server.

### What Gets Blocked?
```
Examples of blocked actions:
✗ rm -rf ~                    (delete entire home folder)
✗ Remove-Item -Recurse C:\   (delete entire drive)
✗ format C:                  (format disk)
✗ Modify ~/.ssh/ files        (SSH key theft risk)
✗ Modify ~/.aws/ files        (AWS credential theft risk)
✗ Modify C:\Windows\ files    (system damage risk)
✗ Cracking/hacking requests   (legally and ethically prohibited)
```

---

## 9. Architecture

### How the System Works

```
[User] → [Claude Code] → [SoDam Plugins] → [Execute Task]
                               ↓
                         [PreToolUse Hook]
                               ↓
                   Is it safe? → YES → Execute
                               → NO  → Block/Confirm
```

### How Plugins Work Together

```
🛡 SoDamHarness (Safety Infrastructure)
    ↑ When Harness is active, other plugins rely on it
    │
    ├── 🧠 SoDamContext → Harness backs up before CLAUDE.md changes
    ├── 🚀 SoDamAgentic → Delegates dangerous command blocking to Harness
    ├── 🔍 SoDamReverse → Injects risk rules into Harness
    └── 🔁 SoDamLoop    → (Coming Soon) Operates on top of Harness safety net
```

### What is a Hook?
A hook is a checkpoint that Claude Code checks before performing any action.

```
Claude Code attempts to delete a file
         ↓
PreToolUse hook fires (SoDamHarness)
         ↓
guard.mjs analyzes: "Is this action safe?"
         ↓
    Safe    → Allow
    Danger  → "Blocked" message + stop action
    Unclear → "Shall we proceed?" confirmation request
```

---

## 10. File and Document Locations

### Plugin Installation Location

```
Windows: C:\Users\YourName\.claude\plugins\
Mac:     ~/.claude/plugins/
```

### SoDamHarness Backup Location

```
Windows: C:\Users\YourName\.sodamharness\backups\
Mac:     ~/.sodamharness/backups/
```

### Claude Code Settings File

```
Windows: C:\Users\YourName\.claude\settings.json
Mac:     ~/.claude/settings.json
```

### AI Instruction File Locations

```
Global (all projects): ~/.claude/CLAUDE.md
Per-project:           ProjectFolder/CLAUDE.md
```

### Log Files

```
Harness activity log:  ~/.sodamharness/activity.log
Harness backup list:   ~/.sodamharness/backups/
```

### SoDamReverse Analysis Reports

```
Saved location: Same folder as the analyzed file
File name:      [originalfilename]-report-[date].md
```

---

## 11. Troubleshooting

### Plugin Commands Not Being Recognized

**Cause**: Most likely Claude Code was not restarted.

**Solution:**
1. Completely close Claude Code (close the window)
2. Open it again
3. Enter `/sodam-harness-status` to verify

### "Cannot find installed plugin" Error

**Solution:**
```
/sodam-harness-install
```
→ Checks installation status and resets.

### Undo Not Working

**Cause**: Deleted files that are security files (e.g., `.env`) are excluded from backups.

**Solution:**
1. Use `/sodam-harness-log` to view backup list
2. If the backup exists, try `/sodam-harness-undo`
3. If not, manual recovery is required (files not backed up cannot be recovered)

### FAIL Appears in `/re-selftest`

Run the following directly in Terminal:
```
node hooks/_selftest.mjs
```
to see which test is failing.

Try resolving the failed item with `/sodam-harness-fix` or  
report it as a GitHub issue.

### CLAUDE.md Treatment Refused Because "File Would Get Larger"

Treatment is refused if the file does not shrink after treatment.  
This is normal behavior. The file is already optimized or  
no treatment is needed.

### Backup Folder is Getting Too Large

Use `/sodam-harness-log` to check old backups and delete them manually.

```
Windows: Open C:\Users\YourName\.sodamharness\backups\ folder
→ Delete old date folders
```

### Node.js Version is Incompatible

Some features will not work if Node.js is below version 18.

1. Check current version with `node --version`
2. If below 18, install the latest LTS from [nodejs.org](https://nodejs.org)
3. Uninstall old Node.js, then reinstall

---

## 12. FAQ

**Q. Is this completely free?**  
A. Yes, SoDam plugins themselves are free.  
However, using Claude Code requires an Anthropic account, and usage fees may apply.

**Q. Can I use this without knowing how to code?**  
A. SoDamPrompt's 10 skills can be used immediately without any coding.  
SoDamReverse and SoDamContext only require a basic understanding of files.

**Q. Does it work on both Windows and Mac?**  
A. Yes, both are supported. Linux is also supported.

**Q. Are my files sent to AI servers?**  
A. Claude Code communicating with Anthropic's servers is its default behavior,  
but SoDam plugins do not send anything additionally to external servers.

**Q. Can I use it on multiple computers?**  
A. You need to install it separately on each computer. Settings are independent per machine.

**Q. When will SoDamLoop launch?**  
A. It is currently in Phase 0 (technical validation). The release date is TBD.  
Follow the GitHub repository to receive update notifications.

**Q. How do I remove a plugin?**  
A. In Claude Code:
```
/plugin uninstall sodam-harness
```
You can remove it in this format.

**Q. Can I add my own skills or rules?**  
A. For SoDamHarness, you can add rules directly to `~/.sodamharness/safety-rules.json`.  
See GUIDE.md for details.

**Q. Can I open and view backup files?**  
A. Yes, you can directly open the `~/.sodamharness/backups/` folder in File Explorer  
to inspect file contents.

**Q. Can I use this commercially?**  
A. Commercial use is permitted under the Apache-2.0 license.  
However, you must maintain the copyright notice and license notice.  
See the [License section](#13-license--copyright--legal) for details.

---

## 13. License · Copyright · Legal

### License

This software is licensed under the **Apache License 2.0**.

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

### What You Are Permitted to Do (Apache-2.0)

| Permission | Description |
|-----------|-------------|
| ✅ Allowed | Use freely in personal projects |
| ✅ Allowed | Use for commercial purposes |
| ✅ Allowed | Modify and use |
| ✅ Allowed | Distribute to others |
| ✅ Allowed | Patent use (granted by contributors) |

### What You Must Do

| Obligation | Description |
|-----------|-------------|
| ⚠️ Required | Retain original copyright notice: `Copyright 2026 SoDam AI Studio` |
| ⚠️ Required | Include license file (LICENSE) when distributing |
| ⚠️ Required | State that you modified it if you modified the original |
| ⚠️ Required | Include NOTICE file with distribution if one exists |

### What You Cannot Do

| Prohibition | Description |
|------------|-------------|
| ❌ Prohibited | Remove copyright notices |
| ❌ Prohibited | Use SoDam AI Studio's name to imply endorsement |
| ❌ Prohibited | Use trademarks ("Claude," "Anthropic" are Anthropic's trademarks) |

### Trademark Notice

- **"Claude"**, **"Claude Code"**, **"Anthropic"** are trademarks of Anthropic PBC
- SoDam plugins integrate with Claude Code but are **not officially supported or affiliated with Anthropic**
- SoDam AI Studio is an independent developer/team with no connection to Anthropic

### Limitation of Liability

This software is provided **"AS IS"** without warranty of any kind.  
SoDam AI Studio accepts no legal liability for data loss, system issues,  
or other damages resulting from use.

We strongly recommend maintaining separate external backups of important files  
in addition to what SoDam plugins provide.

### Consent to Terms

By installing and using SoDam plugins, you are deemed to have agreed to the following:
1. You understand this software is provided without warranty
2. You accept full responsibility for all results of your use
3. You will only use SoDamReverse for your own code and educational purposes
4. You will not use this software for illegal purposes (cracking, hacking, license circumvention, etc.)

### Open Source Dependencies

This project uses only Node.js built-in modules (no external npm packages).  
Therefore, no additional open source dependency notices are required.

---

## 14. Contributing and Contact

### Bug Reports and Feature Requests

Please submit issues at each plugin's GitHub repository:

- Harness: https://github.com/sodam-ai/SoDam-Harness-Eng/issues
- Context: https://github.com/sodam-ai/SoDam-Context-Eng/issues
- Agentic: https://github.com/sodam-ai/SoDam-Agentic-Eng/issues
- Prompt: https://github.com/sodam-ai/SoDam-Prompt-Eng/issues
- Reverse: https://github.com/sodam-ai/SoDam-Reverse-Eng/issues

### Information to Include in Issue Reports

```
OS: (e.g., Windows 11, macOS 14)
Claude Code Version: (Check: Claude Code app → About)
Node.js Version: (result of node --version)
Plugin Version: (v0.1.0)
Issue Description: (what command you entered, what error appeared)
```

### Privacy Notice

When submitting issues, **never include** API keys, passwords, personal file paths,  
or other sensitive information.

---

*This document was written by SoDam AI Studio and is licensed under Apache-2.0.*  
*PDF conversion: `pandoc SUITE-README.en.md -o SUITE-README.en.pdf --pdf-engine=wkhtmltopdf`*
