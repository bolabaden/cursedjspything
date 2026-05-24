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
| `test/collections/slice-with.test.ts` | `pySlice`, `withObject` |
| `test/cpython-derived/compare-ne.test.ts` | CPython `test_compare.py` `__ne__` delegation |
| `test/cpython-derived/richcmp-number.test.ts` | CPython `test_richcmp.py` number ordering |
| `test/cpython-derived/richcmp-incomparable.test.ts` | CPython `test_richcmp.py` Rev/Incomparable |
| `test/cpython-derived/operator-int-float.test.ts` | CPython `test_operator.py` int/float cross-type |
| `test/cpython-derived/operator-int-bool.test.ts` | CPython `test_operator.py` int/bool cross-type |
| `test/cpython-derived/operator-bool-float.test.ts` | CPython `test_operator.py` bool/float cross-type |
| `test/cpython-derived/operator-str-scalar.test.ts` | CPython str↔scalar non-coercion (eq/ne/add/contains) |
| `test/cpython-derived/sequence-repeat-bool.test.ts` | List/tuple/str bool repeat counts (`* True` / `True *`) |
| `test/cpython-derived/sequence-index-type.test.ts` | List/tuple non-integer subscript raises TypeError |
| `test/cpython-derived/contains-protocol.test.ts` | CPython `test_contains.py` membership protocol |
| `test/cpython-derived/isinstance-protocol.test.ts` | CPython `test_isinstance.py` MRO / tuple checks |
| `test/golden/key-parity.test.ts` | Golden case key snapshot parity |
| `test/golden/pyrt-cases-version-gates.test.ts` | `buildPyrtCases` version-gate semantics (`match_args`, buffer, `annotate_x`) per profile 3.9–3.14 |

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

Runs `scripts/golden/run.ts` against `scripts/golden/cases.py` (CPython reference) and `scripts/golden/pyrt-cases.ts` (`buildPyrtCases`) and compares to `scripts/golden/expected/{version}.json` for each available Python 3.9–3.14. **Key parity** (symmetric case keys between CPython and `buildPyrtCases`) runs before value comparison. CI runs this after L2.

When adding or renaming case keys, update both `cases.py` and `scripts/golden/pyrt-cases.ts`, then:

```bash
npm run golden:keys
```

Vitest (`test/golden/key-parity.test.ts`) asserts pyrt keys against `scripts/golden/expected/key-sets.json` without Python installed.

Vitest (`test/golden/pyrt-cases-version-gates.test.ts`) asserts **gated values** per profile (empty/`null` on 3.9, staged enablement on 3.10/3.12/3.14, boundary checks on 3.11/3.13) without Python or per-version expected JSON — complements key-parity when `expected/3.9.json` is absent.

**Builder maintainability:** Both emitters share the same version-gated keys (`match_args`, buffer, `annotate_x`). Use `version_gte` / `versionGte` for 3.10/3.12/3.14 gates and `owner_with_instance_attr` / `ownerWithInstanceAttr` for descriptor-precedence fixtures — extend these helpers when adding similar cases rather than inlining gates or owner setup.

**Current inventory:** 25 keys per profile (see `scripts/golden/expected/key-sets.json`), including Tier A ports (contains, int/float/bool cross-type, sequence bool repetition) and Tier B cherry-picks (descriptor precedence, `__init_subclass__`, `__set_name__`).

---

## L5 — CPython version matrix (partial)

`[REPO]` CI golden matrix: Python 3.10, 3.12, 3.14 (`.github/workflows/ci.yml`). Local runs use whichever `python3.x` binaries are on PATH (3.9–3.14). Offline first: `test/golden/pyrt-cases-version-gates.test.ts` (L2), then repeat selected cases in full golden when validating version-specific gates (`match_args`, buffer, `annotate_x`).

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
