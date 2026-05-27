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

`[REPO]` `vitest.config.ts` uses `isolate: false` and `poolOptions.forks.singleFork: true` for faster repeat runs. Tests must not depend on a fresh module graph per file or on `vi.mock` reset across files.

Optional wall-clock measurement (ce-optimize / local tuning only, not CI):

```bash
npm run test:measure
```

Emits JSON (`vitest_seconds`, pass gates, `test_count`); use median of several runs for comparisons.

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
| `test/cpython-derived/sequence-repeat-bool.test.ts` | List/tuple bool/negative repeat; multi-element and spread-safe large repeat |
| `test/cpython-derived/operator-str-scalar.test.ts` | CPython str↔scalar non-coercion; str bool/negative repeat |
| `test/cpython-derived/operator-float-str-remaining-binary.test.ts` | float↔str truediv/floordiv/mod/divmod/pow TypeError |

---

| `test/cpython-derived/operator-int-str-remaining-binary.test.ts` | int↔str sub/div/pow TypeError (add in str-scalar) |

---

| `test/cpython-derived/operator-str-float.test.ts` | str↔float eq/ne non-coercion; add/sub/mul TypeError |

---

| `test/cpython-derived/operator-sequence-cross-type-add.test.ts` | list/tuple add rejects int/str/tuple cross-type |

---

| `test/cpython-derived/operator-inplace-cross-type.test.ts` | In-place +=/-= cross-type TypeError (int/str/list/bool) |

---

| `test/cpython-derived/operator-float-str-floordiv-mod.test.ts` | float↔str floordiv/mod TypeError |

---

| `test/cpython-derived/operator-float-str-divmod-pow.test.ts` | float↔str divmod/pow TypeError |

---

| `test/cpython-derived/operator-int-str-divmod-pow.test.ts` | int↔str divmod/pow TypeError |

---

| `test/cpython-derived/operator-int-str-binary.test.ts` | int↔str sub/floordiv/mod/truediv TypeError |
| `test/cpython-derived/operator-unary-evidence.test.ts` | neg/pos/invert/abs reject list without unary slots |
| `test/cpython-derived/operator-rounding-evidence.test.ts` | round/trunc/floor/ceil reject list without hooks |
| `test/cpython-derived/operator-numeric-conversion-evidence.test.ts` | toInt/toFloat/index/toComplex reject list |
| `test/cpython-derived/operator-matmul-evidence.test.ts` | matmul @ rejects builtins without __matmul__ |
| `test/cpython-derived/operator-format-evidence.test.ts` | format() __format__, empty-spec str fallback, TypeError |
| `test/cpython-derived/str-encode.test.ts` | str.encode utf-8/ascii/latin-1 and errors modes |
| `test/cpython-derived/bytes-join.test.ts` | bytes.join separator concatenation |
| `test/cpython-derived/bytes-split.test.ts` | bytes.split sep/maxsplit and whitespace |
| `test/cpython-derived/bytes-rsplit.test.ts` | bytes.rsplit sep/maxsplit from the right |
| `test/cpython-derived/bytes-decode.test.ts` | bytes.decode UTF-8/latin-1, errors strict/replace/ignore |
| `test/cpython-derived/bytes-slice-index.test.ts` | bytes slice subscript returns bytes |
| `test/cpython-derived/bytes-getitem-compare.test.ts` | bytes int index + lexicographic rich compare |
| `test/cpython-derived/operator-bytes-conversion.test.ts` | bytes() on str vs int/float TypeError |
| `test/cpython-derived/operator-bytes-cross-type.test.ts` | bytes add/mul cross-type TypeError; bytes+bytes and bytes*int |
| `test/cpython-derived/operator-float-str-binary.test.ts` | float↔str add/sub/truediv TypeError |
| `test/cpython-derived/operator-bool-str-binary.test.ts` | bool↔str add/sub/truediv TypeError ('bool' typename) |
| `test/cpython-derived/operator-bool-str-remaining-binary.test.ts` | bool↔str floordiv/mod/divmod/pow TypeError |
| `test/cpython-derived/sequence-index-type.test.ts` | List/tuple non-integer subscript raises TypeError |
| `test/cpython-derived/contains-protocol.test.ts` | CPython `test_contains.py` membership protocol |
| `test/cpython-derived/sequence-cross-type.test.ts` | List/str add and list mul reject incompatible types |
| `test/cpython-derived/isinstance-protocol.test.ts` | CPython `test_isinstance.py` MRO / tuple checks |
| `test/cpython-derived/sequence-repeat-nonint.test.ts` | List/tuple/str repeat rejects float repeat count |
| `test/cpython-derived/operator-zerodivision.test.ts` | Int/float division by zero raises ZeroDivisionError |
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

**Current inventory:** 29 keys per profile (see `scripts/golden/expected/key-sets.json`), including Tier A ports (contains, int/float/bool cross-type, list/str/tuple bool repetition) and Tier B cherry-picks (descriptor precedence, `__init_subclass__`, `__set_name__`).

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
