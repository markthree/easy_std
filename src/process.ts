import type { AnyFunction } from "./type.ts";
import { which } from "./deps.ts";

export async function execa(cmd: string[], options: Deno.CommandOptions = {}) {
  const command = await which(cmd.shift()!);

  const commander = new Deno.Command(command!, {
    args: [...cmd],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
    ...options,
  });

  let resolved = false;
  const process = commander.spawn();
  const ensureCleanEvents = gracefulShutdown(() => {
    if (!resolved) {
      process.kill();
      resolved = true;
    }
  });
  return process.status.finally(() => {
    resolved = true;
    ensureCleanEvents();
  });
}

export function gracefulShutdown(
  shutdown: AnyFunction,
  options: AddEventListenerOptions = {
    once: true,
  },
) {
  async function exitWithShoutdown() {
    await shutdown();
    if (options.once) {
      Deno.addSignalListener("SIGINT", exitWithShoutdown);
    }
    Deno.exit(130);
  }

  // Synchronization error
  globalThis.addEventListener("error", shutdown, options);
  // Main process exit
  globalThis.addEventListener("unload", shutdown, options);
  // Asynchronous error
  globalThis.addEventListener("unhandledrejection", shutdown, options);

  Deno.addSignalListener("SIGINT", exitWithShoutdown);

  return function ensureCleanEvents() {
    globalThis.removeEventListener("error", shutdown);
    globalThis.removeEventListener("unload", shutdown);
    globalThis.removeEventListener("unhandledrejection", shutdown);
    Deno.removeSignalListener("SIGINT", exitWithShoutdown);
  };
}
