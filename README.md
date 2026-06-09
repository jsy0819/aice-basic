# AICE Basic

AICE Basic is a beginner-friendly study app project for preparing for the AICE Basic certificate while learning how to work with Codex.

The first version will be a simple browser-based web app with:

- Study cards for key AICE Basic concepts
- Short quizzes with explanations
- A 15-question mock exam mode
- Progress tracking with `localStorage`
- AIDU workflow checklist practice

## Current Status

This repository is in the setup and planning stage.

The project is intentionally starting small:

- No backend
- No login
- No database
- No external dependencies
- No deployment until the local version feels useful

## Recommended Build Path

1. Define the product plan and study scope.
2. Build a static dashboard in `app/`.
3. Add study cards.
4. Add quiz data and answer explanations.
5. Add mock exam mode.
6. Add progress tracking with `localStorage`.
7. Verify the app in the browser.
8. Deploy with Sites only after local review.

## Project Documents

- [Product plan](docs/product-plan.md)
- [AICE Basic scope](docs/aice-basic-scope.md)
- [Codex workflow](docs/codex-workflow.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Manual setup checklist](docs/manual-setup-checklist.md)

## For Future Codex Turns

Ask Codex like this:

```text
AICE Basic 앱의 다음 단계를 진행해줘.
AGENTS.md와 docs/product-plan.md를 기준으로,
초보자가 이해할 수 있게 설명하면서 작게 구현하고 브라우저로 확인해줘.
```
