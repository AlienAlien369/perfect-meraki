"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import paintingLoader from "../../../../public/assets/gifs/paint_loader.gif";
import { API_ROUTES } from "@/api/APIRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  BatchNumber?: string;
  lastLogin: string;
}

const UserDetails = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // Get token from Redux authSlice at the top level
  const token = useSelector((state: RootState) => state.auth.token);

  // Define table columns with correct type annotations
  const columns: TableColumn[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone Number",
      accessor: "phoneNumber",
    },
    {
      header: "Last Login",
      accessor: "lastLogin",
    },
    {
      header: "Actions",
      accessor: "actions",
      type: "button", // This must be exactly "button", not just string
      buttonText: "Delete User",
      buttonAction: `${API_ROUTES.USERS.DELETE}`,
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("api route", API_ROUTES.USERS.GET_ALL);
        const response = await axios.get(`${API_ROUTES.USERS.GET_ALL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.data)) {
          response.data.data = response.data.data.map((user: User) => ({
            ...user,
            lastLogin: user.lastLogin ? formatDateTime(user.lastLogin) : "",
          }));
        }
        // Function to format date and time

        function formatDateTime(dateString: string) {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");
          return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Image
          src={paintingLoader.src}
          width={28}
          height={28}
          alt="Loading..."
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Details</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          onChange={(e) => {
            const searchValue = e.target.value.toLowerCase();
            setUsers(
              users.filter(
                (user) =>
                  user.name.toLowerCase().includes(searchValue) ||
                  user.email.toLowerCase().includes(searchValue)
              )
            );
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, userIndex) => (
                <tr
                  key={userIndex}
                  className={
                    userIndex % 2 === 0
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-white hover:bg-green-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        // Handle delete action here
                        const token = localStorage.getItem("token");
                        axios
                          .delete(API_ROUTES.USERS.DELETE(user.id), {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          })
                          .then(() => {
                            setUsers(users.filter((u) => u.id !== user.id));
                          })
                          .catch((error) => {
                            console.error("Error deleting user:", error);
                          });
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add the TableColumn interface to the file
interface TableColumn {
  header: string;
  accessor: string;
  type?: "button";
  buttonText?: string;
  buttonAction?: string;
}

export default UserDetails;
