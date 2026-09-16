import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/admin/Badge";
import Spinner from "@/components/common/Spinner";

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin";
  createdAt: string;
}

interface UserFormState {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "user" | "admin";
}

const EMPTY_FORM: UserFormState = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "user",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ROUTES.ADMIN_USERS.LIST);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: "",
      role: user.role,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingUser) {
        await apiClient.put(API_ROUTES.ADMIN_USERS.UPDATE(editingUser._id), {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          role: form.role,
        });
      } else {
        await apiClient.post(API_ROUTES.ADMIN_USERS.CREATE, form);
      }
      setModalOpen(false);
      await fetchUsers();
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
      await apiClient.delete(API_ROUTES.ADMIN_USERS.DELETE(deleteTarget._id));
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete user.";
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description={`${users.length} account${users.length === 1 ? "" : "s"} total`}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green text-white text-sm font-medium hover:bg-green-dark transition-colors duration-fast"
          >
            <FiPlus className="w-4 h-4" />
            Add User
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
        <div className="p-4 border-b border-sand">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand text-sm focus:outline-none focus:border-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <Spinner label="Loading users..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-sand-light text-espresso/70 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Phone</th>
                  <th className="text-left px-6 py-3 font-medium">Role</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-sand-light/50">
                      <td className="px-6 py-4 font-medium text-espresso">{user.name}</td>
                      <td className="px-6 py-4 text-espresso/70">{user.email}</td>
                      <td className="px-6 py-4 text-espresso/70">{user.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <Badge tone={user.role === "admin" ? "espresso" : "green"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            aria-label={`Edit ${user.name}`}
                            className="p-2 rounded-lg text-espresso/60 hover:bg-sand-light hover:text-green-dark transition-colors duration-fast"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            aria-label={`Delete ${user.name}`}
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
                      No users found.
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
        title={editingUser ? "Edit User" : "Add User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-espresso mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Phone number</label>
            <input
              type="tel"
              required
              maxLength={10}
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
            />
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "user" | "admin" })}
              className="w-full px-3 py-2 rounded-lg border border-sand focus:outline-none focus:border-green"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
              {submitting ? "Saving..." : editingUser ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
