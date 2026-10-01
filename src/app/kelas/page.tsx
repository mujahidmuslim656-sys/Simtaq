"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
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
  const [formData, setFormData] = useState<KelasFormData>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadKelas();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = kelasList.filter(
        (k) =>
          k.Nama_Kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.Hari.toLowerCase().includes(searchQuery.toLowerCase())
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
      const data = await res.json();
      if (data.success) {
        setKelasList(data.data || []);
        setFilteredList(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load kelas:", err);
      setError("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingKelas ? `/api/kelas/${editingKelas.ID_Kelas}` : "/api/kelas";
      const method = editingKelas ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingKelas(null);
        setFormData(emptyForm);
        loadKelas();
      } else {
        setError(data.message || "Gagal menyimpan data");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (kelas: Kelas) => {
    setEditingKelas(kelas);
    setFormData({
      Nama_Kelas: kelas.Nama_Kelas || "",
      ID_Guru: kelas.ID_Guru || "",
      Hari: kelas.Hari || "",
      Jam: kelas.Jam || "",
      Status: kelas.Status || "Aktif",
    });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Data Kelas"
        subtitle="Kelola kelas dan jadwal TPQ"
        action={
          <Button variant="gold" onClick={() => { setEditingKelas(null); setFormData(emptyForm); setIsModalOpen(true); }}>
            + Tambah Kelas
          </Button>
        }
      />

      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari kelas (nama atau hari)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>

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
            {filteredList.map((kelas, index) => (
              <TableRow key={kelas.ID_Kelas || `kelas-${index}`}>
                <TableCell className="font-medium">{kelas.Nama_Kelas}</TableCell>
                <TableCell>{kelas.ID_Guru || "-"}</TableCell>
                <TableCell>{kelas.Hari || "-"}</TableCell>
                <TableCell>{kelas.Jam || "-"}</TableCell>
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

      <div className="md:hidden space-y-4">
        {filteredList.map((kelas, index) => (
          <div key={kelas.ID_Kelas || `kelas-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{kelas.Nama_Kelas}</h3>
              <Badge variant={kelas.Status === "Aktif" ? "success" : "default"}>
                {kelas.Status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Guru: {kelas.ID_Guru || "-"}</p>
            <p className="text-sm text-gray-600">Jadwal: {kelas.Hari || "-"} {kelas.Jam || ""}</p>
            <Button size="sm" variant="secondary" className="w-full mt-3" onClick={() => handleEdit(kelas)}>
              Edit
            </Button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Memuat data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {filteredList.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada data kelas</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingKelas(null); }}
        title={editingKelas ? "Edit Kelas" : "Tambah Kelas"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Kelas" value={formData.Nama_Kelas} onChange={(e) => setFormData({ ...formData, Nama_Kelas: e.target.value })} required />
          <Input label="ID Guru" value={formData.ID_Guru} onChange={(e) => setFormData({ ...formData, ID_Guru: e.target.value })} />
          <Input label="Hari" value={formData.Hari} onChange={(e) => setFormData({ ...formData, Hari: e.target.value })} />
          <Input label="Jam" value={formData.Jam} onChange={(e) => setFormData({ ...formData, Jam: e.target.value })} />
          <Select label="Status" value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </Select>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingKelas(null); }}>
              Batal
            </Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingKelas ? "Simpan Perubahan" : "Tambah Kelas"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
