"use client";

import { useEffect, useState, useRef } from "react";

export default function StatsCard({ icon: Icon, label, value, color, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Fade-in on mount with delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Count-up animation
  useEffect(() => {
    if (!isVisible || typeof value !== "number") return;

    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, isVisible]);

  const gradients = {
    violet: "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(13,110,253,0.05))",
    teal: "linear-gradient(135deg, rgba(0,207,255,0.15), rgba(0,207,255,0.05))",
    warning: "linear-gradient(135deg, rgba(255,212,59,0.15), rgba(255,212,59,0.05))",
    success: "linear-gradient(135deg, rgba(81,207,102,0.15), rgba(81,207,102,0.05))",
  };

  const iconColors = {
    violet: "#0D6EFD",
    teal: "#00CFFF",
    warning: "#FFD43B",
    success: "#51CF66",
  };

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] group"
      style={{
        background: gradients[color] || gradients.violet,
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 40px ${iconColors[color] || iconColors.violet}20`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "#8B8FA3" }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{
              color: "#FFFFFF",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {typeof value === "number" ? displayValue.toLocaleString() : value}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${iconColors[color] || iconColors.violet}20`,
          }}
        >
          {Icon && (
            <Icon
              size={24}
              style={{ color: iconColors[color] || iconColors.violet }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
