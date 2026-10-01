"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check login status via cookie (set by server)
    const cookies = document.cookie;
    if (!cookies.includes("isLoggedIn=true")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="pl-64">
        <Header onMenuClick={() => setIsOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
