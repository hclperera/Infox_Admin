"use client";

import { X, User, Settings, Mail, Calendar, Hash, Volume2, Globe, Mic } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

export default function UserDetailModal({ user, settings, onClose }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
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
        className="relative w-full max-w-lg rounded-2xl overflow-hidden animate-in"
        style={{
          background: "rgba(26, 29, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2A2D3A",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          animation: "modalIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #2A2D3A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(108, 99, 255, 0.15)" }}
            >
              <User size={20} style={{ color: "#6C63FF" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
                {user.username}
              </h2>
              <p className="text-xs" style={{ color: "#8B8FA3" }}>
                User Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
          >
            <X size={20} style={{ color: "#8B8FA3" }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-3">
            <h3
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#8B8FA3" }}
            >
              Account Information
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={Hash}
                label="User ID"
                value={user.user_id}
                mono
              />
              <InfoRow icon={User} label="Username" value={user.username} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={formatDateTime(user.created_at)}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings size={14} style={{ color: "#8B8FA3" }} />
              <h3
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#8B8FA3" }}
              >
                User Settings
              </h3>
            </div>
            {settings ? (
              <div className="space-y-2">
                <InfoRow
                  icon={Volume2}
                  label="Speech Rate"
                  value={settings.speech_rate}
                  mono
                />
                <InfoRow
                  icon={Mic}
                  label="Voice Type"
                  value={settings.voice_type}
                />
                <InfoRow
                  icon={Globe}
                  label="Language"
                  value={settings.language}
                />
              </div>
            ) : (
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255, 212, 59, 0.05)",
                  border: "1px solid rgba(255, 212, 59, 0.15)",
                }}
              >
                <p className="text-sm" style={{ color: "#FFD43B" }}>
                  No settings configured
                </p>
              </div>
            )}
          </div>
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

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "rgba(15, 17, 23, 0.5)" }}
    >
      <Icon size={16} style={{ color: "#8B8FA3", flexShrink: 0 }} />
      <span className="text-sm" style={{ color: "#8B8FA3", minWidth: "90px" }}>
        {label}
      </span>
      <span
        className="text-sm font-medium ml-auto text-right"
        style={{
          color: "#FFFFFF",
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}
