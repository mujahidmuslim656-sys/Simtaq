"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Kelas, KelasFormData } from "@/types";

const emptyForm: KelasFormData = {
  Nama_Kelas: "",
  ID_Guru: "",
  Hari: "",
  Jam: "",
  Status: "Aktif",
};

export default function KelasPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [filteredList, setFilteredList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [formData, setFormData] = useState<KelasFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadKelas();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = kelasList.filter((k) =>
        k.Nama_Kelas.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(kelasList);
    }
  }, [searchQuery, kelasList]);

  const loadKelas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kelas");
      const result = await res.json();
      if (result.success) {
        setKelasList(result.data);
        setFilteredList(result.data);
      } else {
        setError(result.error || "Gagal memuat data");
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
      const url = "/api/kelas";
      const method = editingKelas ? "PUT" : "POST";
      const body = editingKelas
        ? { id: editingKelas.ID_Kelas, data: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingKelas(null);
        setFormData(emptyForm);
        loadKelas();
      } else {
        setError(result.error || "Gagal menyimpan data");
      }
    } catch {
      setError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (kelas: Kelas) => {
    setEditingKelas(kelas);
    setFormData({
      Nama_Kelas: kelas.Nama_Kelas,
      ID_Guru: kelas.ID_Guru,
      Hari: kelas.Hari,
      Jam: kelas.Jam,
      Status: kelas.Status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingKelas(null);
    setFormData(emptyForm);
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Kelas</h1>
            <p className="text-sm text-gray-500">Kelola data kelas TPQ</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Kelas
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
              placeholder="Cari nama kelas..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan kelas baru</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Kelas</TableHead>
                      <TableHead>Guru</TableHead>
                      <TableHead>Hari</TableHead>
                      <TableHead>Jam</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredList.map((kelas) => (
                      <TableRow key={kelas.ID_Kelas}>
                        <TableCell className="font-medium">{kelas.Nama_Kelas}</TableCell>
                        <TableCell>{kelas.ID_Guru}</TableCell>
                        <TableCell>{kelas.Hari}</TableCell>
                        <TableCell>{kelas.Jam}</TableCell>
                        <TableCell>
                          <Badge variant={kelas.Status === "Aktif" ? "success" : "default"}>
                            {kelas.Status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(kelas)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredList.map((kelas) => (
                  <div key={kelas.ID_Kelas} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{kelas.Nama_Kelas}</h3>
                        <p className="text-sm text-gray-500">{kelas.Hari} - {kelas.Jam}</p>
                      </div>
                      <Badge variant={kelas.Status === "Aktif" ? "success" : "default"}>
                        {kelas.Status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(kelas)}>
                        Edit
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
            setEditingKelas(null);
            setFormData(emptyForm);
          }}
          title={editingKelas ? "Edit Kelas" : "Tambah Kelas"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
              <input
                type="text"
                value={formData.Nama_Kelas}
                onChange={(e) => setFormData({ ...formData, Nama_Kelas: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Guru</label>
              <input
                type="text"
                value={formData.ID_Guru}
                onChange={(e) => setFormData({ ...formData, ID_Guru: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Contoh: GURU-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
              <select
                value={formData.Hari}
                onChange={(e) => setFormData({ ...formData, Hari: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              >
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
              <input
                type="time"
                value={formData.Jam}
                onChange={(e) => setFormData({ ...formData, Jam: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value as "Aktif" | "Nonaktif" })}
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
                  setEditingKelas(null);
                  setFormData(emptyForm);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingKelas ? "Simpan Perubahan" : "Tambah Kelas"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
