# Repository signals

`[REPO]` Archaeology snapshot (2026-05-18). Re-verify on structural changes.

---

## Layout

| Path | Role |
|------|------|
| `src/runtime/` | Core implementation |
| `test/` | Vitest (107 tests, 5 files) |
| `examples/python-vs-js.ts` | 39 narrative sections |
| `docs/COMPATIBILITY_AND_GAPS.md` | Exhaustive compatibility |
| `docs/knowledgebase/` | Layered KB |

---

## Test → module map

| Test file | Primary module |
|-----------|----------------|
| `test/slots.test.ts` | `slots.ts` |
| `test/object-model.test.ts` | `object.ts`, `lookup.ts` |
| `test/operators.test.ts` | `operators.ts` |
| `test/class-system.test.ts` | `class.ts` |
| `test/protocols.test.ts` | `protocols.ts` |

No dedicated `builtins.test.ts` — builtins covered via object/protocol tests.

---

## Gaps vs ideal OSS hygiene

| Item | Status |
|------|--------|
| `LICENSE` file | `[OPEN]` README says MIT; file may be missing |
| `.gitignore` | `[OPEN]` not present |
| CI | `[OPEN]` not present |
| Golden vs CPython | `[OPEN]` not present |
| `tsx` in devDependencies | `[OPEN]` examples use `npx tsx` |

Tracked in [../LIVING-PLAN.md](../LIVING-PLAN.md).

---

## Claims audit

| Source | Risk |
|--------|------|
| `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` | May overstate vs shipped |
| `COMPATIBILITY_AND_GAPS.md` | Authoritative for API surface |
| KB version matrix | Authoritative for pinned 3.9–3.14 URLs |

Do not edit the plan file for KB sync; reference KB instead.
