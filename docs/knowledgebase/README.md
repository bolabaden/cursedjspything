# pyrt knowledgebase

Layered, evidence-first documentation for the **pyrt** project (CPython object-model runtime in TypeScript).

## Python version policy (pinned)

| Role | Versions | Document |
|------|----------|----------|
| **Semantic reference range** | **3.9, 3.10, 3.11, 3.12, 3.13, 3.14** | [20-domain-theory/python-version-matrix-3.9-3.14.md](20-domain-theory/python-version-matrix-3.9-3.14.md) |
| **Slot inventory anchor** | **3.14** (`slotdefs[]` alignment) | [20-domain-theory/cpython-data-model-reference.md](20-domain-theory/cpython-data-model-reference.md) |
| **Implementation default** | Document against **3.9–3.14**; do not claim cross-version parity without golden tests per version | [40-operational-risk/compatibility-summary.md](40-operational-risk/compatibility-summary.md) |

Official docs base URLs (pinned):

- https://docs.python.org/3.9/
- https://docs.python.org/3.10/
- https://docs.python.org/3.11/
- https://docs.python.org/3.12/
- https://docs.python.org/3.13/
- https://docs.python.org/3.14/ (also https://docs.python.org/3/ for current stable)

## Layer index

| Layer | Path | Purpose |
|-------|------|---------|
| 00 Intent | [00-intent/](00-intent/) | Goals, non-goals, audience |
| 10 Architecture & runtime | [10-architecture-runtime/](10-architecture-runtime/) | pyrt design, dispatch, repo layout |
| 20 Domain theory | [20-domain-theory/](20-domain-theory/) | CPython data model, version matrix, [implementation checklist](20-domain-theory/version-gates-implementation-checklist.md) |
| 40 Operational risk | [40-operational-risk/](40-operational-risk/) | Gaps, parity limits, JS constraints |
| 50 Execution | [50-execution/](50-execution/) | Build, test, examples, validation ladder |
| 90 Meta | [90-meta/](90-meta/) | Bibliography, evidence rules, repo signals, living plan |

## Authoritative compatibility detail

The exhaustive supported / partial / not-supported matrix lives in:

- [../COMPATIBILITY_AND_GAPS.md](../COMPATIBILITY_AND_GAPS.md) (full bibliography + appendices)
- [40-operational-risk/compatibility-summary.md](40-operational-risk/compatibility-summary.md) (KB-oriented summary + links)

## Living plan

- [LIVING-PLAN.md](LIVING-PLAN.md) — single active implementation plan (3-delta updates)

## Evidence labels

All KB docs use: `[REPO]`, `[OFFICIAL]`, `[SYNTH]`, `[OPEN]`. See [90-meta/evidence-conventions.md](90-meta/evidence-conventions.md).
