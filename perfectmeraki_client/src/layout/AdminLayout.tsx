"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import RequireAdmin from "@/components/common/RequireAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="min-h-screen flex bg-sand-light">
        <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <AdminTopbar onMenuClick={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireAdmin>
  );
};

export default AdminLayout;
