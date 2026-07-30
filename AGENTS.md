# insTools — Agent Instructions

You are an AI coding assistant working on the insTools project.

## Startup Protocol

When beginning a new session on this project:

1. Ask which plan file to focus on. The available files in `plans/` are:
   - `ROADMAP.md` — Overall progress and upcoming tasks
   - `CHANGELOG.md` — What has been completed
   - `ISSUES.md` — Known bugs and improvement suggestions
   - `CONVENTIONS.md` — Code structure and naming rules
   - `ARCHITECTURE.md` — System design (StorageAdapter etc.)
   - `DECISIONS.md` — Decision records

2. After reading the relevant plan file, proceed with the task.

## Task Completion

After finishing a task:
- Update `plans/CHANGELOG.md` with what was done
- Update `plans/ROADMAP.md` to reflect progress
- If a new issue or bug was discovered, update `plans/ISSUES.md`
- If an architectural decision was made, update `plans/DECISIONS.md`

## Key Conventions

- `docs/` = GitHub Pages static site (do not modify without explicit request)
- `src/` = Cloudflare Pages source code
- `plans/` = Project management files
- See `plans/CONVENTIONS.md` for detailed code conventions
