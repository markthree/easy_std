import { noop } from "./fn.ts";

/**
 *  Safe Promise.withResolvers
 * @description Allows running on runtimes that do not implement Promise.withResolvers
 * @example
 * ```ts
 * import { withResolvers } from "https://deno.land/x/easy_std@version/src/withResolvers.ts"
 *
 * const { resolve, reject, promise } = withResolvers()
 * ```
 */
export function withResolvers<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
} {
  if (Promise.withResolvers) {
    return Promise.withResolvers<T>();
  }
  let reject: (reason?: any) => void = noop;
  let resolve: (value: T | PromiseLike<T>) => void = noop;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    reject,
    resolve,
    promise,
  };
}
