"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenantLayout from "@/components/layout/TenantLayout";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IslamicPattern from "@/components/IslamicPattern";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSantri: 0,
    totalGuru: 0,
    totalKelas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tenantName, setTenantName] = useState("");
  const [santriList, setSantriList] = useState<{ Jenis_Kelamin?: string; Status?: string; ID_Kelas?: string }[]>([]);
  const [kelasList, setKelasList] = useState<{ ID_Kelas?: string; Nama_Kelas?: string }[]>([]);
  const [iuranStats, setIuranStats] = useState<{ totalTagihan: number; totalPembayaran: number; totalTunggakan: number } | null>(null);
  const [paket, setPaket] = useState("free");

  useEffect(() => {
    // Read tenant_name from cookie
    const cookies = document.cookie;
    const match = cookies.match(/tenant_name=([^;]+)/);
    if (match) {
      setTenantName(decodeURIComponent(match[1]));
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [santriRes, guruRes, kelasRes, iuranRes, subRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/guru"),
        fetch("/api/kelas"),
        fetch("/api/iuran?stats=true"),
        fetch("/api/subscription"),
      ]);

      const santriData = await santriRes.json();
      const guruData = await guruRes.json();
      const kelasData = await kelasRes.json();
      const iuranData = await iuranRes.json();
      const subData = await subRes.json();
      const tenantRes = await fetch("/api/tenant/me");
      const tenantData = await tenantRes.json();
      // Paket dari profil tenant adalah sumber utama, fallback ke subscription
      if (tenantData.success && tenantData.data?.Paket) {
        setPaket(tenantData.data.Paket);
      } else if (subData.success && subData.data?.Paket) {
        setPaket(subData.data.Paket);
      }

      setStats({
        totalSantri: santriData.data?.filter((s: { Status: string }) => s.Status === "Aktif").length || 0,
        totalGuru: guruData.data?.length || 0,
        totalKelas: kelasData.data?.length || 0,
      });
      setSantriList(santriData.data || []);
      setKelasList(kelasData.data || []);
      setIuranStats(iuranData.success ? iuranData.data : null);
    } catch (error) {
      console.error("Failed to load stats:", error);
      setStats({ totalSantri: 0, totalGuru: 0, totalKelas: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
        <IslamicPattern variant="light" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Selamat Datang di {tenantName || "Simtaq"}
          </h1>
          <p className="text-primary-200 text-sm md:text-base">Kelola data TPQ Anda secara digital dan terpusat</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="Total Santri Aktif"
          value={stats.totalSantri}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Guru"
          value={stats.totalGuru}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Kelas"
          value={stats.totalKelas}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <DashboardCharts santri={santriList} kelas={kelasList} iuranStats={iuranStats} />

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/santri")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Santri</h3>
                <p className="text-sm text-gray-500">Kelola data santri</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/guru")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Guru</h3>
                <p className="text-sm text-gray-500">Kelola data guru</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/kelas")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Kelas</h3>
                <p className="text-sm text-gray-500">Kelola data kelas</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/absensi")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Absensi</h3>
                <p className="text-sm text-gray-500">Catat kehadiran</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/hafalan")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold-50 rounded-xl text-gold-600 group-hover:bg-gold-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.32.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.32.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hafalan</h3>
                <p className="text-sm text-gray-500">Tracking hafalan</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/iuran")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Iuran</h3>
                <p className="text-sm text-gray-500">Kelola pembayaran</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/export")}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-500">Export ke Excel</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Subscription Info */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Paket Langganan</h3>
            <p className="text-sm text-gray-500 mt-1">
              Anda sedang menggunakan paket <span className="capitalize font-medium">{paket}</span>
            </p>
          </div>
          {paket === "pro" ? (
            <span className="px-3 py-1.5 text-sm font-medium bg-gold-100 text-gold-700 rounded-lg">Paket Aktif</span>
          ) : (
            <Button variant="gold" onClick={() => router.push("/upgrade")}>
              Upgrade ke Pro
            </Button>
          )}
        </div>
      </Card>
    </TenantLayout>
  );
}
