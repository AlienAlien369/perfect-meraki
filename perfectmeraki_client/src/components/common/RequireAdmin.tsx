import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import { useAuthHydrated } from "@/store/useAuthHydrated";

interface RequireAdminProps {
  children: React.ReactNode;
}

/**
 * Client-side gate for /admin/*: never renders admin content until we know, post-hydration,
 * that the visitor is an authenticated admin. The server-side `protect`/`authorize` middleware
 * is the real security boundary (see routes/admin.js, routes/user.js) — this only stops the
 * admin shell from flashing on screen for a beat before an unauthorized redirect.
 */
const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const { isAuthenticated, userDetails } = useAppSelector((state) => state.auth);
  const isAdmin = isAuthenticated && userDetails?.role === "admin";

  useEffect(() => {
    if (!hydrated) return;
    if (!isAdmin) {
      router.replace(
        isAuthenticated ? "/signin?unauthorized=1" : "/signin?redirect=admin"
      );
    }
  }, [hydrated, isAdmin, isAuthenticated, router]);

  if (!hydrated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#e0d6c5] border-t-[#63ccbb] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
