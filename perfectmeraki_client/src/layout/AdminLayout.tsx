"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Navbar at the top with highest z-index */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Navbar />
      </header>

      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          background: "#f8fafc",
        }}
      >
        {/* Sidebar - hidden on mobile when closed */}
        <div
          style={{
            minHeight: "calc(100vh - 64px)",
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            zIndex: 900,
            position: isMobile ? "fixed" : "sticky",
            top: "64px",
            left: 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
          }}
        >
          <AdminSidebar />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: "64px",
              left: "280px",
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 899,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* Main content area */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? "24px 16px" : "32px 40px",
            minHeight: "calc(100vh - 128px)",
            transition: "margin-left 0.3s ease",
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
