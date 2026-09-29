"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">TPQ Digital</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userRole");
              router.push("/login");
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
