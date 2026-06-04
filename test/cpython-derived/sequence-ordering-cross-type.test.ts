/**
 * CPython: list/tuple cross-type ordering TypeError (plan 684).
 */
import { describe } from "vitest";
import { pyInt, pyList, pyTuple } from "../../src/index.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("sequence cross-type ordering", () => {
  const oneList = () => pyList([pyInt(1)]);
  const oneTuple = () => pyTuple([pyInt(1)]);

  registerCrossTypeOrderingRejects("list", "tuple", oneList, oneTuple);
});
