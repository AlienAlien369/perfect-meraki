import React from "react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
    <p className="text-espresso/70 text-sm">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-sm font-medium text-espresso border border-sand hover:bg-sand-light transition-colors duration-fast"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-fast disabled:opacity-60 ${
          danger ? "bg-red-600 hover:bg-red-700" : "bg-green hover:bg-green-dark"
        }`}
      >
        {loading ? "Please wait..." : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
