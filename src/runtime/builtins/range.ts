import { PyObject } from "../core/object.js";
import { Hook, Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyIndexError, PyStopIteration, PyTypeError, PyValueError } from "../core/errors.js";
import { pyIndexAsInteger, pyInt } from "./int.js";

type RangeFields = { start: number; stop: number; step: number };

function parseRangeArg(value: unknown, label: string): number {
  if (!(value instanceof PyObject)) {
    const kind = typeof value;
    throw new PyTypeError(`range() ${label} must be PyObject, not ${kind}`);
  }
  const n = pyIndexAsInteger(value);
  if (n === null) {
    throw new PyTypeError(
      `'${value.type.name}' object cannot be interpreted as an integer`,
    );
  }
  return n;
}

function rangeLength({ start, stop, step }: RangeFields): number {
  if (step > 0) {
    if (start >= stop) return 0;
    return Math.floor((stop - start - 1) / step) + 1;
  }
  if (start <= stop) return 0;
  return Math.floor((start - stop - 1) / -step) + 1;
}

function rangeRepr({ start, stop, step }: RangeFields): string {
  if (step === 1) {
    if (start === 0) return `range(${stop})`;
    return `range(${start}, ${stop})`;
  }
  return `range(${start}, ${stop}, ${step})`;
}

function rangeContains(fields: RangeFields, key: unknown): boolean {
  if (!(key instanceof PyObject)) return false;
  const n = pyIndexAsInteger(key);
  if (n === null) return false;
  const { start, stop, step } = fields;
  if (step > 0) {
    if (n < start || n >= stop) return false;
    return (n - start) % step === 0;
  }
  if (n > start || n <= stop) return false;
  return (start - n) % -step === 0;
}

function rangeGetItem(fields: RangeFields, key: unknown): PyObject {
  let index: number;
  if (key instanceof PyObject) {
    const n = pyIndexAsInteger(key);
    if (n === null) {
      throw new PyTypeError(
        "range indices must be integers or slices, not " +
          `'${key.type.name}'`,
      );
    }
    index = n;
  } else {
    throw new PyTypeError("range indices must be integers or slices");
  }
  const len = rangeLength(fields);
  if (index < 0) index += len;
  if (index < 0 || index >= len) {
    throw new PyIndexError("range object index out of range");
  }
  return pyInt(fields.start + index * fields.step);
}

const rangeReverseIterType = makeClass({
  name: "range_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const index = self.dict.get("_index") as number;
      if (index < 0) throw new PyStopIteration();
      const fields = self.dict.get("_fields") as RangeFields;
      const out = pyInt(fields.start + index * fields.step);
      self.dict.set("_index", index - 1);
      return out;
    }],
  ]),
});

const rangeIterType = makeClass({
  name: "range_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const value = self.dict.get("_value") as number;
      const stop = self.dict.get("_stop") as number;
      const step = self.dict.get("_step") as number;
      if (step > 0) {
        if (value >= stop) throw new PyStopIteration();
      } else if (value <= stop) {
        throw new PyStopIteration();
      }
      const out = pyInt(value);
      self.dict.set("_value", value + step);
      return out;
    }],
  ]),
});

export const rangeType = makeClass({
  name: "range",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => rangeRepr(self.dict.get("_fields") as RangeFields)],
    [Slot.iter, (self: PyObject) => {
      const fields = self.dict.get("_fields") as RangeFields;
      const it = new PyObject(rangeIterType);
      it.dict.set("_value", fields.start);
      it.dict.set("_stop", fields.stop);
      it.dict.set("_step", fields.step);
      return it;
    }],
    [Slot.len, (self: PyObject) => {
      return rangeLength(self.dict.get("_fields") as RangeFields);
    }],
    [Slot.bool, (self: PyObject) => {
      return rangeLength(self.dict.get("_fields") as RangeFields) > 0;
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      return rangeGetItem(self.dict.get("_fields") as RangeFields, key);
    }],
    [Slot.contains, (self: PyObject, key: unknown) => {
      return rangeContains(self.dict.get("_fields") as RangeFields, key);
    }],
    [Hook.reversed, (self: PyObject) => {
      const fields = self.dict.get("_fields") as RangeFields;
      const it = new PyObject(rangeReverseIterType);
      it.dict.set("_fields", fields);
      it.dict.set("_index", rangeLength(fields) - 1);
      return it;
    }],
  ]),
});

function makeRangeObject(fields: RangeFields): PyObject {
  const obj = new PyObject(rangeType);
  obj.dict.set("_fields", fields);
  return obj;
}

export function range(...args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError("range expected at least 1 argument, got 0");
  }
  if (args.length > 3) {
    throw new PyTypeError(
      `range expected at most 3 arguments, got ${args.length}`,
    );
  }
  let start: number;
  let stop: number;
  let step = 1;
  if (args.length === 1) {
    start = 0;
    stop = parseRangeArg(args[0], "stop");
  } else if (args.length === 2) {
    start = parseRangeArg(args[0], "start");
    stop = parseRangeArg(args[1], "stop");
  } else {
    start = parseRangeArg(args[0], "start");
    stop = parseRangeArg(args[1], "stop");
    step = parseRangeArg(args[2], "step");
    if (step === 0) {
      throw new PyValueError("range() arg 3 must not be zero");
    }
  }
  return makeRangeObject({ start, stop, step });
}
