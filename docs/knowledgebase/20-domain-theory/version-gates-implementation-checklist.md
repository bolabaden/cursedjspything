# Version gates implementation checklist

Pinned references: [python-version-matrix-3.9-3.14.md](python-version-matrix-3.9-3.14.md).

| Feature | Min Python | Hook / API | Status | Notes |
|---------|------------|------------|--------|-------|
| `__match_args__` | 3.10 | `Hook.matchArgs`, `getMatchArgs()` | **Implemented** | Stored on `PyType`; no `match` VM |
| `__buffer__` / `__release_buffer__` | 3.12 | `Slot.buffer`, `getBuffer` / `releaseBuffer` | **Partial** | Minimal `PyBufferView`; no `memoryview` |
| `__annotate__` / `__annotations__` | 3.14 | `Hook.annotate`, `getAnnotations()` | **Partial** | Deferred callable + map; no full PEP 649 |
| Golden harness | 3.9–3.14 | `npm run golden` | **Partial** | Per-version `expected/{version}.json`; host must have interpreters |
| Class `__prepare__` merge | 3.9+ | `makeClass` + `prepareNamespace` | **Implemented** | Default `usePrepare: true` |
| Metaclass `__call__` | 3.9+ | `metaNewClass` | **Partial** | Custom metaclass only |
| `withObject` helper | 3.9+ | `protocols.withObject` | **Implemented** | Not a statement |
| Dict PyObject keys | 3.9+ | `dict-keys.ts` + `pyDict` | **Implemented** | `eq` + `hash` |
| `slice` + `getItem` | 3.9+ | `pySlice`, `getItem` | **Implemented** | Sequence via `__len__` + `__getitem__` |

## Not planned (Tier 3)

- Structural pattern matching VM
- Full PEP 3118 / `memoryview`
- `super()` / `__classcell__`
- CPython golden for every 3.9–3.13 delta (expand case-by-case)
