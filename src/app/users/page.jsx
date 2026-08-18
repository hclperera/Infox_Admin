"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Users as UsersIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getUsers, deleteUser } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import UsersTable from "@/components/UsersTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { TableSkeleton } from "@/components/LoadingSkeleton";

// Module-level cache — survives navigation within the same session
const usersCache = { data: null, key: null };

export default function UsersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [search, setSearch] = useState("");

  // Seed state from cache immediately so the table renders on first paint
  const cacheKey = `${page}:${perPage}:${search}`;
  const cachedResult = usersCache.key === cacheKey ? usersCache.data : null;

  const [users, setUsers] = useState(cachedResult?.users ?? []);
  const [total, setTotal] = useState(cachedResult?.total ?? 0);
  // Only show full skeleton on a true first load (no cache)
  const [loading, setLoading] = useState(!cachedResult);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track the latest fetch to ignore stale responses
  const fetchId = useRef(0);

  const fetchUsers = useCallback(
    async ({ showSkeleton = false } = {}) => {
      if (!isAuthenticated) return;

      const thisId = ++fetchId.current;

      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError("");

      try {
        const data = await getUsers(page, perPage, search);

        // Discard if a newer fetch has started
        if (thisId !== fetchId.current) return;

        setUsers(data.users);
        setTotal(data.total);

        // Update cache
        usersCache.key = `${page}:${perPage}:${search}`;
        usersCache.data = { users: data.users, total: data.total };
      } catch (err) {
        if (thisId !== fetchId.current) return;
        setError("Failed to load users");
        toast.error("Failed to load users");
      } finally {
        if (thisId === fetchId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, perPage, search, isAuthenticated]
  );

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const newKey = `${page}:${perPage}:${search}`;
    const hit = usersCache.key === newKey;

    if (hit) {
      // Show cache instantly, refresh quietly in background
      setUsers(usersCache.data.users);
      setTotal(usersCache.data.total);
      setLoading(false);
      fetchUsers({ showSkeleton: false });
    } else {
      // No cache for this key — show skeleton
      fetchUsers({ showSkeleton: true });
    }
  }, [authLoading, isAuthenticated, page, perPage, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleView = (userId) => {
    router.push(`/users/${userId}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.user_id);
      toast.success(`User "${userToDelete.username}" deleted successfully`);
      setUserToDelete(null);
      // Invalidate cache after deletion
      usersCache.key = null;
      usersCache.data = null;
      fetchUsers({ showSkeleton: false });
    } catch (err) {
      toast.error(`Failed to delete user: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
            style={{ color: "#FFFFFF" }}
          >
            <UsersIcon size={28} style={{ color: "#0D6EFD" }} />
            Users
            {/* Background refresh spinner */}
            {refreshing && (
              <Loader2
                size={18}
                className="animate-spin"
                style={{ color: "#8B9AB5" }}
              />
            )}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B9AB5" }}>
            Manage and monitor all registered users
          </p>
        </div>
        {(users.length > 0 || total > 0) && (
          <div
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(13, 110, 253, 0.1)",
              color: "#0D6EFD",
              border: "1px solid rgba(13, 110, 253, 0.2)",
            }}
          >
            {total} total user{total !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div
        className="animate-fade-in"
        style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
      >
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by email..."
        />
      </div>

      {/* Error */}
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
      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}
        >
          <UsersTable
            users={users}
            total={total}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            onView={handleView}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {/* Delete Modal */}
      {userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUserToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
