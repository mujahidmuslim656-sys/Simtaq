// ============================================
// PENGUMUMAN SERVICE
// Data dummy in-memory untuk pengumuman
// ============================================

import { Pengumuman } from "@/types";

let pengumumanData: Pengumuman[] = [
  {
    ID_Pengumuman: "PENG-001",
    Judul: "Libur Ramadhan",
    Isi: "TPQ akan libur selama bulan Ramadhan. Kegiatan belajar mengaji dilanjutkan setelah Idul Fitri.",
    Tanggal_Publish: "2024-03-01",
    Tanggal_Expired: "2024-04-15",
    Status: "Aktif",
    Created_By: "Admin",
    Created_At: "2024-03-01T08:00:00Z",
  },
  {
    ID_Pengumuman: "PENG-002",
    Judul: "Ujian Akhir Semester",
    Isi: "Ujian akhir semester akan dilaksanakan pada tanggal 15-20 Juni 2024. Persiapkan diri dengan baik.",
    Tanggal_Publish: "2024-06-01",
    Tanggal_Expired: "2024-06-30",
    Status: "Aktif",
    Created_By: "Admin",
    Created_At: "2024-06-01T08:00:00Z",
  },
  {
    ID_Pengumuman: "PENG-003",
    Judul: "Pembayaran SPP",
    Isi: "Bapak/Ibu wali dimohon untuk segera melunasi pembayaran SPP bulan ini sebelum tanggal 10.",
    Tanggal_Publish: "2024-01-01",
    Tanggal_Expired: "2024-01-31",
    Status: "Nonaktif",
    Created_By: "Admin",
    Created_At: "2024-01-01T08:00:00Z",
  },
];

export function getAllPengumuman(): Pengumuman[] {
  return [...pengumumanData];
}

export function getActivePengumuman(): Pengumuman[] {
  return pengumumanData.filter((p) => p.Status === "Aktif");
}

export function getPengumumanById(id: string): Pengumuman | null {
  return pengumumanData.find((p) => p.ID_Pengumuman === id) || null;
}

export function createPengumuman(
  data: Omit<Pengumuman, "ID_Pengumuman" | "Created_At">
): Pengumuman {
  const now = new Date().toISOString();
  const newPengumuman: Pengumuman = {
    ID_Pengumuman: `PENG-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  pengumumanData.push(newPengumuman);
  return newPengumuman;
}

export function updatePengumuman(
  id: string,
  data: Partial<Pengumuman>
): Pengumuman | null {
  const index = pengumumanData.findIndex((p) => p.ID_Pengumuman === id);
  if (index === -1) return null;

  pengumumanData[index] = { ...pengumumanData[index], ...data };
  return pengumumanData[index];
}

export function deletePengumuman(id: string): boolean {
  const index = pengumumanData.findIndex((p) => p.ID_Pengumuman === id);
  if (index === -1) return false;

  pengumumanData.splice(index, 1);
  return true;
}
