# insTools — Agent Instructions

You are an AI coding assistant working on the insTools project.

## Developer Docs

Project management files are in `docs-dev/`:
- `ROADMAP.md` — 🎯 What to do next (planned tasks & progress)
- `CURRENT.md` — 🔥 What is being worked on right now (active task)
- `ISSUES.md` — 🐛 What needs fixing (bugs & improvements found during work)
- `CHANGELOG.md` — ✅ What has been done (completed features)
- `CONVENTIONS.md` — 📐 How to write code (structure, naming, rules)
- `ARCHITECTURE.md` — 🏗️ Why it's designed this way (StorageAdapter, data flow)
- `DECISIONS.md` — 📝 Why certain choices were made (decision records)

Read the relevant files at the start of a session, do NOT ask which ones to read.

## Startup Flow

At the beginning of each session, do this automatically:

1. **Read `ROADMAP.md`** — Understand the overall phase and long-term direction
2. **Read `CURRENT.md`** — Identify the exact active task
3. **Read `ISSUES.md`** — Check for blocking bugs or relevant suggestions
4. **Synthesize** — Based on all three, give the user a concise summary and specific development suggestions

Example:
> "当前是 Phase 2（Workers API），你在做 JWT 认证。ISSUES 里没有阻塞项，建议按 CURRENT.md 的顺序推进。需要我开始实现吗？"

## Task Completion

After finishing a task:
- Update `docs-dev/CHANGELOG.md` with what was done
- Update `docs-dev/ROADMAP.md` to reflect progress
- Update `docs-dev/CURRENT.md` to advance to the next task
- If a new issue or bug was discovered, update `docs-dev/ISSUES.md`
- If an architectural decision was made, update `docs-dev/DECISIONS.md`

## Key Conventions

- `docs/` = GitHub Pages static site (do not modify without explicit request)
- `src/` = Cloudflare Pages source code
- `docs-dev/` = Developer documentation (project progress, conventions, decisions)
- See `docs-dev/CONVENTIONS.md` for detailed code conventions
