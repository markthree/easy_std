/**
 * cpus length
 * @example
 * ```ts
 * import { cpuLength } from "https://deno.land/x/easy_std@version/src/os.ts";
 *
 * cpuLength()
 * ```
 */
export function cpuLength() {
  return navigator.hardwareConcurrency;
}
