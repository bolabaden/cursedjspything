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

Vitest; 107 tests across:

| File | Focus |
|------|-------|
| `test/slots.test.ts` | Registry completeness |
| `test/object-model.test.ts` | PyObject, types, lookup, descriptors |
| `test/operators.test.ts` | Comparisons, numeric |
| `test/class-system.test.ts` | MRO, class creation |
| `test/protocols.test.ts` | call, iter, async surface, builtins via protocols |

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

## L5 — CPython golden (not in repo)

`[OPEN]` Recommended future harness:

```bash
# illustrative — not implemented
python3.14 -c "..."  # compare to pyrt helper output
```

Repeat for 3.9–3.14 only for behaviors that vary by version.

---

## CI gap

`[REPO]` No `.github/workflows` yet. Living plan tracks adding CI for L1+L2.

---

## Definition of done (vertical slice)

`[SYNTH]` For a behavior change:

1. Implementation in `src/runtime/`
2. Test in `test/`
3. Entry in `COMPATIBILITY_AND_GAPS.md` if user-visible
4. KB update if scope/version policy changes
5. L1 + L2 green

Do not mark complete from source inspection alone when behavior is user-facing.
