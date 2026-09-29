"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import { Santri, Progress } from "@/types";

const KATEGORI_OPTIONS = ["Bacaan", "Tajwid", "Makhraj", "Kelancaran", "Adab", "Lainnya"];
const STATUS_OPTIONS = ["Perlu Bimbingan", "Berkembang", "Baik"];

export default function PerkembanganPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [filteredList, setFilteredList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null);
  const [formData, setFormData] = useState({
    ID_Santri: "",
    Kategori: "Bacaan",
    Materi: "",
    Status: "Berkembang",
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
      const filtered = progressList.filter(
        (p) =>
          p.Materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.Kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.Catatan.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(progressList);
    }
  }, [searchQuery, progressList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [santriRes, progressRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/progress"),
      ]);

      const santriResult = await santriRes.json();
      const progressResult = await progressRes.json();

      if (santriResult.success) {
        setSantriList(santriResult.data.filter((s: Santri) => s.Status === "Aktif"));
      }
      if (progressResult.success) {
        setProgressList(progressResult.data);
        setFilteredList(progressResult.data);
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
      const url = editingProgress ? "/api/progress" : "/api/progress";
      const method = editingProgress ? "PUT" : "POST";
      const body = editingProgress
        ? { id: editingProgress.ID_Progress, data: formData }
        : { ...formData, Tanggal: new Date().toISOString().split("T")[0] };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingProgress(null);
        setFormData({
          ID_Santri: "",
          Kategori: "Bacaan",
          Materi: "",
          Status: "Berkembang",
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

  const handleEdit = (progress: Progress) => {
    setEditingProgress(progress);
    setFormData({
      ID_Santri: progress.ID_Santri,
      Kategori: progress.Kategori,
      Materi: progress.Materi,
      Status: progress.Status,
      Catatan: progress.Catatan,
      ID_Guru: progress.ID_Guru,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch("/api/progress", {
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
    setEditingProgress(null);
    setFormData({
      ID_Santri: "",
      Kategori: "Bacaan",
      Materi: "",
      Status: "Berkembang",
      Catatan: "",
      ID_Guru: "GURU-001",
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Baik":
        return "success";
      case "Berkembang":
        return "info";
      case "Perlu Bimbingan":
        return "warning";
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Perkembangan Mengaji</h1>
            <p className="text-sm text-gray-500">Catat perkembangan belajar santri</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Catatan
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
              placeholder="Cari materi, kategori, atau catatan..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan catatan perkembangan</p>
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
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Materi
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
                    {filteredList.map((progress) => {
                      const santri = santriList.find((s) => s.ID_Santri === progress.ID_Santri);
                      return (
                        <tr key={progress.ID_Progress}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {santri?.Nama || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {progress.Kategori}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {progress.Materi}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusColor(progress.Status)}>
                              {progress.Status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(progress)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDelete(progress.ID_Progress)}>
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
                {filteredList.map((progress) => {
                  const santri = santriList.find((s) => s.ID_Santri === progress.ID_Santri);
                  return (
                    <div key={progress.ID_Progress} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{santri?.Nama || "-"}</h3>
                          <p className="text-sm text-gray-500">{progress.Kategori}</p>
                        </div>
                        <Badge variant={getStatusColor(progress.Status)}>
                          {progress.Status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Materi: {progress.Materi}</p>
                        {progress.Catatan && <p>Catatan: {progress.Catatan}</p>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(progress)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(progress.ID_Progress)}>
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
            setEditingProgress(null);
          }}
          title={editingProgress ? "Edit Perkembangan" : "Tambah Perkembangan"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.Kategori}
                onChange={(e) => setFormData({ ...formData, Kategori: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {KATEGORI_OPTIONS.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
              <input
                type="text"
                value={formData.Materi}
                onChange={(e) => setFormData({ ...formData, Materi: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Contoh: Iqra Jilid 2 halaman 15"
                required
              />
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
                placeholder="Catatan perkembangan..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProgress(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingProgress ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
