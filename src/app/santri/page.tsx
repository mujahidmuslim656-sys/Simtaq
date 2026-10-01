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
  const [formData, setFormData] = useState<SantriFormData>({ ...emptyForm });
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
      const data = await res.json();
      if (data.success) {
        setSantriList(data.data || []);
        setFilteredList(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load santri:", err);
      setError("Gagal memuat data santri");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingSantri ? `/api/santri/${editingSantri.ID_Santri}` : "/api/santri";
      const method = editingSantri ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingSantri(null);
        setFormData(emptyForm);
        loadSantri();
      } else {
        setError(data.message || data.error || "Gagal menyimpan data");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (santri: Santri) => {
    setEditingSantri(santri);
    setFormData({
      NIS: santri.NIS || "",
      Nama: santri.Nama || "",
      Jenis_Kelamin: santri.Jenis_Kelamin || "L",
      Tanggal_Lahir: santri.Tanggal_Lahir || "",
      Nama_Wali: santri.Nama_Wali || "",
      No_WA: santri.No_WA || "",
      ID_Kelas: santri.ID_Kelas || "",
      Status: santri.Status || "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan santri ini?")) return;

    try {
      const res = await fetch(`/api/santri/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadSantri();
      }
    } catch (err) {
      console.error("Failed to deactivate:", err);
    }
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Data Santri"
        subtitle="Kelola data santri TPQ Anda"
        action={
          <Button variant="gold" onClick={() => { setEditingSantri(null); setFormData(emptyForm); setIsModalOpen(true); }}>
            + Tambah Santri
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari santri (nama, NIS, atau wali)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>

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
          <div key={santri.ID_Santri || `santri-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{santri.Nama}</h3>
                <p className="text-sm text-gray-500">NIS: {santri.NIS || "-"}</p>
              </div>
              <Badge variant={santri.Status === "Aktif" ? "success" : "default"}>
                {santri.Status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p><span className="font-medium">L/P:</span> {santri.Jenis_Kelamin}</p>
              <p><span className="font-medium">Kelas:</span> {santri.ID_Kelas || "-"}</p>
              <p><span className="font-medium">Wali:</span> {santri.Nama_Wali || "-"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleEdit(santri)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" className="flex-1" onClick={() => handleDeactivate(santri.ID_Santri)}>
                Nonaktifkan
              </Button>
            </div>
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
          <p className="text-gray-500">Tidak ada data santri</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSantri(null); }}
        title={editingSantri ? "Edit Santri" : "Tambah Santri"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="NIS" value={formData.NIS} onChange={(e) => setFormData({ ...formData, NIS: e.target.value })} />
            <Input label="Nama Lengkap" value={formData.Nama} onChange={(e) => setFormData({ ...formData, Nama: e.target.value })} required />
            <Select label="Jenis Kelamin" value={formData.Jenis_Kelamin} onChange={(e) => setFormData({ ...formData, Jenis_Kelamin: e.target.value })}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </Select>
            <Input label="Tanggal Lahir" type="date" value={formData.Tanggal_Lahir} onChange={(e) => setFormData({ ...formData, Tanggal_Lahir: e.target.value })} />
            <Input label="Nama Wali" value={formData.Nama_Wali} onChange={(e) => setFormData({ ...formData, Nama_Wali: e.target.value })} />
            <Input label="No. WhatsApp" value={formData.No_WA} onChange={(e) => setFormData({ ...formData, No_WA: e.target.value })} />
            <Input label="ID Kelas" value={formData.ID_Kelas} onChange={(e) => setFormData({ ...formData, ID_Kelas: e.target.value })} />
            <Select label="Status" value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingSantri(null); }}>
              Batal
            </Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingSantri ? "Simpan Perubahan" : "Tambah Santri"}
            </Button>
          </div>
        </form>
      </Modal>
    </TenantLayout>
  );
}
