import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuthHydrated } from "@/store/useAuthHydrated";
import { signOut } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import { isTokenExpired } from "@/lib/jwt";

/**
 * Runs once rehydration completes: if the persisted token has already expired,
 * sign the user out immediately instead of showing an "authenticated" UI backed
 * by a dead token that will only fail on the next request. Renders nothing.
 */
export default function AuthBootstrap() {
  const hydrated = useAuthHydrated();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    if (isTokenExpired(token)) {
      dispatch(signOut());
      dispatch(clearUser());
    }
  }, [hydrated, isAuthenticated, token, dispatch]);

  return null;
}
