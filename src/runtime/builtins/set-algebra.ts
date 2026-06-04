import { setAddMember, setMemberHas } from "./set-membership.js";

export function intersectionItems(
  a: Set<unknown>,
  b: Set<unknown>,
): unknown[] {
  return [...a].filter((x) => setMemberHas(b, x));
}

export function unionItems(a: Set<unknown>, b: Set<unknown>): unknown[] {
  const out = new Set<unknown>();
  for (const item of a) setAddMember(out, item);
  for (const item of b) setAddMember(out, item);
  return [...out];
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
