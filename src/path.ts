import { exists } from "@std/fs/exists";
import { join } from "@std/path/join";
import { dirname } from "@std/path/dirname";
import { fromFileUrl } from "@std/path/from_file_url";

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
 * import { slash } from "https://deno.land/x/easy_std@version/src/path.ts";
 *
 * slash("D:\\foo\\bar") // D:/foo/bar
 * ```
 */
export function slash(path: string): string {
  return path.replaceAll(WINDOWS_SEP, "/");
}

/**
 * find all paths up
 * @param root
 * @returns
 * @example
 * ```ts
 * import { createUpBases } from "https://deno.land/x/easy_std@version/src/path.ts";
 *
 * createUpBases("D:/foo/bar") // ["D:", "D:/foo", "D:/foo/bar"]
 * ```
 */
export function createUpBases(root: string = Deno.cwd()): string[] {
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
 * import { findUp } from "https://deno.land/x/easy_std@version/src/path.ts";
 *
 * findUp("bar") // Returns the possible paths from the root directory upwards
 * ```
 */
export async function findUp(
  name: string,
  root: string = Deno.cwd(),
): Promise<string> {
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
 * @example
 * ```ts
 * import { _dirname } from "https://deno.land/x/easy_std@version/src/path.ts";
 *
 * _dirname(import.meta.url)
 * ```
 */
export function _dirname(url: string): string {
  return slash(dirname(fromFileUrl(url)));
}

/**
 * __filename
 * @param url import.meta.url
 * @returns
 * @example
 * ```ts
 * import { _filename } from "https://deno.land/x/easy_std@version/src/path.ts";
 *
 * _filename(import.meta.url)
 * ```
 */
export function _filename(url: string): string {
  return slash(fromFileUrl(url));
}
