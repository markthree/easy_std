import { exists } from "https://deno.land/std@0.192.0/fs/exists.ts";
import { dirname, join } from "https://deno.land/std@0.192.0/path/posix.ts";

export const WINDOWS_SEP = "\\";

export function slash(path: string) {
  return path.replaceAll(WINDOWS_SEP, "/");
}

// TODO to cache
export function createFindUpBases(base: string = Deno.cwd()) {
  base = dirname(base);
  const paths = [base];
  let total = base.split("/").length - 1;
  while (total) {
    paths.push(base);
    total--;
  }
  return paths;
}

export async function findUp(name: string) {
  const bases = createFindUpBases();
  for (const base of bases) {
    const path = join(base, name);
    if (await exists(path)) {
      return path;
    }
  }
  throw new Deno.errors.NotFound(`${name} -> findUp`);
}
