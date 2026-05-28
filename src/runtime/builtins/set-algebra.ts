export function intersectionItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [...a].filter((x) => b.has(x));
}

export function unionItems(a: Set<unknown>, b: Set<unknown>): unknown[] {
  return [...a, ...b];
}

export function differenceItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [...a].filter((x) => !b.has(x));
}

export function symmetricDifferenceItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [
    ...differenceItems(a, b),
    ...differenceItems(b, a),
  ];
}
