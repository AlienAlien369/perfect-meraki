import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/api/APIRoutes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

const PRODUCT_TYPES = [
  "nameplates",
  "spiritual hangings",
  "kitchen decor",
  "fridge magnets",
  "danglers",
  "evil eye",
  "jarokha",
  "mandala mirrors",
  "kids special",
  "key holders",
];

const AddProduct = () => {
  const [form, setForm] = useState<{
    image: string | File;
    type: string;
    name: string;
    description: string;
    originalPrice: string;
    discountedPrice: string;
    category: string;
    stock: string;
  }>({
    image: "",
    type: "",
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    stock: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;
    if (name === "image" && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    try {
      const res = await axios.post(API_ROUTES.PRODUCTS.ADD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Product added:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-5xl grid md:grid-cols-2 gap-6 md:gap-8"
      >
        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-emerald-300 p-6 rounded-xl bg-emerald-50 hover:border-emerald-500 transition w-full">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="rounded-lg shadow-lg max-h-64 w-full object-contain"
            />
          ) : (
            <p className="text-gray-500 text-center">
              Drag & drop an image here, or click below to select
            </p>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            required
          />
          <label
            htmlFor="image"
            className="px-5 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 cursor-pointer transition text-sm sm:text-base"
          >
            {form.image ? "Change Image" : "Choose Image"}
          </label>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-2">
            Add New Product
          </h2>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full"
          >
            <option value="">Select Product Type</option>
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full"
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={form.discountedPrice}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="mt-2 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition w-full"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
