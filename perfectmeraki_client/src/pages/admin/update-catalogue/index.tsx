import React, { useState } from "react";
import { FiUpload, FiLink, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";
import PageHeader from "@/components/admin/PageHeader";

const UpdateCatalogue: React.FC = () => {
  const [catalogueLink, setCatalogueLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogueLink) return;

    setLoading(true);
    setMessage(null);

    try {
      await apiClient.put(API_ROUTES.CATALOGUE.UPDATE, {
        name: "flipbook",
        link: catalogueLink,
      });
      setMessage({ text: "Catalogue updated successfully!", type: "success" });
      setCatalogueLink("");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update catalogue.";
      setMessage({ text: message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Catalogue"
        description="Update the flipbook link shown on the public catalogue page"
      />

      <div className="max-w-md bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="catalogue-link" className="block text-sm font-medium text-espresso mb-1">
              Catalogue link
            </label>
            <div className="relative">
              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40 w-4 h-4" />
              <input
                id="catalogue-link"
                type="url"
                value={catalogueLink}
                onChange={(e) => setCatalogueLink(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sand focus:outline-none focus:border-green"
                placeholder="https://heyzine.com/flip-book/..."
              />
            </div>
            <p className="text-xs text-espresso/50 mt-1">Supported: Heyzine flip book URLs</p>
          </div>

          <button
            type="submit"
            disabled={loading || !catalogueLink}
            className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors duration-fast ${
              loading || !catalogueLink
                ? "bg-green/50 cursor-not-allowed"
                : "bg-green hover:bg-green-dark"
            }`}
          >
            <FiUpload className="w-4 h-4" />
            {loading ? "Updating..." : "Update catalogue"}
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
                message.type === "success"
                  ? "bg-green-light text-green-dark"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateCatalogue;
