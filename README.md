# pyrt

TypeScript library that emulates a **subset** of **CPython’s object model** (special method dispatch, descriptors, MRO, explicit operators like `eq` / `add` / `getAttr`). It is **not** a Python interpreter.

## Documentation

- **[Knowledgebase](docs/knowledgebase/README.md)** — layered docs; **Python 3.9–3.14** official references (pinned URLs); 3.14 slot inventory anchor.
- **[Compatibility matrix, gaps, and bibliography](docs/COMPATIBILITY_AND_GAPS.md)** — exhaustive supported / partial / out-of-scope list with CPython source map.

## Quick start

```bash
npm install
npm test
npm run check
```

Examples: `npx tsx examples/python-vs-js.ts`

## License

MIT
