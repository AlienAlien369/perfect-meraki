import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
const AdminDashboard = () => {
  const allData = useSelector((state: RootState) => state);
  console.log("data", allData);
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
