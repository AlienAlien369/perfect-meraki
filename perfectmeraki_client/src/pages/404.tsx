import React from "react";
import Link from "next/link";

const Custom404: React.FC = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      color: "#1e293b",
      textAlign: "center",
    }}
  >
    <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
    <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link href="/">
      <a
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Go back home
      </a>
    </Link>
  </div>
);

export default Custom404;
