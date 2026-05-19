#!/usr/bin/env python3
"""Emit JSON expectations for pyrt golden harness (CPython reference)."""
from __future__ import annotations

import json
import sys


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
    }

    if vi >= (3, 10):
        cases["match_args"] = list(getattr(Point, "__match_args__", ()))
    else:
        cases["match_args"] = []

    if vi >= (3, 12):
        mv = memoryview(b"abcd")
        cases["buffer_readonly"] = mv.readonly
        cases["buffer_len"] = len(mv)
    else:
        cases["buffer_readonly"] = None
        cases["buffer_len"] = None

    if vi >= (3, 14):
        cases["annotate_x"] = Annotated.__annotate__(1).get("x")
    else:
        cases["annotate_x"] = None

    json.dump(cases, sys.stdout)


if __name__ == "__main__":
    main()
