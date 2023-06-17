// deno run --allow-read --allow-write --allow-env --allow-run https://deno.land/x/easy_std/scripts/release.ts
import { findFile } from "../src/fs.ts";
import { execa } from "../src/process.ts";
import { exists } from "https://deno.land/std@0.192.0/fs/exists.ts";
import { isSemVer } from "https://deno.land/std@0.192.0/semver/is_semver.ts";
import { tryParse } from "https://deno.land/std@0.192.0/semver/try_parse.ts";

const defaultVersionFile = ["version.ts", "src/version.ts"];

const versionFile = await findFile(defaultVersionFile).catch(async () => {
  const argVersionFile = Deno.args[0];
  if (argVersionFile && await exists(argVersionFile)) {
    return argVersionFile;
  }
  const inputedVersionFile = prompt(
    `🎉 input your version file (for example "./version.ts")`,
  );

  if (inputedVersionFile && await exists(inputedVersionFile)) {
    return inputedVersionFile;
  }

  throw new Deno.errors.NotFound(
    inputedVersionFile
      ? `${inputedVersionFile} -> versionFile`
      : "please input your version file",
  );
});

const versionReg = /(?<=version.*").*(?=")/;

const versionText = await Deno.readTextFile(versionFile);

const [version] = versionText.match(versionReg) ?? "0.0.0";

const [major, minor, patch] = version.split(".");

const newVersion = prompt(
  "🎉 input new version",
  `${major}.${minor}.${Number(patch) + 1}`,
);

if (!newVersion || !isSemVer(tryParse(newVersion))) {
  throw new Deno.errors.InvalidData(
    "😥 Please enter the standard SemVer version number",
  );
}

await Deno.writeTextFile(
  versionFile,
  versionText.replace(versionReg, newVersion),
);

await execa(["git", "add", "."]);

await execa(["git", "commit", "-m", `chore: update version to v${newVersion}`]);

await execa(["git", "tag", `v${newVersion}`]);

await execa(["git", "push"]);

await execa(["git", "push", "--tags"]);
