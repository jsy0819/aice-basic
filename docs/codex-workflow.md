# Codex Workflow For This Project

This project is also a Codex learning project. The goal is to learn by building.

## How To Ask Codex

Use outcome-focused requests.

Good example:

```text
퀴즈 화면을 만들어줘.
문제를 풀면 정답 여부와 쉬운 해설이 나오게 하고,
초보자가 이해할 수 있게 변경 내용을 설명해줘.
```

Better example:

```text
docs/product-plan.md 기준으로 퀴즈 화면 MVP를 구현해줘.
localStorage에 풀이 기록을 저장하고,
브라우저에서 직접 확인한 뒤 결과를 알려줘.
```

## Recommended Turn Structure

For each development turn, Codex should:

1. Read relevant files.
2. Explain what will change.
3. Make a small implementation.
4. Run or open the app when possible.
5. Fix obvious issues.
6. Summarize the result in Korean.

## What The User Should Review

The user does not need to read every line of code.

Review these instead:

- Does the screen feel useful?
- Is the wording easy to understand?
- Is the quiz explanation convincing?
- Does the flow match AICE Basic study?
- Is anything confusing or too complex?

## Useful Codex Requests

### Explain The Project

```text
이 프로젝트 구조를 코딩 초보자 기준으로 설명해줘.
```

### Build Next Feature

```text
다음 기능을 작게 구현해줘.
먼저 어떤 파일을 바꿀지 알려주고, 구현 후 실행 방법을 알려줘.
```

### Improve UI

```text
Browser로 화면을 확인하고,
모바일에서도 겹치거나 넘치는 부분이 없는지 고쳐줘.
```

### Add Study Content

```text
AICE Basic 데이터 전처리 범위에 맞춰 퀴즈 10개를 추가해줘.
각 문제에는 쉬운 해설과 topic 태그를 넣어줘.
```

### Review Changes

```text
방금 변경한 내용을 초보자 기준으로 요약해줘.
내가 직접 확인해야 할 부분만 알려줘.
```

## Plugins To Use

- Browser: local app preview and UI verification
- Spreadsheets: quiz bank or progress table planning
- Documents: printable study notes later
- Sites: deployment later, after local review

## Plugins To Delay

- GitHub: useful later if the project moves to GitHub
- Google Drive: useful later if study notes live in Drive
- Slack or Gmail: not needed for this project now
- Security plugin: useful later for larger codebases, not urgent for this MVP
