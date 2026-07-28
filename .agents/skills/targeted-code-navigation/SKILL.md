---
name: targeted-code-navigation
description: High-efficiency code navigation, targeted grepping, and pattern cloning rules.
---

# Targeted Code Navigation & Efficiency Guidelines

Use this skill when investigating issues, reading documentation, or planning code changes across the codebase.

## 1. Targeted Grepping Over Full-Reading
- Never read full multi-hundred line files when searching for specific functions, components, or error locations.
- Always use `grep_search` to pinpoint exact symbol definitions or line ranges first, then inspect only the surrounding snippet.

## 2. Doc Inspection Workflow
- When consulting `docs/`, read `docs/README.md` first to locate the right file.
- Use targeted grep searches on specific doc files rather than dumping entire documentation files into context.
- Run `search-docs` (Boost MCP) prior to modifying framework or vendor package integrations.

## 3. Strict Pattern Cloning ("No Invention")
- Do not invent custom architectural patterns or structural abstractions.
- Identify the nearest existing working sibling file (e.g. nearest controller or page component), clone its structure, and adjust names and types.

## 4. Single-Question Clarification Rule
- When user requirements contain ambiguity, ask at most **ONE** targeted, high-impact question before proceeding. Do not output lists of clarifying questions.
- Let code diffs and test results communicate the work rather than verbose natural language explanations.
