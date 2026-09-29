"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Santri, Kelas, Absensi } from "@/types";

type AbsensiStatus = "Hadir" | "Izin" | "Sakit" | "Alpa";

interface AbsensiForm {
  santriId: string;
  nama: string;
  status: AbsensiStatus;
  catatan: string;
}

export default function AbsensiPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [absensiForm, setAbsensiForm] = useState<AbsensiForm[]>([]);
  const [existingAbsensi, setExistingAbsensi] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadKelas();
  }, []);

  useEffect(() => {
    if (selectedKelas) {
      loadSantri();
    }
  }, [selectedKelas]);

  useEffect(() => {
    if (selectedKelas && selectedTanggal) {
      loadExistingAbsensi();
    }
  }, [selectedKelas, selectedTanggal]);

  const loadKelas = async () => {
    try {
      const res = await fetch("/api/kelas");
      const result = await res.json();
      if (result.success) {
        setKelasList(result.data);
      }
    } catch {
      console.error("Gagal memuat kelas");
    }
  };

  const loadSantri = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/santri");
      const result = await res.json();
      if (result.success) {
        const filtered = result.data.filter(
          (s: Santri) => s.ID_Kelas === selectedKelas && s.Status === "Aktif"
        );
        setSantriList(filtered);

        // Inisialisasi form absensi
        const initialForm: AbsensiForm[] = filtered.map((s: Santri) => ({
          santriId: s.ID_Santri,
          nama: s.Nama,
          status: "Hadir" as AbsensiStatus,
          catatan: "",
        }));
        setAbsensiForm(initialForm);
      }
    } catch {
      console.error("Gagal memuat santri");
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAbsensi = async () => {
    try {
      const res = await fetch(
        `/api/absensi?kelasId=${selectedKelas}&tanggal=${selectedTanggal}`
      );
      const result = await res.json();
      if (result.success) {
        setExistingAbsensi(result.data);

        // Update form dengan data yang sudah ada
        setAbsensiForm((prev) =>
          prev.map((form) => {
            const existing = result.data.find(
              (a: Absensi) => a.ID_Santri === form.santriId
            );
            if (existing) {
              return {
                ...form,
                status: existing.Status as AbsensiStatus,
                catatan: existing.Catatan || "",
              };
            }
            return form;
          })
        );
      }
    } catch {
      console.error("Gagal memuat absensi");
    }
  };

  const handleStatusChange = (santriId: string, status: AbsensiStatus) => {
    setAbsensiForm((prev) =>
      prev.map((form) =>
        form.santriId === santriId ? { ...form, status } : form
      )
    );
  };

  const handleCatatanChange = (santriId: string, catatan: string) => {
    setAbsensiForm((prev) =>
      prev.map((form) =>
        form.santriId === santriId ? { ...form, catatan } : form
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const absensiList = absensiForm.map((form) => ({
        Tanggal: selectedTanggal,
        ID_Santri: form.santriId,
        ID_Kelas: selectedKelas,
        Status: form.status,
        ID_Guru: "GURU-001", // TODO: Get from logged in user
        Catatan: form.catatan,
      }));

      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ absensiList }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Absensi berhasil disimpan!");
        loadExistingAbsensi();
      } else {
        setMessage(result.error || "Gagal menyimpan absensi");
      }
    } catch {
      setMessage("Gagal menyimpan absensi. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: AbsensiStatus) => {
    switch (status) {
      case "Hadir":
        return "success";
      case "Izin":
        return "warning";
      case "Sakit":
        return "info";
      case "Alpa":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Absensi</h1>
          <p className="text-gray-500">Catat kehadiran santri</p>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg mb-4 ${
              message.includes("berhasil")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.ID_Kelas} value={kelas.ID_Kelas}>
                    {kelas.Nama_Kelas}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Memuat data...</p>
            </div>
          ) : selectedKelas && santriList.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {absensiForm.map((form) => (
                      <tr key={form.santriId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {form.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {(["Hadir", "Izin", "Sakit", "Alpa"] as AbsensiStatus[]).map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(form.santriId, status)
                                  }
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    form.status === status
                                      ? status === "Hadir"
                                        ? "bg-green-100 text-green-800 ring-2 ring-green-500"
                                        : status === "Izin"
                                        ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500"
                                        : status === "Sakit"
                                        ? "bg-blue-100 text-blue-800 ring-2 ring-blue-500"
                                        : "bg-red-100 text-red-800 ring-2 ring-red-500"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  {status}
                                </button>
                              )
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={form.catatan}
                            onChange={(e) =>
                              handleCatatanChange(form.santriId, e.target.value)
                            }
                            placeholder="Catatan (opsional)"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {absensiForm.map((form) => (
                  <div
                    key={form.santriId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-gray-900 mb-3">{form.nama}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(["Hadir", "Izin", "Sakit", "Alpa"] as AbsensiStatus[]).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(form.santriId, status)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              form.status === status
                                ? status === "Hadir"
                                  ? "bg-green-100 text-green-800 ring-2 ring-green-500"
                                  : status === "Izin"
                                  ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500"
                                  : status === "Sakit"
                                  ? "bg-blue-100 text-blue-800 ring-2 ring-blue-500"
                                  : "bg-red-100 text-red-800 ring-2 ring-red-500"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                    <input
                      type="text"
                      value={form.catatan}
                      onChange={(e) =>
                        handleCatatanChange(form.santriId, e.target.value)
                      }
                      placeholder="Catatan (opsional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} loading={saving}>
                  Simpan Absensi
                </Button>
              </div>
            </>
          ) : selectedKelas ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada santri aktif di kelas ini</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Pilih kelas dan tanggal untuk mulai</p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
