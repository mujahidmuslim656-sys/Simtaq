"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenantLayout from "@/components/layout/TenantLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import ProGate from "@/components/ProGate";
import StatsCard from "@/components/ui/StatsCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Santri, Iuran } from "@/types";

export default function IuranPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [iuranList, setIuranList] = useState<Iuran[]>([]);
  const [filteredList, setFilteredList] = useState<Iuran[]>([]);
  const [stats, setStats] = useState({ totalTagihan: 0, totalPembayaran: 0, totalTunggakan: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIuran, setEditingIuran] = useState<Iuran | null>(null);
  const [formData, setFormData] = useState({
    ID_Santri: "",
    Bulan: "",
    Jenis: "SPP",
    Nominal: 0,
    Status: "Belum Bayar",
    Tanggal_Bayar: "",
    Catatan: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = iuranList.filter(
        (i) =>
          i.Bulan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.Jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.Status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(iuranList);
    }
  }, [searchQuery, iuranList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [santriRes, iuranRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/iuran"),
      ]);
      const santriData = await santriRes.json();
      const iuranData = await iuranRes.json();
      if (santriData.success) setSantriList(santriData.data || []);
      if (iuranData.success) {
        setIuranList(iuranData.data || []);
        setFilteredList(iuranData.data || []);
        const totalTagihan = (iuranData.data || []).reduce((sum: number, i: Iuran) => sum + (Number(i.Nominal) || 0), 0);
        const totalPembayaran = (iuranData.data || [])
          .filter((i: Iuran) => i.Status === "Lunas")
          .reduce((sum: number, i: Iuran) => sum + (Number(i.Nominal) || 0), 0);
        setStats({
          totalTagihan,
          totalPembayaran,
          totalTunggakan: totalTagihan - totalPembayaran,
        });
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Gagal memuat data iuran");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingIuran ? `/api/iuran/${editingIuran.ID_Iuran}` : "/api/iuran";
      const method = editingIuran ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingIuran(null);
        setFormData({ ID_Santri: "", Bulan: "", Jenis: "SPP", Nominal: 0, Status: "Belum Bayar", Tanggal_Bayar: "", Catatan: "" });
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

  const handleEdit = (iuran: Iuran) => {
    setEditingIuran(iuran);
    setFormData({
      ID_Santri: iuran.ID_Santri || "",
      Bulan: iuran.Bulan || "",
      Jenis: iuran.Jenis || "SPP",
      Nominal: iuran.Nominal || 0,
      Status: iuran.Status || "Belum Bayar",
      Tanggal_Bayar: iuran.Tanggal_Bayar || "",
      Catatan: iuran.Catatan || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data iuran ini?")) return;
    try {
      const res = await fetch(`/api/iuran/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Iuran"
        subtitle="Kelola pembayaran iuran santri"
        action={
          <Button variant="gold" onClick={() => { setEditingIuran(null); setFormData({ ID_Santri: "", Bulan: "", Jenis: "SPP", Nominal: 0, Status: "Belum Bayar", Tanggal_Bayar: "", Catatan: "" }); setIsModalOpen(true); }}>
            + Tambah Iuran
          </Button>
        }
      />

      <ProGate feature="Modul Iuran">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Tagihan"
          value={`Rp ${stats.totalTagihan.toLocaleString("id-ID")}`}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Pembayaran"
          value={`Rp ${stats.totalPembayaran.toLocaleString("id-ID")}`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatsCard
          title="Total Tunggakan"
          value={`Rp ${stats.totalTunggakan.toLocaleString("id-ID")}`}
          color="gold"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari iuran (bulan, jenis, atau status)..."
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
              <TableHead>Bulan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((iuran, index) => {
              const santri = santriList.find((s) => s.ID_Santri === iuran.ID_Santri);
              return (
                <TableRow key={iuran.ID_Iuran || `iuran-${index}`}>
                  <TableCell className="font-medium">{santri?.Nama || "-"}</TableCell>
                  <TableCell>{iuran.Bulan}</TableCell>
                  <TableCell>{iuran.Jenis}</TableCell>
                  <TableCell>Rp {Number(iuran.Nominal).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={iuran.Status === "Lunas" ? "success" : "warning"}>
                      {iuran.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(iuran)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(iuran.ID_Iuran)}>Hapus</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredList.map((iuran, index) => {
          const santri = santriList.find((s) => s.ID_Santri === iuran.ID_Santri);
          return (
            <div key={iuran.ID_Iuran || `iuran-mobile-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{santri?.Nama || "-"}</h3>
                  <p className="text-sm text-gray-500">{iuran.Bulan} - {iuran.Jenis}</p>
                </div>
                <Badge variant={iuran.Status === "Lunas" ? "success" : "warning"}>
                  {iuran.Status}
                </Badge>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-3">Rp {Number(iuran.Nominal).toLocaleString("id-ID")}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleEdit(iuran)}>Edit</Button>
                <Button size="sm" variant="danger" className="flex-1" onClick={() => handleDelete(iuran.ID_Iuran)}>Hapus</Button>
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
          <p className="text-gray-500">Tidak ada data iuran</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIuran(null); }}
        title={editingIuran ? "Edit Iuran" : "Tambah Iuran"}
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
            <Input label="Bulan" value={formData.Bulan} onChange={(e) => setFormData({ ...formData, Bulan: e.target.value })} placeholder="Januari 2024" />
            <Select label="Jenis" value={formData.Jenis} onChange={(e) => setFormData({ ...formData, Jenis: e.target.value })}>
              <option value="SPP">SPP</option>
              <option value="Infaq">Infaq</option>
              <option value="Lainnya">Lainnya</option>
            </Select>
            <Input label="Nominal" type="number" value={formData.Nominal} onChange={(e) => setFormData({ ...formData, Nominal: Number(e.target.value) })} />
            <Select label="Status" value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Lunas">Lunas</option>
            </Select>
            <Input label="Tanggal Bayar" type="date" value={formData.Tanggal_Bayar} onChange={(e) => setFormData({ ...formData, Tanggal_Bayar: e.target.value })} />
          </div>
          <Input label="Catatan" value={formData.Catatan} onChange={(e) => setFormData({ ...formData, Catatan: e.target.value })} />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingIuran(null); }}>Batal</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {editingIuran ? "Simpan Perubahan" : "Tambah Iuran"}
            </Button>
          </div>
        </form>
      </Modal>
      </ProGate>
    </TenantLayout>
  );
}
