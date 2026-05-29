# Growth Marketing — Cursor Setup

This repository documents the setup of Cursor IDE and AI coding extensions for the growth marketing assignment.

## Tools Installed

| Tool | Purpose | Status |
|------|---------|--------|
| [Cursor IDE](https://cursor.com/) | AI-native code editor (VS Code fork) | Installed |
| **Claude Code** (Cursor extension) | Anthropic Claude integration inside Cursor | Installed & logged in |
| **Codex** (Cursor extension) | OpenAI Codex integration inside Cursor | Installed & logged in |
| [Git](https://git-scm.com/) | Version control | Installed |
| [GitHub](https://github.com/) | Remote repository hosting | Account created; repo linked |

## Steps Completed

1. **Installed Cursor IDE** — Downloaded from [cursor.com](https://cursor.com/) and opened the editor on Linux.
2. **Added Claude Code extension** — Opened **Extensions** (`Ctrl+Shift+X`), searched `Claude Code`, installed the add-on, and signed in with an Anthropic account.
3. **Added Codex extension** — Opened **Extensions**, searched `Codex`, installed the add-on, and signed in with an OpenAI account.
4. **Created a public GitHub repository** — Repository: [fajartriadyp/growth-marketing](https://github.com/fajartriadyp/growth-marketing).
5. **Opened the repository in Cursor** — Cloned locally to `~/growth-marketing` and opened the folder in Cursor (**File → Open Folder**).
6. **Created this README.md** — Documents tools, steps, and troubleshooting notes below.
7. **Committed and pushed to GitHub** — Changes pushed to the `master` branch on `origin`.

## Issues Encountered & Solutions

### Cursor CLI not available in terminal

**Issue:** Running `cursor --version` from the shell failed (sandbox / namespace error on Linux).

**Solution:** Used the Cursor desktop app directly instead of the CLI. To install the shell command later: **Cursor → Command Palette** (`Ctrl+Shift+P`) → **Shell Command: Install 'cursor' command in PATH**.

### GitHub CLI (`gh`) not installed

**Issue:** `gh` was not found when checking auth from the terminal.

**Solution:** Used plain `git push` with HTTPS credentials (GitHub personal access token or credential helper) instead of the GitHub CLI. Optional: install later with `sudo apt install gh`.

### Extension login prompts

**Issue:** Claude Code and Codex extensions require separate sign-in flows after install.

**Solution:** Followed each extension’s **Sign In** button in the Extensions sidebar; completed OAuth in the browser and returned to Cursor. Verified both extensions show as authenticated in the extension panel.

### Empty initial README

**Issue:** The repository only had a placeholder title after the initial commit.

**Solution:** Replaced `README.md` with this full setup document and pushed the update.

## Repository Links

- **GitHub repo:** https://github.com/fajartriadyp/growth-marketing
- **This README on GitHub:** https://github.com/fajartriadyp/growth-marketing/blob/master/README.md

## Local Development

```bash
git clone https://github.com/fajartriadyp/growth-marketing.git
cd growth-marketing
cursor .   # or open the folder via File → Open Folder
```
