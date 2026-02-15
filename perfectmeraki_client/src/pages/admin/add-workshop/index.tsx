import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/api/APIRoutes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

const WORKSHOP_TYPES = [
  "corperate team building",
  "festival themed",
  "fridge magnets",
  "kids",
  "lipan art",
  "mandala",
  "nameplate",
];

const AddWorkshop = () => {
  const [form, setForm] = useState<{
    image1: File | null;
    image2: File | null;
    image3: File | null;
    type: string;
    name: string;
    description: string;
  }>({
    image1: null,
    image2: null,
    image3: null,
    type: "",
    name: "",
    description: "",
  });

  const [preview, setPreview] = useState<{ [key: string]: string }>({});
  const token = useSelector((state: RootState) => state.auth.token);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;

    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (form.image1) formData.append("image1", form.image1);
    if (form.image2) formData.append("image2", form.image2);
    if (form.image3) formData.append("image3", form.image3);
    formData.append("type", form.type);
    formData.append("name", form.name);
    formData.append("description", form.description);

    try {
      const res = await axios.post(API_ROUTES.WORKSHOPS.ADD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Workshop added:", res.data);
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
        <div className="flex flex-col gap-6">
          {["image1", "image2", "image3"].map((imgKey, idx) => (
            <div
              key={imgKey}
              className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-emerald-300 p-6 rounded-xl bg-emerald-50 hover:border-emerald-500 transition w-full"
            >
              {preview[imgKey] ? (
                <Image
                  src={preview[imgKey]}
                  alt={`Preview ${idx + 1}`}
                  width={300}
                  height={200}
                  className="rounded-lg shadow-lg max-h-64 w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 text-center">
                  Upload {`Image ${idx + 1}`}
                </p>
              )}

              <input
                type="file"
                id={imgKey}
                name={imgKey}
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required={imgKey === "image1"} // make first image required
              />
              <label
                htmlFor={imgKey}
                className="px-5 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 cursor-pointer transition text-sm sm:text-base"
              >
                {form[imgKey as keyof typeof form] ? "Change" : "Choose"}{" "}
                {`Image ${idx + 1}`}
              </label>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-2">
            Add New Workshop
          </h2>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full"
          >
            <option value="">Select Workshop Type</option>
            {WORKSHOP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Workshop Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full"
          />

          <textarea
            name="description"
            placeholder="Workshop Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 w-full resize-none"
          />

          <button
            type="submit"
            className="mt-2 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition w-full"
          >
            Add Workshop
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkshop;
