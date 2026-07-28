---
name: git-workflow
description: "Guidelines for git commits, conventional commit formatting, and AI branching."
---

# Git Workflow & Commit Standards

When Antigravity agents are tasked with committing code, they must adhere to standard professional practices to keep the repository history clean.

## 1. Conventional & Customer-Facing Commits
All commit messages must follow the Conventional Commits specification with customer-friendly descriptions:
- `feat:` for new features (written in clear, user-facing language for `/changelog`)
- `fix:` for bug fixes
- `refactor:` for internal code restructuring (omitted from public changelog)
- `style:` for formatting, missing semi-colons, etc.
- `chore:` for updating dependencies, build scripts, etc. (omitted from public changelog)

*Example:* `feat(auth): add two-factor authentication via email`
*Note:* Avoid raw technical filenames or internal symbols in commit subjects as post-commit hooks auto-derive entries for `changelog.json`.

## 2. Commit Sizing
- Agents should strive to make atomic, logical commits. 
- Do not group massive, unrelated changes (e.g., fixing a UI bug and adding a new database table for a different feature) into a single "fixed things" commit.

## 3. Descriptive Bodies
- If the change is complex, the commit message should include a body explaining *why* the change was made, not just *what* changed.

## 4. AI Anti-Pattern Warning: The Monolithic Commit
- **Do not commit everything at the end:** As an AI, it is very easy to work in massive multi-file bursts touching backend, frontend, and database migrations. If you wait until the end of a session to commit, you will inevitably create a monolithic commit that violates the "atomic" rule.
- **Rule of Thumb:** Commit continuously. After generating the backend/database changes, commit them. Then build the frontend, and commit that separately. Do not wait until the entire feature is 100% complete across the entire stack.
