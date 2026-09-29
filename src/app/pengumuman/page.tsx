"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import { Pengumuman } from "@/types";

export default function PengumumanPage() {
  const router = useRouter();
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [filteredList, setFilteredList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(null);
  const [formData, setFormData] = useState({
    Judul: "",
    Isi: "",
    Tanggal_Publish: "",
    Tanggal_Expired: "",
    Status: "Aktif",
    Created_By: "Admin",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = pengumumanList.filter(
        (p) =>
          p.Judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.Isi.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(pengumumanList);
    }
  }, [searchQuery, pengumumanList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pengumuman");
      const result = await res.json();

      if (result.success) {
        setPengumumanList(result.data);
        setFilteredList(result.data);
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
      const url = editingPengumuman ? "/api/pengumuman" : "/api/pengumuman";
      const method = editingPengumuman ? "PUT" : "POST";
      const body = editingPengumuman
        ? { id: editingPengumuman.ID_Pengumuman, data: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingPengumuman(null);
        setFormData({
          Judul: "",
          Isi: "",
          Tanggal_Publish: "",
          Tanggal_Expired: "",
          Status: "Aktif",
          Created_By: "Admin",
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

  const handleEdit = (pengumuman: Pengumuman) => {
    setEditingPengumuman(pengumuman);
    setFormData({
      Judul: pengumuman.Judul,
      Isi: pengumuman.Isi,
      Tanggal_Publish: pengumuman.Tanggal_Publish,
      Tanggal_Expired: pengumuman.Tanggal_Expired,
      Status: pengumuman.Status,
      Created_By: pengumuman.Created_By,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch("/api/pengumuman", {
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

  const toggleStatus = async (pengumuman: Pengumuman) => {
    try {
      const newStatus = pengumuman.Status === "Aktif" ? "Nonaktif" : "Aktif";
      const res = await fetch("/api/pengumuman", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pengumuman.ID_Pengumuman,
          data: { Status: newStatus },
        }),
      });

      const result = await res.json();
      if (result.success) {
        loadData();
      }
    } catch {
      setError("Gagal mengubah status");
    }
  };

  const openCreateModal = () => {
    setEditingPengumuman(null);
    setFormData({
      Judul: "",
      Isi: "",
      Tanggal_Publish: new Date().toISOString().split("T")[0],
      Tanggal_Expired: "",
      Status: "Aktif",
      Created_By: "Admin",
    });
    setIsModalOpen(true);
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pengumuman</h1>
            <p className="text-sm text-gray-500">Kelola pengumuman TPQ</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Pengumuman
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
              placeholder="Cari judul atau isi pengumuman..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan pengumuman</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Judul
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
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
                    {filteredList.map((pengumuman) => (
                      <tr key={pengumuman.ID_Pengumuman}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{pengumuman.Judul}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{pengumuman.Isi}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pengumuman.Tanggal_Publish} - {pengumuman.Tanggal_Expired}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={pengumuman.Status === "Aktif" ? "success" : "default"}>
                            {pengumuman.Status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(pengumuman)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => toggleStatus(pengumuman)}>
                              {pengumuman.Status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(pengumuman.ID_Pengumuman)}>
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredList.map((pengumuman) => (
                  <div key={pengumuman.ID_Pengumuman} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{pengumuman.Judul}</h3>
                        <p className="text-sm text-gray-500 mt-1">{pengumuman.Isi}</p>
                      </div>
                      <Badge variant={pengumuman.Status === "Aktif" ? "success" : "default"}>
                        {pengumuman.Status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Periode: {pengumuman.Tanggal_Publish} - {pengumuman.Tanggal_Expired}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(pengumuman)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleStatus(pengumuman)}>
                        {pengumuman.Status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(pengumuman.ID_Pengumuman)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Modal Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPengumuman(null);
          }}
          title={editingPengumuman ? "Edit Pengumuman" : "Tambah Pengumuman"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                value={formData.Judul}
                onChange={(e) => setFormData({ ...formData, Judul: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Judul pengumuman"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
              <textarea
                value={formData.Isi}
                onChange={(e) => setFormData({ ...formData, Isi: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                rows={4}
                placeholder="Isi pengumuman..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish</label>
                <input
                  type="date"
                  value={formData.Tanggal_Publish}
                  onChange={(e) => setFormData({ ...formData, Tanggal_Publish: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={formData.Tanggal_Expired}
                  onChange={(e) => setFormData({ ...formData, Tanggal_Expired: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPengumuman(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingPengumuman ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
