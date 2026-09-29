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
import { Guru, GuruFormData } from "@/types";

const emptyForm: GuruFormData = {
  Nama: "",
  No_WA: "",
  Email: "",
  Status: "Aktif",
};

export default function GuruPage() {
  const router = useRouter();
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [filteredList, setFilteredList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [formData, setFormData] = useState<GuruFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGuru();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = guruList.filter(
        (g) =>
          g.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.No_WA.includes(searchQuery)
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(guruList);
    }
  }, [searchQuery, guruList]);

  const loadGuru = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/guru");
      const result = await res.json();
      if (result.success) {
        setGuruList(result.data);
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
      const url = "/api/guru";
      const method = editingGuru ? "PUT" : "POST";
      const body = editingGuru
        ? { id: editingGuru.ID_Guru, data: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingGuru(null);
        setFormData(emptyForm);
        loadGuru();
      } else {
        setError(result.error || "Gagal menyimpan data");
      }
    } catch {
      setError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({
      Nama: guru.Nama,
      No_WA: guru.No_WA,
      Email: guru.Email,
      Status: guru.Status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingGuru(null);
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Guru</h1>
            <p className="text-sm text-gray-500">Kelola data guru TPQ</p>
          </div>
          <Button onClick={openCreateModal} className="mt-3 sm:mt-0 w-full sm:w-auto">
            + Tambah Guru
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
              placeholder="Cari nama atau nomor WhatsApp..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan guru baru</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>No. WhatsApp</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredList.map((guru) => (
                      <TableRow key={guru.ID_Guru}>
                        <TableCell className="font-medium">{guru.Nama}</TableCell>
                        <TableCell>{guru.No_WA}</TableCell>
                        <TableCell>{guru.Email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={guru.Status === "Aktif" ? "success" : "default"}>
                            {guru.Status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(guru)}>
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
                {filteredList.map((guru) => (
                  <div key={guru.ID_Guru} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{guru.Nama}</h3>
                        <p className="text-sm text-gray-500">{guru.No_WA}</p>
                      </div>
                      <Badge variant={guru.Status === "Aktif" ? "success" : "default"}>
                        {guru.Status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(guru)}>
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
            setEditingGuru(null);
            setFormData(emptyForm);
          }}
          title={editingGuru ? "Edit Guru" : "Tambah Guru"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
              <input
                type="tel"
                value={formData.No_WA}
                onChange={(e) => setFormData({ ...formData, No_WA: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                  setEditingGuru(null);
                  setFormData(emptyForm);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving} className="w-full sm:w-auto">
                {editingGuru ? "Simpan Perubahan" : "Tambah Guru"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
