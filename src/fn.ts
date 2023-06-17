import { AnyFunction } from "./type.ts";

export function invoke<T>(fn: () => T): T {
  return fn();
}

export function createOnce<T extends AnyFunction>(fn: T) {
  let resolved = false;
  return function once(this: ThisType<T>, ...rest: Parameters<T>) {
    if (!resolved) {
      return fn.call(this, rest);
    }
    resolved = true;
  };
}
