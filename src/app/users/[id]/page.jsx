"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Hash,
  Settings,
  Volume2,
  Mic,
  Globe,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getUserDetail, deleteUser } from "@/lib/api";
import { formatDateTime } from "@/utils/formatters";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { UserDetailSkeleton } from "@/components/LoadingSkeleton";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !id) return;

    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const data = await getUserDetail(parseInt(id));
        setUserData(data);
      } catch (err) {
        setError("Failed to load user details");
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [authLoading, isAuthenticated, id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(parseInt(id));
      toast.success(`User "${userData.user.username}" deleted successfully`);
      router.push("/users");
    } catch (err) {
      toast.error(`Failed to delete user: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="space-y-6 pt-14 lg:pt-0 max-w-3xl">
      {/* Back Button */}
      <button
        onClick={() => router.push("/users")}
        className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3 group animate-fade-in"
        style={{ color: "#8B8FA3" }}
      >
        <ArrowLeft
          size={18}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Back to Users
      </button>

      {loading ? (
        <UserDetailSkeleton />
      ) : error ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(26, 29, 39, 0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <User
            size={48}
            style={{ color: "#2A2D3A" }}
            className="mx-auto mb-4"
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "#FF6B6B" }}
          >
            User Not Found
          </h3>
          <p className="text-sm" style={{ color: "#8B8FA3" }}>
            {error}
          </p>
        </div>
      ) : (
        userData && (
          <div className="space-y-6">
            {/* User Header */}
            <div
              className="rounded-2xl p-6 animate-fade-in"
              style={{
                background: "rgba(26, 29, 39, 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
                      color: "#FFFFFF",
                    }}
                  >
                    {userData.user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h1
                      className="text-xl font-bold"
                      style={{ color: "#FFFFFF" }}
                    >
                      {userData.user.username}
                    </h1>
                    <p className="text-sm" style={{ color: "#8B8FA3" }}>
                      {userData.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDelete(true)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  style={{
                    background: "rgba(255, 107, 107, 0.1)",
                    color: "#FF6B6B",
                    border: "1px solid rgba(255, 107, 107, 0.2)",
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div
              className="rounded-2xl p-6 space-y-4 animate-fade-in"
              style={{
                background: "rgba(26, 29, 39, 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                animationDelay: "0.1s",
                animationFillMode: "backwards",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                style={{ color: "#8B8FA3" }}
              >
                <User size={14} />
                Account Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailField
                  icon={Hash}
                  label="User ID"
                  value={userData.user.user_id}
                  mono
                />
                <DetailField
                  icon={User}
                  label="Username"
                  value={userData.user.username}
                />
                <DetailField
                  icon={Mail}
                  label="Email"
                  value={userData.user.email}
                />
                <DetailField
                  icon={Calendar}
                  label="Joined"
                  value={formatDateTime(userData.user.created_at)}
                />
              </div>
            </div>

            {/* Settings */}
            <div
              className="rounded-2xl p-6 space-y-4 animate-fade-in"
              style={{
                background: "rgba(26, 29, 39, 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                animationDelay: "0.2s",
                animationFillMode: "backwards",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                style={{ color: "#8B8FA3" }}
              >
                <Settings size={14} />
                User Settings
              </h2>
              {userData.settings ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DetailField
                    icon={Volume2}
                    label="Speech Rate"
                    value={userData.settings.speech_rate}
                    mono
                  />
                  <DetailField
                    icon={Mic}
                    label="Voice Type"
                    value={userData.settings.voice_type}
                  />
                  <DetailField
                    icon={Globe}
                    label="Language"
                    value={userData.settings.language}
                  />
                </div>
              ) : (
                <div
                  className="rounded-xl p-6 text-center"
                  style={{
                    background: "rgba(255, 212, 59, 0.05)",
                    border: "1px solid rgba(255, 212, 59, 0.15)",
                  }}
                >
                  <Settings
                    size={32}
                    className="mx-auto mb-2"
                    style={{ color: "#FFD43B", opacity: 0.5 }}
                  />
                  <p className="text-sm font-medium" style={{ color: "#FFD43B" }}>
                    No settings configured
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8B8FA3" }}>
                    This user hasn&apos;t customized their settings yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Delete Modal */}
      {showDelete && userData && (
        <DeleteConfirmModal
          user={userData.user}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

function DetailField({ icon: Icon, label, value, mono }) {
  return (
    <div
      className="rounded-xl px-4 py-3 space-y-1"
      style={{ background: "rgba(15, 17, 23, 0.5)" }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: "#8B8FA3" }} />
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "#8B8FA3" }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-sm font-semibold"
        style={{
          color: "#FFFFFF",
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
        }}
      >
        {value}
      </p>
    </div>
  );
}
