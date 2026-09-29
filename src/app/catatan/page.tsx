"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import { Santri, Catatan } from "@/types";

export default function CatatanPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [catatanList, setCatatanList] = useState<Catatan[]>([]);
  const [filteredList, setFilteredList] = useState<Catatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatatan, setEditingCatatan] = useState<Catatan | null>(null);
  const [formData, setFormData] = useState({
    ID_Santri: "",
    Catatan: "",
    Tampil_Ke_Wali: true,
    ID_Guru: "GURU-001",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = catatanList.filter(
        (c) =>
          c.Catatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.ID_Santri.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(catatanList);
    }
  }, [searchQuery, catatanList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [santriRes, catatanRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/catatan"),
      ]);

      const santriResult = await santriRes.json();
      const catatanResult = await catatanRes.json();

      if (santriResult.success) {
        setSantriList(santriResult.data.filter((s: Santri) => s.Status === "Aktif"));
      }
      if (catatanResult.success) {
        setCatatanList(catatanResult.data);
        setFilteredList(catatanResult.data);
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
      const url = editingCatatan ? "/api/catatan" : "/api/catatan";
      const method = editingCatatan ? "PUT" : "POST";
      const body = editingCatatan
        ? { id: editingCatatan.ID_Catatan, data: formData }
        : { ...formData, Tanggal: new Date().toISOString().split("T")[0] };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingCatatan(null);
        setFormData({
          ID_Santri: "",
          Catatan: "",
          Tampil_Ke_Wali: true,
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

  const handleEdit = (catatan: Catatan) => {
    setEditingCatatan(catatan);
    setFormData({
      ID_Santri: catatan.ID_Santri,
      Catatan: catatan.Catatan,
      Tampil_Ke_Wali: catatan.Tampil_Ke_Wali,
      ID_Guru: catatan.ID_Guru,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch("/api/catatan", {
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
    setEditingCatatan(null);
    setFormData({
      ID_Santri: "",
      Catatan: "",
      Tampil_Ke_Wali: true,
      ID_Guru: "GURU-001",
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
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catatan Guru</h1>
            <p className="text-gray-500">Catatan untuk santri</p>
          </div>
          <Button onClick={openCreateModal} className="mt-4 sm:mt-0">
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
              placeholder="Cari catatan..."
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
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan catatan</p>
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
                        Catatan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tampil ke Wali
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredList.map((catatan) => {
                      const santri = santriList.find((s) => s.ID_Santri === catatan.ID_Santri);
                      return (
                        <tr key={catatan.ID_Catatan}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {santri?.Nama || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {catatan.Catatan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={catatan.Tampil_Ke_Wali ? "success" : "default"}>
                              {catatan.Tampil_Ke_Wali ? "Ya" : "Tidak"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(catatan)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDelete(catatan.ID_Catatan)}>
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
                {filteredList.map((catatan) => {
                  const santri = santriList.find((s) => s.ID_Santri === catatan.ID_Santri);
                  return (
                    <div key={catatan.ID_Catatan} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{santri?.Nama || "-"}</h3>
                          <p className="text-sm text-gray-500 mt-1">{catatan.Catatan}</p>
                        </div>
                        <Badge variant={catatan.Tampil_Ke_Wali ? "success" : "default"}>
                          {catatan.Tampil_Ke_Wali ? "Ya" : "Tidak"}
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(catatan)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(catatan.ID_Catatan)}>
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
            setEditingCatatan(null);
          }}
          title={editingCatatan ? "Edit Catatan" : "Tambah Catatan"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
              <select
                value={formData.ID_Santri}
                onChange={(e) => setFormData({ ...formData, ID_Santri: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={formData.Catatan}
                onChange={(e) => setFormData({ ...formData, Catatan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                rows={4}
                placeholder="Tulis catatan untuk santri..."
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tampilKeWali"
                checked={formData.Tampil_Ke_Wali}
                onChange={(e) => setFormData({ ...formData, Tampil_Ke_Wali: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="tampilKeWali" className="text-sm text-gray-700">
                Tampilkan ke Orang Tua/Wali
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCatatan(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving}>
                {editingCatatan ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
