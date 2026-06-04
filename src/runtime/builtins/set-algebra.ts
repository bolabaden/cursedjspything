import { setMemberHas } from "./set-membership.js";

export function intersectionItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [...a].filter((x) => setMemberHas(b, x));
}

export function unionItems(a: Set<unknown>, b: Set<unknown>): unknown[] {
  return [...a, ...b];
}

export function differenceItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [...a].filter((x) => !setMemberHas(b, x));
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
