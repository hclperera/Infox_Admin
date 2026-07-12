"use client";

import { Eye, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function UsersTable({
  users,
  total,
  page,
  perPage,
  onPageChange,
  onView,
  onDelete,
}) {
  const totalPages = Math.ceil(total / perPage);

  if (!users || users.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: "rgba(26, 29, 39, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Users size={48} style={{ color: "#2A2D3A" }} className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: "#8B8FA3" }}>
          No users found
        </h3>
        <p className="text-sm" style={{ color: "#5a5d6e" }}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(26, 29, 39, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2D3A" }}>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B8FA3" }}
              >
                #
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B8FA3" }}
              >
                Username
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: "#8B8FA3" }}
              >
                Email
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell"
                style={{ color: "#8B8FA3" }}
              >
                Joined
              </th>
              <th
                className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B8FA3" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className="transition-colors duration-150 cursor-pointer group"
                style={{ borderBottom: "1px solid rgba(42, 45, 58, 0.5)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(37, 40, 54, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={() => onView(user.user_id)}
              >
                <td className="px-6 py-4">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "#8B8FA3" }}
                  >
                    {(page - 1) * perPage + index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {user.username}
                  </span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-sm" style={{ color: "#8B8FA3" }}>
                    {user.email}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm" style={{ color: "#8B8FA3" }}>
                    {formatDate(user.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(user.user_id);
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ color: "#6C63FF" }}
                      title="View user"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user);
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ color: "#FF6B6B" }}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid #2A2D3A" }}
        >
          <p className="text-sm" style={{ color: "#8B8FA3" }}>
            Showing{" "}
            <span style={{ color: "#FFFFFF" }}>
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}
            </span>{" "}
            of <span style={{ color: "#FFFFFF" }}>{total}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
              style={{
                background: "rgba(108, 99, 255, 0.1)",
                color: "#6C63FF",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background:
                      page === pageNum
                        ? "linear-gradient(135deg, #6C63FF, #5a52e0)"
                        : "transparent",
                    color: page === pageNum ? "#FFFFFF" : "#8B8FA3",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
              style={{
                background: "rgba(108, 99, 255, 0.1)",
                color: "#6C63FF",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
