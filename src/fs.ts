import { exists } from "@std/fs/exists";

/**
 * Find possible files
 * will return a random file that exists
 * requires the `--allow-read` flag.
 * @param paths
 * @returns
 * @example
 * ```ts
 * import { findFile } from "https://deno.land/x/easy_std@version/src/fs.ts";
 *
 * await findFile(['file1.txt', 'file2.txt']) // Randomly return the one that exists, or report an error if all of them do not exist
 * ```
 */
export function findFile(paths: string[]): Promise<string> {
  return Promise.any(paths.map(async (p) => {
    if (await exists(p, { isFile: true })) {
      return p;
    }
    throw new Deno.errors.NotFound(`${p} -> findFile`);
  }));
}
