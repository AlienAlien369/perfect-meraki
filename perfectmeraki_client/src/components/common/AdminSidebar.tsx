"use client";
import React from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiCalendar,
  FiBookOpen,
} from "react-icons/fi";

const sidebarItems = [
  { label: "Dashboard", icon: FiHome, route: "/admin/admin-dashboard" },
  { label: "Users", icon: FiUsers, route: "/admin/users" },
  { label: "Products", icon: FiBox, route: "/admin/products" },
  { label: "Workshops", icon: FiCalendar, route: "/admin/workshops" },
  { label: "Catalogue", icon: FiBookOpen, route: "/admin/update-catalogue" },
];

interface AdminSidebarProps {
  open: boolean;
  onNavigate: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onNavigate }) => {
  const router = useRouter();

  const handleItemClick = (route: string) => {
    router.push(route);
    onNavigate();
  };

  const content = (
    <div className="flex flex-col h-full bg-espresso text-white w-64">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="font-display text-lg text-green">Admin Panel</span>
      </div>
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = router.pathname.startsWith(item.route);
            return (
              <li key={item.route}>
                <button
                  onClick={() => handleItemClick(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-fast ${
                    isActive
                      ? "bg-green text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/40">
        Perfect Meraki &copy; {new Date().getFullYear()}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">{content}</aside>

      {/* Mobile: overlay drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onNavigate}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
