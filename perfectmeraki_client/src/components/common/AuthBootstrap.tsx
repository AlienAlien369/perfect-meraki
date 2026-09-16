import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuthHydrated } from "@/store/useAuthHydrated";
import { signOut } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import { isTokenExpired } from "@/lib/jwt";
import { refreshAccessToken } from "@/api/apiClient";

/**
 * Runs once rehydration completes. The access token is short-lived (15m) by
 * design, so on most page loads it will look expired here - that's expected,
 * not an error: try the httpOnly refresh cookie first, and only sign the user
 * out if that also fails (refresh cookie itself expired/invalid/revoked).
 */
export default function AuthBootstrap() {
  const hydrated = useAuthHydrated();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    if (!isTokenExpired(token)) return;

    let cancelled = false;
    refreshAccessToken().catch(() => {
      if (cancelled) return;
      dispatch(signOut());
      dispatch(clearUser());
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, token, dispatch]);

  return null;
}
