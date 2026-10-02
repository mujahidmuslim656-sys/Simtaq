"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenantLayout from "@/components/layout/TenantLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Santri, Kelas, Absensi } from "@/types";

type AbsensiStatus = "Hadir" | "Izin" | "Sakit" | "Alpa";

interface AbsensiForm {
  santriId: string;
  nama: string;
  status: AbsensiStatus;
  catatan: string;
}

export default function AbsensiPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [absensiForm, setAbsensiForm] = useState<AbsensiForm[]>([]);
  const [existingAbsensi, setExistingAbsensi] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedKelas && selectedTanggal) {
      loadAbsensi();
    }
  }, [selectedKelas, selectedTanggal]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [kelasRes, santriRes] = await Promise.all([
        fetch("/api/kelas"),
        fetch("/api/santri"),
      ]);
      const kelasData = await kelasRes.json();
      const santriData = await santriRes.json();
      if (kelasData.success) setKelasList(kelasData.data || []);
      if (santriData.success) setSantriList(santriData.data || []);
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setError("Gagal memuat data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  const loadAbsensi = async () => {
    try {
      const res = await fetch(`/api/absensi?kelasId=${selectedKelas}&tanggal=${selectedTanggal}`);
      const data = await res.json();
      if (data.success) {
        setExistingAbsensi(data.data || []);
        const santriInKelas = santriList.filter((s) => s.ID_Kelas === selectedKelas);
        const form = santriInKelas.map((s) => {
          const existing = data.data?.find((a: Absensi) => a.ID_Santri === s.ID_Santri);
          return {
            santriId: s.ID_Santri,
            nama: s.Nama,
            status: (existing?.Status as AbsensiStatus) || "Hadir",
            catatan: existing?.Catatan || "",
          };
        });
        setAbsensiForm(form);
      }
    } catch (err) {
      console.error("Failed to load absensi:", err);
    }
  };

  const handleStatusChange = (santriId: string, status: AbsensiStatus) => {
    setAbsensiForm((prev) =>
      prev.map((item) => (item.santriId === santriId ? { ...item, status } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = absensiForm.map((item) => ({
        ID_Santri: item.santriId,
        ID_Kelas: selectedKelas,
        Tanggal: selectedTanggal,
        Status: item.status,
        Catatan: item.catatan,
      }));
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ absensiList: payload }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Absensi berhasil disimpan!");
      }
    } catch (err) {
      console.error("Failed to save absensi:", err);
    } finally {
      setSaving(false);
    }
  };

  const statusColors: Record<AbsensiStatus, string> = {
    Hadir: "bg-green-100 text-green-800",
    Izin: "bg-yellow-100 text-yellow-800",
    Sakit: "bg-blue-100 text-blue-800",
    Alpa: "bg-red-100 text-red-800",
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Absensi"
        subtitle="Catat kehadiran santri per kelas/jilid"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kelas/Jilid</label>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Pilih Kelas/Jilid</option>
            {kelasList.map((k) => (
              <option key={k.ID_Kelas} value={k.ID_Kelas}>{k.Nama_Kelas}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setSelectedTanggal(new Date().toISOString().split("T")[0])}
              className="px-4 py-3 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors whitespace-nowrap"
            >
              Hari Ini
            </button>
          </div>
        </div>
      </div>

      {selectedKelas && selectedTanggal && (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absensiForm.map((item) => (
                  <TableRow key={item.santriId}>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(["Hadir", "Izin", "Sakit", "Alpa"] as AbsensiStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(item.santriId, status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              item.status === status
                                ? statusColors[status]
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        placeholder="Catatan..."
                        value={item.catatan}
                        onChange={(e) =>
                          setAbsensiForm((prev) =>
                            prev.map((f) =>
                              f.santriId === item.santriId ? { ...f, catatan: e.target.value } : f
                            )
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {absensiForm.map((item) => (
              <div key={item.santriId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">{item.nama}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["Hadir", "Izin", "Sakit", "Alpa"] as AbsensiStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(item.santriId, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        item.status === status
                          ? statusColors[status]
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Catatan..."
                  value={item.catatan}
                  onChange={(e) =>
                    setAbsensiForm((prev) =>
                      prev.map((f) =>
                        f.santriId === item.santriId ? { ...f, catatan: e.target.value } : f
                      )
                    )
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="gold" onClick={handleSave} loading={saving}>
              Simpan Absensi
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {(!selectedKelas || !selectedTanggal) && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">Pilih kelas dan tanggal untuk mulai mencatat absensi</p>
        </div>
      )}
    </TenantLayout>
  );
}
