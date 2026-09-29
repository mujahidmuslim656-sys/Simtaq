// ============================================
// HAFALAN SERVICE
// Data dummy in-memory untuk hafalan
// ============================================

import { Hafalan } from "@/types";

let hafalanData: Hafalan[] = [
  {
    ID_Hafalan: "HAF-001",
    ID_Santri: "SANTRI-001",
    Tanggal: "2024-01-15",
    Surah: "Al-Fatihah",
    Status: "Lancar",
    Catatan: "Bacaan sangat baik",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Hafalan: "HAF-002",
    ID_Santri: "SANTRI-001",
    Tanggal: "2024-01-15",
    Surah: "An-Nas",
    Status: "Lancar",
    Catatan: "Hafalan lancar",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Hafalan: "HAF-003",
    ID_Santri: "SANTRI-002",
    Tanggal: "2024-01-16",
    Surah: "Al-Falaq",
    Status: "Berkembang",
    Catatan: "Perlu murojaah lagi",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Hafalan: "HAF-004",
    ID_Santri: "SANTRI-003",
    Tanggal: "2024-01-16",
    Surah: "Al-Ikhlas",
    Status: "Belum",
    Catatan: "Belum mulai menghafal",
    ID_Guru: "GURU-002",
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Hafalan: "HAF-005",
    ID_Santri: "SANTRI-004",
    Tanggal: "2024-01-17",
    Surah: "Al-Fatihah",
    Status: "Perlu Murojaah",
    Catatan: "Perlu murojaah ayat 5-7",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-17T08:00:00Z",
  },
];

export function getAllHafalan(): Hafalan[] {
  return [...hafalanData];
}

export function getHafalanBySantri(santriId: string): Hafalan[] {
  return hafalanData.filter((h) => h.ID_Santri === santriId);
}

export function createHafalan(
  data: Omit<Hafalan, "ID_Hafalan" | "Created_At">
): Hafalan {
  const now = new Date().toISOString();
  const newHafalan: Hafalan = {
    ID_Hafalan: `HAF-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  hafalanData.push(newHafalan);
  return newHafalan;
}

export function updateHafalan(
  id: string,
  data: Partial<Hafalan>
): Hafalan | null {
  const index = hafalanData.findIndex((h) => h.ID_Hafalan === id);
  if (index === -1) return null;

  hafalanData[index] = { ...hafalanData[index], ...data };
  return hafalanData[index];
}

export function deleteHafalan(id: string): boolean {
  const index = hafalanData.findIndex((h) => h.ID_Hafalan === id);
  if (index === -1) return false;

  hafalanData.splice(index, 1);
  return true;
}
