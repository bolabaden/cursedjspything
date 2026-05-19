# CPython reference submodule

`[REPO]` pyrt vendors CPython at `vendor/cpython` (git submodule, shallow clone, pin **`v3.14.0`**) for **reference and test mining only**.

## What it is for

- Traceability links in COMPATIBILITY and ported tests (`Lib/test/test_richcmp.py` line refs)
- Maintainer script `scripts/cpython/mine-lib-tests.sh` lists candidate `Lib/test` modules
- Human review when adding golden cases in `scripts/golden/cases.py`

## What it is not for

- Building CPython inside this repo
- Running `python -m test` / `regrtest` as a merge gate for pyrt
- Auto-transpiling all of `Lib/test` to TypeScript

## Parity surfaces

| Surface | Mechanism | CPython source |
|---------|-----------|----------------|
| Cross-runtime JSON | `npm run golden` | `scripts/golden/cases.py` (executed on installed Python) |
| Ported unittest logic | Vitest `test/cpython-derived/*` | Curated methods from `Lib/test` |
| Unit regressions | `npm test` | pyrt-specific |

## Updating the pin

```bash
cd vendor/cpython
git fetch --depth 1 origin tag v3.14.x
git checkout v3.14.x
cd ../..
git add vendor/cpython
# Re-run golden matrix; refresh test/cpython-derived if slotdefs changed
```

## Init for contributors

```bash
git submodule update --init --depth 1 vendor/cpython
cd vendor/cpython && git checkout v3.14.0
```
