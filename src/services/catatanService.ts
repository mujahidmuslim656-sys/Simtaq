// ============================================
// CATATAN SERVICE
// Data dummy in-memory untuk catatan guru
// ============================================

import { Catatan } from "@/types";

let catatanData: Catatan[] = [
  {
    ID_Catatan: "CAT-001",
    ID_Santri: "SANTRI-001",
    Tanggal: "2024-01-15",
    ID_Guru: "GURU-001",
    Catatan: "Alhamdulillah bacaan semakin lancar. Perlu lebih sering murojaah di rumah.",
    Tampil_Ke_Wali: true,
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Catatan: "CAT-002",
    ID_Santri: "SANTRI-002",
    Tanggal: "2024-01-16",
    ID_Guru: "GURU-001",
    Catatan: "Perlu lebih fokus saat belajar tajwid.",
    Tampil_Ke_Wali: true,
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Catatan: "CAT-003",
    ID_Santri: "SANTRI-003",
    Tanggal: "2024-01-16",
    ID_Guru: "GURU-002",
    Catatan: "Perlu bimbingan ekstra untuk makhraj huruf ع dan غ.",
    Tampil_Ke_Wali: false,
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Catatan: "CAT-004",
    ID_Santri: "SANTRI-004",
    Tanggal: "2024-01-17",
    ID_Guru: "GURU-001",
    Catatan: "Baik, perlu dipertahankan.",
    Tampil_Ke_Wali: true,
    Created_At: "2024-01-17T08:00:00Z",
  },
];

export function getAllCatatan(): Catatan[] {
  return [...catatanData];
}

export function getCatatanBySantri(santriId: string): Catatan[] {
  return catatanData.filter((c) => c.ID_Santri === santriId);
}

export function getCatatanBySantriForWali(santriId: string): Catatan[] {
  return catatanData.filter(
    (c) => c.ID_Santri === santriId && c.Tampil_Ke_Wali
  );
}

export function createCatatan(
  data: Omit<Catatan, "ID_Catatan" | "Created_At">
): Catatan {
  const now = new Date().toISOString();
  const newCatatan: Catatan = {
    ID_Catatan: `CAT-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  catatanData.push(newCatatan);
  return newCatatan;
}

export function updateCatatan(
  id: string,
  data: Partial<Catatan>
): Catatan | null {
  const index = catatanData.findIndex((c) => c.ID_Catatan === id);
  if (index === -1) return null;

  catatanData[index] = { ...catatanData[index], ...data };
  return catatanData[index];
}

export function deleteCatatan(id: string): boolean {
  const index = catatanData.findIndex((c) => c.ID_Catatan === id);
  if (index === -1) return false;

  catatanData.splice(index, 1);
  return true;
}
