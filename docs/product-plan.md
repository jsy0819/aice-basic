# Product Plan: AICE Basic

## Purpose

Build a simple study web app that helps a beginner prepare for AICE Basic and learn Codex through a real project.

The app should make the user feel:

- "I know what to study today."
- "I understand why this answer is right."
- "I can follow the AIDU-style workflow without getting lost."
- "I can see which topic is still weak."

## Audience

- AICE Basic test taker
- Non-programmer
- AI and data analysis beginner
- Wants a guided study flow rather than a dense textbook

## App Name

AICE Basic

## Core Experience

The first screen should be a study dashboard, not a landing page.

Recommended first-screen sections:

- Today's study focus
- Exam progress summary
- Four topic cards
- Quick quiz button
- Mock exam button
- AIDU checklist button
- Weak topics panel

## Main Features

### 1. Study Cards

Topic-based concept cards with short explanations and examples.

Initial topics:

- Exploratory data analysis
- Missing values
- Outliers
- Encoding
- Normalization
- Decision tree
- Random forest
- KNN
- Deep learning basics
- Model performance evaluation
- Feature importance
- Performance improvement simulation

### 2. Quiz Mode

Short practice questions with:

- Question
- Choices
- Correct answer
- Explanation
- Topic tag
- Difficulty

The goal is not only to mark right or wrong, but to explain the thinking process.

### 3. Mock Exam Mode

Simulate the AICE Basic pressure lightly:

- 15 questions
- 60-minute timer
- 80-point pass threshold
- Result screen with weak topic summary

### 4. AIDU Workflow Checklist

Help the user rehearse the flow used in AIDU-style no-code AI practice.

Example steps:

1. Understand the problem.
2. Check the dataset columns.
3. Inspect missing values and outliers.
4. Explore visual patterns and correlations.
5. Apply preprocessing.
6. Choose a model.
7. Train and evaluate the model.
8. Check feature importance.
9. Try performance improvements.
10. Review what changed.

### 5. Progress Tracking

Use browser `localStorage` for the first version.

Track:

- Completed cards
- Quiz attempts
- Mock exam scores
- Weak topics
- Last study date

## Non-Goals For The First Version

- Login
- Server backend
- Cloud database
- Payment
- User accounts
- Real AIDU integration
- Uploading private files
- AI chatbot tutor

These can be reconsidered after the first useful local version exists.

## Design Direction

- Quiet dashboard style
- Clear topic grouping
- High readability
- Calm colors with enough contrast
- No oversized marketing hero
- No decorative clutter
- Mobile-friendly layout

## Success Criteria

The first useful version is successful if the user can:

- Open the app locally
- Study one topic
- Take a short quiz
- See an explanation
- Run a 15-question mock exam
- Return later and keep progress

## Sources To Re-Check

- Official AICE Basic page: https://aice.study/info/aice/basic
- Official AICE overview page: https://aice.study/info/aice

Exam details can change, so re-check the official page before final exam preparation.
