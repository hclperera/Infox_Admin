"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, CalendarDays, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getStats, getUsers, getSignupTrend } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import SignupChart from "@/components/SignupChart";
import { StatsSkeleton, ChartSkeleton, TableSkeleton } from "@/components/LoadingSkeleton";
import { formatDate } from "@/utils/formatters";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [recentUsers, setRecentUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, trendRes, usersRes] = await Promise.allSettled([
          getStats(),
          getSignupTrend(),
          getUsers(1, 5),
        ]);

        if (statsRes.status === "fulfilled") setStats(statsRes.value);
        else toast.error("Failed to load statistics");

        if (trendRes.status === "fulfilled") setTrendData(trendRes.value.data);
        else toast.error("Failed to load signup trend");

        if (usersRes.status === "fulfilled") setRecentUsers(usersRes.value.users);
        else toast.error("Failed to load recent users");
      } catch (err) {
        setError("Failed to load dashboard data. Please check your connection.");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [authLoading, isAuthenticated]);

  if (authLoading) return null;

  return (
    <div className="space-y-8 pt-14 lg:pt-0">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFFFFF" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8B8FA3" }}>
          Welcome back. Here&apos;s an overview of your application.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="rounded-xl px-5 py-4 text-sm animate-fade-in"
          style={{
            background: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.2)",
            color: "#FF6B6B",
          }}
        >
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={Users}
              label="Total Users"
              value={stats.total_users}
              color="violet"
              delay={0}
            />
            <StatsCard
              icon={UserPlus}
              label="New Today"
              value={stats.new_users_today}
              color="teal"
              delay={100}
            />
            <StatsCard
              icon={CalendarDays}
              label="This Week"
              value={stats.new_users_this_week}
              color="warning"
              delay={200}
            />
            <StatsCard
              icon={TrendingUp}
              label="This Month"
              value={stats.new_users_this_month}
              color="success"
              delay={300}
            />
          </div>
        )
      )}

      {/* Chart */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
          <SignupChart data={trendData || []} />
        </div>
      )}

      {/* Recent Users */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        recentUsers && (
          <div
            className="rounded-2xl overflow-hidden animate-fade-in"
            style={{
              background: "rgba(26, 29, 39, 0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              animationDelay: "0.3s",
              animationFillMode: "backwards",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #2A2D3A" }}
            >
              <h3
                className="text-lg font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                Recent Users
              </h3>
              <button
                onClick={() => router.push("/users")}
                className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:gap-2.5 group"
                style={{ color: "#0D6EFD" }}
              >
                View All
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(42, 45, 58, 0.5)" }}>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#8B8FA3" }}
                    >
                      Username
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                      style={{ color: "#8B8FA3" }}
                    >
                      Email
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#8B8FA3" }}
                    >
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="transition-colors duration-150 cursor-pointer"
                      style={{
                        borderBottom: "1px solid rgba(42, 45, 58, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(37, 40, 54, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                      onClick={() => router.push(`/users/${user.user_id}`)}
                    >
                      <td className="px-6 py-3.5">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#FFFFFF" }}
                        >
                          {user.username}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <span className="text-sm" style={{ color: "#8B8FA3" }}>
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-sm" style={{ color: "#8B8FA3" }}>
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
