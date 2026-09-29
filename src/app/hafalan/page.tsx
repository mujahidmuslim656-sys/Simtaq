"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import { Santri, Hafalan } from "@/types";

const SURAH_OPTIONS = [
  "Al-Fatihah",
  "An-Nas",
  "Al-Falaq",
  "Al-Ikhlas",
  "Al-Lahab",
  "An-Nasr",
  "Al-Kautsar",
  "Al-Asr",
  "Al-Fil",
  "Quraish",
  "Al-Ma'un",
  "Al-Humazah",
];

const STATUS_OPTIONS = ["Belum", "Berkembang", "Lancar", "Perlu Murojaah"];

export default function HafalanPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [hafalanList, setHafalanList] = useState<Hafalan[]>([]);
  const [filteredList, setFilteredList] = useState<Hafalan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHafalan, setEditingHafalan] = useState<Hafalan | null>(null);
  const [formData, setFormData] = useState({
    ID_Santri: "",
    Surah: "Al-Fatihah",
    Status: "Belum",
    Catatan: "",
    ID_Guru: "GURU-001",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hafalanList.filter(
        (h) =>
          h.Surah.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.Catatan.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(hafalanList);
    }
  }, [searchQuery, hafalanList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [santriRes, hafalanRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/hafalan"),
      ]);

      const santriResult = await santriRes.json();
      const hafalanResult = await hafalanRes.json();

      if (santriResult.success) {
        setSantriList(santriResult.data.filter((s: Santri) => s.Status === "Aktif"));
      }
      if (hafalanResult.success) {
        setHafalanList(hafalanResult.data);
        setFilteredList(hafalanResult.data);
      }
    } catch {
      setError("Data belum dapat dimuat. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingHafalan ? "/api/hafalan" : "/api/hafalan";
      const method = editingHafalan ? "PUT" : "POST";
      const body = editingHafalan
        ? { id: editingHafalan.ID_Hafalan, data: formData }
        : { ...formData, Tanggal: new Date().toISOString().split("T")[0] };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingHafalan(null);
        setFormData({
          ID_Santri: "",
          Surah: "Al-Fatihah",
          Status: "Belum",
          Catatan: "",
          ID_Guru: "GURU-001",
        });
        loadData();
      } else {
        setError(result.error || "Gagal menyimpan data");
      }
    } catch {
      setError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (hafalan: Hafalan) => {
    setEditingHafalan(hafalan);
    setFormData({
      ID_Santri: hafalan.ID_Santri,
      Surah: hafalan.Surah,
      Status: hafalan.Status,
      Catatan: hafalan.Catatan,
      ID_Guru: hafalan.ID_Guru,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch("/api/hafalan", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const result = await res.json();
        if (result.success) {
          loadData();
        } else {
          setError(result.error || "Gagal menghapus data");
        }
      } catch {
        setError("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  const openCreateModal = () => {
    setEditingHafalan(null);
    setFormData({
      ID_Santri: "",
      Surah: "Al-Fatihah",
      Status: "Belum",
      Catatan: "",
      ID_Guru: "GURU-001",
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lancar":
        return "success";
      case "Berkembang":
        return "info";
      case "Perlu Murojaah":
        return "warning";
      case "Belum":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Hafalan</h1>
            <p className="text-sm text-gray-500">Catat hafalan santri</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Hafalan
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <Card>
          <div className="mb-4">
            <SearchInput
              placeholder="Cari surah atau catatan..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.32.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.32.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan hafalan</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Santri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Surah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredList.map((hafalan) => {
                      const santri = santriList.find((s) => s.ID_Santri === hafalan.ID_Santri);
                      return (
                        <tr key={hafalan.ID_Hafalan}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {santri?.Nama || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {hafalan.Surah}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusColor(hafalan.Status)}>
                              {hafalan.Status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(hafalan)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDelete(hafalan.ID_Hafalan)}>
                                Hapus
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredList.map((hafalan) => {
                  const santri = santriList.find((s) => s.ID_Santri === hafalan.ID_Santri);
                  return (
                    <div key={hafalan.ID_Hafalan} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{santri?.Nama || "-"}</h3>
                          <p className="text-sm text-gray-500">{hafalan.Surah}</p>
                        </div>
                        <Badge variant={getStatusColor(hafalan.Status)}>
                          {hafalan.Status}
                        </Badge>
                      </div>
                      {hafalan.Catatan && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Catatan: {hafalan.Catatan}</p>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(hafalan)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(hafalan.ID_Hafalan)}>
                          Hapus
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        {/* Modal Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHafalan(null);
          }}
          title={editingHafalan ? "Edit Hafalan" : "Tambah Hafalan"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
              <select
                value={formData.ID_Santri}
                onChange={(e) => setFormData({ ...formData, ID_Santri: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              >
                <option value="">Pilih Santri</option>
                {santriList.map((santri) => (
                  <option key={santri.ID_Santri} value={santri.ID_Santri}>
                    {santri.Nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surah</label>
              <select
                value={formData.Surah}
                onChange={(e) => setFormData({ ...formData, Surah: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {SURAH_OPTIONS.map((surah) => (
                  <option key={surah} value={surah}>
                    {surah}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={formData.Catatan}
                onChange={(e) => setFormData({ ...formData, Catatan: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                rows={3}
                placeholder="Catatan hafalan..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingHafalan(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingHafalan ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
