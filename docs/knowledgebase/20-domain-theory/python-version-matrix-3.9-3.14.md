# Python version matrix (pinned 3.9–3.14)

**Policy:** Every official reference in this knowledgebase that describes language behavior MUST use one of the pinned bases below. Do not use unversioned `/3/` links in normative KB text except as “current stable” pointers.

**Observation date:** 2026-05-18. `[OFFICIAL]` URLs verified via docs site structure; re-check when Python 3.15 ships.

---

## Pinned documentation roots

| Version | Base URL | Release (approx.) |
|---------|----------|-------------------|
| **3.9** | https://docs.python.org/3.9/ | 2020-10 |
| **3.10** | https://docs.python.org/3.10/ | 2021-10 |
| **3.11** | https://docs.python.org/3.11/ | 2022-10 |
| **3.12** | https://docs.python.org/3.12/ | 2023-10 |
| **3.13** | https://docs.python.org/3.13/ | 2024-10 |
| **3.14** | https://docs.python.org/3.14/ | 2025-10 |

Current stable alias (informational only): https://docs.python.org/3/

---

## Core data-model pages (all versions)

Replace `3.N` with each row above.

| Topic | Path pattern |
|-------|----------------|
| Data model | `https://docs.python.org/3.N/reference/datamodel.html` |
| Special method lookup | `https://docs.python.org/3.N/reference/datamodel.html#special-lookup` |
| Customizing class creation | `https://docs.python.org/3.N/reference/datamodel.html#customizing-class-creation` |
| Coroutines | `https://docs.python.org/3.N/reference/datamodel.html#coroutines` |
| `typing` | `https://docs.python.org/3.N/library/typing.html` |

### Pinned links — data model

| Version | Data model |
|---------|------------|
| 3.9 | https://docs.python.org/3.9/reference/datamodel.html |
| 3.10 | https://docs.python.org/3.10/reference/datamodel.html |
| 3.11 | https://docs.python.org/3.11/reference/datamodel.html |
| 3.12 | https://docs.python.org/3.12/reference/datamodel.html |
| 3.13 | https://docs.python.org/3.13/reference/datamodel.html |
| 3.14 | https://docs.python.org/3.14/reference/datamodel.html |

### Pinned links — special method lookup

| Version | Special lookup |
|---------|----------------|
| 3.9 | https://docs.python.org/3.9/reference/datamodel.html#special-lookup |
| 3.10 | https://docs.python.org/3.10/reference/datamodel.html#special-lookup |
| 3.11 | https://docs.python.org/3.11/reference/datamodel.html#special-lookup |
| 3.12 | https://docs.python.org/3.12/reference/datamodel.html#special-lookup |
| 3.13 | https://docs.python.org/3.13/reference/datamodel.html#special-lookup |
| 3.14 | https://docs.python.org/3.14/reference/datamodel.html#special-lookup |

---

## Version gates relevant to pyrt

`[OFFICIAL]` + `[SYNTH]` — features that appear or change across 3.9–3.14.

| Feature | Min version | pyrt status | Notes |
|---------|-------------|-------------|-------|
| PEP 560 `__mro_entries__` | 3.7+ (in 3.9 docs) | Partial | Generic alias hooks in class system |
| PEP 585 `list[int]` style | 3.9 | N/A | Typing syntax; not runtime focus |
| `__match_args__` | **3.10** | Not implemented | Pattern matching support |
| PEP 634 structural pattern matching | **3.10** | Non-goal | Syntax + VM |
| PEP 688 buffer API | **3.12** | Stubs | `__buffer__`, `__release_buffer__` |
| PEP 695 type params | **3.12** | N/A | Syntax |
| PEP 649 deferred annotations | **3.14** | Not implemented | Evaluation timing |
| `__annotate__` (LR) | **3.14** | Not implemented | See 3.14 data model |
| 3.14 slotdefs expansion | **3.14** | **Anchor** | `[REPO]` 81 slots in `slots.ts` |

Per-version “what’s new” (context only, Tier 2):

| Version | What's new |
|---------|------------|
| 3.9 | https://docs.python.org/3.9/whatsnew/3.9.html |
| 3.10 | https://docs.python.org/3.10/whatsnew/3.10.html |
| 3.11 | https://docs.python.org/3.11/whatsnew/3.11.html |
| 3.12 | https://docs.python.org/3.12/whatsnew/3.12.html |
| 3.13 | https://docs.python.org/3.13/whatsnew/3.13.html |
| 3.14 | https://docs.python.org/3.14/whatsnew/3.14.html |

---

## CPython source (implementation anchor)

`[OFFICIAL]` Tag **v3.14.0** (or current `main`) for line-level slotdefs:

| File | Role |
|------|------|
| https://github.com/python/cpython/blob/v3.14.0/Objects/typeobject.c | `slotdefs[]`, `fill_slots` |
| https://github.com/python/cpython/blob/v3.14.0/Objects/abstract.c | Abstract protocol APIs |
| https://github.com/python/cpython/blob/v3.14.0/Objects/object.c | `PyObject_*` |
| https://github.com/python/cpython/blob/v3.14.0/Objects/descrobject.c | Descriptors |
| https://github.com/python/cpython/blob/v3.14.0/Objects/call.c | Calling |
| https://github.com/python/cpython/blob/v3.14.0/Python/ceval.c | Interpreter (out of pyrt scope) |

For 3.9–3.13 slot counts, diff `typeobject.c` at `v3.9.0` … `v3.13.0` — pyrt **documents** full 3.9–3.14 range but **implements** against 3.14 inventory.

---

## pyrt mapping

| Concern | Choice |
|---------|--------|
| Cite behavior | Pin URL to **3.N** that introduced or defines the feature |
| Implement slots | **3.14** list in `src/runtime/slots.ts` |
| Claim parity | Only for tested helpers; mark version gates `[OPEN]` until golden tests exist |

See [cpython-data-model-reference.md](cpython-data-model-reference.md).
