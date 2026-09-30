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
      const data = await res.json();
      if (data.success) {
        setPengumumanList(data.data || []);
        setFilteredList(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingPengumuman ? `/api/pengumuman/${editingPengumuman.ID_Pengumuman}` : "/api/pengumuman";
      const method = editingPengumuman ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingPengumuman(null);
        setFormData({ Judul: "", Isi: "", Tanggal_Publish: "", Tanggal_Expired: "", Status: "Aktif", Created_By: "Admin" });
        loadData();
      } else {
        setError(data.message || "Gagal menyimpan data");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pengumuman: Pengumuman) => {
    setEditingPengumuman(pengumuman);
    setFormData({
      Judul: pengumuman.Judul || "",
      Isi: pengumuman.Isi || "",
      Tanggal_Publish: pengumuman.Tanggal_Publish || "",
      Tanggal_Expired: pengumuman.Tanggal_Expired || "",
      Status: pengumuman.Status || "Aktif",
      Created_By: pengumuman.Created_By || "Admin",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;
    try {
      const res = await fetch(`/api/pengumuman/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Pengumuman"
        subtitle="Kelola pengumuman untuk santri dan wali"
        action={
          <Button variant="gold" onClick={() => { setEditingPengumuman(null); setFormData({ Judul: "", Isi: "", Tanggal_Publish: "", Tanggal_Expired: "", Status: "Aktif", Created_By: "Admin" }); setIsModalOpen(true); }}>
            + Tambah Pengumuman
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
            placeholder="Cari pengumuman..."
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
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal Publish</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((pengumuman, index) => (
              <TableRow key={pengumuman.ID_Pengumuman || `pengumuman-${index}`}>
                <TableCell className="font-medium">{pengumuman.Judul}</TableCell>
                <TableCell>{pengumuman.Tanggal_Publish ? new Date(pengumuman.Tanggal_Publish).toLocaleDateString("id-ID") : "-"}</TableCell>
                <TableCell>
                  <Badge variant={pengumuman.Status === "Aktif" ? "success" : "default"}>
                    {pengumuman.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(pengumuman)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(pengumuman.ID_Pengumuman)}>Hapus</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredList.map((pengumuman, index) => (
          <div key={pengumuman.ID_Pengumuman || `pengumuman-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{pengumuman.Judul}</h3>
              <Badge variant={pengumuman.Status === "Aktif" ? "success" : "default"}>
                {pengumuman.Status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pengumuman.Isi}</p>
            <p className="text-xs text-gray-500 mb-3">
              Publish: {pengumuman.Tanggal_Publish ? new Date(pengumuman.Tanggal_Publish).toLocaleDateString("id-ID") : "-"}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleEdit(pengumuman)}>Edit</Button>
              <Button size="sm" variant="danger" className="flex-1" onClick={() => handleDelete(pengumuman.ID_Pengumuman)}>Hapus</Button>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada pengumuman</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPengumuman(null); }}
        title={editingPengumuman ? "Edit Pengumuman" : "Tambah Pengumuman"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul" value={formData.Judul} onChange={(e) => setFormData({ ...formData, Judul: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Isi Pengumuman</label>
            <textarea
              value={formData.Isi}
              onChange={(e) => setFormData({ ...formData, Isi: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Tanggal Publish" type="date" value={formData.Tanggal_Publish} onChange={(e) => setFormData({ ...formData, Tanggal_Publish: e.target.value })} />
            <Input label="Tanggal Expired" type="date" value={formData.Tanggal_Expired} onChange={(e) => setFormData({ ...formData, Tanggal_Expired: e.target.value })} />
          </div>
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
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingPengumuman(null); }}>Batal</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingPengumuman ? "Simpan Perubahan" : "Tambah Pengumuman"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
