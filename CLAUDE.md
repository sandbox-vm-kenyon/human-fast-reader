# human-fast-reader

A **simple, mobile-friendly web app** for fast human reading. The technique: **show one word at a time in the same spot, moving very quickly** (so the eye doesn't have to scan; words appear and disappear in place).

## What the user said (verbatim — do not paraphrase into requirements)

> "build out a human fast reader web app. Simple mobile friendly site that uses a trick where one word is shown at a time in the same spot, moving very quickly."

Added later:

> "build the web hosting GitHub repo all accounts get to host the web tool"
> "load as default a public domain book text for testing"
> "Have it use the supervised tdd worker skill, taking notes on effectiveness"

## Naming clarification

There is an **existing** unrelated host-side tool also named "fastReader" — a **developer file-scanner skill** for navigating code/text files. **This project is not that.** This is a human-facing web app for the user to *read*.

## Constraints

- Web app, **mobile-first**.
- **One word visible at a time** in a fixed location on screen.
- High words-per-minute (WPM), easy to adjust + pause/resume.
- Stay inside this VM sandbox at `~/sandbox-projects/human-fast-reader/`.
- Minimal dependencies. Prefer browser-native APIs. A single static HTML/CSS/JS bundle is fine.

## Required setup (do these as part of the build)

1. **Public GitHub repo on the dedicated `sandbox-vm-kenyon` account**, configured for **GitHub Pages** so the repo itself hosts the web tool publicly (no separate server / no ngrok needed). PAT + account notes: `~/Documents/agent-vm-control-reference/github-account.md`.
   - Repo name: `human-fast-reader`.
   - **Add collaborator `randyhaylor` immediately.**
   - Enable GitHub Pages; confirm the live URL works.
2. **Default test text:** ship the app pre-loaded with a **public-domain book text** (Project Gutenberg is fine — e.g., *Pride and Prejudice*, *Alice's Adventures in Wonderland*, *The Picture of Dorian Gray*). Bundle it in the repo, load by default, let the user paste their own to override.

## Use the supervised-tdd-worker skill (and take effectiveness notes)

You are required to use the **supervised-tdd-worker** skill at `~/.claude/supervised-tdd-worker/` throughout this build. The skill has no SKILL.md upstream; read its `src/` modules + `dev-and-test-log.md` to learn its interface. Then drive your work through it (test-first, supervised by it, per its design).

While using it, **continuously keep an effectiveness log at `./tdd-worker-effectiveness-notes.md`** in this project's root. Track:
- What worked well, what didn't.
- Any friction points (interface clarity, supervision behavior, places you had to work around it).
- Whether using it produced better code / fewer regressions than you'd estimate without it.
- Concrete suggestions you'd give its author for the next iteration.

This is the user's primary test of the skill's real-world effectiveness, so notes matter as much as the code.

## Workflow notes

- You are running inside a Claude Code session named `human-fast-reader` with Remote Control enabled, so the user may steer you from a phone app at any time.
- After meaningful units of work (TDD-worker interface understood, repo created, Pages live, default text loading, prototype walkable, prototype usable), surface a one-line summary.
- The host-side agent is available to move files in/out of the VM or run host-side tasks on request.
