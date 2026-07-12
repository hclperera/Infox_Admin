"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const colors = {
  success: {
    bg: "rgba(81, 207, 102, 0.1)",
    border: "rgba(81, 207, 102, 0.3)",
    text: "#51CF66",
    bar: "#51CF66",
  },
  error: {
    bg: "rgba(255, 107, 107, 0.1)",
    border: "rgba(255, 107, 107, 0.3)",
    text: "#FF6B6B",
    bar: "#FF6B6B",
  },
  warning: {
    bg: "rgba(255, 212, 59, 0.1)",
    border: "rgba(255, 212, 59, 0.3)",
    text: "#FFD43B",
    bar: "#FFD43B",
  },
};

export default function Toast({ id, message, type = "success", duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const Icon = icons[type] || icons.success;
  const color = colors[type] || colors.success;

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className="pointer-events-auto relative overflow-hidden rounded-xl shadow-2xl"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        backdropFilter: "blur(16px)",
        transform: isVisible ? "translateX(0)" : "translateX(120%)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minWidth: "320px",
        maxWidth: "420px",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon size={20} style={{ color: color.text, flexShrink: 0 }} />
        <p className="text-sm font-medium flex-1" style={{ color: "#FFFFFF" }}>
          {message}
        </p>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "#8B8FA3" }}
        >
          <X size={16} />
        </button>
      </div>
      <div
        className="h-[2px] transition-none"
        style={{
          width: `${progress}%`,
          background: color.bar,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
