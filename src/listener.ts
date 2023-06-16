// TODO note
export function useEventListener(...args: Parameters<typeof addEventListener>) {
  const [type, listener, options] = args;
  globalThis.addEventListener(type, listener, options);

  return function stop() {
    globalThis.removeEventListener(type, listener, options);
  };
}

export function useSignalListener(signal: Deno.Signal, handler: () => void) {
  Deno.addSignalListener(signal, handler);
  return function stop() {
    Deno.addSignalListener(signal, handler);
  };
}

export const SIGNALS = [{
  code: 21,
  type: "SIGBREAK",
}, {
  code: 130,
  type: "SIGINT",
}] as const;

export const EVENTS = ["error", "unhandledrejection", "unload"];
