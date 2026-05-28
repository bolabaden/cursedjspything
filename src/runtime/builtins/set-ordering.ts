/** Subset/superset helpers for set and frozenset ordering comparisons. */

export function isSubsetOf(a: Set<unknown>, b: Set<unknown>): boolean {
  for (const item of a) if (!b.has(item)) return false;
  return true;
}

export function isProperSubsetOf(a: Set<unknown>, b: Set<unknown>): boolean {
  return a.size < b.size && isSubsetOf(a, b);
}

export function isSupersetOf(a: Set<unknown>, b: Set<unknown>): boolean {
  return isSubsetOf(b, a);
}

export function isProperSupersetOf(a: Set<unknown>, b: Set<unknown>): boolean {
  return a.size > b.size && isSubsetOf(b, a);
}

export function areDisjoint(a: Set<unknown>, b: Set<unknown>): boolean {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of small) if (large.has(item)) return false;
  return true;
}
