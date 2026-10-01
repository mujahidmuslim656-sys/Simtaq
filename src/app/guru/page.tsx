"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenantLayout from "@/components/layout/TenantLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
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
  const [formData, setFormData] = useState<GuruFormData>({ ...emptyForm });
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
          g.Email.toLowerCase().includes(searchQuery.toLowerCase())
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
      const data = await res.json();
      if (data.success) {
        setGuruList(data.data || []);
        setFilteredList(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load guru:", err);
      setError("Gagal memuat data guru");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingGuru ? `/api/guru/${editingGuru.ID_Guru}` : "/api/guru";
      const method = editingGuru ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingGuru(null);
        setFormData(emptyForm);
        loadGuru();
      } else {
        setError(data.message || "Gagal menyimpan data");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({
      Nama: guru.Nama || "",
      No_WA: guru.No_WA || "",
      Email: guru.Email || "",
      Status: guru.Status || "Aktif",
    });
    setIsModalOpen(true);
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Data Guru"
        subtitle="Kelola data guru dan pengajar TPQ"
        action={
          <Button variant="gold" onClick={() => { setEditingGuru(null); setFormData(emptyForm); setIsModalOpen(true); }}>
            + Tambah Guru
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
            placeholder="Cari guru (nama atau email)..."
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
              <TableHead>Nama</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((guru, index) => (
              <TableRow key={guru.ID_Guru || `guru-${index}`}>
                <TableCell className="font-medium">{guru.Nama}</TableCell>
                <TableCell>{guru.No_WA || "-"}</TableCell>
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

      <div className="md:hidden space-y-4">
        {filteredList.map((guru, index) => (
          <div key={guru.ID_Guru || `guru-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{guru.Nama}</h3>
              <Badge variant={guru.Status === "Aktif" ? "success" : "default"}>
                {guru.Status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">WA: {guru.No_WA || "-"}</p>
            <p className="text-sm text-gray-600">Email: {guru.Email || "-"}</p>
            <Button size="sm" variant="secondary" className="w-full mt-3" onClick={() => handleEdit(guru)}>
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
          <p className="text-gray-500">Tidak ada data guru</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingGuru(null); }}
        title={editingGuru ? "Edit Guru" : "Tambah Guru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Lengkap" value={formData.Nama} onChange={(e) => setFormData({ ...formData, Nama: e.target.value })} required />
          <Input label="No. WhatsApp" value={formData.No_WA} onChange={(e) => setFormData({ ...formData, No_WA: e.target.value })} />
          <Input label="Email" type="email" value={formData.Email} onChange={(e) => setFormData({ ...formData, Email: e.target.value })} />
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
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingGuru(null); }}>
              Batal
            </Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingGuru ? "Simpan Perubahan" : "Tambah Guru"}
            </Button>
          </div>
        </form>
      </Modal>
    </TenantLayout>
  );
}
