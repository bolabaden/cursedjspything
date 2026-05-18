# Evidence conventions

## Labels

| Label | Meaning |
|-------|---------|
| `[REPO]` | Observed fact from this repository (source, tests, config) |
| `[OFFICIAL]` | Python docs, PEPs, or CPython source claims (with URL) |
| `[SYNTH]` | Synthesis or implementation guidance derived from multiple sources |
| `[OPEN]` | Unverified, disputed, or environment-dependent |

Do not merge categories in a single sentence without labels.

## Python version citations

When citing behavior:

1. Prefer **version-pinned** URLs: `https://docs.python.org/3.N/reference/datamodel.html`
2. State **minimum version** for a feature (e.g. `__match_args__` ≥ 3.10).
3. Distinguish **documented in LR** vs **runtime may differ** (`[OPEN]` if not golden-tested).

## Relevance tiers (external research)

- **Tier 1:** directly actionable for pyrt now
- **Tier 2:** strongly directional near-term
- **Tier 3:** frontier / adjacent (label as non-current truth)

## Source priority (this project)

1. User instructions and this knowledgebase
2. `[REPO]` evidence
3. `[OFFICIAL]` Python 3.9–3.14 docs (pinned per version)
4. CPython `main` source (pin commit/tag for papers)
5. External research / community
