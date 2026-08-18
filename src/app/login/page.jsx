"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern"
      style={{ background: "#0f1117" }}
    >
      {/* Background gradient blobs */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(13,110,253,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div
        className="relative w-full max-w-md animate-fade-in"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden"
            style={{
              background: "rgba(13, 110, 253, 0.08)",
              boxShadow: "0 8px 30px rgba(0, 207, 255, 0.2), 0 0 0 1px rgba(13, 110, 253, 0.15)",
            }}
          >
            <Image
              src="/logo.png"
              alt="InfoX Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#FFFFFF" }}
          >
            InfoX Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B8FA3" }}>
            Sign in to access the admin panel
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(9, 13, 22, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid #1E2D45",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(255, 107, 107, 0.1)",
                  border: "1px solid rgba(255, 107, 107, 0.2)",
                  color: "#FF6B6B",
                }}
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: "#8B8FA3" }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "rgba(9, 13, 22, 0.9)",
                  border: "1px solid #1E2D45",
                  color: "#FFFFFF",
                  caretColor: "#0D6EFD",
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: "#8B8FA3" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    background: "rgba(9, 13, 22, 0.9)",
                    border: "1px solid #1E2D45",
                    color: "#FFFFFF",
                    caretColor: "#0D6EFD",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/10"
                >
                  {showPassword ? (
                    <EyeOff size={18} style={{ color: "#8B8FA3" }} />
                  ) : (
                    <Eye size={18} style={{ color: "#8B8FA3" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #0D6EFD, #0056d6)",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(13, 110, 253, 0.35)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "#5a5d6e" }}
        >
          InfoX Admin Panel • Authorized Access Only
        </p>
      </div>

      <style jsx>{`
        input::placeholder {
          color: #5a5d6e;
        }
        input:focus {
          border-color: #0D6EFD !important;
          --tw-ring-color: rgba(13, 110, 253, 0.2);
        }
      `}</style>
    </div>
  );
}
