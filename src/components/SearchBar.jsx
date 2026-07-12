"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search users..." }) {
  const [localValue, setLocalValue] = useState(value || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(val);
    }, 350);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: "#8B8FA3" }}
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus:ring-2"
        style={{
          background: "rgba(26, 29, 39, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid #2A2D3A",
          color: "#FFFFFF",
          caretColor: "#6C63FF",
        }}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/10"
        >
          <X size={16} style={{ color: "#8B8FA3" }} />
        </button>
      )}
      <style jsx>{`
        input::placeholder {
          color: #5a5d6e;
        }
        input:focus {
          border-color: #6C63FF;
          --tw-ring-color: rgba(108, 99, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
