"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatChartDate } from "@/utils/formatters";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl"
      style={{
        background: "rgba(26, 29, 39, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid #2A2D3A",
      }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: "#8B8FA3" }}>
        {formatChartDate(label)}
      </p>
      <p className="text-lg font-bold" style={{ color: "#6C63FF" }}>
        {payload[0].value}{" "}
        <span className="text-xs font-normal" style={{ color: "#8B8FA3" }}>
          signups
        </span>
      </p>
    </div>
  );
}

export default function SignupChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(26, 29, 39, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>
          Signup Trend
        </h3>
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-sm" style={{ color: "#8B8FA3" }}>
            No signup data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(26, 29, 39, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      <h3 className="text-lg font-semibold mb-6" style={{ color: "#FFFFFF" }}>
        Signup Trend{" "}
        <span className="text-sm font-normal" style={{ color: "#8B8FA3" }}>
          — Last 30 days
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(42, 45, 58, 0.6)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartDate}
            tick={{ fill: "#8B8FA3", fontSize: 12 }}
            axisLine={{ stroke: "#2A2D3A" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#8B8FA3", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6C63FF"
            strokeWidth={2.5}
            fill="url(#signupGradient)"
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#6C63FF",
              strokeWidth: 2,
              fill: "#1a1d27",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
