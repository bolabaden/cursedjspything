---
date: 2026-05-19
topic: golden-key-parity
---

# Golden harness key-parity guard

## Summary

Add an automated check so every JSON key emitted by the CPython golden reference (`scripts/golden/cases.py`) has a matching key in the pyrt golden builder (`buildPyrtCases` in `scripts/golden/run.ts`), and vice versa, before value-level golden comparison runs. The check fails fast in CI with a clear missing/extra key report.

---

## Problem Frame

The golden harness proves cross-runtime parity by comparing CPython JSON to pyrt output. Today, fixture classes and case keys are maintained in two places with comment-based discipline (`golden:*` markers). Tier-1 work added `rich_lt_both_not_impl_raises` and reinforced the Rev/Incomparable pattern — but nothing mechanically prevents adding a key on one side only.

When keys drift, failures are subtle: extra pyrt-only keys are ignored by `compareCases` (it only iterates expected keys), so a forgotten `cases.py` key might not fail until someone regenerates expected JSON or notices manually. Contributors and agents extending the harness need a cheap guard that compounds trust without expanding golden scope.

---

## Assumptions

*Authored with delegated topic selection (no synchronous confirmation). Review before planning.*

- The guard runs in Node/CI without requiring every Python 3.9–3.14 interpreter to be installed.
- Version-gated keys use the same minor-version thresholds in Python and TypeScript (3.10 / 3.12 / 3.14 today).
- Parsing or extracting key sets from both sides is acceptable; merging into a single authored file is out of scope for this slice.

---

## Requirements

- R1. **Symmetric key sets** — For each supported Python minor version profile used by the harness, the set of case keys (excluding `python`) in the reference emitter and in `buildPyrtCases` must be identical.
- R2. **Version gates aligned** — Keys that appear only at or above 3.10, 3.12, or 3.14 in the reference must follow the same gate in the pyrt builder; keys below a gate must not appear in that profile’s set.
- R3. **Fail fast with actionable output** — On mismatch, the runner reports keys missing from pyrt, keys missing from reference, and which version profile failed; exit non-zero.
- R4. **CI integration** — The check runs on every PR (same workflow as `npm run golden` or as a dedicated script invoked before/at golden).
- R5. **No semantic duplication** — The guard validates structure only; it does not re-run or duplicate value comparisons already done by golden compare.
- R6. **Documented contributor rule** — README or golden docs state: new golden cases require both sides plus optional `golden:` comment; the guard enforces keys, comments remain human hints.

---

## Acceptance Examples

**AE1 — Missing pyrt key**  
Covers: R1, R3  
Given a key exists only in `cases.py` for profile 3.14, when the key-parity check runs for 3.14, then the run fails and lists that key as missing from pyrt.

**AE2 — Orphan pyrt key**  
Covers: R1, R3  
Given `buildPyrtCases` adds a key not present in `cases.py` for the same profile, when the check runs, then the run fails and lists that key as extra on the pyrt side.

**AE3 — Version gate mismatch**  
Covers: R2  
Given `annotate_x` is emitted only for ≥3.14 on one side but always on the other, when the check runs for 3.12, then the key sets for 3.12 differ and the failure names the gate mismatch (not a value diff).

**AE4 — Clean pass**  
Covers: R1, R4  
Given both sides match the current Rev/Incomparable/MRO/slice/buffer/annotate fixtures, when CI runs the check, then it exits 0 without invoking CPython value compare.

---

## Success Criteria

- A contributor cannot merge a PR that adds a `cases.py` key without a matching `buildPyrtCases` entry (and the reverse).
- CI failure messages are sufficient to fix drift without reading `compareCases` source.
- `npm run golden` (or documented sibling script) remains the single entry point contributors use for golden work.
- No increase in required installed Python versions beyond what golden already needs for value checks.

---

## Scope Boundaries

**In scope**

- Key-set parity across version profiles
- CI wiring and contributor documentation
- Optional Vitest smoke that imports the checker (if that matches repo patterns)

**Deferred for later**

- Auto-generating `buildPyrtCases` from Python
- Expanding golden case count (protocol-family goldens are a separate brainstorm)
- Validating `golden:` comment text against key names (comments stay advisory)

**Outside this product's identity**

- Running CPython `Lib/test` or `regrtest` in CI
- Replacing value-level golden comparison with key-only checks

---

## Key Decisions

- **Mechanism:** Prefer a structural key-set check at golden harness startup over a third manifest file, unless planning finds manifest lower maintenance.
- **Profiles:** Reuse the harness’s existing version-gate matrix rather than a single “union of all keys” check that ignores gates.

---

## Dependencies / Assumptions

- Existing golden layout: `scripts/golden/cases.py`, `scripts/golden/run.ts`, `scripts/golden/expected/`.
- STRATEGY track “Evidence & documentation” now calls for structural guards; this slice delivers one.

---

## Outstanding Questions

- Should the check live inside `run.ts` or as `npm run golden:keys` called from CI before `golden`? (Planning decides; R4 allows either if PR-blocking.)
- Should unit tests in `test/dispatch/operators.test.ts` continue duplicate `golden:` comments only, or link to a shared key list later?
