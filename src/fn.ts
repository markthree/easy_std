import { AnyFunction } from "./type.ts";

/**
 * Calling function parameters directly
 * @param fn
 * @returns
 * @example
 * ```ts
 * import { invoke } from "https://deno.land/x/easy_std@version/fn.ts"
 *
 * const fns = [() => 1, () => 2]
 *
 * fns.map(invoke) // [1, 2]
 * ```
 */
export function invoke<T>(fn: () => T): T {
  return fn();
}

// TODO Cache results after the first call
/**
 * Any function will only be called once
 * @param fn
 * @returns
 * @example
 * ```ts
 * import { createOnce } from "https://deno.land/x/easy_std@version/fn.ts"
 *
 * let foo = 0
 *
 * const countOnce = createOnce(() => foo += 1)
 *
 * countOnce()
 * countOnce()
 *
 * foo // 1
 * ```
 */
export function createOnce<T extends AnyFunction>(fn: T) {
  let resolved = false;
  return function once(this: ThisType<T>, ...rest: Parameters<T>) {
    if (!resolved) {
      return fn.call(this, rest);
    }
    resolved = true;
  };
}
