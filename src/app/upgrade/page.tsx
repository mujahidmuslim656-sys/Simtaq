"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import IslamicPattern from "@/components/IslamicPattern";

export default function UpgradePage() {
  const router = useRouter();
  const [tenant, setTenant] = useState<{ tenant_id: string; nama_tpq: string; paket: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Cek login status
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "", password: "" }),
        });
        // Jika tidak redirect, berarti sudah login
        const cookies = document.cookie;
        if (!cookies.includes("isLoggedIn=true")) {
          router.push("/login");
          return;
        }

        // Ambil tenant_id dari cookie
        const tenantIdMatch = cookies.match(/tenant_id=([^;]+)/);
        if (tenantIdMatch) {
          setTenant({
            tenant_id: tenantIdMatch[1],
            nama_tpq: "",
            paket: "free",
          });
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleUpgrade = async () => {
    if (!tenant) return;

    setUpgrading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenant.tenant_id,
          paket: "pro",
          harga: 49000,
          bukti_transfer: "", // TODO: Implement file upload
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Pembayaran berhasil dibuat! Admin akan memverifikasi dalam 1x24 jam.");
      } else {
        setError(data.message || "Gagal membuat pembayaran");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 relative">
      <IslamicPattern variant="dark" />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Upgrade paket Anda untuk fitur lebih lengkap
          </p>
        </div>

        {/* Upgrade Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6">
            Upgrade ke Paket Pro
          </h2>

          {/* Current Plan */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paket Saat Ini</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{tenant?.paket || "Free"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Limit Santri</p>
                <p className="text-lg font-semibold text-gray-900">{tenant?.paket === "pro" ? "100" : "10"}</p>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-gold-400 rounded-xl p-6 mb-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                REKOMENDASI
              </span>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Paket Pro</h3>
              <div className="flex items-baseline justify-center gap-1 mt-2">
                <span className="text-4xl font-bold text-primary-600">Rp 49.000</span>
                <span className="text-gray-500">/bulan</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">100 santri</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">20 guru</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">5 kelas</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Semua fitur dasar</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Prioritas support</span>
              </li>
            </ul>

            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gold-800">
                <strong>Cara Pembayaran:</strong> Transfer ke rekening BCA 1234567890 a.n. TPQ Digital, lalu upload bukti transfer.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {upgrading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Upgrade Sekarang"
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            <a href="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              Kembali ke Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
