"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import paintingLoader from "../../../../public/assets/gifs/paint_loader.gif";
import { API_ROUTES } from "@/api/APIRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useRouter } from "next/router";

interface Product {
  _id: string;
  image: string;
  name: string;
  type: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TableColumn {
  header: string;
  accessor: string;
  type?: "button";
  buttonText?: string;
  buttonAction?: string;
}

const columns: TableColumn[] = [
  {
    header: "Product Image",
    accessor: "image",
  },
  {
    header: "Product Name",
    accessor: "name",
  },
  {
    header: "Product Type",
    accessor: "type",
  },
  {
    header: "Phone Description",
    accessor: "description",
  },
  //   {
  //     header: "Edit Product",
  //     accessor: "actions",
  //     type: "button",
  //     buttonText: "Edit Product",
  //     buttonAction: `${API_ROUTES.PRODUCTS.EDIT}/:id`,
  //   },
  {
    header: "Delete Product",
    accessor: "actions",
    type: "button",
    buttonText: "Delete Product",
    buttonAction: `${API_ROUTES.PRODUCTS.DELETE}/:id`,
  },
];

const ProductDetails = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${API_ROUTES.PRODUCTS.GET_BY_TYPE}`,
          { type: "" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          product.type.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(API_ROUTES.PRODUCTS.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Details</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, productIndex) => (
                <tr
                  key={product._id}
                  className={
                    productIndex % 2 === 0
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-white hover:bg-green-50"
                  }
                >
                  {columns.map((column, colIndex) => {
                    if (column.type === "button") {
                      if (column.buttonText?.toLowerCase().includes("edit")) {
                        return (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              onClick={
                                column.buttonAction
                                  ? () =>
                                      router.push(
                                        (column.buttonAction ?? "").replace(
                                          ":id",
                                          product._id
                                        )
                                      )
                                  : undefined
                              }
                            >
                              {column.buttonText}
                            </button>
                          </td>
                        );
                      }
                      if (column.buttonText?.toLowerCase().includes("delete")) {
                        return (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              onClick={() => handleDelete(product._id)}
                            >
                              {column.buttonText}
                            </button>
                          </td>
                        );
                      }
                      return <td key={colIndex}></td>;
                    }
                    if (column.accessor === "image") {
                      return (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                            style={{
                              objectFit: "cover",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </td>
                      );
                    }
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {product[column.accessor as keyof Product]}
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
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
