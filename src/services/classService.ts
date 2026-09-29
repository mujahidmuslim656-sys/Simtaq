// ============================================
// CLASS SERVICE
// Business logic untuk data kelas
// ============================================

import { Kelas, KelasFormData } from "@/types";
import * as sheets from "./googleSheets";

export async function getAllKelas(): Promise<Kelas[]> {
  return sheets.getAllKelas() as unknown as Promise<Kelas[]>;
}

export async function getKelasById(id: string): Promise<Kelas | null> {
  const kelasList = await getAllKelas();
  return kelasList.find((k) => k.ID_Kelas === id) || null;
}

export async function createKelas(data: KelasFormData): Promise<Kelas> {
  const result = await sheets.createKelas(data as unknown as Record<string, unknown>);
  return { ID_Kelas: (result as { ID_Kelas: string }).ID_Kelas, ...data };
}

export async function updateKelas(
  id: string,
  data: Partial<KelasFormData>
): Promise<Kelas | null> {
  await sheets.updateKelas(id, data as Record<string, unknown>);
  return { ID_Kelas: id, ...data } as Kelas;
}

export async function deleteKelas(id: string): Promise<boolean> {
  // TODO: Implement delete
  return true;
}
