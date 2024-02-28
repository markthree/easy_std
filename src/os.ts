/**
 * cpus length
 * @example
 * ```ts
 * import { cpuLength } from "https://deno.land/x/easy_std@version/src/os.ts";
 *
 * cpuLength()
 * ```
 */
export function cpuLength(): number {
  return navigator.hardwareConcurrency;
}
