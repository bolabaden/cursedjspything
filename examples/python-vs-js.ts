/**
 * Exhaustive Python-vs-TypeScript examples.
 *
 * Each section shows a Python snippet in comments, then the equivalent
 * pyrt TypeScript code.  Run with:  npx tsx examples/python-vs-js.ts
 */

import {
  // core
  PyObject, PyType, objectType, typeType,
  Slot, Hook,
  // class system
  makeClass, instantiate, pyClass, setPyClass,
  isinstance, issubclass, classGetitem,
  // attribute access
  getAttr, setAttr, delAttr,
  // operators
  is, isNot, eq, ne, lt, le, gt, ge,
  add, sub, mul, truediv, floordiv, mod, pow, divmod,
  matmul, lshift, rshift, bitwiseAnd, bitwiseOr, bitwiseXor,
  iadd, isub, imul,
  neg, pos, abs, invert,
  hash, bool, toInt, toFloat, index,
  repr, str, format, bytes,
  round, trunc, floor, ceil,
  // protocols
  call, len, lengthHint, getItem, setItem, delItem, contains,
  iter, next, reversed,
  enter, exit,
  dir,
  // builtins
  pyInt, pyFloat, pyStr, pyBool, pyList, pyTuple, pyDict, pySet,
  pyNone, pyTrue, pyFalse,
  pySlice,
  NotImplemented, unwrap,
  // errors
  PyStopIteration,
} from "../src/index.js";

function section(title: string) { console.log(`\n=== ${title} ===`); }
function show(label: string, value: unknown) { console.log(`  ${label}: ${value}`); }

// ─────────────────────────────────────────────────────────────────────
section("1. Object Identity (Python: is / is not)");
// Python:
//   a = object()
//   b = object()
//   a is a   # True
//   a is b   # False
const a = new PyObject(objectType);
const b = new PyObject(objectType);
show("is(a, a)", is(a, a));    // true
show("is(a, b)", is(a, b));    // false
show("isNot(a, b)", isNot(a, b));  // true

// ─────────────────────────────────────────────────────────────────────
section("2. Rich Comparison (__eq__, __lt__, etc.)");
// Python:
//   1 == 1   → True
//   1 < 2    → True
//   "a" >= "b" → False
show("eq(1, 1)", eq(pyInt(1), pyInt(1)));
show("lt(1, 2)", lt(pyInt(1), pyInt(2)));
show("ge('a','b')", ge(pyStr("a"), pyStr("b")));
show("ne(1, 2)", ne(pyInt(1), pyInt(2)));

// ─────────────────────────────────────────────────────────────────────
section("3. Arithmetic (__add__, __sub__, __mul__, __truediv__, etc.)");
// Python:
//   3 + 4    → 7
//   10 - 3   → 7
//   2 ** 10  → 1024
//   7 / 2    → 3.5
//   7 // 2   → 3
//   -7 % 3   → 2   (Python-style modulo)
show("add(3,4)", unwrap(add(pyInt(3), pyInt(4)) as PyObject));
show("sub(10,3)", unwrap(sub(pyInt(10), pyInt(3)) as PyObject));
show("pow(2,10)", unwrap(pow(pyInt(2), pyInt(10)) as PyObject));
show("truediv(7,2)", unwrap(truediv(pyInt(7), pyInt(2)) as PyObject));
show("floordiv(7,2)", unwrap(floordiv(pyInt(7), pyInt(2)) as PyObject));
show("mod(-7,3)", unwrap(mod(pyInt(-7), pyInt(3)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("4. Bitwise ops (__lshift__, __and__, __or__, __xor__, __invert__)");
// Python:
//   1 << 3  → 8
//   ~0      → -1
//   0b1100 & 0b1010 → 0b1000
show("lshift(1,3)", unwrap(lshift(pyInt(1), pyInt(3)) as PyObject));
show("invert(0)", unwrap(invert(pyInt(0)) as PyObject));
show("and(12,10)", unwrap(bitwiseAnd(pyInt(0b1100), pyInt(0b1010)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("5. Unary ops (__neg__, __pos__, __abs__)");
// Python:
//   -5      → -5
//   abs(-7) → 7
show("neg(5)", unwrap(neg(pyInt(5)) as PyObject));
show("abs(-7)", unwrap(abs(pyInt(-7)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("6. In-place ops (__iadd__, __isub__, etc.)");
// Python:
//   x = [1]
//   x += [2]   # x is now [1, 2], same object
const lst = pyList([pyInt(1)]);
const result = iadd(lst, pyList([pyInt(2)])) as PyObject;
show("iadd list (same obj?)", is(result, lst));
show("len after iadd", len(lst));

// ─────────────────────────────────────────────────────────────────────
section("7. Hashing (__hash__)");
// Python:
//   hash(42)     → 42
//   hash("hi")   → consistent int
show("hash(42)", hash(pyInt(42)));
show("hash('hi')", hash(pyStr("hi")));

// ─────────────────────────────────────────────────────────────────────
section("8. Truthiness (__bool__, __len__ fallback)");
// Python:
//   bool(0)     → False
//   bool(1)     → True
//   bool([])    → False
//   bool(None)  → False
show("bool(0)", bool(pyInt(0)));
show("bool(1)", bool(pyInt(1)));
show("bool([])", bool(pyList([])));
show("bool(None)", bool(pyNone));

// ─────────────────────────────────────────────────────────────────────
section("9. Conversions (__int__, __float__, __index__)");
// Python:
//   int(3.7)  → 3
//   float(5)  → 5.0
//   operator.index(True) → 1
show("toInt(3.7)", toInt(pyFloat(3.7)));
show("toFloat(5)", toFloat(pyInt(5)));
show("index(True)", index(pyBool(true)));

// ─────────────────────────────────────────────────────────────────────
section("10. Rounding (__round__, __trunc__, __floor__, __ceil__)");
show("round(3.7)", unwrap(round(pyFloat(3.7)) as PyObject));
show("trunc(3.7)", unwrap(trunc(pyFloat(3.7)) as PyObject));
show("floor(3.7)", unwrap(floor(pyFloat(3.7)) as PyObject));
show("ceil(3.2)", unwrap(ceil(pyFloat(3.2)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("11. Representation (__repr__, __str__, __format__)");
// Python:
//   repr(42)   → '42'
//   str(42)    → '42'
//   format(255, 'x') → 'ff'
show("repr(42)", repr(pyInt(42)));
show("str('hi')", str(pyStr("hi")));
show("format(255,'x')", format(pyInt(255), "x"));

// ─────────────────────────────────────────────────────────────────────
section("12. Class creation (__new__, __init__)");
// Python:
//   class Point:
//       def __init__(self, x, y):
//           self.x = x
//           self.y = y
//       def __repr__(self):
//           return f"Point({self.x}, {self.y})"
const Point = makeClass({
  name: "Point",
  dict: new Map<string | symbol, unknown>([
    [Slot.init, (self: PyObject, x: number, y: number) => {
      setAttr(self, "x", x);
      setAttr(self, "y", y);
    }],
    [Slot.repr, (self: PyObject) =>
      `Point(${getAttr(self, "x")}, ${getAttr(self, "y")})`
    ],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== Point) return NotImplemented;
      return getAttr(self, "x") === getAttr(other, "x") &&
             getAttr(self, "y") === getAttr(other, "y");
    }],
    [Slot.hash, (self: PyObject) => {
      return ((getAttr(self, "x") as number) * 1000003) ^ (getAttr(self, "y") as number);
    }],
  ]),
});
const p = instantiate(Point, 3, 4);
show("repr(Point(3,4))", repr(p));
show("eq(p, p)", eq(p, p));

// ─────────────────────────────────────────────────────────────────────
section("13. Inheritance and MRO");
// Python:
//   class A: pass
//   class B(A): pass
//   class C(A): pass
//   class D(B, C): pass
//   D.__mro__  → (D, B, C, A, object)
const A = makeClass({ name: "A", dict: new Map() });
const B = makeClass({ name: "B", bases: [A], dict: new Map() });
const C = makeClass({ name: "C", bases: [A], dict: new Map() });
const D = makeClass({ name: "D", bases: [B, C], dict: new Map() });
show("D.mro", D.mro.map((t) => t.name).join(" → "));

// ─────────────────────────────────────────────────────────────────────
section("14. Descriptor protocol (__get__, __set__, __delete__)");
// Python:
//   class Descriptor:
//       def __get__(self, obj, objtype=None):
//           return obj._val * 2
//       def __set__(self, obj, value):
//           obj._val = value
const descType = makeClass({
  name: "Doubler",
  dict: new Map<string | symbol, unknown>([
    [Slot.get, (_desc: PyObject, obj: PyObject | null, _owner: PyType) => {
      if (obj === null) return _desc;
      return (obj.dict.get("_val") as number ?? 0) * 2;
    }],
    [Slot.set, (_desc: PyObject, obj: PyObject, value: unknown) => {
      obj.dict.set("_val", value);
    }],
  ]),
});
const desc = new PyObject(descType);
const Owner = makeClass({
  name: "Owner",
  dict: new Map<string | symbol, unknown>([["doubled", desc]]),
});
const owner = new PyObject(Owner);
setAttr(owner, "doubled", 5);
show("descriptor get (5*2)", getAttr(owner, "doubled"));

// ─────────────────────────────────────────────────────────────────────
section("15. __getattr__ fallback");
// Python:
//   class Magic:
//       def __getattr__(self, name):
//           return f"magic:{name}"
const Magic = makeClass({
  name: "Magic",
  dict: new Map<string | symbol, unknown>([
    [Slot.getattr, (_self: PyObject, name: string) => `magic:${name}`],
  ]),
});
show("getAttr(magic, 'anything')", getAttr(new PyObject(Magic), "anything"));

// ─────────────────────────────────────────────────────────────────────
section("16. __class__ reassignment");
// Python:
//   class Cat: sound = "meow"
//   class Dog: sound = "woof"
//   c = Cat()
//   c.__class__ = Dog
//   c.sound  → "woof"
const Cat = makeClass({
  name: "Cat",
  dict: new Map<string | symbol, unknown>([["sound", "meow"]]),
});
const Dog = makeClass({
  name: "Dog",
  dict: new Map<string | symbol, unknown>([["sound", "woof"]]),
});
const animal = new PyObject(Cat);
show("before setPyClass", getAttr(animal, "sound"));
setPyClass(animal, Dog);
show("after setPyClass", getAttr(animal, "sound"));
show("pyClass(animal).name", pyClass(animal).name);

// ─────────────────────────────────────────────────────────────────────
section("17. Metaclass");
// Python:
//   class Meta(type):
//       def __new__(mcs, name, bases, ns):
//           ns['meta_attr'] = 'added_by_meta'
//           return super().__new__(mcs, name, bases, ns)
const Meta = makeClass({
  name: "Meta",
  bases: [typeType],
  dict: new Map(),
  metaclass: typeType,
});
const WithMeta = makeClass({
  name: "WithMeta",
  dict: new Map<string | symbol, unknown>([["meta_attr", "added_by_meta"]]),
  metaclass: Meta,
});
show("type(WithMeta).name", WithMeta.type.name);

// ─────────────────────────────────────────────────────────────────────
section("18. __init_subclass__");
// Python:
//   class Plugin:
//       registry = []
//       def __init_subclass__(cls, **kwargs):
//           Plugin.registry.append(cls)
const registry: string[] = [];
const Plugin = makeClass({
  name: "Plugin",
  dict: new Map<string | symbol, unknown>([
    [Hook.initSubclass, (cls: PyType) => { registry.push(cls.name); }],
  ]),
});
makeClass({ name: "PluginA", bases: [Plugin], dict: new Map() });
makeClass({ name: "PluginB", bases: [Plugin], dict: new Map() });
show("registry", registry);

// ─────────────────────────────────────────────────────────────────────
section("19. __class_getitem__ (generic aliases)");
// Python:
//   class MyList:
//       def __class_getitem__(cls, params):
//           return f"MyList[{params}]"
//   MyList[int]  → "MyList[<class 'int'>]"
const MyList = makeClass({
  name: "MyList",
  dict: new Map<string | symbol, unknown>([
    [Hook.classGetitem, (_cls: PyType, params: unknown) => `MyList[${params}]`],
  ]),
});
show("classGetitem(MyList, 'int')", classGetitem(MyList, "int"));

// ─────────────────────────────────────────────────────────────────────
section("20. isinstance / issubclass with __instancecheck__");
const ABCMeta = makeClass({
  name: "ABCMeta",
  bases: [typeType],
  dict: new Map<string | symbol, unknown>([
    [Hook.instancecheck, (_cls: PyType, obj: PyObject) => {
      return obj.dict.has("quack");
    }],
  ]),
  metaclass: typeType,
});
const DuckType = makeClass({
  name: "DuckType",
  dict: new Map(),
  metaclass: ABCMeta,
});
const duck = new PyObject(makeClass({ name: "X", dict: new Map() }));
duck.dict.set("quack", true);
show("isinstance(duck, DuckType)", isinstance(duck, DuckType));

// ─────────────────────────────────────────────────────────────────────
section("21. Callable objects (__call__)");
// Python:
//   class Adder:
//       def __init__(self, n): self.n = n
//       def __call__(self, x): return self.n + x
const Adder = makeClass({
  name: "Adder",
  dict: new Map<string | symbol, unknown>([
    [Slot.init, (self: PyObject, n: number) => { self.dict.set("n", n); }],
    [Slot.call, (self: PyObject, x: number) => (self.dict.get("n") as number) + x],
  ]),
});
const adder = instantiate(Adder, 10);
show("call(adder, 5)", call(adder, 5));

// ─────────────────────────────────────────────────────────────────────
section("22. Container protocols (__len__, __getitem__, __contains__)");
show("len([1,2,3])", len(pyList([pyInt(1), pyInt(2), pyInt(3)])));
show("getItem([10,20,30], 1)", unwrap(getItem(pyList([pyInt(10), pyInt(20), pyInt(30)]), 1) as PyObject));
show("contains('hello', 'ell')", contains(pyStr("hello"), pyStr("ell")));

// ─────────────────────────────────────────────────────────────────────
section("22b. Slice subscripts (__getitem__ with slice)");
// Python:
//   [0, 1, 2, 3][1:3]  → [1, 2]
{
  const nums = pyList([pyInt(0), pyInt(1), pyInt(2), pyInt(3)]);
  const part = getItem(nums, pySlice(1, 3, null)) as PyObject;
  show("getItem(list, slice(1,3))", unwrap(part));
}

// ─────────────────────────────────────────────────────────────────────
section("23. Iteration (__iter__, __next__)");
// Python:
//   for x in [1, 2, 3]: print(x)
{
  const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
  const it = iter(lst);
  const collected: number[] = [];
  try {
    while (true) collected.push(unwrap(next(it) as PyObject));
  } catch (e) {
    if (!(e instanceof PyStopIteration)) throw e;
  }
  show("iterated", collected);
}

// ─────────────────────────────────────────────────────────────────────
section("24. reversed()");
{
  const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
  const it = reversed(lst);
  const collected: number[] = [];
  try {
    while (true) collected.push(unwrap(next(it) as PyObject));
  } catch (e) {
    if (!(e instanceof PyStopIteration)) throw e;
  }
  show("reversed", collected);
}

// ─────────────────────────────────────────────────────────────────────
section("25. Context manager (__enter__, __exit__)");
// Python:
//   class CM:
//       def __enter__(self): print("enter"); return self
//       def __exit__(self, *a): print("exit"); return False
const CM = makeClass({
  name: "CM",
  dict: new Map<string | symbol, unknown>([
    [Hook.enter, (self: PyObject) => { console.log("  >> enter"); return self; }],
    [Hook.exit, () => { console.log("  >> exit"); return false; }],
  ]),
});
const cm = new PyObject(CM);
enter(cm);
exit(cm, null, null, null);

// ─────────────────────────────────────────────────────────────────────
section("26. __set_name__");
// Python:
//   class MyDescriptor:
//       def __set_name__(self, owner, name):
//           self.attr_name = name
{
  let capturedName: string | symbol = "";
  const descType = makeClass({
    name: "NamedDesc",
    dict: new Map<string | symbol, unknown>([
      [Hook.setName, (self: PyObject, _owner: PyType, name: string | symbol) => {
        capturedName = name;
      }],
      [Slot.get, () => "val"],
      [Slot.set, () => {}],
    ]),
  });
  const d = new PyObject(descType);
  makeClass({
    name: "Host",
    dict: new Map<string | symbol, unknown>([["my_field", d]]),
  });
  show("setName captured", capturedName);
}

// ─────────────────────────────────────────────────────────────────────
section("27. Reflected operators (__radd__ etc.)");
// Python:
//   class Vec:
//       def __rmul__(self, n): return "scaled"
//   3 * Vec()   → "scaled"
const Vec = makeClass({
  name: "Vec",
  dict: new Map<string | symbol, unknown>([
    [Slot.rmul, () => pyStr("scaled")],
  ]),
});
show("mul(3, Vec())", unwrap(mul(pyInt(3), new PyObject(Vec)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("28. __matmul__");
// Python:
//   class Matrix:
//       def __matmul__(self, other): return "matmul result"
const Matrix = makeClass({
  name: "Matrix",
  dict: new Map<string | symbol, unknown>([
    [Slot.matmul, () => "matmul result"],
  ]),
});
show("matmul(m, m)", matmul(new PyObject(Matrix), new PyObject(Matrix)));

// ─────────────────────────────────────────────────────────────────────
section("29. __divmod__");
show("divmod(7, 3)", repr(divmod(pyInt(7), pyInt(3)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("30. __slots__ enforcement");
// Python:
//   class Tight:
//       __slots__ = ('x', 'y')
//   t = Tight()
//   t.x = 1   # ok
//   t.z = 1   # AttributeError
const Tight = makeClass({
  name: "Tight",
  dict: new Map(),
  slotNames: ["x", "y"],
});
const tight = new PyObject(Tight);
setAttr(tight, "x", 1);
show("tight.x", getAttr(tight, "x"));
try {
  setAttr(tight, "z", 1);
} catch (e) {
  show("tight.z raises", (e as Error).message);
}

// ─────────────────────────────────────────────────────────────────────
section("31. Builtin types: str operations");
show("pyStr('hello') + pyStr(' world')", unwrap(add(pyStr("hello"), pyStr(" world")) as PyObject));
show("pyStr('ab') * pyInt(3)", unwrap(mul(pyStr("ab"), pyInt(3)) as PyObject));
show("len(pyStr('hello'))", len(pyStr("hello")));
show("contains('hello', 'ell')", contains(pyStr("hello"), pyStr("ell")));

// ─────────────────────────────────────────────────────────────────────
section("32. Builtin types: dict");
{
  const k = pyStr("key");
  const d = pyDict([[k, pyInt(42)]]);
  show("getItem(dict, key)", unwrap(getItem(d, k) as PyObject));
  show("contains(dict, key)", contains(d, k));
  show("len(dict)", len(d));
}

// ─────────────────────────────────────────────────────────────────────
section("33. Builtin types: set operations");
{
  const s1 = pySet([1, 2, 3]);
  const s2 = pySet([2, 3, 4]);
  show("set & set", repr(bitwiseAnd(s1, s2) as PyObject));
  show("set | set", repr(bitwiseOr(s1, s2) as PyObject));
  show("set - set", repr(sub(s1, s2) as PyObject));
  show("set ^ set", repr(bitwiseXor(s1, s2) as PyObject));
}

// ─────────────────────────────────────────────────────────────────────
section("34. Builtin types: tuple");
show("repr((1,))", repr(pyTuple([pyInt(1)])));
show("repr((1,2))", repr(pyTuple([pyInt(1), pyInt(2)])));
show("hash(tuple)", hash(pyTuple([pyInt(1), pyInt(2)])));

// ─────────────────────────────────────────────────────────────────────
section("35. dir()");
{
  const Cls = makeClass({
    name: "Inspectable",
    dict: new Map<string | symbol, unknown>([
      ["method_a", () => {}],
      ["method_b", () => {}],
    ]),
  });
  const obj = new PyObject(Cls);
  obj.dict.set("inst_x", 1);
  show("dir()", dir(obj).filter(n => !n.startsWith("_")));
}

// ─────────────────────────────────────────────────────────────────────
section("36. NotImplemented sentinel and fallback chain");
// Demonstrates: int + custom → tries int.__add__ → NotImplemented
//               → tries custom.__radd__ → returns "custom"
const Custom = makeClass({
  name: "Custom",
  dict: new Map<string | symbol, unknown>([
    [Slot.radd, () => "custom-radd"],
  ]),
});
show("add(pyInt(1), Custom())", add(pyInt(1), new PyObject(Custom)));

// ─────────────────────────────────────────────────────────────────────
section("37. Float/int mixed arithmetic");
show("add(int(1), float(2.5))", unwrap(add(pyInt(1), pyFloat(2.5)) as PyObject));
show("truediv(float(7), int(2))", unwrap(truediv(pyFloat(7), pyInt(2)) as PyObject));

// ─────────────────────────────────────────────────────────────────────
section("38. Bool is a subtype of int");
show("neg(True)", unwrap(neg(pyBool(true)) as PyObject));
show("index(False)", index(pyBool(false)));
show("hash(True)", hash(pyTrue));

// ─────────────────────────────────────────────────────────────────────
section("39. None");
show("repr(None)", repr(pyNone));
show("bool(None)", bool(pyNone));
show("eq(None, None)", eq(pyNone, pyNone));

console.log("\n✓ All examples completed.");
