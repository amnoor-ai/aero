---
name: public-changelog
description: Protocol for managing user-facing public changelogs via changelog.json and git commit hooks.
---

# Public Changelog Protocol (`changelog.json`)

Use this skill when preparing commits or updating project changelogs to ensure non-technical, customer-facing transparency.

## 1. User-Facing Commit Subject Format
- Write commit subjects in plain, customer-accessible language focusing on end-user benefits.
- **Do NOT** use raw code symbols, technical filenames (e.g. `Tasks/Index.tsx`), package names, or internal architecture details in primary commit subjects.
- *Good:* `feat(tasks): add CSV export action to global tasks directory`
- *Bad:* `feat(tasks): added handleExport function and Button component to Tasks/Index.tsx`

## 2. Post-Commit Hook & Automated Versioning
- The `post-commit` hook automatically extracts the commit subject and folds it into `changelog.json` via `--amend`.
- Internal commits (`chore:`, `test:`, `ci:`, `docs:`, merges, dependency updates) are automatically filtered out by the changelog parser. Do not force technical chores into the changelog.
- Version numbers are computed automatically based on commit count (`0.<commits/100>.<commits%100>`). Never manually edit `current` or `version` fields in `changelog.json`.

## 3. Regenerating Public Changelogs
- If derived entries need full sync or manual cleanup, run:
  ```bash
  php artisan changelog:generate --force
  ```
- The resulting user-facing release notes are rendered at `/changelog`.
