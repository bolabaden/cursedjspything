#!/usr/bin/env python3
"""Emit JSON expectations for pyrt golden harness (CPython reference)."""
from __future__ import annotations

import json
import sys
from typing import TypeVar

T = TypeVar("T")


class A:
    pass


class B(A):
    pass


class C(A):
    pass


class D(B, C):
    pass


class Point:
    __match_args__ = ("x", "y")

    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y


class Annotated:
    def __annotate__(format):
        return {"x": "int"}


# golden:rich_lt_reflected — keep Rev/__gt__ in sync with scripts/golden/run.ts
class Rev:
    """Reflected rich compare: int.__lt__ returns NotImplemented, __gt__ wins."""

    def __gt__(self, other: object) -> bool:
        return True


# golden:rich_lt_both_not_impl — keep Incomparable in sync with scripts/golden/run.ts
class Incomparable:
    """Both forward and reflected ordering ops return NotImplemented."""

    def __lt__(self, other: object):
        return NotImplemented

    def __gt__(self, other: object):
        return NotImplemented


# golden:descriptor_data_wins — data descriptor beats instance __dict__
class DataDesc:
    def __get__(self, obj, owner):
        return "descriptor-value"

    def __set__(self, obj, value):
        pass


class DescOwner:
    attr = DataDesc()


# golden:descriptor_nodata_loses — non-data descriptor loses to instance __dict__
class NonDataDesc:
    def __get__(self, obj, owner):
        return "desc-value"


class NonDataOwner:
    attr = NonDataDesc()


def version_gte(vi: tuple[int, ...], major: int, minor: int) -> bool:
    return vi >= (major, minor)


def owner_with_instance_attr(owner_cls: type[T], attr: str, value: str) -> T:
    owner = owner_cls()
    owner.__dict__[attr] = value
    return owner


def main() -> None:
    vi = sys.version_info
    cases: dict[str, object] = {
        "python": f"{vi.major}.{vi.minor}",
        "mro_D": [c.__name__ for c in D.__mro__],
        "isinstance_D": isinstance(D(), A),
        "issubclass_DC": issubclass(D, C),
        "rich_eq_int": (1 == 1),
        "rich_lt_reflected": 1 < Rev(),
        "slice_list": [0, 1, 2][1:3],
        "contains_str": "c" in "abc",
        "contains_list": 1 in [0, 1, 2],
        "int_float_eq": 1 == 1.0,
        "int_float_add": 1 + 1.0,
        "bool_int_eq": 1 == True,
        "bool_int_add": 1 + True,
        "bool_float_eq": True == 1.0,
        "bool_float_add": True + 1.0,
        # golden:seq_bool_mul / seq_bool_rmul — keep in sync with scripts/golden/pyrt-cases.ts
        "seq_bool_mul": len([1] * True),
        "seq_bool_rmul": len(True * [1]),
        # golden:str_bool_mul / str_bool_rmul — keep in sync with scripts/golden/pyrt-cases.ts
        "str_bool_mul": "ab" * True,
        "str_bool_rmul": True * "ab",
    }

    desc_owner = owner_with_instance_attr(DescOwner, "attr", "instance-value")
    cases["descriptor_data_wins"] = desc_owner.attr

    nodata_owner = owner_with_instance_attr(NonDataOwner, "attr", "instance-value")
    cases["descriptor_nodata_loses"] = nodata_owner.attr

    # golden:init_subclass_called — base __init_subclass__ runs on subclass creation
    init_subclass_log: list[str] = []

    class InitSubclassBase:
        @classmethod
        def __init_subclass__(cls, **kwargs):
            init_subclass_log.append(cls.__name__)

    class InitSubclassChild(InitSubclassBase):
        pass

    cases["init_subclass_called"] = "InitSubclassChild" in init_subclass_log

    # golden:set_name_called — descriptor __set_name__ runs at class creation
    set_name_log: list[tuple[str, str]] = []

    class SetNameDesc:
        def __get__(self, obj, owner):
            return "val"

        def __set__(self, obj, value):
            pass

        def __set_name__(self, owner, name):
            set_name_log.append((owner.__name__, name))

    class SetNameOwner:
        my_desc = SetNameDesc()

    cases["set_name_called"] = set_name_log == [("SetNameOwner", "my_desc")]

    inc_a, inc_b = Incomparable(), Incomparable()
    try:
        inc_a < inc_b
        cases["rich_lt_both_not_impl_raises"] = False
    except TypeError:
        cases["rich_lt_both_not_impl_raises"] = True

    if version_gte(vi, 3, 10):
        cases["match_args"] = list(getattr(Point, "__match_args__", ()))
    else:
        cases["match_args"] = []

    if version_gte(vi, 3, 12):
        mv = memoryview(b"abcd")
        cases["buffer_readonly"] = mv.readonly
        cases["buffer_len"] = len(mv)
    else:
        cases["buffer_readonly"] = None
        cases["buffer_len"] = None

    if version_gte(vi, 3, 14):
        cases["annotate_x"] = Annotated.__annotate__(1).get("x")
    else:
        cases["annotate_x"] = None

    json.dump(cases, sys.stdout)


if __name__ == "__main__":
    main()
