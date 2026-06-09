# Implementation Roadmap

## Phase 0: Setup

Status: in progress

Deliverables:

- `AGENTS.md`
- `README.md`
- Product plan
- AICE Basic scope note
- Codex workflow note
- Manual setup checklist
- Git repository initialization

## Phase 1: Static App Shell

Goal: Open a real first screen in the browser.

Deliverables:

- `app/index.html`
- `app/styles.css`
- `app/main.js`
- Dashboard layout
- Topic cards
- Buttons for Quiz, Mock Exam, and AIDU Checklist

Acceptance check:

- The app opens locally in a browser.
- The first screen is usable, not a marketing page.
- The layout works on desktop and mobile.

## Phase 2: Study Cards

Goal: Learn concepts one by one.

Deliverables:

- Study card data
- Topic filter
- Completed-card tracking with `localStorage`

Acceptance check:

- The user can mark a card as learned.
- Progress remains after refreshing the browser.

## Phase 3: Quiz Mode

Goal: Practice short questions with explanations.

Deliverables:

- Quiz data structure
- Multiple-choice UI
- Correct/incorrect feedback
- Explanation panel
- Weak-topic tracking

Acceptance check:

- The user can answer questions and understand why.
- The app records attempts locally.

## Phase 4: Mock Exam Mode

Goal: Simulate AICE Basic practice.

Deliverables:

- 15-question mock exam
- 60-minute timer
- Score calculation
- 80-point pass threshold
- Result screen by topic

Acceptance check:

- The user can complete a mock exam.
- The result identifies weak topics.

## Phase 5: AIDU Workflow Practice

Goal: Rehearse the no-code AI workflow.

Deliverables:

- AIDU-style checklist
- Scenario cards
- Step-by-step reasoning prompts

Acceptance check:

- The user can explain the workflow from data inspection to performance improvement.

## Phase 6: Polish

Goal: Make the app pleasant enough for daily use.

Deliverables:

- Responsive layout improvements
- Better empty states
- More quiz questions
- Printable summary notes if useful

Acceptance check:

- The user can use the app comfortably for repeated study sessions.

## Phase 7: Optional Deployment

Goal: Share or access the app from another device.

Deliverables:

- Sites-compatible deployment path
- Saved version
- Production deployment only after review

Acceptance check:

- The deployed URL opens correctly.
- Access settings are intentional.
