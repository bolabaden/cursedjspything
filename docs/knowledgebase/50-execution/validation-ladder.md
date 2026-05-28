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
| `test/cpython-derived/operator-format-evidence.test.ts` | format() __format__ on int/str/float/bool/bytes/None/list/tuple/dict/slice/set/frozenset; empty-spec repr; non-empty TypeError; repr-only fallback class |
| `test/cpython-derived/frozenset-set-eq.test.ts` | frozenset ↔ set cross-type __eq__ with element-wise eq() |
| `test/cpython-derived/frozenset-hash.test.ts` | frozenset __hash__ order-independent; set unhashable |
| `test/cpython-derived/frozenset-set-algebra.test.ts` | frozenset |&-^ and cross-type set↔frozenset result-type rules |
| `test/cpython-derived/frozenset-iter.test.ts` | frozenset __iter__ / frozenset_iterator; StopIteration on empty |
| `test/cpython-derived/frozenset-set-ordering.test.ts` | frozenset ↔ set subset/superset ordering (<=, <, >=, >) cross-type |
| `test/cpython-derived/set-frozenset-inplace.test.ts` | set |=, &=, -=, ^= mutate in place; frozenset/set operands |
| `test/cpython-derived/frozenset-set-methods.test.ts` | set/frozenset issubset, issuperset, isdisjoint; cross-type; TypeError on non-set-like |
| `test/cpython-derived/set-mutation.test.ts` | set add/remove/discard/pop/clear/copy/update; frozenset.copy; KeyError and iterable update |
| `test/cpython-derived/frozenset-set-named-algebra.test.ts` | set/frozenset union/intersection/difference/symmetric_difference; cross-type result-type rules |
| `test/cpython-derived/str-encode.test.ts` | str.encode utf-8/ascii/latin-1 errors including backslashreplace/surrogateescape |
| `test/cpython-derived/str-upper-lower.test.ts` | str.upper / str.lower case conversion |
| `test/cpython-derived/str-capitalize.test.ts` | str.capitalize case conversion |
| `test/cpython-derived/str-title.test.ts` | str.title word boundaries and Unicode |
| `test/cpython-derived/str-swapcase.test.ts` | str.swapcase case inversion |
| `test/cpython-derived/str-isascii.test.ts` | str.isascii predicate |
| `test/cpython-derived/str-predicates.test.ts` | str isalpha/isdigit/isalnum/islower/isupper/istitle/isspace |
| `test/cpython-derived/str-find.test.ts` | str.find / rfind bounds and Unicode |
| `test/cpython-derived/str-index.test.ts` | str.index / rindex ValueError on miss |
| `test/cpython-derived/str-count.test.ts` | str.count non-overlapping bounds |
| `test/cpython-derived/str-startswith-endswith.test.ts` | str.startswith / endswith tuple and bounds |
| `test/cpython-derived/str-replace.test.ts` | str.replace count and empty-old rules |
| `test/cpython-derived/str-removeprefix-removesuffix.test.ts` | str.removeprefix / removesuffix affix stripping |
| `test/cpython-derived/str-center.test.ts` | str.center width padding with fill character |
| `test/cpython-derived/str-ljust-rjust.test.ts` | str.ljust / rjust width padding |
| `test/cpython-derived/str-zfill.test.ts` | str.zfill width zero-padding |
| `test/cpython-derived/str-expandtabs.test.ts` | str.expandtabs tab expansion |
| `test/cpython-derived/str-translate.test.ts` | str.maketrans / str.translate |
| `test/cpython-derived/str-join.test.ts` | str.join |
| `test/cpython-derived/str-casefold.test.ts` | str.casefold |
| `test/cpython-derived/str-format.test.ts` | str.format / format_map including bool/bytes/None/list/tuple/dict/slice/set/frozenset empty-spec fields and conversions with format_spec |
| `test/cpython-derived/str-reversed.test.ts` | str.__reversed__ yields one-char strings last-to-first; empty StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/str-strip.test.ts` | str.strip / lstrip / rstrip |
| `test/cpython-derived/str-split.test.ts` | str.split sep/maxsplit and whitespace |
| `test/cpython-derived/str-rsplit.test.ts` | str.rsplit sep/maxsplit and whitespace |
| `test/cpython-derived/str-partition.test.ts` | str.partition first-separator triple |
| `test/cpython-derived/str-rpartition.test.ts` | str.rpartition last-separator triple |
| `test/cpython-derived/str-splitlines.test.ts` | str.splitlines Unicode line breaks |
| `test/cpython-derived/bytes-join.test.ts` | bytes.join separator concatenation |
| `test/cpython-derived/bytes-split.test.ts` | bytes.split sep/maxsplit and whitespace |
| `test/cpython-derived/bytes-rsplit.test.ts` | bytes.rsplit sep/maxsplit from the right |
| `test/cpython-derived/bytes-startswith-endswith.test.ts` | bytes.startswith/endswith affix and bounds |
| `test/cpython-derived/bytes-partition.test.ts` | bytes.partition/rpartition triple split |
| `test/cpython-derived/bytes-splitlines.test.ts` | bytes.splitlines keepends and line breaks |
| `test/cpython-derived/bytes-strip.test.ts` | bytes.strip/lstrip/rstrip whitespace and chars |
| `test/cpython-derived/bytes-find.test.ts` | bytes.find/rfind subbytes search with bounds |
| `test/cpython-derived/bytes-index.test.ts` | bytes.index/rindex subbytes search; ValueError on miss |
| `test/cpython-derived/bytes-count.test.ts` | bytes.count non-overlapping subbytes in slice |
| `test/cpython-derived/bytes-replace.test.ts` | bytes.replace count-limited substitution |
| `test/cpython-derived/bytes-upper-lower.test.ts` | bytes.upper/lower ASCII case conversion |
| `test/cpython-derived/bytes-capitalize.test.ts` | bytes.capitalize first upper rest lower |
| `test/cpython-derived/bytes-swapcase.test.ts` | bytes.swapcase ASCII case inversion |
| `test/cpython-derived/bytes-center.test.ts` | bytes.center width padding with fill byte |
| `test/cpython-derived/bytes-ljust-rjust.test.ts` | bytes.ljust/rjust width padding |
| `test/cpython-derived/bytes-zfill.test.ts` | bytes.zfill width zero-padding |
| `test/cpython-derived/bytes-title.test.ts` | bytes.title ASCII word title case |
| `test/cpython-derived/bytes-removeprefix-removesuffix.test.ts` | bytes.removeprefix/removesuffix affix stripping |
| `test/cpython-derived/bytes-expandtabs.test.ts` | bytes.expandtabs tab expansion |
| `test/cpython-derived/bytes-hex-fromhex.test.ts` | bytes.hex / bytes.fromhex |
| `test/cpython-derived/bytes-predicates.test.ts` | bytes ASCII predicate methods |
| `test/cpython-derived/bytes-translate.test.ts` | bytes.maketrans / bytes.translate |
| `test/cpython-derived/bytes-isascii-contains.test.ts` | bytes.isascii / bytes.__contains__ |
| `test/cpython-derived/bytes-decode.test.ts` | bytes.decode UTF-8/latin-1/ascii errors strict/replace/ignore/backslashreplace/surrogateescape |
| `test/cpython-derived/bytes-iter.test.ts` | bytes.__iter__ yields int 0–255; empty bytes StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/bytes-hash.test.ts` | bytes.__hash__ stable; empty bytes hash 0; equal content matches |
| `test/cpython-derived/bytes-bytes.test.ts` | bytes.__bytes__ returns self; bytes() on bytes is identity |
| `test/cpython-derived/bytes-bool.test.ts` | bytes.__bool__ empty falsy; non-empty including b'\\x00' truthy |
| `test/cpython-derived/bytes-reversed.test.ts` | bytes.__reversed__ yields int 0–255 last-to-first; empty StopIteration; iterator __iter__ returns self |
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
