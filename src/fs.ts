import { exists } from "https://deno.land/std@0.192.0/fs/exists.ts";

// TODO note
export function findFile(paths: string[]) {
  return Promise.any(paths.map(async (p) => {
    if (await exists(p)) {
      return p;
    }
    throw new Deno.errors.NotFound(`${p} -> findFile`);
  }));
}
