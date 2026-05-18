# Non-goals

Explicit out-of-scope items. `[SYNTH]` unless noted `[REPO]`.

## Language & runtime

| Non-goal | Rationale |
|----------|-----------|
| Bytecode VM / `eval` / `exec` | Different product; see CPython `ceval.c` |
| `import`, modules, `sys.path` | No module graph |
| Generators, `yield`, `async for` over real coroutines | Requires frame stack + scheduler |
| Full `asyncio` | Only async **protocol surface** (`__aiter__`, …) partially stubbed |
| `super()` | No implicit `__class__` cell / frame linkage |
| Structural pattern matching (`match`/`case`) | Syntax + VM, not object model alone |
| `try`/`except`/`finally` as Python | JS exceptions differ |
| Arbitrary-precision `int` | `[REPO]` `pyInt` uses JS `number` |
| GC, cycles, `__del__` | `[REPO]` `Slot.del` registered; no finalizer integration |
| PEP 3118 buffer protocol | Stubs only; no memoryview |

## Syntax & ergonomics

| Non-goal | Rationale |
|----------|-----------|
| Python surface syntax in TS | Use `add(a,b)` not `a+b` |
| TC39 operator overloading | Withdrawn; not in JS |
| Full `Proxy` emulation of all dunders | Partial; see COMPATIBILITY §11 |

## Parity claims

| Non-goal | Rationale |
|----------|-----------|
| Bit-identical behavior vs CPython on all versions | No per-version golden suite `[OPEN]` |
| Full metaclass `type.__call__` pipeline | `[REPO]` simplified `makeClass` / `instantiate` |
| Complete 3.14 `__annotate__` | Documented 3.14+; not fully implemented |

## Repository hygiene (not product, but noted)

`[REPO]` As of KB creation: no `LICENSE`, `.gitignore`, or CI in repo — tracked in [../LIVING-PLAN.md](../LIVING-PLAN.md).

## Where detail lives

- Matrix: [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md)
- Summary: [../40-operational-risk/compatibility-summary.md](../40-operational-risk/compatibility-summary.md)
