// ============================================
// STUDENT SERVICE
// Business logic untuk data santri
// ============================================

import { Santri, SantriFormData } from "@/types";
import * as sheets from "./googleSheets";

export async function getAllSantri(tenantId?: string): Promise<Santri[]> {
  const result = await sheets.getAllSantri(tenantId);
  return result as unknown as Santri[];
}

export async function getSantriById(id: string): Promise<Santri | null> {
  const result = await sheets.getSantriById(id);
  return result as unknown as Santri | null;
}

export async function getSantriByToken(token: string): Promise<Santri | null> {
  const result = await sheets.getSantriByToken(token);
  return result as unknown as Santri | null;
}

export async function createSantri(data: SantriFormData): Promise<Santri> {
  const result = await sheets.createSantri(data as unknown as Record<string, unknown>);
  return {
    ID_Santri: (result as { ID_Santri: string }).ID_Santri,
    ...data,
    Jenis_Kelamin: data.Jenis_Kelamin as "L" | "P",
    Status: data.Status as "Aktif" | "Nonaktif",
    Access_Token: (result as { Access_Token: string }).Access_Token || "",
    Created_At: new Date().toISOString(),
    Updated_At: new Date().toISOString(),
  };
}

export async function updateSantri(
  id: string,
  data: Partial<SantriFormData>
): Promise<Santri | null> {
  await sheets.updateSantri(id, data as Record<string, unknown>);
  return { ID_Santri: id, ...data } as Santri;
}

export async function deactivateSantri(id: string): Promise<boolean> {
  return sheets.deactivateSantri(id);
}

export async function searchSantri(query: string): Promise<Santri[]> {
  const santriList = await getAllSantri();
  const lowerQuery = query.toLowerCase();

  return santriList.filter(
    (s) =>
      s.Nama.toLowerCase().includes(lowerQuery) ||
      s.NIS.toLowerCase().includes(lowerQuery) ||
      s.Nama_Wali.toLowerCase().includes(lowerQuery)
  );
}

export async function getSantriByKelas(kelasId: string): Promise<Santri[]> {
  const santriList = await getAllSantri();
  return santriList.filter((s) => s.ID_Kelas === kelasId && s.Status === "Aktif");
}

export async function getSantriByStatus(status: "Aktif" | "Nonaktif"): Promise<Santri[]> {
  const santriList = await getAllSantri();
  return santriList.filter((s) => s.Status === status);
}
