# Validation ladder

Narrowest-first checks for pyrt changes. `[REPO]` commands from `package.json`.

---

## L1 — Typecheck

```bash
npm run check
```

Runs `tsc --noEmit`. Required before claiming compile safety.

---

## L2 — Unit tests

```bash
npm test
```

Vitest; unit tests mirror `src/runtime/` layout:

| Path | Focus |
|------|-------|
| `test/core/slots.test.ts` | Registry completeness |
| `test/core/object-model.test.ts` | PyObject, types, lookup, descriptors |
| `test/dispatch/operators.test.ts` | Comparisons, numeric |
| `test/dispatch/protocols.test.ts` | call, iter, async surface, builtins via protocols |
| `test/class/system.test.ts` | MRO, class creation |
| `test/class/pipeline.test.ts` | `__prepare__` / namespace merge |
| `test/class/instantiate.test.ts` | Type `__call__` on instantiate |
| `test/class/version-gates.test.ts` | `__match_args__`, `__annotate__`, buffer |
| `test/builtins/dict-keys.test.ts` | Dict key eq/hash |
| `test/builtins/list-eq.test.ts` | List `__eq__` via `eq()` |
| `test/builtins/tuple-eq.test.ts` | Tuple `__eq__` via `eq()` |
| `test/cpython-derived/*.test.ts` | Curated Lib/test ports |
| `test/golden/key-parity.test.ts` | Golden harness key sets vs snapshot |
| `test/collections/slice-with.test.ts` | `pySlice`, `withObject` |

---

## L3 — Examples (manual)

```bash
npx tsx examples/python-vs-js.ts
```

`[OPEN]` `tsx` may need to be installed (`npx` fetches). Not listed in `package.json` devDependencies.

39 sections; async examples omitted from file (covered in tests).

---

## L4 — Source vs docs parity

After doc or slot changes:

1. `SLOTDEF_COUNT` vs CPython 3.14 `slotdefs[]`
2. `COMPATIBILITY_AND_GAPS.md` appendices vs `Slot`/`Hook` enums
3. KB version matrix links still resolve

`[SYNTH]` Optional: `git diff --check` for conflict markers in `docs/`.

---

## L3b — Golden harness

```bash
npm run golden
```

Runs `scripts/golden/run.ts` against `scripts/golden/cases.py`: **key-set parity** vs live CPython JSON, then value compare to `scripts/golden/expected/{version}.json` for each available Python 3.9–3.14. CI golden matrix runs 3.10 / 3.12 / 3.14 after L2.

When adding a case, update both `scripts/golden/cases.py` and `buildPyrtCases` in `run.ts`, then:

```bash
npm run golden:keys   # refresh scripts/golden/expected/key-sets.json (Vitest, no Python)
npm run golden        # value + key parity vs installed interpreters
```

---

## L5 — CPython version matrix (partial)

`[REPO]` CI golden job matrix: Python 3.10, 3.12, 3.14. Local runs use every interpreter found on PATH (3.9–3.14). Key names are identical across profiles today; gated keys use `null` / `[]` below version thresholds.

---

## CI

`[REPO]` `.github/workflows/ci.yml` runs L1 + L2 + golden.

---

## Definition of done (vertical slice)

`[SYNTH]` For a behavior change:

1. Implementation in `src/runtime/`
2. Test in `test/`
3. Entry in `COMPATIBILITY_AND_GAPS.md` if user-visible
4. KB update if scope/version policy changes
5. L1 + L2 green

Do not mark complete from source inspection alone when behavior is user-facing.
