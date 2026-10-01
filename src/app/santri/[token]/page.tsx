"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Santri, Progress, Hafalan, Catatan, Iuran, Pengumuman, Kelas, Guru } from "@/types";

export default function ParentPortalPage() {
  const params = useParams();
  const token = params.token as string;

  const [santri, setSantri] = useState<Santri | null>(null);
  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [guru, setGuru] = useState<Guru | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [hafalan, setHafalan] = useState<Hafalan[]>([]);
  const [catatan, setCatatan] = useState<Catatan[]>([]);
  const [iuran, setIuran] = useState<Iuran[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [absensiStats, setAbsensiStats] = useState({ hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0, persentase: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get santri by token
      const santriRes = await fetch("/api/santri");
      const santriResult = await santriRes.json();

      if (!santriResult.success) {
        setError("Data tidak ditemukan");
        return;
      }

      if (!Array.isArray(santriResult.data)) {
        setError("Data tidak valid");
        return;
      }

      const foundSantri = santriResult.data.find((s: Santri) => s.Access_Token === token);

      if (!foundSantri) {
        setError("Token tidak valid");
        return;
      }

      setSantri(foundSantri);

      // Get kelas
      const kelasRes = await fetch("/api/kelas");
      const kelasResult = await kelasRes.json();
      if (kelasResult.success) {
        const foundKelas = kelasResult.data.find((k: Kelas) => k.ID_Kelas === foundSantri.ID_Kelas);
        setKelas(foundKelas || null);

        // Get guru
        if (foundKelas) {
          const guruRes = await fetch("/api/guru");
          const guruResult = await guruRes.json();
          if (guruResult.success) {
            const foundGuru = guruResult.data.find((g: Guru) => g.ID_Guru === foundKelas.ID_Guru);
            setGuru(foundGuru || null);
          }
        }
      }

      // Get progress
      const progressRes = await fetch(`/api/progress?santriId=${foundSantri.ID_Santri}`);
      const progressResult = await progressRes.json();
      if (progressResult.success) {
        setProgress(progressResult.data);
      }

      // Get hafalan
      const hafalanRes = await fetch(`/api/hafalan?santriId=${foundSantri.ID_Santri}`);
      const hafalanResult = await hafalanRes.json();
      if (hafalanResult.success) {
        setHafalan(hafalanResult.data);
      }

      // Get catatan (hanya yang tampil ke wali)
      const catatanRes = await fetch(`/api/catatan?santriId=${foundSantri.ID_Santri}&forWali=true`);
      const catatanResult = await catatanRes.json();
      if (catatanResult.success) {
        setCatatan(catatanResult.data);
      }

      // Get iuran
      const iuranRes = await fetch(`/api/iuran?santriId=${foundSantri.ID_Santri}`);
      const iuranResult = await iuranRes.json();
      if (iuranResult.success) {
        setIuran(iuranResult.data);
      }

      // Get pengumuman aktif
      const pengumumanRes = await fetch("/api/pengumuman?active=true");
      const pengumumanResult = await pengumumanRes.json();
      if (pengumumanResult.success) {
        setPengumuman(pengumumanResult.data);
      }

      // Get absensi stats
      const absensiRes = await fetch(`/api/absensi?santriId=${foundSantri.ID_Santri}`);
      const absensiResult = await absensiRes.json();
      if (absensiResult.success) {
        setAbsensiStats(absensiResult.data);
      }
    } catch {
      setError("Data belum dapat dimuat. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">TPQ Digital</h1>
          <p className="text-primary-100">Portal Orang Tua/Wali</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profil Anak */}
        <Card title="Profil Anak">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-medium text-gray-900">{santri?.Nama}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NIS</p>
              <p className="font-medium text-gray-900">{santri?.NIS}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kelas</p>
              <p className="font-medium text-gray-900">{kelas?.Nama_Kelas || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Guru</p>
              <p className="font-medium text-gray-900">{guru?.Nama || "-"}</p>
            </div>
          </div>
        </Card>

        {/* Kehadiran */}
        <Card title="Kehadiran">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{absensiStats.hadir}</p>
              <p className="text-sm text-gray-500">Hadir</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{absensiStats.izin}</p>
              <p className="text-sm text-gray-500">Izin</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{absensiStats.sakit}</p>
              <p className="text-sm text-gray-500">Sakit</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{absensiStats.alpa}</p>
              <p className="text-sm text-gray-500">Alpa</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Persentase Kehadiran</p>
            <p className="text-3xl font-bold text-primary-600">{absensiStats.persentase}%</p>
          </div>
        </Card>

        {/* Perkembangan */}
        <Card title="Perkembangan Mengaji">
          {progress.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada data perkembangan</p>
          ) : (
            <div className="space-y-3">
              {progress.map((p) => (
                <div key={p.ID_Progress} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{p.Materi}</p>
                      <p className="text-sm text-gray-500">{p.Kategori} - {p.Tanggal}</p>
                    </div>
                    <Badge
                      variant={
                        p.Status === "Baik"
                          ? "success"
                          : p.Status === "Berkembang"
                          ? "info"
                          : "warning"
                      }
                    >
                      {p.Status}
                    </Badge>
                  </div>
                  {p.Catatan && (
                    <p className="text-sm text-gray-500 mt-2">{p.Catatan}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Hafalan */}
        <Card title="Hafalan">
          {hafalan.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada data hafalan</p>
          ) : (
            <div className="space-y-3">
              {hafalan.map((h) => (
                <div key={h.ID_Hafalan} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{h.Surah}</p>
                      <p className="text-sm text-gray-500">{h.Tanggal}</p>
                    </div>
                    <Badge
                      variant={
                        h.Status === "Lancar"
                          ? "success"
                          : h.Status === "Berkembang"
                          ? "info"
                          : h.Status === "Perlu Murojaah"
                          ? "warning"
                          : "default"
                      }
                    >
                      {h.Status}
                    </Badge>
                  </div>
                  {h.Catatan && (
                    <p className="text-sm text-gray-500 mt-2">{h.Catatan}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Catatan Guru */}
        <Card title="Catatan Guru">
          {catatan.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada catatan</p>
          ) : (
            <div className="space-y-3">
              {catatan.map((c) => (
                <div key={c.ID_Catatan} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500">{c.Tanggal}</p>
                  <p className="text-gray-900 mt-1">{c.Catatan}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Iuran */}
        <Card title="Iuran">
          {iuran.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada data iuran</p>
          ) : (
            <div className="space-y-3">
              {iuran.map((i) => (
                <div key={i.ID_Iuran} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{i.Bulan}</p>
                      <p className="text-sm text-gray-500">{i.Jenis} - Rp {i.Nominal.toLocaleString("id-ID")}</p>
                    </div>
                    <Badge variant={i.Status === "Lunas" ? "success" : "warning"}>
                      {i.Status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pengumuman */}
        <Card title="Pengumuman">
          {pengumuman.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada pengumuman</p>
          ) : (
            <div className="space-y-3">
              {pengumuman.map((p) => (
                <div key={p.ID_Pengumuman} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{p.Judul}</p>
                  <p className="text-sm text-gray-500 mt-1">{p.Isi}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Periode: {p.Tanggal_Publish} - {p.Tanggal_Expired}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
