# pyrt

TypeScript library that emulates a **subset** of **CPython’s object model** (special method dispatch, descriptors, MRO, explicit operators like `eq` / `add` / `getAttr`). It is **not** a Python interpreter.

## Documentation

- **[Compatibility matrix, gaps, and bibliography](docs/COMPATIBILITY_AND_GAPS.md)** — exhaustive list of what is supported, partial, or out of scope, with links to Python docs and CPython source.

## Quick start

```bash
npm install
npm test
npm run check
```

Examples: `npx tsx examples/python-vs-js.ts`

## License

MIT
