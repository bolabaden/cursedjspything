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
| `test/builtins/dict-keys.test.ts` | Dict key eq/hash; invalid __hash__ and unhashable keys on hash/set/get/del/contains/pyDict ctor (plans 574/576/588) |
| `test/builtins/list-eq.test.ts` | list __eq__ rich elements; __contains__ hash+eq (plan 622) |
| `test/cpython-derived/tuple-eq-hash-eq.test.ts` | tuple __eq__ and __contains__ element hash+eq (plans 622, 624) |
| `test/cpython-derived/sequence-add.test.ts` | list/tuple __add__ same-type concat (plan 634) |
| `test/cpython-derived/sequence-iadd.test.ts` | list __iadd__ in-place extend same-type (plan 636) |
| `test/cpython-derived/str-add.test.ts` | str __add__ same-type concat (plan 638) |
| `test/cpython-derived/dict-union.test.ts` | dict \| and \|= merge; rhs overwrites; hash+eq key collapse (plan 596) |
| `test/cpython-derived/dict-get.test.ts` | dict.get present/missing/default; hash+eq probe; unhashable TypeError (plan 598) |
| `test/cpython-derived/dict-update-copy.test.ts` | dict.update / copy / |= iterable pairs; hash+eq overwrite (plan 600) |
| `test/cpython-derived/dict-setdefault-clear.test.ts` | dict.setdefault insert/lookup; dict.clear (plan 602) |
| `test/cpython-derived/dict-pop-popitem.test.ts` | dict.pop / popitem; hash+eq pop; LIFO popitem (plan 604) |
| `test/cpython-derived/dict-keys-values-items-views.test.ts` | dict keys/values/items views; items contains hash+eq (606, 624) |
| `test/cpython-derived/dict-fromkeys.test.ts` | dict.fromkeys iterable; default None; hash+eq dedupe (plan 608) |
| `test/cpython-derived/dict-eq-hash-eq.test.ts` | dict __eq__ / ne hash+eq keys (plans 620, 626) |
| `test/cpython-derived/dict-contains-hash-eq.test.ts` | dict __contains__ and __getitem__ hash+eq keys (plan 628) |
| `test/cpython-derived/dict-delitem-hash-eq.test.ts` | dict __delitem__ hash+eq keys (plan 632) |
| `test/cpython-derived/hash-strictness-matrix.test.ts` | Cross-cutting hash strictness matrix dict/set/frozenset/tuple (plan 588) |
| `test/collections/slice-with.test.ts` | `pySlice`, `withObject` |
| `test/cpython-derived/compare-ne.test.ts` | CPython `test_compare.py` `__ne__` delegation |
| `test/cpython-derived/richcmp-number.test.ts` | CPython `test_richcmp.py` number ordering |
| `test/cpython-derived/richcmp-incomparable.test.ts` | CPython `test_richcmp.py` Rev/Incomparable |
| `test/cpython-derived/operator-int-float.test.ts` | CPython `test_operator.py` int/float cross-type |
| `test/cpython-derived/operator-int-bool.test.ts` | CPython `test_operator.py` int/bool cross-type |
| `test/cpython-derived/operator-bool-float.test.ts` | CPython `test_operator.py` bool/float cross-type |
| `test/cpython-derived/sequence-repeat-bool.test.ts` | List/tuple bool/negative repeat; multi-element and spread-safe large repeat |
| `test/cpython-derived/operator-str-scalar.test.ts` | str↔int/bool eq/ne/add/contains/ordering; empty str haystack contains (plan 554); bool str repeat (remaining binary in int-str/bool-str files; plan 468/470/474) |
| `test/cpython-derived/operator-float-str-remaining-binary.test.ts` | float↔str sub/mul/truediv/floordiv/mod/divmod/pow TypeError both orders (add in str-float; plan 408/476) |

---

| `test/cpython-derived/operator-int-str-remaining-binary.test.ts` | int↔str sub/truediv/floordiv/mod/divmod/pow TypeError both orders (ordering in str-scalar; plan 406) |

---

| `test/cpython-derived/operator-str-float.test.ts` | str↔float eq/ne/add/contains/ordering (remaining binary in float-str-remaining; plan 466/476) |

---

| `test/cpython-derived/operator-list-tuple-cross-type.test.ts` | list↔tuple eq/ordering/binary/inplace; list/tuple↔bytes mul; list/tuple↔bytes eq/ne (plans 428, 444, 446, 448) |

---

| `test/cpython-derived/operator-container-cross-type.test.ts` | dict/list/tuple/slice/set/frozenset cross-type add/eq/ordering/mul; set/frozenset↔bytes; slice↔int (plans 434, 440, 442, 444) |

---

| `test/cpython-derived/operator-container-scalar-cross-type.test.ts` | dict↔bytes/int/slice eq/ne non-coercion (plans 436–438) |

---

| `test/cpython-derived/operator-inplace-cross-type.test.ts` | In-place cross-type TypeError both orders (scalar↔str/bytes; container iadd; plan 432) |

| `test/cpython-derived/operator-unary-evidence.test.ts` | neg/pos/invert/abs reject list without unary slots |
| `test/cpython-derived/operator-rounding-evidence.test.ts` | round/trunc/floor/ceil reject list without hooks |
| `test/cpython-derived/operator-numeric-conversion-evidence.test.ts` | toInt/toFloat/index/toComplex reject list |
| `test/cpython-derived/operator-matmul-evidence.test.ts` | matmul @ rejects builtins without __matmul__ |
| `test/cpython-derived/operator-format-evidence.test.ts` | format() __format__ on int/str/float/bool/bytes/None/list/tuple/dict/slice/set/frozenset; empty-spec repr; non-empty TypeError; repr-only fallback class |
| `test/cpython-derived/frozenset-set-eq.test.ts` | frozenset ↔ set cross-type __eq__; equal-but-distinct keys (plan 620) |
| `test/cpython-derived/frozenset-hash.test.ts` | frozenset __hash__; equal-key hash+eq (plan 630); hash guards (578/582) |
| `test/cpython-derived/frozenset-set-algebra.test.ts` | frozenset |&-^ and cross-type set↔frozenset result-type; hash+eq equal keys (plan 618) |
| `test/cpython-derived/frozenset-iter.test.ts` | frozenset __iter__ / frozenset_iterator; StopIteration on empty |
| `test/cpython-derived/frozenset-set-ordering.test.ts` | frozenset ↔ set subset/superset ordering (<=, <, >=, >) cross-type; hash+eq equal keys (plan 612) |
| `test/cpython-derived/set-frozenset-inplace.test.ts` | set |=, &=, -=, ^= mutate in place; frozenset/set operands; hash+eq equal keys (plan 616) |
| `test/cpython-derived/frozenset-set-methods.test.ts` | set/frozenset issubset, issuperset, isdisjoint; cross-type; hash+eq equal keys (plan 610); TypeError on non-set-like |
| `test/cpython-derived/set-mutation.test.ts` | set/pySet hash guards; pop/remove hash+eq (plan 620); KeyError repr; frozenset.copy |
| `test/cpython-derived/set-named-update-methods.test.ts` | set intersection_update / difference_update / symmetric_difference_update; hash+eq (plan 594) |
| `test/cpython-derived/set-membership.test.ts` | set/frozenset hash+eq membership via dictKeysEqual (plan 590); dedupe, contains, remove, inplace &=/-= |
| `test/cpython-derived/set-algebra-membership.test.ts` | set/frozenset \|&-^ and named algebra with equal-but-distinct keys (plan 592); unionItems uses setAddMember |
| `test/cpython-derived/frozenset-set-named-algebra.test.ts` | set/frozenset union/intersection/difference/symmetric_difference; cross-type result-type; hash+eq equal keys (plan 614) |
| `test/cpython-derived/str-encode.test.ts` | str.encode codecs + empty input (plans 478/482/550) |
| `test/cpython-derived/str-upper-lower.test.ts` | str.upper / str.lower case conversion |
| `test/cpython-derived/str-capitalize.test.ts` | str.capitalize case conversion |
| `test/cpython-derived/str-title.test.ts` | str.title word boundaries and Unicode |
| `test/cpython-derived/str-swapcase.test.ts` | str.swapcase case inversion |
| `test/cpython-derived/str-isascii.test.ts` | str.isascii predicate |
| `test/cpython-derived/str-predicates.test.ts` | str isalpha/isdigit/isalnum/islower/isupper/istitle/isspace |
| `test/cpython-derived/str-find.test.ts` | str.find / rfind bounds, Unicode, empty input (plan 538) |
| `test/cpython-derived/str-index.test.ts` | str.index / rindex ValueError on miss + empty input (plan 540) |
| `test/cpython-derived/str-count.test.ts` | str.count non-overlapping bounds + empty input (plan 544) |
| `test/cpython-derived/str-startswith-endswith.test.ts` | str.startswith/endswith tuple, bounds, empty input (plan 542) |
| `test/cpython-derived/str-replace.test.ts` | str.replace empty input + empty/missing old (plans 512/546) |
| `test/cpython-derived/str-removeprefix-removesuffix.test.ts` | str.removeprefix/removesuffix + empty input (plan 548) |
| `test/cpython-derived/str-center.test.ts` | str.center width padding + empty input width=0 (plan 532) |
| `test/cpython-derived/str-ljust-rjust.test.ts` | str.ljust/rjust padding + empty width=0 (plans 522/534) |
| `test/cpython-derived/str-zfill.test.ts` | str.zfill width padding + width=0 no-op (plan 520) |
| `test/cpython-derived/str-expandtabs.test.ts` | str.expandtabs tab expansion + empty input (plan 530) |
| `test/cpython-derived/str-translate.test.ts` | str.maketrans / str.translate + empty input (plan 536) |
| `test/cpython-derived/str-join.test.ts` | str.join empty sep: concat, empty iter, single elt (510/518/526) |
| `test/cpython-derived/str-casefold.test.ts` | str.casefold |
| `test/cpython-derived/str-format.test.ts` | str.format / format_map including bool/bytes/None/list/tuple/dict/slice/set/frozenset empty-spec fields and conversions with format_spec |
| `test/cpython-derived/str-reversed.test.ts` | str.__reversed__ yields one-char strings last-to-first; empty StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/str-bool.test.ts` | str.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/str-hash.test.ts` | str.__hash__ stable; empty str hash 0; equal content matches (plan 556) |
| `test/cpython-derived/str-strip.test.ts` | str.strip/lstrip/rstrip empty input + empty chars (502/506) |
| `test/cpython-derived/str-split.test.ts` | str.split sep/maxsplit/whitespace; maxsplit=0 whitespace-only (plans 484/516) |
| `test/cpython-derived/str-rsplit.test.ts` | str.rsplit sep/maxsplit/whitespace; maxsplit=0 whitespace-only (plans 488/516) |
| `test/cpython-derived/str-partition.test.ts` | str.partition triple + multi-byte exact match (plan 524) |
| `test/cpython-derived/str-rpartition.test.ts` | str.rpartition triple; empty str (496); multi-byte exact (524) |
| `test/cpython-derived/str-splitlines.test.ts` | str.splitlines breaks + keepends; empty input (514); no breaks + keepends (528) |
| `test/cpython-derived/bytes-join.test.ts` | bytes.join empty sep: concat, empty iter, single elt (510/518/526) |
| `test/cpython-derived/bytes-split.test.ts` | bytes.split sep/maxsplit/whitespace; maxsplit=0 whitespace-only (plans 486/516) |
| `test/cpython-derived/bytes-rsplit.test.ts` | bytes.rsplit from the right; maxsplit=0 whitespace-only (plans 486/516) |
| `test/cpython-derived/bytes-startswith-endswith.test.ts` | bytes.startswith/endswith affix, bounds, empty input (plan 542) |
| `test/cpython-derived/bytes-partition.test.ts` | bytes.partition/rpartition; empty/exact; multi-byte exact (524) |
| `test/cpython-derived/bytes-splitlines.test.ts` | bytes.splitlines breaks; empty + keepends (514); no breaks + keepends (528) |
| `test/cpython-derived/bytes-strip.test.ts` | bytes.strip/lstrip/rstrip empty input + empty chars (506) |
| `test/cpython-derived/bytes-find.test.ts` | bytes.find/rfind bounds + empty input (plan 538) |
| `test/cpython-derived/bytes-index.test.ts` | bytes.index/rindex ValueError on miss + empty input (plan 540) |
| `test/cpython-derived/bytes-count.test.ts` | bytes.count non-overlapping subbytes + empty input (plan 544) |
| `test/cpython-derived/bytes-replace.test.ts` | bytes.replace empty input + empty/missing old (plans 512/546) |
| `test/cpython-derived/bytes-upper-lower.test.ts` | bytes.upper/lower ASCII case conversion |
| `test/cpython-derived/bytes-capitalize.test.ts` | bytes.capitalize first upper rest lower |
| `test/cpython-derived/bytes-swapcase.test.ts` | bytes.swapcase ASCII case inversion |
| `test/cpython-derived/bytes-center.test.ts` | bytes.center width padding + empty input width=0 (plan 532) |
| `test/cpython-derived/bytes-ljust-rjust.test.ts` | bytes.ljust/rjust padding + empty width=0 (plans 522/534) |
| `test/cpython-derived/bytes-zfill.test.ts` | bytes.zfill width padding + width=0 no-op (plan 520) |
| `test/cpython-derived/bytes-title.test.ts` | bytes.title ASCII word title case |
| `test/cpython-derived/bytes-removeprefix-removesuffix.test.ts` | bytes.removeprefix/removesuffix + empty input (plan 548) |
| `test/cpython-derived/bytes-expandtabs.test.ts` | bytes.expandtabs tab expansion + empty input (plan 530) |
| `test/cpython-derived/bytes-hex-fromhex.test.ts` | bytes.hex / fromhex + str/bytes arg + error messages (plans 480/482) |
| `test/cpython-derived/bytes-predicates.test.ts` | bytes ASCII predicate methods |
| `test/cpython-derived/bytes-translate.test.ts` | bytes.maketrans / bytes.translate + empty input (plan 536) |
| `test/cpython-derived/bytes-isascii-contains.test.ts` | bytes.isascii / bytes.__contains__ + empty haystack (plan 552) |
| `test/cpython-derived/bytes-decode.test.ts` | bytes.decode codecs + empty input (plan 550) |
| `test/cpython-derived/bytes-iter.test.ts` | bytes.__iter__ yields int 0–255; empty bytes StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/bytes-hash.test.ts` | bytes.__hash__ stable; empty bytes hash 0; equal content matches |
| `test/cpython-derived/bytes-bytes.test.ts` | bytes.__bytes__ returns self; bytes() on bytes is identity |
| `test/cpython-derived/bytes-bool.test.ts` | bytes.__bool__ empty falsy; non-empty including b'\\x00' truthy |
| `test/cpython-derived/bytes-reversed.test.ts` | bytes.__reversed__ yields int 0–255 last-to-first; empty StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/bytes-slice-index.test.ts` | bytes slice subscript returns bytes |
| `test/cpython-derived/bytes-getitem-compare.test.ts` | bytes int index; non-integer subscript TypeError; out-of-range IndexError; lexicographic rich compare |
| `test/cpython-derived/operator-bytes-conversion.test.ts` | bytes() on str vs int/float TypeError |
| `test/cpython-derived/operator-bytes-cross-type.test.ts` | bytes+bytes add and bytes*int mul happy paths only (plan 418) |
| `test/cpython-derived/operator-bytes-remaining-cross-type.test.ts` | bytes↔int/float/str/bool full binary + bytes↔int/float/bool ordering (str↔bytes ordering in str-bytes file; plan 426) |
| `test/cpython-derived/operator-str-bytes-cross-type.test.ts` | str↔bytes eq/ne, contains, ordering (binary in bytes-remaining; plans 458/462/464) |
| `test/cpython-derived/operator-bytes-scalar-cross-type.test.ts` | bytes↔int/float/bool eq/ne non-coercion (plan 430) |
| `test/cpython-derived/operator-bool-str-remaining-binary.test.ts` | bool↔str sub/truediv/floordiv/mod/divmod/pow TypeError both orders (add in str-scalar; plan 404/474) |
| `test/cpython-derived/sequence-index-type.test.ts` | List/tuple get/set/del non-integer subscript TypeError; list index out of range and delItem |
| `test/cpython-derived/contains-protocol.test.ts` | CPython `test_contains.py` membership protocol |
| `test/cpython-derived/isinstance-protocol.test.ts` | CPython `test_isinstance.py` MRO / tuple checks |
| `test/cpython-derived/sequence-repeat-nonint.test.ts` | List/tuple/str repeat rejects float repeat count |
| `test/cpython-derived/list-reversed.test.ts` | list.__reversed__ yields elements last-to-first via list_reverseiterator; empty StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/list-bool.test.ts` | list.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/list-dict-unhashable.test.ts` | list/dict hash TypeError unhashable (plan 568); set in frozenset-hash |
| `test/cpython-derived/dict-bool.test.ts` | dict.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/dict-keyerror.test.ts` | dict getitem/delitem missing key PyKeyError with repr-shaped key text |
| `test/cpython-derived/set-bool.test.ts` | set.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/frozenset-bool.test.ts` | frozenset.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/tuple-reversed.test.ts` | tuple.__reversed__ yields elements last-to-first; empty StopIteration; iterator __iter__ returns self |
| `test/cpython-derived/tuple-bool.test.ts` | tuple.__bool__ empty falsy; non-empty truthy |
| `test/cpython-derived/tuple-hash.test.ts` | tuple __hash__; equal-key element hash (plan 630); empty/order/guards (586, 564/572) |
| `test/cpython-derived/int-bool.test.ts` | int.__bool__ 0 falsy; non-zero truthy |
| `test/cpython-derived/int-hash.test.ts` | int.__hash__ stable; zero hash 0; equal value matches (plan 558) |
| `test/cpython-derived/float-bool.test.ts` | float.__bool__ 0.0 falsy; non-zero truthy |
| `test/cpython-derived/float-hash.test.ts` | float.__hash__ integral matches int; stable/non-integral (plan 562) |
| `test/cpython-derived/bool-bool.test.ts` | bool.__bool__ False falsy; True truthy |
| `test/cpython-derived/bool-hash.test.ts` | bool.__hash__ False 0 / True 1; stable singletons (plan 560) |
| `test/cpython-derived/none-bool.test.ts` | NoneType.__bool__ None always falsy |
| `test/cpython-derived/none-hash.test.ts` | NoneType.__hash__ fixed sentinel 0x345678; stable (plan 566) |
| `test/cpython-derived/slice-bool.test.ts` | slice.__bool__ all slice objects truthy |
| `test/cpython-derived/slice-unhashable.test.ts` | slice hash TypeError unhashable (plan 570) |
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

Runs `scripts/golden/run.ts` against `scripts/golden/cases.py` (CPython reference) and `scripts/golden/pyrt-cases.ts` (`buildPyrtCases`) and compares to `scripts/golden/expected/{version}.json` for each available Python 3.9–3.14. **Key parity** (symmetric case keys between CPython and `buildPyrtCases`) runs before value comparison; harness failures use `GoldenHarnessError` / `KeyParityError` (`scripts/golden/errors.ts`, plan 472). CI runs this after L2.

When adding or renaming case keys, update both `cases.py` and `scripts/golden/pyrt-cases.ts`, then:

```bash
npm run golden:keys
```

Vitest (`test/golden/key-parity.test.ts`) asserts pyrt keys against `scripts/golden/expected/key-sets.json` without Python installed.

Vitest (`test/golden/pyrt-cases-version-gates.test.ts`) asserts **gated values** per profile (empty/`null` on 3.9, staged enablement on 3.10/3.12/3.14, boundary checks on 3.11/3.13) without Python or per-version expected JSON — complements key-parity when `expected/3.9.json` is absent.

**Builder maintainability:** Both emitters share the same version-gated keys (`match_args`, buffer, `annotate_x`). Use `version_gte` / `versionGte` for 3.10/3.12/3.14 gates and `owner_with_instance_attr` / `ownerWithInstanceAttr` for descriptor-precedence fixtures — extend these helpers when adding similar cases rather than inlining gates or owner setup.

**Current inventory:** 32 keys per profile (see `scripts/golden/expected/key-sets.json`), including Tier A ports (contains, int/float/bool cross-type, list/str/tuple bool repetition, str↔int/str↔bytes non-coercion golden keys) and Tier B cherry-picks (descriptor precedence, `__init_subclass__`, `__set_name__`).

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
