# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

---

## Delta update (2026-05-24, plan 104 bytes rsplit)

### Landed

- [REPO] Plan 104 — `bytes.rsplit(sep=None, maxsplit=-1)` → `pyList` of `pyBytes`; `bytes-rsplit.test.ts`.

### Partial

- None.

### Next

1. Further bytes methods (`startswith`, `partition`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 103 merge PR #65)

### Landed

- [REPO] Plan 103 — PR #65 merged; plan 102 bytes split on `main` (358 Vitest, 57 files).

### Partial

- None.

### Next

1. Further bytes methods (`rsplit`, `startswith`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 102 bytes split)

### Landed

- [REPO] Plan 102 — `bytes.split(sep=None, maxsplit=-1)` → `pyList` of `pyBytes`; `bytes-split.test.ts`.

### Partial

- None.

### Next

1. Further bytes methods (`rsplit`, `startswith`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 101 merge PR #64)

### Landed

- [REPO] Plan 101 — PR #64 merged; plan 100 str encode errors on `main` (349 Vitest, 56 files).

### Partial

- None.

### Next

1. Further bytes/str codec handlers or bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 100 str encode errors)

### Landed

- [REPO] Plan 100 — `str.encode(encoding, errors=)` → `pyBytes`; `PyUnicodeEncodeError`; `str-encode.test.ts`.

### Partial

- None.

### Next

1. Further bytes/str codec handlers or bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 099 merge PR #63)

### Landed

- [REPO] Plan 099 — PR #63 merged; plan 098 bytes join on `main` (341 Vitest, 55 files).

### Partial

- None.

### Next

1. `str.encode(errors=...)` or further bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 098 bytes join)

### Landed

- [REPO] Plan 098 — `bytes.join(iterable)` → `pyBytes`; `bytes-join.test.ts`.

### Partial

- None.

### Next

1. `str.encode(errors=...)` or further bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 097 merge PR #62)

### Landed

- [REPO] Plan 097 — PR #62 merged; plan 096 bytes decode errors on `main` (335 Vitest, 54 files).

### Partial

- None.

### Next

1. `bytes.join` or `str.encode(errors=...)` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 096 bytes decode errors)

### Landed

- [REPO] Plan 096 — `bytes.decode(..., errors=)` strict/replace/ignore for UTF-8; extended `bytes-decode.test.ts`.

### Partial

- None.

### Next

1. `bytes.join` or `str.encode(errors=...)` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 095 merge PR #61)

### Landed

- [REPO] Plan 095 — PR #61 merged; plan 094 bytes decode on `main` (330 Vitest, 54 files).

### Partial

- None.

### Next

1. Further bytes API (encode errors modes, join, etc.) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 094 bytes decode)

### Landed

- [REPO] Plan 094 — `bytes.decode()` → `pyStr` (utf-8 default, latin-1); `PyUnicodeDecodeError` / `PyLookupError`; `bytes-decode.test.ts`.

### Partial

- None.

### Next

1. Further bytes API (encode errors modes, join, etc.) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 093 merge PR #60)

### Landed

- [REPO] Plan 093 — PR #60 merged; plan 092 bytes slice indexing + `sliceIndices` reverse fix on `main` (324 Vitest, 53 files).

### Partial

- None.

### Next

1. bytes `decode()` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 092 bytes slice indexing)

### Landed

- [REPO] Plan 092 — bytes `__getitem__(slice)` → `pyBytes`; `bytes-slice-index.test.ts`.

### Partial

- None.

### Next

1. bytes `decode()` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 091 merge PR #59)

### Landed

- [REPO] Plan 091 — PR #59 merged; plan 090 bytes getitem + rich compare on `main` (320 Vitest, 52 files).

### Partial

- None.

### Next

1. bytes slice indexing and decode when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 090 bytes getitem and rich compare)

### Landed

- [REPO] Plan 090 — bytes `__getitem__` (int → `pyInt`); rich compare slots; `bytes-getitem-compare.test.ts`.

### Partial

- None.

### Next

1. bytes slice indexing and decode when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 089 merge PR #58)

### Landed

- [REPO] Plan 089 — PR #58 merged; plan 088 bytes PyObject + cross-type evidence on `main` (315 Vitest, 51 files).

### Partial

- None.

### Next

1. bytes API expansion (getitem, rich compare, decode) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 088 bytes PyObject cross-type)

### Landed

- [REPO] Plan 088 — `bytesType` / `pyBytes`; `bytes(str)` returns PyObject; `operator-bytes-cross-type.test.ts` (315 Vitest, 51 files).

### Partial

- None.

### Next

1. bytes API expansion (getitem, rich compare, decode) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 087 merge PR #57)

### Landed

- [REPO] Plan 087 — PR #57 merged; plan 086 LIVING-PLAN archive on `main` (active ~129 lines + `LIVING-PLAN-ARCHIVE.md`; 309 Vitest).

### Partial

- None.

### Next

1. bytes object cross-type §8.15 when prioritized (requires bytes PyObject surface).

---

## Delta update (2026-05-24, plan 086 LIVING-PLAN archive)

### Landed

- [REPO] Plan 086 — moved 68 historical delta blocks (plan 074 → 2026-05-19) to `LIVING-PLAN-ARCHIVE.md`; active file retains plans 081–085 + current objective (136 lines vs 1200).

### Partial

- None.

### Next

1. bytes object cross-type §8.15 when prioritized (requires bytes PyObject surface).

---

## Delta update (2026-05-24, plan 085 merge PR #56)

### Landed

- [REPO] Plan 085 — PR #56 merged; plan 084 sequence exotic evidence sync on `main` (309 Vitest, 50 files).

### Partial

- None.

### Next

1. bytes object cross-type §8.15 when prioritized (requires bytes PyObject surface).
2. Optional deeper LIVING-PLAN archive when doc maintenance is scheduled.

---

## Delta update (2026-05-24, plan 084 sequence exotic evidence sync)

### Landed

- [REPO] Plan 084 — COMPATIBILITY §8.15 evidence lists `sequence-cross-type.test.ts` and `sequence-repeat-nonint.test.ts`; remaining-gap text updated (309 Vitest).

### Partial

- None.

### Next

1. bytes object cross-type §8.15 when prioritized (requires bytes PyObject surface).
2. Optional deeper LIVING-PLAN archive when doc maintenance is scheduled.

---

## Delta update (2026-05-24, plan 083 merge PR #55)

### Landed

- [REPO] Plan 083 — PR #55 merged; plan 082 LIVING-PLAN prune on `main` (309 Vitest, 50 files; zero `[OPEN] PRs` partials).

### Partial

- None.

### Next

1. bytes / bool↔str / sequence exotic §8.15 when prioritized.
2. Optional deeper LIVING-PLAN archive when doc maintenance is scheduled.

---

## Delta update (2026-05-24, plan 082 LIVING-PLAN stale partial prune)

### Landed

- [REPO] Plan 082 — replaced 23 stale `[OPEN] PRs` partial bullets with plan 080 superseded notes; removed orphan duplicate next-step fragments; marked plans 036–047 `status: completed`.

### Partial

- None.

### Next

1. bytes / bool↔str / sequence exotic §8.15 when prioritized.
2. Optional deeper LIVING-PLAN archive (collapse pre-080 historical deltas) when doc maintenance is scheduled.

---

## Delta update (2026-05-24, plan 081 §8.15 evidence dedupe + queue closure)

### Landed

- [REPO] Plan 080 — merged open PR queue (#29–#53); `main` at green CI.
- [REPO] Plan 081 — PR #54 merged; COMPATIBILITY §8.15 duplicate Evidence paragraphs consolidated to one inventory (309 Vitest, 50 files).

### Partial

- None.

### Next

1. bytes / bool↔str / sequence exotic §8.15 when prioritized.
2. Optional LIVING-PLAN historical delta pruning when doc maintenance is scheduled.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Historical archive

Pre–plan 081 delta blocks (68 updates) moved to [`LIVING-PLAN-ARCHIVE.md`](LIVING-PLAN-ARCHIVE.md) in plan 086.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
