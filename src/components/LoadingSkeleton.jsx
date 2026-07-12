"use client";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-6 animate-pulse"
          style={{
            background: "rgba(26, 29, 39, 0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div
                className="h-3 w-20 rounded"
                style={{ background: "#2A2D3A" }}
              />
              <div
                className="h-8 w-16 rounded"
                style={{ background: "#2A2D3A" }}
              />
            </div>
            <div
              className="w-12 h-12 rounded-xl"
              style={{ background: "#2A2D3A" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{
        background: "rgba(26, 29, 39, 0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="h-5 w-40 rounded mb-6"
        style={{ background: "#2A2D3A" }}
      />
      <div className="flex items-end gap-2 h-[280px] pt-8">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{
              background: "#2A2D3A",
              height: `${Math.random() * 60 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        background: "rgba(26, 29, 39, 0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: "1px solid #2A2D3A" }}
      >
        {[40, 120, 180, 100, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded"
            style={{ background: "#2A2D3A", width: `${w}px` }}
          />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4"
          style={{ borderBottom: "1px solid rgba(42, 45, 58, 0.5)" }}
        >
          <div
            className="h-3 w-8 rounded"
            style={{ background: "#2A2D3A" }}
          />
          <div
            className="h-3 rounded"
            style={{ background: "#2A2D3A", width: `${100 + Math.random() * 80}px` }}
          />
          <div
            className="h-3 rounded flex-1"
            style={{ background: "#2A2D3A", maxWidth: "200px" }}
          />
          <div
            className="h-3 w-20 rounded hidden md:block"
            style={{ background: "#2A2D3A" }}
          />
          <div
            className="h-3 w-16 rounded ml-auto"
            style={{ background: "#2A2D3A" }}
          />
        </div>
      ))}
    </div>
  );
}

export function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl"
          style={{ background: "#2A2D3A" }}
        />
        <div className="space-y-2">
          <div
            className="h-5 w-32 rounded"
            style={{ background: "#2A2D3A" }}
          />
          <div
            className="h-3 w-48 rounded"
            style={{ background: "#2A2D3A" }}
          />
        </div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl"
          style={{ background: "#2A2D3A" }}
        />
      ))}
    </div>
  );
}
