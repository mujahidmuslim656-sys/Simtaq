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
    Tanggal: "",
    Surah: "",
    Status: "Belum",
    Catatan: "",
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
          h.Status.toLowerCase().includes(searchQuery.toLowerCase())
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
      const santriData = await santriRes.json();
      const hafalanData = await hafalanRes.json();
      if (santriData.success) setSantriList(santriData.data || []);
      if (hafalanData.success) {
        setHafalanList(hafalanData.data || []);
        setFilteredList(hafalanData.data || []);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Gagal memuat data hafalan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingHafalan ? `/api/hafalan/${editingHafalan.ID_Hafalan}` : "/api/hafalan";
      const method = editingHafalan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingHafalan(null);
        setFormData({ ID_Santri: "", Tanggal: "", Surah: "", Status: "Belum", Catatan: "" });
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

  const handleEdit = (hafalan: Hafalan) => {
    setEditingHafalan(hafalan);
    setFormData({
      ID_Santri: hafalan.ID_Santri || "",
      Tanggal: hafalan.Tanggal || "",
      Surah: hafalan.Surah || "",
      Status: hafalan.Status || "Belum",
      Catatan: hafalan.Catatan || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data hafalan ini?")) return;
    try {
      const res = await fetch(`/api/hafalan/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const statusColors: Record<string, "default" | "warning" | "info" | "success" | "danger"> = {
    Belum: "default",
    Berkembang: "warning",
    Lancar: "success",
    "Perlu Murojaah": "danger",
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Hafalan"
        subtitle="Tracking hafalan Al-Quran santri"
        action={
          <Button variant="gold" onClick={() => { setEditingHafalan(null); setFormData({ ID_Santri: "", Tanggal: "", Surah: "", Status: "Belum", Catatan: "" }); setIsModalOpen(true); }}>
            + Tambah Hafalan
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
            placeholder="Cari hafalan (surah atau status)..."
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
              <TableHead>Santri</TableHead>
              <TableHead>Surah</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((hafalan, index) => {
              const santri = santriList.find((s) => s.ID_Santri === hafalan.ID_Santri);
              return (
                <TableRow key={hafalan.ID_Hafalan || `hafalan-${index}`}>
                  <TableCell className="font-medium">{santri?.Nama || "-"}</TableCell>
                  <TableCell>{hafalan.Surah}</TableCell>
                  <TableCell>{hafalan.Tanggal ? new Date(hafalan.Tanggal).toLocaleDateString("id-ID") : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[hafalan.Status] || "default"}>
                      {hafalan.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>{hafalan.Catatan || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(hafalan)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(hafalan.ID_Hafalan)}>Hapus</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredList.map((hafalan, index) => {
          const santri = santriList.find((s) => s.ID_Santri === hafalan.ID_Santri);
          return (
            <div key={hafalan.ID_Hafalan || `hafalan-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{santri?.Nama || "-"}</h3>
                  <p className="text-sm text-gray-500">{hafalan.Surah}</p>
                </div>
                <Badge variant={statusColors[hafalan.Status] || "default"}>
                  {hafalan.Status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Tanggal: {hafalan.Tanggal ? new Date(hafalan.Tanggal).toLocaleDateString("id-ID") : "-"}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleEdit(hafalan)}>Edit</Button>
                <Button size="sm" variant="danger" className="flex-1" onClick={() => handleDelete(hafalan.ID_Hafalan)}>Hapus</Button>
              </div>
            </div>
          );
        })}
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
          <p className="text-gray-500">Tidak ada data hafalan</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHafalan(null); }}
        title={editingHafalan ? "Edit Hafalan" : "Tambah Hafalan"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Santri" value={formData.ID_Santri} onChange={(e) => setFormData({ ...formData, ID_Santri: e.target.value })} required>
              <option value="">Pilih Santri</option>
              {santriList.map((s) => (
                <option key={s.ID_Santri} value={s.ID_Santri}>{s.Nama}</option>
              ))}
            </Select>
            <Input label="Tanggal" type="date" value={formData.Tanggal} onChange={(e) => setFormData({ ...formData, Tanggal: e.target.value })} />
            <Select label="Surah" value={formData.Surah} onChange={(e) => setFormData({ ...formData, Surah: e.target.value })} required>
              <option value="">Pilih Surah</option>
              {SURAH_OPTIONS.map((surah) => (
                <option key={surah} value={surah}>{surah}</option>
              ))}
            </Select>
            <Select label="Status" value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>
          <Input label="Catatan" value={formData.Catatan} onChange={(e) => setFormData({ ...formData, Catatan: e.target.value })} />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingHafalan(null); }}>Batal</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingHafalan ? "Simpan Perubahan" : "Tambah Hafalan"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
