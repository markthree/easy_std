import type { AnyFunction } from "./type.ts";
import { which } from "./deps.ts";
import {
  EVENTS,
  SIGNALS,
  useEventListener,
  useSignalListener,
} from "./listener.ts";
import { invoke } from "./fn.ts";

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

export function denoFmt(files: string[]) {
  const args = ["deno", "fmt"];
  if (files?.length > 0) {
    args.push(...files);
  }
  return execa(args);
}
