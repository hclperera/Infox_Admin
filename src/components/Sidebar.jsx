"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, X, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl transition-all duration-200 hover:scale-105"
        style={{
          background: "rgba(9, 13, 22, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid #1E2D45",
        }}
      >
        {isOpen ? (
          <X size={22} color="#FFFFFF" />
        ) : (
          <Menu size={22} color="#FFFFFF" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          background: "rgba(9, 13, 22, 0.92)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid #1E2D45",
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(13, 110, 253, 0.08)",
                boxShadow: "0 0 16px rgba(0, 207, 255, 0.15)",
              }}
            >
              <Image
                src="/logo.png"
                alt="InfoX Logo"
                width={40}
                height={40}
                className="object-contain"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
                InfoX
              </h1>
              <p className="text-xs" style={{ color: "#8B9AB5" }}>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: isActive
                    ? "rgba(13, 110, 253, 0.12)"
                    : "transparent",
                  color: isActive ? "#00CFFF" : "#8B9AB5",
                  borderLeft: isActive
                    ? "3px solid #0D6EFD"
                    : "3px solid transparent",
                }}
              >
                <item.icon
                  size={20}
                  className="transition-colors duration-200"
                  style={{
                    color: isActive ? "#00CFFF" : "#8B9AB5",
                  }}
                />
                <span className="group-hover:text-white transition-colors duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            style={{ color: "#FF6B6B" }}
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-[-2px] transition-transform duration-200"
            />
            <span className="group-hover:opacity-80 transition-opacity duration-200">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
