# easy_std

Generic Deno standard library, focused on ease of use

<br />

## scripts

### release

1. export your current version number to `version.ts`

```ts
// version.ts or src/version.ts
export const version = "0.0.0";
```

2. update your deno.json

```json5
// deno.json or deno.jsonc
{
  "tasks": {
    "start": "deno run mod.ts",
    "release": "deno run --allow-read --allow-write --allow-env --allow-run https://deno.land/x/easy_std/scripts/release.ts"
  }
}
```

3. executing the deno task will automatically update the version

```shell
deno task release
```

<br />

## function

The functions provided by this package are safe, efficient, and support multiple
platforms at the same time。

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
