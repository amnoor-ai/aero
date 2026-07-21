---
name: git-workflow
description: "Guidelines for git commits, conventional commit formatting, and AI branching."
---

# Git Workflow & Commit Standards

When Antigravity agents are tasked with committing code, they must adhere to standard professional practices to keep the repository history clean.

## 1. Conventional Commits
All commit messages must follow the Conventional Commits specification:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code changes that neither fix a bug nor add a feature
- `style:` for formatting, missing semi-colons, etc.
- `chore:` for updating dependencies, build scripts, etc.

*Example:* `feat(auth): implemented two-factor authentication via email`

## 2. Commit Sizing
- Agents should strive to make atomic, logical commits. 
- Do not group massive, unrelated changes (e.g., fixing a UI bug and adding a new database table for a different feature) into a single "fixed things" commit.

## 3. Descriptive Bodies
- If the change is complex, the commit message should include a body explaining *why* the change was made, not just *what* changed.

## 4. AI Anti-Pattern Warning: The Monolithic Commit
- **Do not commit everything at the end:** As an AI, it is very easy to work in massive multi-file bursts touching backend, frontend, and database migrations. If you wait until the end of a session to commit, you will inevitably create a monolithic commit that violates the "atomic" rule.
- **Rule of Thumb:** Commit continuously. After generating the backend/database changes, commit them. Then build the frontend, and commit that separately. Do not wait until the entire feature is 100% complete across the entire stack.
