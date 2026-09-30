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
import { Santri, SantriFormData } from "@/types";

const emptyForm: SantriFormData = {
  NIS: "",
  Nama: "",
  Jenis_Kelamin: "L",
  Tanggal_Lahir: "",
  Nama_Wali: "",
  No_WA: "",
  ID_Kelas: "",
  Status: "Aktif",
};

export default function SantriPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [filteredList, setFilteredList] = useState<Santri[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [formData, setFormData] = useState<SantriFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSantri();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = santriList.filter(
        (s) =>
          s.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.NIS.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.Nama_Wali.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(santriList);
    }
  }, [searchQuery, santriList]);

  const loadSantri = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/santri");
      const result = await res.json();
      if (result.success) {
        setSantriList(result.data);
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
      const url = editingSantri ? "/api/santri" : "/api/santri";
      const method = editingSantri ? "PUT" : "POST";
      const body = editingSantri
        ? { id: editingSantri.ID_Santri, data: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingSantri(null);
        setFormData(emptyForm);
        loadSantri();
      } else {
        setError(result.error || "Gagal menyimpan data");
      }
    } catch {
      setError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (santri: Santri) => {
    setEditingSantri(santri);
    setFormData({
      NIS: santri.NIS,
      Nama: santri.Nama,
      Jenis_Kelamin: santri.Jenis_Kelamin,
      Tanggal_Lahir: santri.Tanggal_Lahir,
      Nama_Wali: santri.Nama_Wali,
      No_WA: santri.No_WA,
      ID_Kelas: santri.ID_Kelas,
      Status: santri.Status,
    });
    setIsModalOpen(true);
  };

  const handleDeactivate = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan santri ini?")) {
      try {
        const res = await fetch("/api/santri", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const result = await res.json();
        if (result.success) {
          loadSantri();
        } else {
          setError(result.error || "Gagal menonaktifkan santri");
        }
      } catch {
        setError("Gagal menonaktifkan santri. Silakan coba lagi.");
      }
    }
  };

  const openCreateModal = () => {
    setEditingSantri(null);
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Santri</h1>
            <p className="text-sm text-gray-500">Kelola data santri TPQ</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Santri
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
              placeholder="Cari nama, NIS, atau nama wali..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan santri baru</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>L/P</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredList.map((santri, index) => (
                      <TableRow key={santri.ID_Santri || `santri-${index}`}>
                        <TableCell>{santri.NIS}</TableCell>
                        <TableCell className="font-medium">{santri.Nama}</TableCell>
                        <TableCell>{santri.Jenis_Kelamin}</TableCell>
                        <TableCell>{santri.ID_Kelas || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={santri.Status === "Aktif" ? "success" : "default"}>
                            {santri.Status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(santri)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDeactivate(santri.ID_Santri)}>
                              Nonaktifkan
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredList.map((santri, index) => (
                  <div key={santri.ID_Santri || `santri-mobile-${index}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{santri.Nama}</h3>
                        <p className="text-sm text-gray-500">NIS: {santri.NIS}</p>
                      </div>
                      <Badge variant={santri.Status === "Aktif" ? "success" : "default"}>
                        {santri.Status}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Kelas: {santri.ID_Kelas || "-"}</p>
                      <p>Wali: {santri.Nama_Wali}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(santri)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeactivate(santri.ID_Santri)}>
                        Nonaktifkan
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
            setEditingSantri(null);
            setFormData(emptyForm);
          }}
          title={editingSantri ? "Edit Santri" : "Tambah Santri"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                <input
                  type="text"
                  value={formData.NIS}
                  onChange={(e) => setFormData({ ...formData, NIS: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.Nama}
                  onChange={(e) => setFormData({ ...formData, Nama: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.Jenis_Kelamin}
                  onChange={(e) => setFormData({ ...formData, Jenis_Kelamin: e.target.value as "L" | "P" })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.Tanggal_Lahir}
                  onChange={(e) => setFormData({ ...formData, Tanggal_Lahir: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wali</label>
                <input
                  type="text"
                  value={formData.Nama_Wali}
                  onChange={(e) => setFormData({ ...formData, Nama_Wali: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={formData.No_WA}
                  onChange={(e) => setFormData({ ...formData, No_WA: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <input
                  type="text"
                  value={formData.ID_Kelas}
                  onChange={(e) => setFormData({ ...formData, ID_Kelas: e.target.value })}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Contoh: KLS-001"
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
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSantri(null);
                  setFormData(emptyForm);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingSantri ? "Simpan Perubahan" : "Tambah Santri"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
