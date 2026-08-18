"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <title>InfoX Admin</title>
        <meta name="description" content="InfoX Admin Panel — Manage users and monitor app statistics" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="min-h-full"
        style={{ background: "#090d16", fontFamily: "'Inter', sans-serif" }}
      >
        <AuthProvider>
          <ToastProvider>
            {isLoginPage ? (
              children
            ) : (
              <div className="flex min-h-screen">
                <Sidebar
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <main
                  className="flex-1 transition-all duration-300"
                  style={{ marginLeft: "0" }}
                >
                  <div className="lg:ml-[260px]">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
            )}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
