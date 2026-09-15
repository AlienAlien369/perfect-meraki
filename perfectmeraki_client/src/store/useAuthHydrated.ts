import { useEffect, useState } from "react";
import { persistor } from "@/store/store";

/**
 * redux-persist rehydrates `auth` from localStorage asynchronously, after first
 * paint. Anything that renders differently for signed-in vs signed-out users must
 * wait for this to flip to `true` before trusting `state.auth`, or it will flash
 * the signed-out UI for a frame on every hard refresh / direct URL load.
 */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(
    () => persistor.getState().bootstrapped
  );

  useEffect(() => {
    if (hydrated) return;
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setHydrated(true);
      }
    });
    return unsubscribe;
  }, [hydrated]);

  return hydrated;
}
