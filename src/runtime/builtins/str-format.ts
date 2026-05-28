/**
 * PEP 3101-style str.format / str.format_map (positional + named via mapping).
 */
import { PyObject, PyType } from "../core/object.js";
import {
  PyIndexError,
  PyKeyError,
  PyTypeError,
  PyValueError,
} from "../core/errors.js";
import { ascii, format, repr, str } from "../dispatch/operators/numeric.js";
import { getItem } from "../dispatch/protocols.js";
import { getAttr } from "../core/lookup.js";
import { dictGet } from "../collections/dict-keys.js";
import { nativeVal, setNative } from "./native.js";
import { dictType } from "./dict.js";
import { pyInt } from "./int.js";

type ConversionFlag = "" | "s" | "r" | "a";

interface FormatField {
  readonly name: string;
  readonly conversion: ConversionFlag;
  readonly formatSpec: string;
}

type FormatPart =
  | { readonly kind: "literal"; readonly text: string }
  | { readonly kind: "field"; readonly field: FormatField };

function parseFormatString(template: string): FormatPart[] {
  const parts: FormatPart[] = [];
  let i = 0;
  while (i < template.length) {
    const ch = template[i]!;
    if (ch === "{") {
      if (template[i + 1] === "{") {
        parts.push({ kind: "literal", text: "{" });
        i += 2;
        continue;
      }
      const { field, end } = parseField(template, i + 1);
      parts.push({ kind: "field", field });
      i = end + 1;
      continue;
    }
    if (ch === "}") {
      if (template[i + 1] === "}") {
        parts.push({ kind: "literal", text: "}" });
        i += 2;
        continue;
      }
      throw new PyValueError("Single '}' encountered in format string");
    }
    const start = i;
    while (i < template.length) {
      const c = template[i]!;
      if (c === "{" || c === "}") break;
      i += 1;
    }
    parts.push({ kind: "literal", text: template.slice(start, i) });
  }
  return parts;
}

function parseField(
  template: string,
  start: number,
): { field: FormatField; end: number } {
  let i = start;
  let nameEnd = start;
  while (nameEnd < template.length) {
    const c = template[nameEnd]!;
    if (c === "!" || c === ":" || c === "}") break;
    nameEnd += 1;
  }
  const name = template.slice(start, nameEnd);
  i = nameEnd;

  let conversion: ConversionFlag = "";
  if (i < template.length && template[i] === "!") {
    i += 1;
    if (i >= template.length) {
      throw new PyValueError("expected ':' after conversion specifier");
    }
    const flag = template[i]!;
    if (flag === "s" || flag === "r" || flag === "a") {
      conversion = flag;
      i += 1;
    } else {
      throw new PyValueError(
        `Unknown conversion specifier ${JSON.stringify(flag)}`,
      );
    }
  }

  let formatSpec = "";
  if (i < template.length && template[i] === ":") {
    i += 1;
    const specStart = i;
    i = parseFormatSpecEnd(template, specStart);
    formatSpec = template.slice(specStart, i);
  }

  if (i >= template.length || template[i] !== "}") {
    throw new PyValueError("expected '}' before end of string");
  }

  return { field: { name, conversion, formatSpec }, end: i };
}

function parseFormatSpecEnd(template: string, start: number): number {
  let i = start;
  let depth = 0;
  while (i < template.length) {
    const c = template[i]!;
    if (c === "{") {
      if (depth === 0 && template[i + 1] === "{") {
        i += 2;
        continue;
      }
      depth += 1;
      i += 1;
      continue;
    }
    if (c === "}") {
      if (depth === 0 && template[i + 1] === "}") {
        i += 2;
        continue;
      }
      if (depth > 0) {
        depth -= 1;
        i += 1;
        continue;
      }
      return i;
    }
    i += 1;
  }
  throw new PyValueError("expected '}' before end of string");
}

function isIdentifierField(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

function isPositionalField(name: string): boolean {
  return name === "" || /^\d+$/.test(name);
}

interface FieldNameParts {
  readonly root: string;
  readonly steps: readonly FieldStep[];
}

type FieldStep =
  | { readonly kind: "attr"; readonly name: string }
  | { readonly kind: "getitem"; readonly key: number | string };

/** Trailing wrapper for **kwargs at the JS `str.format` call boundary. */
export class FormatKeywordMapping {
  readonly mapping: PyObject;

  constructor(mapping: PyObject) {
    if (!(mapping instanceof PyObject)) {
      throw new PyTypeError(
        "FormatKeywordMapping requires a PyObject mapping instance",
      );
    }
    this.mapping = mapping;
  }
}

export function isFormatKeywordMapping(v: unknown): v is FormatKeywordMapping {
  return v instanceof FormatKeywordMapping;
}

function parseFieldName(name: string): FieldNameParts {
  if (name === "") return { root: "", steps: [] };
  if (name.startsWith(".") || name.startsWith("[")) {
    throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
  }

  let i = 0;
  while (i < name.length && name[i] !== "." && name[i] !== "[") i += 1;
  const root = name.slice(0, i);
  if (root !== "" && !/^\d+$/.test(root) && !isIdentifierField(root)) {
    throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
  }

  const steps: FieldStep[] = [];
  while (i < name.length) {
    if (name[i] === ".") {
      i += 1;
      const start = i;
      while (i < name.length && name[i] !== "." && name[i] !== "[") i += 1;
      const attr = name.slice(start, i);
      if (attr === "" || !isIdentifierField(attr)) {
        throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
      }
      steps.push({ kind: "attr", name: attr });
      continue;
    }
    if (name[i] === "[") {
      i += 1;
      const start = i;
      while (i < name.length && name[i] !== "]") i += 1;
      if (i >= name.length || name[i] !== "]") {
        throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
      }
      const indexStr = name.slice(start, i);
      i += 1;
      if (indexStr === "") {
        throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
      }
      if (/^\d+$/.test(indexStr)) {
        steps.push({ kind: "getitem", key: Number(indexStr) });
      } else {
        steps.push({ kind: "getitem", key: indexStr });
      }
      continue;
    }
    throw new PyValueError(`Invalid field name: ${JSON.stringify(name)}`);
  }

  return { root, steps };
}

function subscriptKeyForGetItem(key: number | string, strType: PyType): unknown {
  if (typeof key === "number") return key;
  const obj = new PyObject(strType);
  setNative(obj, key);
  return obj;
}

function applyFormatSteps(
  obj: PyObject,
  steps: readonly FieldStep[],
  strType: PyType,
): PyObject {
  let current = obj;
  for (const step of steps) {
    if (step.kind === "attr") {
      const next = getAttr(current, step.name);
      if (!(next instanceof PyObject)) {
        throw new PyTypeError(
          `format attribute ${JSON.stringify(step.name)} did not resolve to a PyObject`,
        );
      }
      current = next;
      continue;
    }
    try {
      const next = getItem(current, subscriptKeyForGetItem(step.key, strType));
      if (!(next instanceof PyObject)) {
        throw new PyTypeError("format subscript did not resolve to a PyObject");
      }
      current = next;
    } catch (e) {
      if (e instanceof PyKeyError || e instanceof PyIndexError) throw e;
      throw e;
    }
  }
  return current;
}

function renderFieldValue(
  obj: PyObject,
  conversion: ConversionFlag,
  formatSpec: string,
): string {
  if (conversion === "r") return repr(obj);
  if (conversion === "s") return str(obj);
  if (conversion === "a") return ascii(obj);
  if (formatSpec === "" && conversion === "") return str(obj);
  return format(obj, formatSpec);
}

function substituteFormatSpec(
  formatSpec: string,
  resolve: (field: FormatField) => PyObject,
): string {
  if (!formatSpec.includes("{")) return formatSpec;
  const parts = parseFormatString(formatSpec);
  let out = "";
  for (const part of parts) {
    if (part.kind === "literal") {
      out += part.text;
      continue;
    }
    const { field } = part;
    if (field.conversion !== "" || field.formatSpec !== "") {
      throw new PyValueError(
        "Invalid format specifier " + JSON.stringify(formatSpec),
      );
    }
    out += str(resolve(field));
  }
  return out;
}

function mappingKeyForField(fieldName: string, strType: PyType): PyObject {
  if (/^\d+$/.test(fieldName)) return pyInt(Number(fieldName));
  const obj = new PyObject(strType);
  setNative(obj, fieldName);
  return obj;
}

function lookupMappingValue(
  mapping: PyObject,
  fieldName: string,
  strType: PyType,
): PyObject {
  if (mapping.type === dictType) {
    const m = nativeVal<Map<unknown, unknown>>(mapping);
    const key = mappingKeyForField(fieldName, strType);
    const value = dictGet(m, key);
    if (value === undefined) {
      throw new PyKeyError(fieldName);
    }
    if (!(value instanceof PyObject)) {
      throw new PyTypeError("format mapping values must be PyObject");
    }
    return value;
  }
  try {
    const key = mappingKeyForField(fieldName, strType);
    const value = getItem(mapping, key);
    if (!(value instanceof PyObject)) {
      throw new PyTypeError("format mapping values must be PyObject");
    }
    return value;
  } catch (e) {
    if (e instanceof PyKeyError) throw new PyKeyError(fieldName);
    throw e;
  }
}

function resolvePositional(
  args: readonly PyObject[],
  field: FormatField,
  strType: PyType,
  autoIndex: { value: number },
  manualSeen: { value: boolean },
): PyObject {
  const { root, steps } = parseFieldName(field.name);
  if (!isPositionalField(root)) {
    throw new PyKeyError(field.name);
  }
  let index: number;
  if (root === "") {
    if (manualSeen.value) {
      throw new PyValueError(
        "cannot switch from manual field specification to automatic field numbering",
      );
    }
    index = autoIndex.value;
    autoIndex.value += 1;
  } else {
    if (autoIndex.value > 0) {
      throw new PyValueError(
        "cannot switch from automatic field numbering to manual field specification",
      );
    }
    manualSeen.value = true;
    index = Number(root);
  }
  const value = args[index];
  if (value === undefined) {
    throw new PyIndexError(
      "Replacement index " + index + " out of range for positional args tuple",
    );
  }
  return applyFormatSteps(value, steps, strType);
}

function resolvePositionalWithKwargs(
  args: readonly PyObject[],
  kwargs: PyObject,
  field: FormatField,
  strType: PyType,
  autoIndex: { value: number },
  manualSeen: { value: boolean },
): PyObject {
  const { root, steps } = parseFieldName(field.name);
  if (root === "") {
    if (manualSeen.value) {
      throw new PyValueError(
        "cannot switch from manual field specification to automatic field numbering",
      );
    }
    const index = autoIndex.value;
    autoIndex.value += 1;
    const value = args[index];
    if (value === undefined) {
      throw new PyIndexError(
        "Replacement index " +
          index +
          " out of range for positional args tuple",
      );
    }
    return applyFormatSteps(value, steps, strType);
  }
  if (/^\d+$/.test(root)) {
    if (autoIndex.value > 0) {
      throw new PyValueError(
        "cannot switch from automatic field numbering to manual field specification",
      );
    }
    manualSeen.value = true;
    const index = Number(root);
    const value = args[index];
    if (value === undefined) {
      throw new PyIndexError(
        "Replacement index " +
          index +
          " out of range for positional args tuple",
      );
    }
    return applyFormatSteps(value, steps, strType);
  }
  if (isIdentifierField(root)) {
    const value = lookupMappingValue(kwargs, root, strType);
    return applyFormatSteps(value, steps, strType);
  }
  throw new PyValueError(`Invalid field name: ${JSON.stringify(field.name)}`);
}

function resolveMapping(
  mapping: PyObject,
  field: FormatField,
  strType: PyType,
  autoIndex: { value: number },
  manualSeen: { value: boolean },
): PyObject {
  const { root, steps } = parseFieldName(field.name);
  if (root === "") {
    if (manualSeen.value) {
      throw new PyValueError(
        "cannot switch from manual field specification to automatic field numbering",
      );
    }
    throw new PyValueError(
      "cannot switch from manual field specification to automatic field numbering",
    );
  }
  let value: PyObject;
  if (/^\d+$/.test(root)) {
    if (autoIndex.value > 0) {
      throw new PyValueError(
        "cannot switch from automatic field numbering to manual field specification",
      );
    }
    manualSeen.value = true;
    value = lookupMappingValue(mapping, root, strType);
  } else if (isIdentifierField(root)) {
    value = lookupMappingValue(mapping, root, strType);
  } else {
    throw new PyValueError(`Invalid field name: ${JSON.stringify(field.name)}`);
  }
  return applyFormatSteps(value, steps, strType);
}

function buildFormattedString(
  template: string,
  strType: PyType,
  resolve: (field: FormatField) => PyObject,
): string {
  const parts = parseFormatString(template);
  let out = "";
  for (const part of parts) {
    if (part.kind === "literal") {
      out += part.text;
      continue;
    }
    const { field } = part;
    const value = resolve(field);
    const expandedSpec = substituteFormatSpec(field.formatSpec, resolve);
    out += renderFieldValue(value, field.conversion, expandedSpec);
  }
  return out;
}

export function formatStr(
  template: string,
  strType: PyType,
  args: readonly PyObject[],
  kwargs?: PyObject,
): string {
  const autoIndex = { value: 0 };
  const manualSeen = { value: false };
  const resolve = kwargs
    ? (field: FormatField) =>
        resolvePositionalWithKwargs(
          args,
          kwargs,
          field,
          strType,
          autoIndex,
          manualSeen,
        )
    : (field: FormatField) =>
        resolvePositional(args, field, strType, autoIndex, manualSeen);
  return buildFormattedString(template, strType, resolve);
}

export function formatMapStr(
  template: string,
  strType: PyType,
  mapping: PyObject,
): string {
  if (!(mapping instanceof PyObject)) {
    throw new PyTypeError(
      "format_map() argument must be a mapping, not " + typeof mapping,
    );
  }
  const autoIndex = { value: 0 };
  const manualSeen = { value: false };
  return buildFormattedString(template, strType, (field) =>
    resolveMapping(mapping, field, strType, autoIndex, manualSeen),
  );
}
