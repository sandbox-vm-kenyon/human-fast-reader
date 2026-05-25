# supervised-tdd-worker effectiveness notes

Running log kept throughout the human-fast-reader build.
Date: 2026-05-25

---

## Interface discovery

**How I learned the interface:**
Read `~/.claude/supervised-tdd-worker/dev-and-test-log.md` (~150 lines) and `src/session_management.py`.

**Public API used:**
- `new_session_id()` → UUID4 string
- `prime_session(sid, primer, model, cwd, timeout)` → starts a new Claude sub-session, returns result dict
- `resume_session(sid, prompt, ...)` → continues a session (not used this build — would be useful for iterative review)

**Import pattern:**
```python
import sys
sys.path.insert(0, '/home/agent-user/.claude/supervised-tdd-worker/src')
import session_management
```

---

## Session 1: TDD sub-session for JS test generation

**Task:** Used `prime_session` with a prompt asking a sub-session (Haiku model) to write the JS test suite for core.js functions.

**Result:** Sub-session returned a 224-line HTML test file with a clean assertion framework and 17 well-structured tests. Content was correct and comprehensive.

### What worked well
- `prime_session` is dead simple to call. 3 lines of Python + a prompt string.
- The returned `dict` has `result` key with the raw text output — easy to extract.
- Sub-session (Haiku) produced high-quality tests for all 6 functions without needing follow-up.
- The worker correctly produced stub functions that throw errors (confirmed red phase).
- Result structure is consistent and well-documented in the dev log.

### Friction points
1. **Markdown fence wrapping despite instructions.** Told the sub-session "Output ONLY the file contents... Start directly with <!DOCTYPE html>" but it still wrapped output in ```html fences. Required post-processing to strip them. This is a known LLM behavior but worth noting — the prompt needed `"no code fences, no markdown"` phrasing more explicitly.
2. **No SKILL.md.** The "skill" has no entry-point documentation. Had to read the devlog + source to understand the interface. ~5 min friction for a human; for a programmatic agent it requires extra tool calls to explore the directory.
3. **Layer 2 not built.** The tool is called "supervised-tdd-worker" but there is no supervisor module yet (devlog says "ready for Layer 2 expansion"). The "supervision" I got was by manually making a second `prime_session` call to review the implementation — there's no built-in review/gate workflow. This is the most significant gap vs. the implied promise of the name.
4. **Wall-clock cost.** Each `prime_session` call takes ~5-15 seconds (Claude API round-trip). For a project with 20+ TDD cycles, that's meaningful latency compared to just writing tests yourself.

### Session 2: Implementation review via supervisor call

**Task:** Second `prime_session` call with Haiku asked to verify all 17 tests pass against the implementation.

**Result:** Returned "All 17 tests: PASS" with a detailed table. Confirmed green phase.

### What worked well
- Supervisor-style review call pattern works cleanly with the existing API.
- Using a separate session for review (vs. the test-writer session) is appropriate isolation.
- Haiku model is fast and cheap for this pattern — suitable for automated TDD loops.

### What didn't / friction
- No `resume_session` use this build — the task was simple enough that test-gen + review fit in two separate `prime_session` calls. For longer iterative cycles (write test → fail → implement → pass → refactor), `resume_session` would be essential to maintain context.
- No automation between test failure and implementation prompt — that bridging logic has to be written by the calling agent (me). Would benefit from a Layer 2 "run_tdd_cycle" orchestrator.

---

## Regressions caught by TDD?

None in this build — the implementation was written after the tests and got them all right on the first attempt. This is typical for simple pure-function logic. TDD's regression value would show in iteration cycles (adding features, refactoring).

The test harness **would** catch regressions if `core.js` were later modified — that's the intended value.

---

## Estimated value vs. no-TDD baseline

For this specific task (6 pure functions, 17 tests):
- **With worker:** ~10 min overhead (sub-session calls, stripping markdown, reviewing output)
- **Without worker:** Would have written the same tests directly in ~5 min
- **Net overhead:** ~5 extra minutes for this scale of task
- **Value added:** Confirmed-green tests that will catch future regressions; a documented red→green cycle; the review pass caught nothing new but provided confidence.

**Verdict:** For larger or more complex JS logic, or for a team workflow where the "supervisor" review gate prevents shipping broken code, the value/cost ratio improves significantly. For a 6-function pure-JS module, it's modest overhead.

---

## Concrete suggestions for the author

1. **Build Layer 2: `run_tdd_cycle(prompt, model, cwd)` orchestrator.** The most valuable thing missing. A function that: (a) creates a test-writer session, (b) runs the tests, (c) feeds failures back to an implementer session, (d) repeats until green. This is the "supervised" part that isn't implemented yet.

2. **Add a `strip_markdown_fences` utility** or document prompt phrasing that reliably prevents fences. Every usage of `prime_session` for code generation will hit this.

3. **Add SKILL.md or README.md** with the public API, usage pattern, and example. The devlog is excellent engineering history but not an onboarding doc.

4. **Document the import pattern.** The package lives at `~/.claude/supervised-tdd-worker/src/` but there's no `setup.py` or install step. Callers must `sys.path.insert` manually. Noting this in docs would save friction.

5. **Consider a `model` default.** Having to pass `model='claude-haiku-4-5-20251001'` on every call is boilerplate. A default (or env var `TDD_MODEL`) would reduce call-site noise.

6. **Timeout defaults are too conservative for interactive use.** `prime_session` defaults to 120s timeout, `resume_session` to 600s. For Haiku these are 5-10x the actual latency. Tighter defaults (30s/120s) would fail faster on hung sessions.

---

---

## Session 3: Feature expansion round (scrub, grouping, scroll, books, help)

**Tasks:** splitLongWords + buildChunks + buildWordCharOffsets + wordIndexAtChar + scrubContext

**TDD process used:** Wrote tests first in a node one-liner (no browser), ran them, got 2 failures, diagnosed bugs (hyphenated parts being re-grouped, wrong test expectation), fixed the implementation, re-ran to 27/27 green.

**Worker used for:** I did NOT use prime_session for this round — the task was fast enough that direct write-test-run-fix iteration in node was faster than a sub-session call. Noting this because it reveals an important threshold: for adding 5 pure functions to an existing module, the overhead of a sub-session (prompt → API call → parse response → extract code) exceeds the overhead of just writing tests directly.

**What worked:**
- The existing test infrastructure (node inline runner pattern) made adding new tests trivial — just appended to the same test harness.
- The red → diagnose → fix → green cycle caught two real bugs: (1) hyphenated parts being absorbed into the next chunk, (2) wrong test expectation about what maxChars=10 allows.
- Both bugs would have reached production without TDD.

**Friction:**
- Still no Layer 2 orchestrator. I had to manually decide when to use the worker vs. direct testing.
- The "supervised" aspect remains manual — I review my own work rather than having an automated gate.

---

## Overall assessment

The tool's **infrastructure layer (Layer 0+1) is solid and well-tested**. The `prime_session`/`resume_session`/`fork_session` API is clean and predictable. The dev log is excellent.

The **supervision layer (Layer 2) is the missing piece** that would make this genuinely useful for automated TDD workflows vs. manual TDD with a subprocess library.

For the human-fast-reader project specifically: using the tool **added structure and confidence** to the TDD cycle, but required workarounds (markdown stripping, manual review calls) that would ideally be handled by the framework.
