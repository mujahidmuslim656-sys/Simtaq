"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
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
      const filtered = iuranList.filter((i) => {
        const santri = santriList.find((s) => s.ID_Santri === i.ID_Santri);
        return (
          santri?.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.Bulan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.Jenis.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredList(filtered);
    } else {
      setFilteredList(iuranList);
    }
  }, [searchQuery, iuranList, santriList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [santriRes, iuranRes, statsRes] = await Promise.all([
        fetch("/api/santri"),
        fetch("/api/iuran"),
        fetch("/api/iuran?stats=true"),
      ]);

      const santriResult = await santriRes.json();
      const iuranResult = await iuranRes.json();
      const statsResult = await statsRes.json();

      if (santriResult.success) {
        setSantriList(santriResult.data.filter((s: Santri) => s.Status === "Aktif"));
      }
      if (iuranResult.success) {
        setIuranList(iuranResult.data);
        setFilteredList(iuranResult.data);
      }
      if (statsResult.success) {
        setStats(statsResult.data);
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
      const url = editingIuran ? "/api/iuran" : "/api/iuran";
      const method = editingIuran ? "PUT" : "POST";
      const body = editingIuran
        ? { id: editingIuran.ID_Iuran, data: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingIuran(null);
        setFormData({
          ID_Santri: "",
          Bulan: "",
          Jenis: "SPP",
          Nominal: 0,
          Status: "Belum Bayar",
          Tanggal_Bayar: "",
          Catatan: "",
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

  const handleEdit = (iuran: Iuran) => {
    setEditingIuran(iuran);
    setFormData({
      ID_Santri: iuran.ID_Santri,
      Bulan: iuran.Bulan,
      Jenis: iuran.Jenis,
      Nominal: iuran.Nominal,
      Status: iuran.Status,
      Tanggal_Bayar: iuran.Tanggal_Bayar,
      Catatan: iuran.Catatan,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch("/api/iuran", {
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
    setEditingIuran(null);
    setFormData({
      ID_Santri: "",
      Bulan: "",
      Jenis: "SPP",
      Nominal: 0,
      Status: "Belum Bayar",
      Tanggal_Bayar: "",
      Catatan: "",
    });
    setIsModalOpen(true);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
            <h1 className="text-2xl font-bold text-gray-900">Iuran</h1>
            <p className="text-gray-500">Kelola iuran santri</p>
          </div>
          <Button onClick={openCreateModal} className="mt-4 sm:mt-0">
            + Tambah Iuran
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Tagihan</p>
                <p className="text-xl font-bold text-gray-900">{formatRupiah(stats.totalTagihan)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Pembayaran</p>
                <p className="text-xl font-bold text-gray-900">{formatRupiah(stats.totalPembayaran)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Tunggakan</p>
                <p className="text-xl font-bold text-gray-900">{formatRupiah(stats.totalTunggakan)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <SearchInput
              placeholder="Cari nama santri, bulan, atau jenis..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan iuran</p>
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
                        Bulan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nominal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredList.map((iuran) => {
                      const santri = santriList.find((s) => s.ID_Santri === iuran.ID_Santri);
                      return (
                        <tr key={iuran.ID_Iuran}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {santri?.Nama || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {iuran.Bulan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {iuran.Jenis}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatRupiah(iuran.Nominal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={iuran.Status === "Lunas" ? "success" : "warning"}>
                              {iuran.Status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(iuran)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDelete(iuran.ID_Iuran)}>
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
                {filteredList.map((iuran) => {
                  const santri = santriList.find((s) => s.ID_Santri === iuran.ID_Santri);
                  return (
                    <div key={iuran.ID_Iuran} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{santri?.Nama || "-"}</h3>
                          <p className="text-sm text-gray-500">{iuran.Bulan} - {iuran.Jenis}</p>
                        </div>
                        <Badge variant={iuran.Status === "Lunas" ? "success" : "warning"}>
                          {iuran.Status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Nominal: {formatRupiah(iuran.Nominal)}</p>
                        {iuran.Tanggal_Bayar && <p>Tanggal Bayar: {iuran.Tanggal_Bayar}</p>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(iuran)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(iuran.ID_Iuran)}>
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
            setEditingIuran(null);
          }}
          title={editingIuran ? "Edit Iuran" : "Tambah Iuran"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <input
                  type="text"
                  value={formData.Bulan}
                  onChange={(e) => setFormData({ ...formData, Bulan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Contoh: Januari 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                <select
                  value={formData.Jenis}
                  onChange={(e) => setFormData({ ...formData, Jenis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="SPP">SPP</option>
                  <option value="Infaq">Infaq</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={formData.Nominal}
                  onChange={(e) => setFormData({ ...formData, Nominal: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="25000"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="Belum Bayar">Belum Bayar</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
            </div>
            {formData.Status === "Lunas" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bayar</label>
                <input
                  type="date"
                  value={formData.Tanggal_Bayar}
                  onChange={(e) => setFormData({ ...formData, Tanggal_Bayar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={formData.Catatan}
                onChange={(e) => setFormData({ ...formData, Catatan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                rows={2}
                placeholder="Catatan (opsional)..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingIuran(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving}>
                {editingIuran ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
