/**
 * accumulate all numbers
 * @param ns
 * @returns
 * @example
 * ```ts
 * import { sum } from "https://deno.land/x/easy_std@version/collections.ts"
 *
 * const total = sum([1, 2, 3]) // 6
 * ```
 */
export function sum(ns: number[]) {
  return ns.reduce((l, r) => l + r, 0);
}
