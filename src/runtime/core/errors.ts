/** Runtime exception types mirroring common Python built-in exceptions. */

export class PyAttributeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AttributeError";
  }
}

export class PyTypeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "TypeError";
  }
}

export class PyKeyError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "KeyError";
  }
}

export class PyIndexError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "IndexError";
  }
}

export class PyZeroDivisionError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ZeroDivisionError";
  }
}

export class PyStopIteration extends Error {
  readonly value: unknown;
  constructor(value?: unknown) {
    super("StopIteration");
    this.name = "StopIteration";
    this.value = value;
  }
}

export class PyValueError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ValueError";
  }
}
