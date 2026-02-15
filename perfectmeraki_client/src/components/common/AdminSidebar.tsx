"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const sidebarItems = [
  { label: "Dashboard", icon: "🏠", route: "/admin/admin-dashboard" },
  { label: "Users", icon: "👥", route: "/admin/users-list" },
  { label: "Update Catalogue", icon: "📚", route: "/admin/update-catalogue" },
  { label: "Add Products", icon: "➕", route: "/admin/add-product" },
  { label: "Add Workshops", icon: "➕", route: "/admin/add-workshop" },
  { label: "Products List", icon: "📋", route: "/admin/products-list" },
  { label: "Workshops List", icon: "📋", route: "/admin/workshops-list" },
];

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveItem(router.pathname);
  }, [router.pathname]);

  const handleItemClick = (route: string) => {
    router.push(route);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  const itemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 100,
            background: "rgba(46, 204, 64, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {isMobileOpen ? (
            <FiX size={24} color="white" />
          ) : (
            <FiMenu size={24} color="white" />
          )}
        </button>
      )}

      <AnimatePresence>
        {(!isMobile || isMobileOpen) && (
          <motion.aside
            initial={isMobile ? "closed" : "open"}
            animate={isMobileOpen ? "open" : isMobile ? "closed" : "open"}
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onMouseEnter={() => !isMobile && setIsHovering(true)}
            onMouseLeave={() => !isMobile && setIsHovering(false)}
            style={{
              width: isMobile ? "80vw" : isHovering ? "280px" : "100px",
              height: "100vh",
              background:
                "linear-gradient(180deg, rgba(46, 204, 64, 0.95) 0%, rgba(39, 174, 96, 0.95) 100%)",
              color: "#fff",
              padding: "24px 0",
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              position: isMobile ? "fixed" : "relative",
              left: 0,
              top: 0,
              zIndex: 50,
              overflow: "hidden",
              backdropFilter: "blur(5px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontWeight: "bold",
                fontSize: isHovering || isMobile ? "1.5rem" : "1.2rem",
                textAlign: "center",
                marginBottom: "2rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                padding: "0 16px",
              }}
            >
              {isHovering || isMobile ? "Admin Panel" : "AP"}
            </motion.div>

            <nav>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {sidebarItems.map((item) => (
                  <motion.li
                    key={item.label}
                    initial="closed"
                    animate="open"
                    variants={itemVariants}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 24px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      background:
                        activeItem === item.route
                          ? "rgba(255, 255, 255, 0.2)"
                          : "transparent",
                      borderRadius: "0 12px 12px 0",
                      marginRight: "16px",
                    }}
                    onClick={() => handleItemClick(item.route)}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.background =
                          activeItem === item.route
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent";
                      }
                    }}
                  >
                    {activeItem === item.route && (
                      <motion.div
                        layoutId="activeItem"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: "4px",
                          background: "white",
                          borderRadius: "0 4px 4px 0",
                        }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                    <span
                      style={{
                        marginRight: isHovering || isMobile ? "16px" : "0",
                        fontSize: "1.4rem",
                        minWidth: "24px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    <AnimatePresence>
                      {(isHovering || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "1rem",
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Animated decorative elements */}
            {!isMobile && (
              <>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    right: "20px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    filter: "blur(2px)",
                  }}
                />
                <motion.div
                  animate={{
                    y: [10, 0, 10],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    bottom: "80px",
                    right: "40px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.15)",
                    filter: "blur(1px)",
                  }}
                />
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
