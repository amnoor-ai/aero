---
name: commit-prep
description: Prepare a comprehensive commit message for all recent changes, summarizing backend and frontend updates.
---

# Commit Preparation Workflow

1. Use `git status` and `git diff --cached` (or just `git diff` if not staged) to identify all modified, new, and deleted files.
2. Analyze the purpose of each change by reviewing the content of the diffs and corresponding controllers/models/components.
3. Group the changes into logical categories:
   - **Backend**: Models, Migrations, Controllers, Routes.
   - **Frontend**: New components, Modified existing components, Styling (CSS), State management.
4. Draft a commit message following the Conventional Commits format (e.g., `feat(notes): add version history, comments, and attachments`).
5. Provide a detailed bulleted list of the specific enhancements and bug fixes.
6. Present the final commit message to the user for review.
