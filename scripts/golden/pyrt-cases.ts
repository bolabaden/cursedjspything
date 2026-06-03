/**
 * Build pyrt golden case values for a given Python minor version profile.
 */
import { Hook, Slot } from "../../src/runtime/core/slots.js";
import { NotImplemented } from "../../src/runtime/core/object.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import {
  makeClass,
  instantiate,
  objectType,
  isinstance,
  issubclass,
  eq,
  lt,
  add,
  contains,
  mul,
  len,
  pyInt,
  pyFloat,
  pyTrue,
  pyStr,
  getMatchArgs,
  getAnnotations,
  pyList,
  pyTuple,
  getItem,
  pySlice,
  pyBytes,
  unwrap,
  wrapBuffer,
  getBuffer,
  getAttr,
  PyObject,
} from "../../src/index.js";

function parseVersion(version: string): [number, number] {
  const [a, b] = version.split(".").map(Number);
  return [a, b];
}

function versionGte(version: [number, number], minMajor: number, minMinor: number): boolean {
  const [major, minor] = version;
  return major > minMajor || (major === minMajor && minor >= minMinor);
}

function ownerWithInstanceAttr(
  ownerName: string,
  attrName: string,
  descriptor: PyObject,
  instanceValue: string,
): PyObject {
  const Owner = makeClass({
    name: ownerName,
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([[attrName, descriptor]]),
  });
  const owner = new PyObject(Owner);
  owner.dict.set(attrName, instanceValue);
  return owner;
}

export function buildPyrtCases(pythonVersion: string): Record<string, unknown> {
  const version = parseVersion(pythonVersion);

  const A = makeClass({ name: "A", bases: [objectType], dict: {} });
  const B = makeClass({ name: "B", bases: [A], dict: {} });
  const C = makeClass({ name: "C", bases: [A], dict: {} });
  const D = makeClass({ name: "D", bases: [B, C], dict: {} });

  const Point = makeClass({
    name: "Point",
    bases: [objectType],
    dict: new Map([[Hook.matchArgs, ["x", "y"]]]),
  });

  const Annotated = makeClass({
    name: "Annotated",
    bases: [objectType],
    dict: new Map([[Hook.annotate, () => ({ x: "int" })]]),
  });

  // golden:rich_lt_reflected — keep Rev/__gt__ in sync with scripts/golden/cases.py
  const Rev = makeClass({
    name: "Rev",
    bases: [objectType],
    dict: new Map([[Slot.gt, () => true]]),
  });

  // golden:rich_lt_both_not_impl — keep Incomparable in sync with scripts/golden/cases.py
  const Incomparable = makeClass({
    name: "Incomparable",
    bases: [objectType],
    dict: new Map([
      [Slot.lt, () => NotImplemented],
      [Slot.gt, () => NotImplemented],
    ]),
  });

  const dInst = instantiate(D);
  const revInst = instantiate(Rev);
  const incA = instantiate(Incomparable);
  const incB = instantiate(Incomparable);
  let rich_lt_both_not_impl_raises = false;
  try {
    lt(incA, incB);
  } catch (e) {
    if (e instanceof PyTypeError) rich_lt_both_not_impl_raises = true;
  }

  let str_int_add_raises = false;
  try {
    add(pyInt(1), pyStr("a"));
  } catch (e) {
    if (e instanceof PyTypeError) str_int_add_raises = true;
  }

  const list = pyList([pyInt(0), pyInt(1), pyInt(2)]);
  const oneItemList = pyList([pyInt(1)]);
  const oneItemTuple = pyTuple([pyInt(1)]);
  const sliced = getItem(list, pySlice(1, 3, null)) as PyObject;
  const slicedItems = unwrap<PyObject[]>(sliced);

  const DataDesc = makeClass({
    name: "DataDesc",
    dict: new Map<string | symbol, unknown>([
      [
        Slot.get,
        (desc: PyObject, obj: PyObject | null, _owner: typeof objectType) => {
          if (obj === null) return desc;
          return "descriptor-value";
        },
      ],
      [Slot.set, (_desc: PyObject, obj: PyObject, value: unknown) => {
        obj.dict.set("_stored", value);
      }],
    ]),
  });
  const descOwner = ownerWithInstanceAttr(
    "DescOwner",
    "attr",
    new PyObject(DataDesc),
    "instance-value",
  );

  const NonDataDesc = makeClass({
    name: "NonDataDesc",
    dict: new Map<string | symbol, unknown>([
      [Slot.get, () => "desc-value"],
    ]),
  });
  const nonDataOwner = ownerWithInstanceAttr(
    "NonDataOwner",
    "attr",
    new PyObject(NonDataDesc),
    "instance-value",
  );

  // golden:init_subclass_called — keep InitSubclassBase in sync with scripts/golden/cases.py
  const initSubclassLog: string[] = [];
  const InitSubclassBase = makeClass({
    name: "InitSubclassBase",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Hook.initSubclass, (cls: { name: string }) => { initSubclassLog.push(cls.name); }],
    ]),
  });
  makeClass({ name: "InitSubclassChild", bases: [InitSubclassBase], dict: new Map() });

  // golden:set_name_called — keep SetNameDesc in sync with scripts/golden/cases.py
  const setNameLog: [string, string | symbol][] = [];
  const SetNameDescType = makeClass({
    name: "SetNameDesc",
    dict: new Map<string | symbol, unknown>([
      [
        Hook.setName,
        (_self: PyObject, owner: { name: string }, name: string | symbol) => {
          setNameLog.push([owner.name, name]);
        },
      ],
      [Slot.get, () => "val"],
      [Slot.set, () => {}],
    ]),
  });
  const setNameDesc = new PyObject(SetNameDescType);
  makeClass({
    name: "SetNameOwner",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([["my_desc", setNameDesc]]),
  });

  const cases: Record<string, unknown> = {
    python: pythonVersion,
    mro_D: D.mro.map((t) => t.name),
    isinstance_D: isinstance(dInst, A),
    issubclass_DC: issubclass(D, C),
    rich_eq_int: eq(pyInt(1), pyInt(1)) === true,
    rich_lt_reflected: lt(pyInt(1), revInst) === true,
    rich_lt_both_not_impl_raises,
    slice_list: slicedItems.map((v) => unwrap<number>(v)),
    contains_str: contains(pyStr("abc"), pyStr("c")),
    contains_list: contains(list, pyInt(1)),
    int_float_eq: eq(pyInt(1), pyFloat(1.0)) === true,
    int_float_add: unwrap<number>(add(pyInt(1), pyFloat(1.0)) as PyObject),
    bool_int_eq: eq(pyInt(1), pyTrue) === true,
    bool_int_add: unwrap<number>(add(pyInt(1), pyTrue) as PyObject),
    bool_float_eq: eq(pyTrue, pyFloat(1.0)) === true,
    bool_float_add: unwrap<number>(add(pyTrue, pyFloat(1.0)) as PyObject),
    // golden:str_int_eq_false / str_bytes_eq_false / str_int_add_raises — keep in sync with cases.py
    str_int_eq_false: eq(pyStr("1"), pyInt(1)) === false,
    str_bytes_eq_false:
      eq(pyStr("ab"), pyBytes(new Uint8Array([97, 98]))) === false,
    str_int_add_raises,
    // golden:seq_bool_mul / seq_bool_rmul — keep in sync with scripts/golden/cases.py
    seq_bool_mul: len(mul(oneItemList, pyTrue) as PyObject),
    seq_bool_rmul: len(mul(pyTrue, oneItemList) as PyObject),
    // golden:str_bool_mul / str_bool_rmul — keep in sync with scripts/golden/cases.py
    str_bool_mul: unwrap<string>(mul(pyStr("ab"), pyTrue) as PyObject),
    str_bool_rmul: unwrap<string>(mul(pyTrue, pyStr("ab")) as PyObject),
    // golden:tuple_bool_mul / tuple_bool_rmul — keep in sync with scripts/golden/cases.py
    tuple_bool_mul: len(mul(oneItemTuple, pyTrue) as PyObject),
    tuple_bool_rmul: len(mul(pyTrue, oneItemTuple) as PyObject),
    descriptor_data_wins: getAttr(descOwner, "attr"),
    descriptor_nodata_loses: getAttr(nonDataOwner, "attr"),
    init_subclass_called: initSubclassLog.includes("InitSubclassChild"),
    set_name_called:
      setNameLog.length === 1 &&
      setNameLog[0]![0] === "SetNameOwner" &&
      setNameLog[0]![1] === "my_desc",
  };

  if (versionGte(version, 3, 10)) {
    cases.match_args = getMatchArgs(Point) ?? [];
  } else {
    cases.match_args = [];
  }

  if (versionGte(version, 3, 12)) {
    const data = new ArrayBuffer(4);
    const Exporter = makeClass({
      name: "Exporter",
      bases: [objectType],
      dict: new Map([
        [Slot.buffer, () => wrapBuffer(data, true)],
        [Slot.releaseBuffer, () => {}],
      ]),
    });
    const obj = new PyObject(Exporter);
    const view = getBuffer(obj, 0) as { readonly: boolean; byteLength: number };
    cases.buffer_readonly = view.readonly;
    cases.buffer_len = view.byteLength;
  } else {
    cases.buffer_readonly = null;
    cases.buffer_len = null;
  }

  if (versionGte(version, 3, 14)) {
    cases.annotate_x = getAnnotations(Annotated).get("x");
  } else {
    cases.annotate_x = null;
  }

  return cases;
}
