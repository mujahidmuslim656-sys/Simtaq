// ============================================
// ATTENDANCE SERVICE
// Data dummy in-memory untuk absensi
// ============================================

import { Absensi } from "@/types";
import { getSantriByKelas } from "./mockData";

// Data dummy absensi
let absensiData: Absensi[] = [
  {
    ID_Absensi: "ABS-001",
    Tanggal: "2024-01-15",
    ID_Santri: "SANTRI-001",
    ID_Kelas: "KELAS-001",
    Status: "Hadir",
    ID_Guru: "GURU-001",
    Catatan: "",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Absensi: "ABS-002",
    Tanggal: "2024-01-15",
    ID_Santri: "SANTRI-002",
    ID_Kelas: "KELAS-001",
    Status: "Hadir",
    ID_Guru: "GURU-001",
    Catatan: "",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Absensi: "ABS-003",
    Tanggal: "2024-01-15",
    ID_Santri: "SANTRI-003",
    ID_Kelas: "KELAS-002",
    Status: "Izin",
    ID_Guru: "GURU-002",
    Catatan: "Sakit demam",
    Created_At: "2024-01-15T08:00:00Z",
  },
  {
    ID_Absensi: "ABS-004",
    Tanggal: "2024-01-16",
    ID_Santri: "SANTRI-001",
    ID_Kelas: "KELAS-001",
    Status: "Hadir",
    ID_Guru: "GURU-001",
    Catatan: "",
    Created_At: "2024-01-16T08:00:00Z",
  },
  {
    ID_Absensi: "ABS-005",
    Tanggal: "2024-01-16",
    ID_Santri: "SANTRI-004",
    ID_Kelas: "KELAS-001",
    Status: "Sakit",
    ID_Guru: "GURU-001",
    Catatan: "Sakit flu",
    Created_At: "2024-01-16T08:00:00Z",
  },
];

// Get semua absensi
export function getAllAbsensi(): Absensi[] {
  return [...absensiData];
}

// Get absensi by kelas dan tanggal
export function getAbsensiByKelasAndTanggal(
  kelasId: string,
  tanggal: string
): Absensi[] {
  return absensiData.filter(
    (a) => a.ID_Kelas === kelasId && a.Tanggal === tanggal
  );
}

// Get absensi by santri
export function getAbsensiBySantri(santriId: string): Absensi[] {
  return absensiData.filter((a) => a.ID_Santri === santriId);
}

// Simpan absensi (batch)
export function saveAbsensi(
  absensiList: Omit<Absensi, "ID_Absensi" | "Created_At">[]
): Absensi[] {
  const now = new Date().toISOString();
  const newAbsensiList: Absensi[] = [];

  for (const absensi of absensiList) {
    // Cek apakah sudah ada absensi untuk santri, kelas, tanggal yang sama
    const existingIndex = absensiData.findIndex(
      (a) =>
        a.ID_Santri === absensi.ID_Santri &&
        a.ID_Kelas === absensi.ID_Kelas &&
        a.Tanggal === absensi.Tanggal
    );

    if (existingIndex !== -1) {
      // Update existing
      absensiData[existingIndex] = {
        ...absensiData[existingIndex],
        ...absensi,
      };
      newAbsensiList.push(absensiData[existingIndex]);
    } else {
      // Create new
      const newAbsensi: Absensi = {
        ID_Absensi: `ABS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...absensi,
        Created_At: now,
      };
      absensiData.push(newAbsensi);
      newAbsensiList.push(newAbsensi);
    }
  }

  return newAbsensiList;
}

// Get statistik absensi
export function getAbsensiStats(santriId: string): {
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
  persentase: number;
} {
  const absensiSantri = absensiData.filter((a) => a.ID_Santri === santriId);
  const hadir = absensiSantri.filter((a) => a.Status === "Hadir").length;
  const izin = absensiSantri.filter((a) => a.Status === "Izin").length;
  const sakit = absensiSantri.filter((a) => a.Status === "Sakit").length;
  const alpa = absensiSantri.filter((a) => a.Status === "Alpa").length;
  const total = absensiSantri.length;
  const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return { hadir, izin, sakit, alpa, total, persentase };
}

// Get santri by kelas (untuk form absensi)
export function getSantriForAbsensi(kelasId: string) {
  return getSantriByKelas(kelasId);
}
