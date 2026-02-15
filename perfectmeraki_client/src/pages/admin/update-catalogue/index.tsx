import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/api/APIRoutes"; // Adjust the path as needed
import { motion } from "framer-motion";
import { FiUpload, FiLink, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const UpdateCatalogue: React.FC = () => {
  const [catalogueLink, setCatalogueLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogueLink) return;

    setLoading(true);
    setMessage(null);

    try {
      // Replace with your actual API endpoint
      const res = await axios.put(
        API_ROUTES.CATALOGUE.UPDATE,
        { name: "flipbook", link: catalogueLink },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setMessage({
          text: "Catalogue updated successfully!",
          type: "success",
        });
        setCatalogueLink("");
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update catalogue."
        : "An unexpected error occurred.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiUpload className="text-white" />
            Update Catalogue
          </h2>
          <p className="text-green-100 mt-1">
            Upload the latest catalogue link for your customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="catalogue-link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catalogue Link
            </label>
            <div
              className={`relative rounded-md shadow-sm transition-all duration-200 ${
                isFocused ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLink className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="catalogue-link"
                type="url"
                value={catalogueLink}
                onChange={(e) => setCatalogueLink(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md"
                placeholder="https://example.com/catalogue.pdf"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !catalogueLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !catalogueLink
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Update Catalogue
              </>
            )}
          </motion.button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-md flex items-start ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <FiAlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </form>

        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            Supported formats: Heyzine flip books URL
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateCatalogue;
