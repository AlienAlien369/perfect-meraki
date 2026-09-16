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

const WORKSHOP_TYPES = [
  "corperate team building",
  "festival themed",
  "fridge magnets",
  "kids",
  "lipan art",
  "mandala",
  "nameplate",
];

interface Workshop {
  _id: string;
  image1: string;
  image2: string;
  image3: string;
  name: string;
  type: string;
  description: string;
}

interface WorkshopFormState {
  name: string;
  type: string;
  description: string;
  image1: File | null;
  image2: File | null;
  image3: File | null;
}

const EMPTY_FORM: WorkshopFormState = {
  name: "",
  type: "",
  description: "",
  image1: null,
  image2: null,
  image3: null,
};

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [form, setForm] = useState<WorkshopFormState>(EMPTY_FORM);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Workshop | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ROUTES.WORKSHOPS.GET_BY_TYPE());
      setWorkshops(res.data.data || []);
    } catch (err) {
      console.error("Error fetching workshops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const filteredWorkshops = workshops.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.type.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingWorkshop(null);
    setForm(EMPTY_FORM);
    setPreviews({});
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setForm({ ...EMPTY_FORM, name: workshop.name, type: workshop.type, description: workshop.description });
    setPreviews({ image1: workshop.image1, image2: workshop.image2, image3: workshop.image3 });
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageChange = (key: "image1" | "image2" | "image3") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, [key]: file }));
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("description", form.description);
      if (form.image1) formData.append("image1", form.image1);
      if (form.image2) formData.append("image2", form.image2);
      if (form.image3) formData.append("image3", form.image3);

      if (editingWorkshop) {
        await apiClient.put(API_ROUTES.WORKSHOPS.EDIT(editingWorkshop._id), formData);
      } else {
        if (!form.image1 || !form.image2 || !form.image3) {
          setFormError("All three images are required.");
          setSubmitting(false);
          return;
        }
        await apiClient.post(API_ROUTES.WORKSHOPS.ADD, formData);
      }
      setModalOpen(false);
      await fetchWorkshops();
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
      await apiClient.delete(API_ROUTES.WORKSHOPS.DELETE(deleteTarget._id));
      setWorkshops((prev) => prev.filter((w) => w._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting workshop:", err);
      alert("Failed to delete workshop.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Workshops"
        description={`${workshops.length} workshop${workshops.length === 1 ? "" : "s"} listed`}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green text-white text-sm font-medium hover:bg-green-dark transition-colors duration-fast"
          >
            <FiPlus className="w-4 h-4" />
            Add Workshop
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
            <Spinner label="Loading workshops..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-sand-light text-espresso/70 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Images</th>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filteredWorkshops.length > 0 ? (
                  filteredWorkshops.map((workshop) => (
                    <tr key={workshop._id} className="hover:bg-sand-light/50">
                      <td className="px-6 py-3">
                        <div className="flex gap-1">
                          {[workshop.image1, workshop.image2, workshop.image3]
                            .filter(Boolean)
                            .map((img, i) => (
                              <Image
                                key={i}
                                src={img}
                                alt={`${workshop.name} ${i + 1}`}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg object-cover border border-sand"
                                unoptimized
                              />
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-espresso">{workshop.name}</td>
                      <td className="px-6 py-4">
                        <Badge>{workshop.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(workshop)}
                            aria-label={`Edit ${workshop.name}`}
                            className="p-2 rounded-lg text-espresso/60 hover:bg-sand-light hover:text-green-dark transition-colors duration-fast"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(workshop)}
                            aria-label={`Delete ${workshop.name}`}
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
                    <td colSpan={4} className="px-6 py-10 text-center text-espresso/50">
                      No workshops found.
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
        title={editingWorkshop ? "Edit Workshop" : "Add Workshop"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {(["image1", "image2", "image3"] as const).map((key, idx) => (
              <div key={key} className="text-center">
                <div className="w-full aspect-square rounded-lg border border-dashed border-sand bg-sand-light flex items-center justify-center overflow-hidden mb-1">
                  {previews[key] ? (
                    <Image
                      src={previews[key]}
                      alt={`Image ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-espresso/40">Image {idx + 1}</span>
                  )}
                </div>
                <label className="cursor-pointer text-xs font-medium text-green-dark hover:underline">
                  {previews[key] ? "Change" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(key)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
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
              {WORKSHOP_TYPES.map((type) => (
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
              {submitting ? "Saving..." : editingWorkshop ? "Save changes" : "Create workshop"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete workshop"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
