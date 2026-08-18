"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getAuditLogs } from "@/lib/api";
import { formatDateTime } from "@/utils/formatters";

const ACTION_CONFIG = {
  VIEW_USER: {
    label: "View User",
    icon: Eye,
    color: "#0D6EFD",
    bg: "rgba(13, 110, 253, 0.12)",
    border: "rgba(13, 110, 253, 0.25)",
  },
  DELETE_USER: {
    label: "Delete User",
    icon: Trash2,
    color: "#FF6B6B",
    bg: "rgba(255, 107, 107, 0.12)",
    border: "rgba(255, 107, 107, 0.25)",
  },
};

function ActionBadge({ actionType }) {
  const config = ACTION_CONFIG[actionType] || {
    label: actionType,
    icon: ShieldAlert,
    color: "#FFD43B",
    bg: "rgba(255, 212, 59, 0.12)",
    border: "rgba(255, 212, 59, 0.25)",
  };
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
}

export default function AuditLogsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const data = await getAuditLogs(page, perPage);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError("Failed to load audit logs. The backend endpoint may not be ready yet.");
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, isAuthenticated]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchLogs();
  }, [authLoading, isAuthenticated, fetchLogs]);

  if (authLoading) return null;

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
            style={{ color: "#FFFFFF" }}
          >
            <ClipboardList size={28} style={{ color: "#0D6EFD" }} />
            Audit Logs
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B9AB5" }}>
            Immutable record of all admin actions — view-only
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <div
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(13, 110, 253, 0.1)",
                color: "#0D6EFD",
                border: "1px solid rgba(13, 110, 253, 0.2)",
              }}
            >
              {total} total log{total !== 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              background: "rgba(13, 110, 253, 0.1)",
              color: "#0D6EFD",
              border: "1px solid rgba(13, 110, 253, 0.2)",
            }}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Immutability Notice */}
      <div
        className="flex items-start gap-3 rounded-xl px-5 py-4 text-sm animate-fade-in"
        style={{
          background: "rgba(255, 212, 59, 0.06)",
          border: "1px solid rgba(255, 212, 59, 0.2)",
          animationDelay: "0.05s",
          animationFillMode: "backwards",
        }}
      >
        <ShieldAlert size={16} style={{ color: "#FFD43B", flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: "#FFD43B" }}>
          Audit logs are <strong>immutable</strong> — they cannot be modified or deleted, and are preserved for a minimum of 1 year (FR 35).
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.2)",
            color: "#FF6B6B",
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in"
        style={{
          background: "rgba(9, 13, 22, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          animationDelay: "0.1s",
          animationFillMode: "backwards",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1E2D45" }}>
                {["#", "Timestamp", "Admin", "Action", "Target User ID"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#8B9AB5" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                [...Array(8)].map((_, i) => (
                  <tr
                    key={i}
                    className="animate-pulse"
                    style={{ borderBottom: "1px solid rgba(30, 45, 69, 0.5)" }}
                  >
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div
                          className="h-3 rounded"
                          style={{
                            background: "#1E2D45",
                            width: j === 0 ? "30px" : j === 3 ? "90px" : `${80 + Math.random() * 60}px`,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <ClipboardList size={48} style={{ color: "#1E2D45" }} />
                      <p className="text-sm font-semibold" style={{ color: "#8B9AB5" }}>
                        No audit logs found
                      </p>
                      <p className="text-xs" style={{ color: "#4a5670" }}>
                        Logs will appear here once admin actions are performed
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log.log_id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: "1px solid rgba(30, 45, 69, 0.4)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(13, 110, 253, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Row number */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono" style={{ color: "#4a5670" }}>
                        {(page - 1) * perPage + index + 1}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4">
                      <span
                        className="text-sm"
                        style={{ color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
                      >
                        {formatDateTime(log.timestamp)}
                      </span>
                    </td>

                    {/* Admin username */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: "linear-gradient(135deg, #0D6EFD, #00CFFF)",
                            color: "#FFFFFF",
                          }}
                        >
                          {log.admin_username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                          {log.admin_username || `Admin #${log.admin_id}`}
                        </span>
                      </div>
                    </td>

                    {/* Action type */}
                    <td className="px-6 py-4">
                      <ActionBadge actionType={log.action_type} />
                    </td>

                    {/* Target user ID */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/users/${log.target_user_id}`)}
                        className="text-sm font-mono transition-colors duration-150 hover:underline"
                        style={{ color: "#00CFFF" }}
                        title="View user profile"
                      >
                        #{log.target_user_id}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: "1px solid #1E2D45" }}
          >
            <p className="text-sm" style={{ color: "#8B9AB5" }}>
              Showing{" "}
              <span style={{ color: "#FFFFFF" }}>
                {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}
              </span>{" "}
              of <span style={{ color: "#FFFFFF" }}>{total}</span> logs
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
                style={{ background: "rgba(13, 110, 253, 0.1)", color: "#0D6EFD" }}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background:
                        page === pageNum
                          ? "linear-gradient(135deg, #0D6EFD, #0056d6)"
                          : "transparent",
                      color: page === pageNum ? "#FFFFFF" : "#8B9AB5",
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
                style={{ background: "rgba(13, 110, 253, 0.1)", color: "#0D6EFD" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
