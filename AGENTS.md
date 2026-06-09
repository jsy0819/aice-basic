# AGENTS.md

## User Context

- The user is new to Codex and is not comfortable reading or writing code yet.
- Explain work in Korean unless the user asks otherwise.
- Keep explanations practical and beginner-friendly.
- After making changes, briefly explain what changed, how to run or check it, and what the next useful step is.

## Project Goal

- Build a study web app for the AICE Basic certificate.
- The app should help the user prepare for AICE Basic through concept cards, quizzes, mock exams, and AIDU workflow practice.
- The app should not pretend to replace AIDU. It should train the thinking process needed before and during AIDU-based practice.

## Product Direction

- App name: AICE Basic.
- Target user: a non-programmer preparing for AICE Basic.
- Storage: use browser `localStorage` first.
- First version: no login, no backend, no database, no payment, no account system.
- Design tone: calm, clear, study-focused dashboard UI.
- Avoid a marketing-style landing page. The first screen should be the usable study dashboard.

## Development Rules

- Prefer small, working increments over large rewrites.
- Use static HTML/CSS/JavaScript first unless the user asks for a framework.
- If a framework becomes useful later, explain why before introducing it.
- Keep files easy to understand and name them clearly.
- Verify UI changes in a browser whenever possible.
- Use accessible labels, readable contrast, responsive layout, and stable dimensions for repeated UI elements.
- Do not add dependencies unless they clearly improve the project.

## AICE Basic Study Scope

- Use official AICE pages as the source for exam structure and scope when current facts matter.
- Treat exam details as changeable. Re-check official AICE information before final exam prep.
- Core topics:
  - Exploratory data analysis
  - Data preprocessing
  - AI modeling
  - Model performance evaluation
  - AIDU workflow familiarity

## Codex Working Style

- Before editing files, state what will be changed.
- When exploring the project, summarize what was learned.
- If a command needs approval, ask with a clear reason.
- If a test or browser check cannot be run, say so.
- Do not overwrite user changes without permission.
