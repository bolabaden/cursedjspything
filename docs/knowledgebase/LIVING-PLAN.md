# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

---

## Delta update (2026-05-24, plan 274 set frozenset methods)

### Landed

- [REPO] Plan 274 — `set` / `frozenset` `issubset`, `issuperset`, `isdisjoint` with cross-type operands.

### Partial

- PEP 3118 out of scope; COMPATIBILITY docs sync for methods deferred.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for set/frozenset methods.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 273 merge PR #150)

### Landed

- [REPO] Plan 272 merged via PR #150 — frozenset/set stack docs sync on `main` (670 Vitest / 111 files).

### Partial

- PEP 3118 out of scope.

### Next

1. Next prioritized §8.15 or builtin surface gap from COMPATIBILITY remaining-gap list.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 272 set inplace frozenset stack docs)

### Landed

- [REPO] Plan 272 — COMPATIBILITY §8.15 + validation-ladder synced with set inplace ops (plan 270); frozenset/set stack docs complete.

### Partial

- PEP 3118 out of scope.

### Next

1. Next prioritized §8.15 or builtin surface gap from COMPATIBILITY remaining-gap list.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 271 merge PR #149)

### Landed

- [REPO] Plan 270 merged via PR #149 — set inplace ops with frozenset operands on `main` (670 Vitest / 111 files).

### Partial

- PEP 3118 out of scope; COMPATIBILITY docs sync for set inplace deferred.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for set inplace / frozenset stack completion.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 270 set frozenset inplace)

### Landed

- [REPO] Plan 270 — `set` inplace `|=`, `&=`, `-=`, `^=` mutate in place with cross-type frozenset operands.

### Partial

- PEP 3118 out of scope; COMPATIBILITY docs sync for inplace deferred.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for set inplace / frozenset stack completion.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 269 merge PR #148)

### Landed

- [REPO] Plan 268 merged via PR #148 — frozenset iter/ordering docs sync on `main` (666 Vitest / 110 files).

### Partial

- frozenset inplace ops deferred; PEP 3118 out of scope.

### Next

1. Further frozenset surface (inplace on set only today) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 268 frozenset iter/ordering docs sync)

### Landed

- [REPO] Plan 268 — COMPATIBILITY §8.15 + validation-ladder synced with frozenset iter and ordering evidence (plans 264–266).

### Partial

- frozenset inplace ops deferred; PEP 3118 out of scope.

### Next

1. Further frozenset surface (inplace on set only today) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 267 merge PR #147)

### Landed

- [REPO] Plan 266 merged via PR #147 — frozenset ordering comparisons on `main` (666 Vitest / 110 files).

### Partial

- frozenset inplace ops deferred; PEP 3118 out of scope; COMPATIBILITY docs sync for ordering/iter deferred.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for frozenset ordering/iter evidence.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 266 frozenset ordering)

### Landed

- [REPO] Plan 266 — `frozenset` ordering comparisons (`<=`, `<`, `>=`, `>`) with cross-type set operands; shared `set-ordering.ts`.

### Partial

- frozenset inplace ops deferred; PEP 3118 out of scope; COMPATIBILITY docs sync for ordering deferred.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for frozenset ordering/iter evidence.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 265 merge PR #146)

### Landed

- [REPO] Plan 264 merged via PR #146 — `frozenset.__iter__` on `main` (661 Vitest / 109 files).

### Partial

- frozenset ordering comparisons / inplace ops deferred; PEP 3118 out of scope.

### Next

1. frozenset ordering comparisons (`<=`, `<`, …) cross-type if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 264 frozenset iter)

### Landed

- [REPO] Plan 264 — `frozenset.__iter__` with frozenset_iterator (mirrors set).

### Partial

- frozenset ordering comparisons / inplace ops deferred; PEP 3118 out of scope.

### Next

1. frozenset ordering comparisons (`<=`, `<`, …) cross-type if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 263 merge PR #145)

### Landed

- [REPO] Plan 262 merged via PR #145 — frozenset hash/algebra docs sync on `main` (658 Vitest / 108 files).

### Partial

- frozenset ordering comparisons / inplace ops / iter deferred; PEP 3118 out of scope.

### Next

1. frozenset `__iter__` or ordering comparisons if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 262 frozenset hash/algebra docs sync)

### Landed

- [REPO] Plan 262 — COMPATIBILITY §8.15 + validation-ladder synced with frozenset hash and set algebra (plans 258–260).

### Partial

- frozenset ordering comparisons / inplace ops deferred; PEP 3118 out of scope.

### Next

1. Further frozenset surface (ordering, iter on frozenset) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 261 merge PR #144)

### Landed

- [REPO] Plan 260 merged via PR #144 — frozenset set algebra on `main` (658 Vitest / 108 files).

### Partial

- frozenset ordering comparisons / inplace ops deferred; docs sync for hash/algebra evidence; PEP 3118 out of scope.

### Next

1. Docs sync COMPATIBILITY §8.15 + validation-ladder for frozenset hash/algebra.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 260 frozenset set algebra)

### Landed

- [REPO] Plan 260 — frozenset `|&-^` ops + cross-type set↔frozenset algebra with shared `set-algebra.ts` helpers.

### Partial

- frozenset ordering comparisons / inplace ops deferred; PEP 3118 out of scope.

### Next

1. Docs sync for frozenset hash/algebra evidence if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 259 merge PR #143)

### Landed

- [REPO] Plan 258 merged via PR #143 — `frozenset.__hash__` on `main` (653 Vitest / 107 files).

### Partial

- frozenset set algebra deferred; PEP 3118 out of scope.

### Next

1. frozenset set algebra (|, &, -, ^) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 258 frozenset hash)

### Landed

- [REPO] Plan 258 — `frozenset.__hash__` with order-independent XOR mixing; set remains unhashable.

### Partial

- frozenset set algebra deferred; PEP 3118 out of scope.

### Next

1. frozenset set algebra (|, &, -, ^) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 257 merge PR #142)

### Landed

- [REPO] Plan 256 merged via PR #142 — frozenset evidence docs sync on `main` (649 Vitest / 106 files).

### Partial

- frozenset hash / set algebra deferred; PEP 3118 out of scope.

### Next

1. frozenset `__hash__` or set algebra if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 256 frozenset evidence docs sync)

### Landed

- [REPO] Plan 256 — COMPATIBILITY §8.15 + validation-ladder synced with frozenset format and frozenset↔set eq evidence (plans 252–254).

### Partial

- frozenset hash / set algebra deferred; PEP 3118 out of scope.

### Next

1. frozenset `__hash__` or set algebra if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 255 merge PR #141)

### Landed

- [REPO] Plan 254 merged via PR #141 — frozenset ↔ set cross-type `__eq__` on `main` (649 Vitest / 106 files).

### Partial

- frozenset hash / set algebra deferred; COMPATIBILITY §8.15 frozenset format gap; PEP 3118 out of scope.

### Next

1. Sync COMPATIBILITY §8.15 + validation-ladder with frozenset format evidence.
2. frozenset `__hash__` or set algebra if prioritized.
3. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 254 frozenset set eq)

### Landed

- [REPO] Plan 254 — frozenset ↔ set cross-type `__eq__` via shared set-contents helper.

### Partial

- frozenset hash / set algebra deferred; PEP 3118 out of scope.

### Next

1. frozenset `__hash__` or set algebra if prioritized.
2. Sync COMPATIBILITY §8.15 format paragraph with frozenset (plan 250 gap).
3. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 253 merge PR #140)

### Landed

- [REPO] Plan 252 merged via PR #140 — `frozenset.__format__` on `main` (645 Vitest / 105 files).

### Partial

- frozenset set algebra / hash / set↔frozenset ops deferred; PEP 3118 out of scope.

### Next

1. Extend frozenset surface (hash, comparisons with set) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 252 frozenset format)

### Landed

- [REPO] Plan 252 — minimal `frozenset` builtin + `frozenset.__format__` (empty spec repr; non-empty TypeError).

### Partial

- frozenset set algebra / hash / set↔frozenset ops deferred; PEP 3118 out of scope.

### Next

1. Extend frozenset surface (hash, comparisons with set) if prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 251 merge PR #139)

### Landed

- [REPO] Plan 250 merged via PR #139 — format evidence docs sync on `main` (643 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope; frozenset not implemented.

### Next

1. Further format parity only if new gaps are prioritized (e.g. frozenset builtin + `__format__`).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 250 format evidence docs sync)

### Landed

- [REPO] Plan 250 — COMPATIBILITY §8.15 + validation-ladder synced with format stack (plans 228–248): None/list/tuple/dict/slice/set `__format__` and `str-format.test.ts` evidence.

### Partial

- PEP 3118 buffer protocol out of scope; frozenset not implemented.

### Next

1. Further format parity only if new gaps are prioritized (e.g. frozenset builtin + `__format__`).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 249 merge PR #138)

### Landed

- [REPO] Plan 248 merged via PR #138 — `set.__format__` on `main` (643 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. frozenset).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 248 set format)

### Landed

- [REPO] Plan 248 — `set.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. frozenset).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 247 merge PR #137)

### Landed

- [REPO] Plan 246 merged via PR #137 — `slice.__format__` on `main` (641 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. set).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 246 slice format)

### Landed

- [REPO] Plan 246 — `slice.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. set).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 245 merge PR #136)

### Landed

- [REPO] Plan 244 merged via PR #136 — `dict.__format__` on `main` (639 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. slice).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 244 dict format)

### Landed

- [REPO] Plan 244 — `dict.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. slice).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 243 merge PR #135)

### Landed

- [REPO] Plan 242 merged via PR #135 — `tuple.__format__` on `main` (637 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. dict).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 242 tuple format)

### Landed

- [REPO] Plan 242 — `tuple.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. dict).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 241 merge PR #134)

### Landed

- [REPO] Plan 240 merged via PR #134 — `list.__format__` on `main` (635 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. tuple).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 240 list format)

### Landed

- [REPO] Plan 240 — `list.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. tuple).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 239 merge PR #133)

### Landed

- [REPO] Plan 238 merged via PR #133 — `NoneType.__format__` on `main` (633 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 238 None format)

### Landed

- [REPO] Plan 238 — `NoneType.__format__` (empty spec → `"None"`; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 237 merge PR #132)

### Landed

- [REPO] Plan 236 merged via PR #132 — str.format bool/bytes integration evidence on `main` (631 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 236 str format bool bytes evidence)

### Landed

- [REPO] Plan 236 — str.format integration tests for bool/bytes `__format__` fields.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 235 merge PR #131)

### Landed

- [REPO] Plan 234 merged via PR #131 — `bytes.__format__` on `main` (630 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 234 bytes format)

### Landed

- [REPO] Plan 234 — `bytes.__format__` (empty spec repr; non-empty TypeError).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 233 merge PR #130)

### Landed

- [REPO] Plan 232 merged via PR #130 — conversion + format_spec on `main` (629 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 232 str format conversion spec)

### Landed

- [REPO] Plan 232 — `!r`/`!s`/`!a` with format_spec applies str alignment/width to converted text.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 231 merge PR #129)

### Landed

- [REPO] Plan 230 merged via PR #129 — `bool.__format__` on `main` (628 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 230 bool format)

### Landed

- [REPO] Plan 230 — `bool.__format__` (empty spec True/False; else int delegation).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 229 merge PR #128)

### Landed

- [REPO] Plan 228 merged via PR #128 — `!a` ascii conversion on `main` (627 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. `bool.__format__`).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 228 str format ascii conversion)

### Landed

- [REPO] Plan 228 — `!a` ascii conversion in `str.format` / `format_map`; `ascii()` helper in `numeric.ts`.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized (e.g. `bool.__format__`).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 227 merge PR #127)

### Landed

- [REPO] Plan 226 merged via PR #127 — nested format_spec on `main` (626 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 226 str format nested spec)

### Landed

- [REPO] Plan 226 — nested `format_spec` fields in `str.format` / `format_map`.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 225 merge PR #126)

### Landed

- [REPO] Plan 224 merged via PR #126 — float format presentation on `main` (625 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 224 float format presentation)

### Landed

- [REPO] Plan 224 — `float.__format__` presentation codes (`f`, `e`, `g`, `G`, `%`).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 223 merge PR #125)

### Landed

- [REPO] Plan 222 merged via PR #125 — str format alignment/precision on `main` (624 Vitest / 105 files).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 222 str format alignment)

### Landed

- [REPO] Plan 222 — `str.__format__` alignment, width, precision, and fill.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 221 merge PR #124)

### Landed

- [REPO] Plan 220 merged via PR #124 — int `g`/`G`/`%` format on `main` (622 Vitest / 105 files). Int format stack for deferred float-style codes complete.

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 220 int format g/G/%)

### Landed

- [REPO] Plan 220 — int `__format__` general and percent codes (`g`, `G`, `%`).

### Partial

- PEP 3118 buffer protocol out of scope.

### Next

1. Further format parity only if new gaps are prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 219 merge PR #123)

### Landed

- [REPO] Plan 218 merged via PR #123 — int float presentation format on `main` (621 Vitest / 105 files).

### Partial

- `g`/`G`/`%` deferred; PEP 3118 out of scope.

### Next

1. Further format parity (`g`, `%`) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 218 int format float presentation)

### Landed

- [REPO] Plan 218 — int `__format__` float presentation codes (`f`, `.2f`, `10f`, `.2e`).

### Partial

- `g`/`G`/`%` deferred; PEP 3118 out of scope.

### Next

1. Further format parity (`g`, `%`) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 217 merge PR #122)

### Landed

- [REPO] Plan 216 merged via PR #122 — int format sign options on `main` (620 Vitest / 105 files).

### Partial

- No float-style `f` on int; PEP 3118 out of scope.

### Next

1. Further format parity when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 216 int format sign)

### Landed

- [REPO] Plan 216 — int `__format__` sign options (`+04d`, ` d`, `-04d`, `+04x`).

### Partial

- No float-style `f` on int; PEP 3118 out of scope.

### Next

1. Further format parity when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 215 merge PR #121)

### Landed

- [REPO] Plan 214 merged via PR #121 — int format width padding on `main` (619 Vitest / 105 files).

### Partial

- No float-style `f` on int; sign/`+` fill variants deferred.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity when prioritized.

---

## Delta update (2026-05-24, plan 214 int format width)

### Landed

- [REPO] Plan 214 — int `__format__` width padding (`04`, `4`, `04x`) and ValueError on precision/unknown codes.

### Partial

- No float-style `f` on int; sign/`+` fill variants deferred.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity when prioritized.

---

## Delta update (2026-05-24, plan 213 merge PR #120)

### Landed

- [REPO] Plan 212 merged via PR #120 — arbitrary format bracket keys on `main` (616 Vitest / 105 files).

### Partial

- Bracket keys: literal substring only (no quoted-string stripping); kwargs require `FormatKeywordMapping` wrapper.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity when prioritized.

---

## Delta update (2026-05-24, plan 212 str format bracket keys)

### Landed

- [REPO] Plan 212 — arbitrary string bracket keys in format fields (`{0[a-b]}`, `{0[space test]}`).

### Partial

- Bracket keys: literal substring only (no quoted-string stripping); kwargs require `FormatKeywordMapping` wrapper.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity when prioritized.

---

## Delta update (2026-05-24, plan 211 merge PR #119)

### Landed

- [REPO] Plan 210 merged via PR #119 — `str.format` kwargs bridging on `main` (614 Vitest / 105 files).

### Partial

- Bracket keys: integer literals and identifiers only; kwargs require explicit `FormatKeywordMapping` wrapper at JS boundary.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity (quoted bracket keys, etc.) when prioritized.

---

## Delta update (2026-05-24, plan 210 str format kwargs)

### Landed

- [REPO] Plan 210 — `str.format` kwargs bridging via trailing `FormatKeywordMapping` wrapper.

### Partial

- Bracket keys: integer literals and identifiers only; kwargs require explicit wrapper at JS boundary.

### Next

1. PEP 3118 buffer protocol remains out of scope until planned.
2. Further format parity (quoted bracket keys, etc.) when prioritized.

---

## Delta update (2026-05-24, plan 209 merge PR #118)

### Landed

- [REPO] Plan 208 merged via PR #118 — bracket/index format fields on `main` (610 Vitest / 105 files).

### Partial

- Bracket keys: integer literals and identifiers only; no `**kwargs` on `.format()`.

### Next

1. kwargs bridging for `.format()` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 208 str format brackets)

### Landed

- [REPO] Plan 208 — bracket/index format fields (`{0[name]}`, `{0[0]}`, nested subscripts).

### Partial

- Bracket keys: integer literals and identifiers only; no `**kwargs` on `.format()`.

### Next

1. kwargs bridging for `.format()` when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 207 merge PR #117)

### Landed

- [REPO] Plan 207 — PR #117 merged; plan 206 format attribute fields on `main` (609 Vitest, 105 files).

### Partial

- No bracket/index fields (`{0[name]}`); no `**kwargs` on `.format()`.

### Next

1. Bracket/index format fields or kwargs bridging when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 206 str format attributes)

### Landed

- [REPO] Plan 206 — dot-attribute format fields (`{0.year}`, `{foo._x}`).

### Partial

- No bracket/index fields (`{0[name]}`); no `**kwargs` on `.format()`.

### Next

1. Bracket/index format fields or kwargs bridging when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 205 merge PR #116)

### Landed

- [REPO] Plan 205 — PR #116 merged; plan 204 str format on `main` (607 Vitest, 105 files).

### Partial

- Named fields on `.format()` require `format_map`; no attribute/index field names.

### Next

1. Expand format field grammar (`{0.name}`) or `**kwargs` bridging when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 204 str format)

### Landed

- [REPO] Plan 204 — `str.format` / `str.format_map`; `str-format.test.ts`.

### Partial

- Named fields on `.format()` require `format_map` (no `**kwargs` at JS call boundary); no attribute/index field names.

### Next

1. Expand format field grammar (`{0.name}`) or `**kwargs` bridging when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 203 merge PR #115)

### Landed

- [REPO] Plan 203 — PR #115 merged; plan 202 str casefold on `main` (598 Vitest, 104 files).

### Partial

- Casefold still uses targeted Unicode overrides, not full CaseFolding.txt table.

### Next

1. Further str/bytes API when prioritized (`format`, expand casefold table).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 202 str casefold)

### Landed

- [REPO] Plan 202 — `str.casefold`; `str-casefold.test.ts`.

### Partial

- Casefold uses targeted Unicode overrides, not full CaseFolding.txt table.

### Next

1. Further str/bytes API when prioritized (`format`, expand casefold table).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 201 merge PR #114)

### Landed

- [REPO] Plan 201 — PR #114 merged; plan 200 str join on `main` (593 Vitest, 103 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (casefold, format).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 200 str join)

### Landed

- [REPO] Plan 200 — `str.join`; `str-join.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (casefold, format).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 199 merge PR #113)

### Landed

- [REPO] Plan 199 — PR #113 merged; plan 198 str maketrans/translate on `main` (586 Vitest, 102 files). Core str method parity with bytes complete.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 198 str translate)

### Landed

- [REPO] Plan 198 — `str.maketrans` / `str.translate`; `str-translate.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 197 merge PR #112)

### Landed

- [REPO] Plan 197 — PR #112 merged; plan 196 str expandtabs on `main` (581 Vitest, 101 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (translate/maketrans).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 196 str expandtabs)

### Landed

- [REPO] Plan 196 — `str.expandtabs`; `str-expandtabs.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (translate/maketrans).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 195 merge PR #111)

### Landed

- [REPO] Plan 195 — PR #111 merged; plan 194 str zfill on `main` (577 Vitest, 100 files). Str padding parity complete (`center`, `ljust`, `rjust`, `zfill`).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 194 str zfill)

### Landed

- [REPO] Plan 194 — `str.zfill`; `str-zfill.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 193 merge PR #110)

### Landed

- [REPO] Plan 193 — PR #110 merged; plan 192 str ljust/rjust on `main` (573 Vitest, 99 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (zfill).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 192 str ljust rjust)

### Landed

- [REPO] Plan 192 — `str.ljust` / `str.rjust`; `str-ljust-rjust.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (zfill).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 191 merge PR #109)

### Landed

- [REPO] Plan 191 — PR #109 merged; plan 190 str center on `main` (568 Vitest, 98 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (ljust, rjust, zfill).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 190 str center)

### Landed

- [REPO] Plan 190 — `str.center`; `str-center.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (ljust, rjust, zfill).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 189 merge PR #108)

### Landed

- [REPO] Plan 189 — PR #108 merged; plan 188 str removeprefix/removesuffix on `main` (562 Vitest, 97 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (center).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 188 str removeprefix removesuffix)

### Landed

- [REPO] Plan 188 — `str.removeprefix` / `str.removesuffix`; `str-removeprefix-removesuffix.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (center).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 187 merge PR #107)

### Landed

- [REPO] Plan 187 — PR #107 merged; plan 186 str replace on `main` (558 Vitest, 96 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (removeprefix, center).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 186 str replace)

### Landed

- [REPO] Plan 186 — `str.replace`; `str-replace.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (removeprefix, center).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 185 merge PR #106)

### Landed

- [REPO] Plan 185 — PR #106 merged; plan 184 str startswith/endswith on `main` (552 Vitest, 95 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (replace, removeprefix).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 184 str startswith endswith)

### Landed

- [REPO] Plan 184 — `str.startswith` / `str.endswith`; `str-startswith-endswith.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (replace, removeprefix).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 183 merge PR #105)

### Landed

- [REPO] Plan 183 — PR #105 merged; plan 182 str count on `main` (544 Vitest, 94 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (startswith, replace).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 182 str count)

### Landed

- [REPO] Plan 182 — `str.count`; `str-count.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (startswith, replace).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 181 merge PR #104)

### Landed

- [REPO] Plan 181 — PR #104 merged; plan 180 str index/rindex on `main` (537 Vitest, 93 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (count, startswith).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 180 str index)

### Landed

- [REPO] Plan 180 — `str.index` / `str.rindex`; `str-index.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (count, startswith).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 179 merge PR #103)

### Landed

- [REPO] Plan 179 — PR #103 merged; plan 178 str find/rfind on `main` (531 Vitest, 92 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (index, count, startswith).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 178 str find)

### Landed

- [REPO] Plan 178 — `str.find` / `str.rfind`; `str-find.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized (index, count, startswith).
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 177 merge PR #102)

### Landed

- [REPO] Plan 177 — PR #102 merged; plan 176 str predicates on `main` (525 Vitest, 91 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 176 str predicates)

### Landed

- [REPO] Plan 176 — str classification predicates; `str-predicates.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 175 merge PR #101)

### Landed

- [REPO] Plan 175 — PR #101 merged; plan 174 str splitlines on `main` (521 Vitest, 90 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 174 str splitlines)

### Landed

- [REPO] Plan 174 — `str.splitlines`; `str-splitlines.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 173 merge PR #100)

### Landed

- [REPO] Plan 173 — PR #100 merged; plan 172 str rpartition on `main` (513 Vitest, 89 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 172 str rpartition)

### Landed

- [REPO] Plan 172 — `str.rpartition`; `str-rpartition.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 171 merge PR #99)

### Landed

- [REPO] Plan 171 — PR #99 merged; plan 170 str partition on `main` (507 Vitest, 88 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 170 str partition)

### Landed

- [REPO] Plan 170 — `str.partition`; `str-partition.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 169 merge PR #98)

### Landed

- [REPO] Plan 169 — PR #98 merged; plan 168 str swapcase on `main` (500 Vitest, 87 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 168 str swapcase)

### Landed

- [REPO] Plan 168 — `str.swapcase`; `str-swapcase.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 167 merge PR #97)

### Landed

- [REPO] Plan 167 — PR #97 merged; plan 166 str title on `main` (497 Vitest, 86 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 166 str title)

### Landed

- [REPO] Plan 166 — `str.title`; `str-title.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 165 merge PR #96)

### Landed

- [REPO] Plan 165 — PR #96 merged; plan 164 str rsplit on `main` (494 Vitest, 85 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 164 str rsplit)

### Landed

- [REPO] Plan 164 — `str.rsplit`; `str-rsplit.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 163 merge PR #95)

### Landed

- [REPO] Plan 163 — PR #95 merged; plan 162 str split on `main` (485 Vitest, 84 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 162 str split)

### Landed

- [REPO] Plan 162 — `str.split`; `str-split.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 161 merge PR #94)

### Landed

- [REPO] Plan 161 — PR #94 merged; plan 160 str strip on `main` (479 Vitest, 83 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 160 str strip)

### Landed

- [REPO] Plan 160 — `str.strip` / `lstrip` / `rstrip`; `str-strip.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 159 merge PR #93)

### Landed

- [REPO] Plan 159 — PR #93 merged; plan 158 str isascii on `main` (474 Vitest, 82 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 158 str isascii)

### Landed

- [REPO] Plan 158 — `str.isascii`; `str-isascii.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 157 merge PR #92)

### Landed

- [REPO] Plan 157 — PR #92 merged; plan 156 str capitalize on `main` (472 Vitest, 81 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 156 str capitalize)

### Landed

- [REPO] Plan 156 — `str.capitalize`; `str-capitalize.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 155 merge PR #91)

### Landed

- [REPO] Plan 155 — PR #91 merged; plan 154 str upper/lower on `main` (469 Vitest, 80 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 154 str upper lower)

### Landed

- [REPO] Plan 154 — `str.upper` / `str.lower`; `str-upper-lower.test.ts`.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 153 merge PR #90)

### Landed

- [REPO] Plan 153 — PR #90 merged; plan 152 surrogateescape codec on `main` (466 Vitest, 79 files).

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 152 surrogateescape codec)

### Landed

- [REPO] Plan 152 — `errors='surrogateescape'` for str.encode and bytes.decode; extended codec tests.

### Partial

- None.

### Next

1. Further str/bytes API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 151 merge PR #89)

### Landed

- [REPO] Plan 151 — PR #89 merged; plan 150 backslashreplace codec on `main` (463 Vitest, 79 files).

### Partial

- None.

### Next

1. Further codec handlers (surrogateescape) or str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 150 backslashreplace codec)

### Landed

- [REPO] Plan 150 — `errors='backslashreplace'` for `str.encode` (ascii/latin-1) and `bytes.decode` (utf-8/ascii); extended `str-encode.test.ts` and `bytes-decode.test.ts`.

### Partial

- None.

### Next

1. Further codec handlers (surrogateescape) or str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 149 merge PR #88)

### Landed

- [REPO] Plan 149 — PR #88 merged; plan 148 bytes decode ascii on `main` (461 Vitest, 79 files).

### Partial

- None.

### Next

1. Further codec handlers (surrogateescape/backslashreplace) or str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 148 bytes decode ascii)

### Landed

- [REPO] Plan 148 — `bytes.decode('ascii', errors=...)`; extended `bytes-decode.test.ts`.

### Partial

- None.

### Next

1. Further codec handlers (surrogateescape/backslashreplace) or str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 147 merge PR #87)

### Landed

- [REPO] Plan 147 — PR #87 merged; plan 146 bytes isascii/contains on `main` (460 Vitest, 79 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 146 bytes isascii contains)

### Landed

- [REPO] Plan 146 — `bytes.isascii` / `__contains__`; `bytes-isascii-contains.test.ts`.

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 145 merge PR #86)

### Landed

- [REPO] Plan 145 — PR #86 merged; plan 144 bytes translate on `main` (456 Vitest, 78 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 144 bytes translate)

### Landed

- [REPO] Plan 144 — `bytes.maketrans` / `translate`; `bytes-translate.test.ts`.

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 143 merge PR #85)

### Landed

- [REPO] Plan 143 — PR #85 merged; plan 142 bytes predicates on `main` (452 Vitest, 77 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 142 bytes predicates)

### Landed

- [REPO] Plan 142 — `bytes.isalpha` / `isdigit` / `isalnum` / `islower` / `isupper` / `istitle` / `isspace`; `bytes-predicates.test.ts`.

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 141 merge PR #84)

### Landed

- [REPO] Plan 141 — PR #84 merged; plan 140 bytes hex/fromhex on `main` (448 Vitest, 76 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 140 bytes hex fromhex)

### Landed

- [REPO] Plan 140 — `bytes.hex` / `bytes.fromhex`; `bytes-hex-fromhex.test.ts`.

### Partial

- None.

### Next

1. Merge plan 140 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 139 merge PR #83)

### Landed

- [REPO] Plan 139 — PR #83 merged; plan 138 bytes expandtabs on `main` (445 Vitest, 75 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 138 bytes expandtabs)

### Landed

- [REPO] Plan 138 — `bytes.expandtabs`; `bytes-expandtabs.test.ts`.

### Partial

- None.

### Next

1. Merge plan 138 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 137 merge PR #82)

### Landed

- [REPO] Plan 137 — PR #82 merged; plan 136 bytes removeprefix/removesuffix on `main` (442 Vitest, 74 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 136 bytes removeprefix removesuffix)

### Landed

- [REPO] Plan 136 — `bytes.removeprefix` / `removesuffix`; `bytes-removeprefix-removesuffix.test.ts`.

### Partial

- None.

### Next

1. Merge plan 136 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 135 merge PR #81)

### Landed

- [REPO] Plan 135 — PR #81 merged; plan 134 bytes title on `main` (439 Vitest, 73 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 134 bytes title)

### Landed

- [REPO] Plan 134 — `bytes.title` ASCII word title case; `bytes-title.test.ts`.

### Partial

- None.

### Next

1. Merge plan 134 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 133 merge PR #80)

### Landed

- [REPO] Plan 133 — PR #80 merged; plan 132 bytes zfill on `main` (436 Vitest, 72 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 132 bytes zfill)

### Landed

- [REPO] Plan 132 — `bytes.zfill` with sign-preserving zero padding; `bytes-zfill.test.ts`.

### Partial

- None.

### Next

1. Merge plan 132 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 131 merge PR #79)

### Landed

- [REPO] Plan 131 — PR #79 merged; plan 130 bytes ljust/rjust on `main` (433 Vitest, 71 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 130 bytes ljust rjust)

### Landed

- [REPO] Plan 130 — `bytes.ljust` / `rjust` with optional fill byte; `bytes-ljust-rjust.test.ts`.

### Partial

- None.

### Next

1. Merge plan 130 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 129 merge PR #78)

### Landed

- [REPO] Plan 129 — PR #78 merged; plan 128 bytes center on `main` (430 Vitest, 70 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 128 bytes center)

### Landed

- [REPO] Plan 128 — `bytes.center` with optional fill byte; `bytes-center.test.ts`.

### Partial

- None.

### Next

1. Merge plan 128 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 127 merge PR #77)

### Landed

- [REPO] Plan 127 — PR #77 merged; plan 126 bytes swapcase on `main` (426 Vitest, 69 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 126 bytes swapcase)

### Landed

- [REPO] Plan 126 — `bytes.swapcase` ASCII case swap; `bytes-swapcase.test.ts`.

### Partial

- None.

### Next

1. Merge plan 126 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 125 merge PR #76)

### Landed

- [REPO] Plan 125 — PR #76 merged; plan 124 bytes capitalize on `main` (423 Vitest, 68 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 124 bytes capitalize)

### Landed

- [REPO] Plan 124 — `bytes.capitalize` ASCII case conversion; `bytes-capitalize.test.ts`.

### Partial

- None.

### Next

1. Merge plan 124 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 123 merge PR #75)

### Landed

- [REPO] Plan 123 — PR #75 merged; plan 122 bytes upper/lower on `main` (420 Vitest, 67 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 122 bytes upper lower)

### Landed

- [REPO] Plan 122 — `bytes.upper` / `lower` ASCII case conversion; `bytes-upper-lower.test.ts`.

### Partial

- None.

### Next

1. Merge plan 122 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 121 merge PR #74)

### Landed

- [REPO] Plan 121 — PR #74 merged; plan 120 bytes replace on `main` (417 Vitest, 66 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 120 bytes replace)

### Landed

- [REPO] Plan 120 — `bytes.replace` with optional count; `bytes-replace.test.ts`.

### Partial

- None.

### Next

1. Merge plan 120 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 119 merge PR #73)

### Landed

- [REPO] Plan 119 — PR #73 merged; plan 118 bytes count on `main` (412 Vitest, 65 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 118 bytes count)

### Landed

- [REPO] Plan 118 — `bytes.count` with optional start/end; `bytes-count.test.ts`.

### Partial

- None.

### Next

1. Merge plan 118 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 117 merge PR #72)

### Landed

- [REPO] Plan 117 — PR #72 merged; plan 116 bytes index/rindex on `main` (406 Vitest, 64 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 116 bytes index)

### Landed

- [REPO] Plan 116 — `bytes.index` / `rindex` with optional start/end; `bytes-index.test.ts`.

### Partial

- None.

### Next

1. Merge plan 116 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 115 merge PR #71)

### Landed

- [REPO] Plan 115 — PR #71 merged; plan 114 bytes find/rfind on `main` (401 Vitest, 63 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 114 bytes find)

### Landed

- [REPO] Plan 114 — `bytes.find` / `rfind` with optional start/end; `bytes-find.test.ts`.

### Partial

- None.

### Next

1. Merge plan 114 via PR; then codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 113 merge PR #70)

### Landed

- [REPO] Plan 113 — PR #70 merged; plan 112 bytes strip on `main` (396 Vitest, 62 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 112 bytes strip)

### Landed

- [REPO] Plan 112 — `bytes.strip` / `lstrip` / `rstrip` with optional chars; `bytes-strip.test.ts`.

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 111 merge PR #69)

### Landed

- [REPO] Plan 111 — PR #69 merged; plan 110 bytes splitlines on `main` (391 Vitest, 61 files).

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 110 bytes splitlines)

### Landed

- [REPO] Plan 110 — `bytes.splitlines(keepends=False)` → `pyList` of `pyBytes`; `bytes-splitlines.test.ts`.

### Partial

- None.

### Next

1. Codec handlers or further bytes/str API when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 109 merge PR #68)

### Landed

- [REPO] Plan 109 — PR #68 merged; plan 108 bytes partition on `main` (383 Vitest, 60 files).

### Partial

- None.

### Next

1. Further bytes methods or codec handlers when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 108 bytes partition)

### Landed

- [REPO] Plan 108 — `bytes.partition` / `bytes.rpartition` → 3-tuple of `pyBytes`; `bytes-partition.test.ts`.

### Partial

- None.

### Next

1. Further bytes methods or codec handlers when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 107 merge PR #67)

### Landed

- [REPO] Plan 107 — PR #67 merged; plan 106 bytes startswith/endswith on `main` (374 Vitest, 59 files).

### Partial

- None.

### Next

1. Further bytes methods (`partition`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 106 bytes startswith endswith)

### Landed

- [REPO] Plan 106 — `bytes.startswith` / `bytes.endswith` with tuple affixes and slice bounds; `bytes-startswith-endswith.test.ts`.

### Partial

- None.

### Next

1. Further bytes methods (`partition`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

---

## Delta update (2026-05-24, plan 105 merge PR #66)

### Landed

- [REPO] Plan 105 — PR #66 merged; plan 104 bytes rsplit on `main` (367 Vitest, 58 files).

### Partial

- None.

### Next

1. Further bytes methods (`startswith`, `partition`, codec handlers) when prioritized.
2. PEP 3118 buffer protocol remains out of scope until planned.

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
