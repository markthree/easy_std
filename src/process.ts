import type { AnyFunction } from "./type.ts";
import { which } from "./deps.ts";
import {
  EVENTS,
  SIGNALS,
  useEventListener,
  useSignalListener,
} from "./listener.ts";
import { invoke } from "./fn.ts";

/**
 * Safe execution of sub-processes
 * Automatically kill child processes when the master process exits
 * requires the `--allow-run` and `--allow-env` flag.
 * @param cmd
 * @param options
 * @returns
 * @example
 * ```ts
 * import { execa } from "https://deno.land/x/easy_std@version/process.ts";
 *
 * await execa(['npm', 'install', 'koa']) // Safe invocation of child processes
 * ```
 */
export async function execa(cmd: string[], options: Deno.CommandOptions = {}) {
  const command = await which(cmd.shift()!);

  const commander = new Deno.Command(command!, {
    args: [...cmd],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
    ...options,
  });

  const process = commander.spawn();

  const stopShutdown = gracefulShutdown(() => {
    process.kill();
  });

  return process.status.finally(stopShutdown);
}

/**
 * The incoming function will be executed regardless of the reason for the process to exit
 * @param shutdown
 * @returns
 * @example
 * ```ts
 * import { gracefulShutdown } from "https://deno.land/x/easy_std@version/process.ts";
 *
 * gracefulShutdown(() => console.log("good bye")) // When the process exits, it prints
 * ```
 */
export function gracefulShutdown(
  shutdown: AnyFunction,
) {
  const stopEventListners = EVENTS.map((type) => {
    return useEventListener(type, onceShutdown);
  });

  const stopSignalListeners = SIGNALS.map((SIGNAL) => {
    return useSignalListener(
      SIGNAL.type,
      createOnceShutdownWithExit(SIGNAL.code),
    );
  });

  async function onceShutdown() {
    await shutdown();
    stop();
  }

  function createOnceShutdownWithExit(code?: number) {
    return async function () {
      await onceShutdown();
      Deno.exit(code);
    };
  }

  function stop() {
    stopEventListners.forEach(invoke);
    stopSignalListeners.forEach(invoke);
  }

  return stop;
}

/**
 * call the deno subprocess to format the file
 * requires the `--allow-run` and `--allow-env` flag.
 * @param files
 * @returns
 */
export function denoFmt(files: string[]) {
  const args = ["deno", "fmt"];
  if (files?.length > 0) {
    args.push(...files);
  }
  return execa(args);
}
