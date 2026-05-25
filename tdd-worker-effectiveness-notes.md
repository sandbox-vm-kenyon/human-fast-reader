# supervised-tdd-worker effectiveness notes

Running log kept throughout the human-fast-reader build.
Date: 2026-05-25

---

## Interface discovery

**How I learned the interface:**
Read `~/.claude/supervised-tdd-worker/dev-and-test-log.md` and `src/session_management.py`.

**Public API (what I'll use):**
- `new_session_id()` → UUID4 string
- `prime_session(sid, primer, model, cwd, timeout)` → starts a new Claude sub-session
- `resume_session(sid, prompt, model, cwd, timeout)` → continues an existing session
- `fork_session(parent_sid, prompt, ...)` → branches a session (fork-of-fork rejected)
- `session_exists(sid)` → checks if JSONL exists

**Conceptual use pattern for TDD:**
1. `prime_session` with a system prompt like "You are a TDD worker. Write tests first, then implement."
2. `resume_session` for each task (write test → verify red → implement → verify green)

**Initial friction (before first use):**
- No SKILL.md makes the entry point non-obvious. Required reading ~150 lines of devlog + source.
- The tool is in Layer 1 of ~2+ planned layers — Layer 2 ("expansion") not yet built. No "supervisor" module exists yet (the name implies one is coming).
- `call_blocking` requires `_CLAUDE_BIN_OVERRIDE` env var for testing but uses `claude` binary by default — fine for real usage.
- The tool spawns actual Claude CLI processes. For a short static-app build, the latency of sub-sessions adds real wall-clock cost. Worth documenting.

---

## Session 1: JS core logic — word parser + WPM controller

*(Will be filled in as work proceeds)*

---

## Ongoing notes template

### What worked
-

### What didn't / friction
-

### Regressions caught by TDD?
-

### Estimated value vs. no-TDD baseline
-

### Suggestions for the author
-
