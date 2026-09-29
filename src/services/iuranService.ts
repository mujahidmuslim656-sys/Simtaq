// ============================================
// IURAN SERVICE
// Data dummy in-memory untuk iuran
// ============================================

import { Iuran } from "@/types";

let iuranData: Iuran[] = [
  {
    ID_Iuran: "IUR-001",
    ID_Santri: "SANTRI-001",
    Bulan: "Januari 2024",
    Jenis: "SPP",
    Nominal: 25000,
    Status: "Lunas",
    Tanggal_Bayar: "2024-01-05",
    Catatan: "",
    Created_At: "2024-01-05T08:00:00Z",
  },
  {
    ID_Iuran: "IUR-002",
    ID_Santri: "SANTRI-001",
    Bulan: "Februari 2024",
    Jenis: "SPP",
    Nominal: 25000,
    Status: "Belum Bayar",
    Tanggal_Bayar: "",
    Catatan: "",
    Created_At: "2024-02-01T08:00:00Z",
  },
  {
    ID_Iuran: "IUR-003",
    ID_Santri: "SANTRI-002",
    Bulan: "Januari 2024",
    Jenis: "SPP",
    Nominal: 25000,
    Status: "Lunas",
    Tanggal_Bayar: "2024-01-10",
    Catatan: "",
    Created_At: "2024-01-10T08:00:00Z",
  },
  {
    ID_Iuran: "IUR-004",
    ID_Santri: "SANTRI-003",
    Bulan: "Januari 2024",
    Jenis: "SPP",
    Nominal: 25000,
    Status: "Belum Bayar",
    Tanggal_Bayar: "",
    Catatan: "",
    Created_At: "2024-01-01T08:00:00Z",
  },
  {
    ID_Iuran: "IUR-005",
    ID_Santri: "SANTRI-004",
    Bulan: "Januari 2024",
    Jenis: "SPP",
    Nominal: 25000,
    Status: "Lunas",
    Tanggal_Bayar: "2024-01-15",
    Catatan: "",
    Created_At: "2024-01-15T08:00:00Z",
  },
];

export function getAllIuran(): Iuran[] {
  return [...iuranData];
}

export function getIuranBySantri(santriId: string): Iuran[] {
  return iuranData.filter((i) => i.ID_Santri === santriId);
}

export function createIuran(
  data: Omit<Iuran, "ID_Iuran" | "Created_At">
): Iuran {
  const now = new Date().toISOString();
  const newIuran: Iuran = {
    ID_Iuran: `IUR-${Date.now()}`,
    ...data,
    Created_At: now,
  };
  iuranData.push(newIuran);
  return newIuran;
}

export function updateIuran(
  id: string,
  data: Partial<Iuran>
): Iuran | null {
  const index = iuranData.findIndex((i) => i.ID_Iuran === id);
  if (index === -1) return null;

  iuranData[index] = { ...iuranData[index], ...data };
  return iuranData[index];
}

export function deleteIuran(id: string): boolean {
  const index = iuranData.findIndex((i) => i.ID_Iuran === id);
  if (index === -1) return false;

  iuranData.splice(index, 1);
  return true;
}

export function getIuranStats(): {
  totalTagihan: number;
  totalPembayaran: number;
  totalTunggakan: number;
} {
  const totalTagihan = iuranData.reduce((sum, i) => sum + i.Nominal, 0);
  const totalPembayaran = iuranData
    .filter((i) => i.Status === "Lunas")
    .reduce((sum, i) => sum + i.Nominal, 0);
  const totalTunggakan = totalTagihan - totalPembayaran;

  return { totalTagihan, totalPembayaran, totalTunggakan };
}
