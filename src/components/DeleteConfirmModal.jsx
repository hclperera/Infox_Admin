"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({ user, onConfirm, onCancel, isDeleting }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 29, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 107, 107, 0.2)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          animation: "modalIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255, 107, 107, 0.15)" }}
            >
              <AlertTriangle size={20} style={{ color: "#FF6B6B" }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
              Delete User
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10"
          >
            <X size={20} style={{ color: "#8B8FA3" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed" style={{ color: "#8B8FA3" }}>
            Are you sure you want to delete{" "}
            <span className="font-semibold" style={{ color: "#FFFFFF" }}>
              {user.username}
            </span>{" "}
            ({user.email})? This action cannot be undone and will permanently
            remove all associated data.
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid #2A2D3A" }}
        >
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{ color: "#8B8FA3" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #ee5a5a)",
              color: "#FFFFFF",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
            }}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete User"
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
