import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDetails = useAppSelector((state) => state.auth.userDetails);

  const handleLogout = () => {
    apiClient.post(API_ROUTES.AUTH.LOGOUT).catch(() => {});
    dispatch(signOut());
    dispatch(clearUser());
    router.push("/signin");
  };

  const initial = userDetails?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-sand">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-espresso hover:bg-sand-light transition-colors duration-fast"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <span className="font-display text-lg text-espresso hidden sm:block">
          Perfect Meraki <span className="text-green">Admin</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="text-sm text-espresso hidden sm:block">
            {userDetails?.name || "Admin"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-espresso border border-sand hover:bg-sand-light transition-colors duration-fast"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
