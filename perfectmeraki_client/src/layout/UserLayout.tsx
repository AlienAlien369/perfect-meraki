import React from "react";
import Navbar from "../components/common/Navbar"; // Adjust the path as needed
import Footer from "../components/common/Footer"; // Adjust the path as needed

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <div
        style={{
          flex: 1,
          marginTop: "0px", // Adjust if your Navbar has a different height
          marginBottom: "0px", // Adjust if your Footer has a different height
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
