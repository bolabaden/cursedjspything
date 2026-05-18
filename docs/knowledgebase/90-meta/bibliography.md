# Bibliography (pinned references)

Canonical numbered list for citations `[n]`. Full commentary in [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md).

**Python docs:** use version **3.N** from [../20-domain-theory/python-version-matrix-3.9-3.14.md](../20-domain-theory/python-version-matrix-3.9-3.14.md). Below, **3.14** pins are listed; substitute `3.9` … `3.13` as needed.

---

## Language reference (by version)

| ID | Resource | 3.14 pin |
|----|----------|----------|
| [1] | Data model | https://docs.python.org/3.14/reference/datamodel.html |
| [2] | Special method lookup | https://docs.python.org/3.14/reference/datamodel.html#special-lookup |
| [3] | Customizing class creation | https://docs.python.org/3.14/reference/datamodel.html#customizing-class-creation |
| [4] | Coroutines (data model) | https://docs.python.org/3.14/reference/datamodel.html#coroutines |
| [5] | `typing` | https://docs.python.org/3.14/library/typing.html |

**3.9–3.13:** same paths under `https://docs.python.org/3.N/`.

---

## PEPs (version gates)

| ID | PEP | Relevance |
|----|-----|-----------|
| [6] | PEP 560 — `__mro_entries__` | Generics |
| [7] | PEP 585 — builtin generics | 3.9+ syntax |
| [8] | PEP 634 — pattern matching | 3.10+; non-goal |
| [9] | PEP 688 — buffer | 3.12+ |
| [10] | PEP 695 — type parameters | 3.12+ |
| [11] | PEP 649 — deferred annotations | 3.14+ |
| [12] | PEP 3118 — buffer protocol | Stubs only |

PEP index: https://peps.python.org/

---

## CPython source (v3.14.0)

| ID | File |
|----|------|
| [13] | https://github.com/python/cpython/blob/v3.14.0/Objects/typeobject.c |
| [14] | https://github.com/python/cpython/blob/v3.14.0/Objects/abstract.c |
| [15] | https://github.com/python/cpython/blob/v3.14.0/Objects/object.c |
| [16] | https://github.com/python/cpython/blob/v3.14.0/Objects/descrobject.c |
| [17] | https://github.com/python/cpython/blob/v3.14.0/Objects/call.c |
| [18] | https://github.com/python/cpython/blob/v3.14.0/Python/ceval.c |

---

## JavaScript / TC39

| ID | Resource |
|----|----------|
| [19] | ECMA-262 — https://tc39.es/ecma262/ |
| [20] | MDN `Proxy` — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy |
| — | Withdrawn operator overloading — historical TC39 proposals (Tier 3) |

---

## Repo-local

| ID | Resource |
|----|----------|
| [R1] | `docs/COMPATIBILITY_AND_GAPS.md` |
| [R2] | `src/runtime/slots.ts` |
| [R3] | `test/*.test.ts` |

---

## Context7 note

`[OPEN]` Context7 CLI quota was exceeded during KB orchestration (2026-05-18). Official URLs were verified via direct documentation research instead of `ctx7 docs`. Re-run `npx ctx7@latest login` for higher limits when refreshing.
