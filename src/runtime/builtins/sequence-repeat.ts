import type { PyObject } from "../core/object.js";

/** Build backing array for list/tuple `__mul__` (reference copy, no spread). */
export function buildRepeatedArray(src: readonly PyObject[], n: number): PyObject[] {
  if (n === 0 || src.length === 0) return [];
  if (n === 1) return src.slice();

  const total = src.length * n;
  const out = new Array<PyObject>(total);
  let pos = 0;
  for (let rep = 0; rep < n; rep++) {
    for (let j = 0; j < src.length; j++) out[pos++] = src[j];
  }
  return out;
}
