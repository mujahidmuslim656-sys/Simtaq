// ============================================
// PROGRESS SERVICE
// Data dummy in-memory untuk perkembangan mengaji
// ============================================

import { Progress } from "@/types";

let progressData: Progress[] = [
  {
    ID_Progress: "PROG-001",
    Tanggal: "2024-01-15",
    ID_Santri: "SANTRI-001",
    Kategori: "Bacaan",
    Materi: "Iqra Jilid 2 halaman 15",
    Status: "Berkembang",
    Catatan: "Masih perlu latihan huruf ث",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Progress: "PROG-002",
    Tanggal: "2024-01-15",
    ID_Santri: "SANTRI-002",
    Kategori: "Tajwid",
    Materi: "Hukum Nun Mati",
    Status: "Baik",
    Catatan: "Sudah baik bacaannya",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Progress: "PROG-003",
    Tanggal: "2024-01-16",
    ID_Santri: "SANTRI-003",
    Kategori: "Makhraj",
    Materi: "Huruf Hijaiyah",
    Status: "Perlu Bimbingan",
    Catatan: "Perlu latihan huruf ع dan غ",
    ID_Guru: "GURU-002",
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Progress: "PROG-004",
    Tanggal: "2024-01-16",
    ID_Santri: "SANTRI-001",
    Kategori: "Kelancaran",
    Materi: "Juz 30",
    Status: "Baik",
    Catatan: "Bacaan semakin lancar",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Progress: "PROG-005",
    Tanggal: "2024-01-17",
    ID_Santri: "SANTRI-004",
    Kategori: "Adab",
    Materi: "Adab Belajar",
    Status: "Berkembang",
    Catatan: "Perlu lebih fokus saat belajar",
    ID_Guru: "GURU-001",
    Created_At: "2024-01-17T08:00:00Z",
  },
];

export function getAllProgress(): Progress[] {
  return [...progressData];
}

export function getProgressBySantri(santriId: string): Progress[] {
  return progressData.filter((p) => p.ID_Santri === santriId);
}

export function createProgress(
  data: Omit<Progress, "ID_Progress" | "Created_At">
): Progress {
  const now = new Date().toISOString();
  const newProgress: Progress = {
    ID_Progress: `PROG-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  progressData.push(newProgress);
  return newProgress;
}

export function updateProgress(
  id: string,
  data: Partial<Progress>
): Progress | null {
  const index = progressData.findIndex((p) => p.ID_Progress === id);
  if (index === -1) return null;

  progressData[index] = { ...progressData[index], ...data };
  return progressData[index];
}

export function deleteProgress(id: string): boolean {
  const index = progressData.findIndex((p) => p.ID_Progress === id);
  if (index === -1) return false;

  progressData.splice(index, 1);
  return true;
}
