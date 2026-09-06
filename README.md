# ITCS333 — Assignment 1: HTML Page + GitHub Workflow (2.5%)

Build a small two-page personal profile site in valid, semantic HTML5 **and** demonstrate the Git workflow used throughout this course.

## Learning outcomes
CILO 1, 2 — semantic HTML5 structure; version control with Git/GitHub.

## What you must build
1. `index.html` — your profile home page.
2. `about.html` — an "About me" page.
3. Both pages must share consistent navigation.
4. Work with Git: **at least 3 meaningful commits**, and at least one **feature branch merged via a pull request** in your fork.

## Requirements (graded — see rubric)
- Valid HTML5 (`<!DOCTYPE html>`, `lang` attribute, `<title>` on each page).
- Semantic elements: `header`, `nav`, `main`, `footer`.
- Correct heading hierarchy (`h1` before `h2`).
- Internal navigation between the two pages + at least one external link.
- At least one image with a non-empty `alt` attribute (put files in `assets/`).
- One ordered list **and** one unordered list across the two pages.
- Git history: ≥3 commits with meaningful messages; ≥1 merged PR from a feature branch.

## Rubric (100 points = 2.5% of course grade)
| # | Check | Points |
|---|---|---|
| 1 | Valid HTML5 boilerplate (`doctype`, `lang`, `<title>`) on both pages | 15 |
| 2 | Semantic elements `header`/`nav`/`main`/`footer` present | 15 |
| 3 | Heading hierarchy `h1 → h2` correct on both pages | 10 |
| 4 | Internal links between pages + ≥1 external link | 10 |
| 5 | ≥1 image with non-empty `alt` | 10 |
| 6 | Ordered + unordered lists present | 10 |
| 7 | ≥3 commits with meaningful messages | 20 |
| 8 | ≥1 pull request merged from a feature branch | 10 |

Checks 1–6 run automatically on every push (see badge above). Checks 7–8 are verified from your repository history at grading time.

## How to work on this assignment
1. **Fork** this repository (top-right button on GitHub).
2. In your fork, open the **Actions** tab and click "I understand my workflows, enable them" (one time only).
3. **Clone your fork** locally: `git clone https://github.com/<your-username>/itcs333-a1-html-github.git`
4. Create a feature branch: `git checkout -b feature/profile-content`
5. Edit `index.html` / `about.html`, commit with meaningful messages, push.
6. Open a **pull request** in your fork and merge it.
7. Run the tests locally (below) until you're happy.
8. **Submit your fork URL in Blackboard** before the deadline.

## Run the tests locally
```bash
npm ci --prefix tests   # first time only (installs test dependencies)
./run_tests.sh          # runs the same checks as GitHub Actions
```
Output lines look like `CHECK html_doctype PASS 15/15` — the same format the grader uses.

## Rules
- This is an **individual** assignment. Do not share code.
- Do not modify anything under `tests/` or `.github/` — official grading uses the instructor's pristine copy of the tests, and tampering is an academic-integrity violation.
