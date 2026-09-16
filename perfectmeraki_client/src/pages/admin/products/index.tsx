import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/admin/Badge";
import Spinner from "@/components/common/Spinner";

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

interface Product {
  _id: string;
  image: string;
  name: string;
  type: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
}

interface ProductFormState {
  name: string;
  type: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  image: File | null;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  type: "",
  description: "",
  originalPrice: "",
  discountedPrice: "",
  image: null,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post(API_ROUTES.PRODUCTS.GET_BY_TYPE, {});
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      type: product.type,
      description: product.description,
      originalPrice: String(product.originalPrice),
      discountedPrice: String(product.discountedPrice),
      image: null,
    });
    setPreview(product.image);
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingProduct) {
        await apiClient.put(API_ROUTES.PRODUCTS.EDIT(editingProduct._id), {
          name: form.name,
          type: form.type,
          description: form.description,
          originalPrice: Number(form.originalPrice),
          discountedPrice: Number(form.discountedPrice),
        });
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("type", form.type);
        formData.append("description", form.description);
        formData.append("originalPrice", form.originalPrice);
        formData.append("discountedPrice", form.discountedPrice);
        if (form.image) formData.append("image", form.image);
        await apiClient.post(API_ROUTES.PRODUCTS.ADD, formData);
      }
      setModalOpen(false);
      await fetchProducts();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(API_ROUTES.PRODUCTS.DELETE(deleteTarget._id));
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in the catalogue`}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green text-white text-sm font-medium hover:bg-green-dark transition-colors duration-fast"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
        <div className="p-4 border-b border-sand">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand text-sm focus:outline-none focus:border-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <Spinner label="Loading products..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-sand-light text-espresso/70 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Image</th>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-sand-light/50">
                      <td className="px-6 py-3">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-sand"
                            unoptimized
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-espresso">{product.name}</td>
                      <td className="px-6 py-4">
                        <Badge>{product.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-espresso/70">
                        <span className="font-medium text-espresso">
                          ₹{product.discountedPrice}
                        </span>{" "}
                        <span className="line-through text-espresso/40 text-xs">
                          ₹{product.originalPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            aria-label={`Edit ${product.name}`}
                            className="p-2 rounded-lg text-espresso/60 hover:bg-sand-light hover:text-green-dark transition-colors duration-fast"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            aria-label={`Delete ${product.name}`}
                            className="p-2 rounded-lg text-espresso/60 hover:bg-red-50 hover:text-red-600 transition-colors duration-fast"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-espresso/50">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Image</label>
            <div className="flex items-center gap-4">
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover border border-sand"
                  unoptimized
                />
              )}
              <label className="cursor-pointer px-4 py-2 rounded-lg border border-sand text-sm font-medium text-espresso hover:bg-sand-light transition-colors duration-fast">
                {form.image ? "Change image" : editingProduct ? "Replace image" : "Choose image"}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            {editingProduct && (
              <p className="text-xs text-espresso/50 mt-1">
                Image replacement isn&apos;t supported yet - only new products can set an image.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Type</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
            >
              <option value="">Select type</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Original price
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Discounted price
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.discountedPrice}
                onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
              />
            </div>
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-espresso border border-sand hover:bg-sand-light transition-colors duration-fast"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green hover:bg-green-dark transition-colors duration-fast disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingProduct ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
