import { exists } from "https://deno.land/std@0.209.0/fs/exists.ts";
import { join } from "https://deno.land/std@0.209.0/path/posix/mod.ts";
import { dirname } from "https://deno.land/std@0.209.0/path/posix/dirname.ts";
import { fromFileUrl } from "https://deno.land/std@0.209.0/path/posix/from_file_url.ts";

/**
 * windows path separator
 */
export const WINDOWS_SEP = "\\";

/**
 * normalizing windows path to Support all platforms
 * @param path
 * @returns
 * @example
 * ```ts
 * import { slash } from "https://deno.land/x/easy_std@version/path.ts";
 *
 * slash("D:\\foo\\bar") // D:/foo/bar
 * ```
 */
export function slash(path: string) {
  return path.replaceAll(WINDOWS_SEP, "/");
}

/**
 * find all paths up
 * @param root
 * @returns
 * @example
 * ```ts
 * import { createUpBases } from "https://deno.land/x/easy_std@version/path.ts";
 *
 * createUpBases("D:/foo/bar") // ["D:", "D:/foo", "D:/foo/bar"]
 * ```
 */
export function createUpBases(root: string = Deno.cwd()) {
  const base = slash(root);
  return base.split("/").reduceRight((bases: string[], b) => {
    const lastBase = bases.at(-1);
    if (b === lastBase) {
      return bases;
    }
    bases.push(lastBase!.replace(`/${b}`, ""));
    return bases;
  }, [base]);
}

/**
 * find back from the root path
 * requires the `--allow-read` flag.
 * @param name
 * @returns
 * @example
 * ```ts
 * import { findUp } from "https://deno.land/x/easy_std@version/path.ts";
 *
 * findUp("bar") // Returns the possible paths from the root directory upwards
 * ```
 */
export async function findUp(name: string, root = Deno.cwd()) {
  const bases = createUpBases(root);
  for (const base of bases) {
    const path = join(base, name);
    if (await exists(path)) {
      return path;
    }
  }
  throw new Deno.errors.NotFound(`${name} -> findUp`);
}

/**
 * __dirname
 * @param url import.meta.url
 * @returns
 */
export function _dirname(url: string) {
  return dirname(fromFileUrl(url));
}

/**
 * __filename
 * @param url import.meta.url
 * @returns
 */
export function _filename(url: string) {
  return fromFileUrl(url);
}
