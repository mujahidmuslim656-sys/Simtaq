"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const YEARS = ["2024", "2025", "2026"];

const MODULES = [
  { id: "santri", name: "Santri" },
  { id: "guru", name: "Guru" },
  { id: "kelas", name: "Kelas" },
  { id: "absensi", name: "Absensi" },
  { id: "progress", name: "Perkembangan" },
  { id: "hafalan", name: "Hafalan" },
  { id: "catatan", name: "Catatan" },
  { id: "iuran", name: "Iuran" },
  { id: "pengumuman", name: "Pengumuman" },
];

export default function ExportPage() {
  const router = useRouter();
  const [selectedModules, setSelectedModules] = useState<string[]>(["santri", "absensi"]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tenantName, setTenantName] = useState("");

  useEffect(() => {
    const cookies = document.cookie;
    const match = cookies.match(/tenant_name=([^;]+)/);
    if (match) {
      setTenantName(decodeURIComponent(match[1]));
    }
  }, []);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedModules(MODULES.map((m) => m.id));
  };

  const deselectAll = () => {
    setSelectedModules([]);
  };

  const handleExportExcel = async () => {
    if (selectedModules.length === 0) {
      setError("Pilih minimal 1 modul untuk di-export");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);
      params.append("modules", selectedModules.join(","));

      const response = await fetch(`/api/export?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Gagal mengekspor data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tenantName || "TPQ"}_${month || "Semua"}_${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      setError("Gagal mengekspor data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // For PDF, we'll use the browser print functionality
    window.print();
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Export Data"
        subtitle={`Export data ${tenantName || "TPQ"} ke Excel atau PDF`}
      />

      <div className="max-w-2xl">
        <Card title="Pilih Modul">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={selectAll}>
                Pilih Semua
              </Button>
              <Button size="sm" variant="ghost" onClick={deselectAll}>
                Hapus Semua
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MODULES.map((mod) => (
                <label
                  key={mod.id}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.id)}
                    onChange={() => toggleModule(mod.id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{mod.name}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Periode (Opsional)">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bulan
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
              >
                <option value="">Semua Bulan</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tahun
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Kembali
          </Button>
          <Button
            variant="gold"
            onClick={handleExportExcel}
            loading={loading}
            className="flex-1"
          >
            Export Excel
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            File akan ter-download otomatis setelah klik Export
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
