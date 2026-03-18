import { useEffect, useRef, useCallback } from "react";

/**
 * Autosave hook: calls `saveFn` after `delay` ms of inactivity
 * whenever `deps` change. Skips the initial mount.
 */
export function useAutosave(saveFn: () => Promise<void> | void, deps: any[], delay = 2000) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(false);
  const saving = useRef(false);

  const stableSave = useCallback(saveFn, deps);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (saving.current) return;

    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      saving.current = true;
      try {
        await stableSave();
      } finally {
        saving.current = false;
      }
    }, delay);

    return () => clearTimeout(timer.current);
  }, [stableSave, delay]);
}
