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
import { format, repr, str } from "../dispatch/operators/numeric.js";
import { getItem } from "../dispatch/protocols.js";
import { dictGet } from "../collections/dict-keys.js";
import { nativeVal, setNative } from "./native.js";
import { dictType } from "./dict.js";
import { pyInt } from "./int.js";

type ConversionFlag = "" | "s" | "r";

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
    if (flag === "s" || flag === "r") {
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
    while (i < template.length && template[i] !== "}") i += 1;
    formatSpec = template.slice(specStart, i);
  }

  if (i >= template.length || template[i] !== "}") {
    throw new PyValueError("expected '}' before end of string");
  }

  return { field: { name, conversion, formatSpec }, end: i };
}

function isIdentifierField(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

function isPositionalField(name: string): boolean {
  return name === "" || /^\d+$/.test(name);
}

function renderFieldValue(
  obj: PyObject,
  conversion: ConversionFlag,
  formatSpec: string,
): string {
  if (conversion === "r") return repr(obj);
  if (conversion === "s") return str(obj);
  if (formatSpec === "" && conversion === "") return str(obj);
  return format(obj, formatSpec);
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
  autoIndex: { value: number },
  manualSeen: { value: boolean },
): PyObject {
  if (!isPositionalField(field.name)) {
    throw new PyKeyError(field.name);
  }
  let index: number;
  if (field.name === "") {
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
    index = Number(field.name);
  }
  const value = args[index];
  if (value === undefined) {
    throw new PyIndexError("Replacement index " + index + " out of range for positional args tuple");
  }
  return value;
}

function resolveMapping(
  mapping: PyObject,
  field: FormatField,
  strType: PyType,
  autoIndex: { value: number },
  manualSeen: { value: boolean },
): PyObject {
  if (field.name === "") {
    if (manualSeen.value) {
      throw new PyValueError(
        "cannot switch from manual field specification to automatic field numbering",
      );
    }
    throw new PyValueError(
      "cannot switch from manual field specification to automatic field numbering",
    );
  }
  if (/^\d+$/.test(field.name)) {
    if (autoIndex.value > 0) {
      throw new PyValueError(
        "cannot switch from automatic field numbering to manual field specification",
      );
    }
    manualSeen.value = true;
    return lookupMappingValue(mapping, field.name, strType);
  }
  if (isIdentifierField(field.name)) {
    return lookupMappingValue(mapping, field.name, strType);
  }
  throw new PyValueError(`Invalid field name: ${JSON.stringify(field.name)}`);
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
    out += renderFieldValue(value, field.conversion, field.formatSpec);
  }
  return out;
}

export function formatStr(
  template: string,
  strType: PyType,
  args: readonly PyObject[],
): string {
  const autoIndex = { value: 0 };
  const manualSeen = { value: false };
  return buildFormattedString(template, strType, (field) =>
    resolvePositional(args, field, autoIndex, manualSeen),
  );
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
