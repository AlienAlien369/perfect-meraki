"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import paintingLoader from "../../../../public/assets/gifs/paint_loader.gif";
import { API_ROUTES } from "@/api/APIRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Workshop {
  _id: string;
  image1: string;
  image2: string;
  image3: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TableColumn {
  header: string;
  accessor: string;
  type?: "button" | "imageGroup";
  buttonText?: string;
  buttonAction?: string;
}

const columns: TableColumn[] = [
  {
    header: "Workshop Images",
    accessor: "images",
    type: "imageGroup",
  },
  {
    header: "Workshop Name",
    accessor: "name",
  },
  {
    header: "Workshop Type",
    accessor: "type",
  },
  {
    header: "Workshop Description",
    accessor: "description",
  },
  {
    header: "Delete Workshop",
    accessor: "actions",
    type: "button",
    buttonText: "Delete Workshop",
    buttonAction: `${API_ROUTES.WORKSHOPS.DELETE}/:id`,
  },
];

const WorkshopDetails = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get(
          `${API_ROUTES.WORKSHOPS.GET_BY_TYPE()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response) {
          setWorkshops(response.data.data);
          setFilteredWorkshops(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setFilteredWorkshops(
      workshops.filter(
        (w) =>
          w.name.toLowerCase().includes(searchValue) ||
          w.type.toLowerCase().includes(searchValue) ||
          w.description.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(API_ROUTES.WORKSHOPS.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkshops((prev) => prev.filter((w) => w._id !== id));
      setFilteredWorkshops((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Error deleting workshop:", error);
    }
  };

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Workshop Details
      </h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search workshops..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          onChange={handleSearch}
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
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop, workshopIndex) => (
                <tr
                  key={workshop._id}
                  className={
                    workshopIndex % 2 === 0
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-white hover:bg-green-50"
                  }
                >
                  {columns.map((column, colIndex) => {
                    if (column.type === "button") {
                      return (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={() => handleDelete(workshop._id)}
                          >
                            {column.buttonText}
                          </button>
                        </td>
                      );
                    }
                    if (column.type === "imageGroup") {
                      return (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2"
                        >
                          {[workshop.image1, workshop.image2, workshop.image3]
                            .filter(Boolean)
                            .map((img, i) => (
                              <Image
                                key={i}
                                src={img}
                                alt={`${workshop.name} image ${i + 1}`}
                                width={48}
                                height={48}
                                className="object-cover rounded border"
                              />
                            ))}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {workshop[column.accessor as keyof Workshop]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No workshops found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkshopDetails;
